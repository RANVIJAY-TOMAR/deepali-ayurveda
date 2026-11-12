# Deepali Ayurveda — Database Security Audit & Production Readiness

**Project**: Deepali Ayurveda E-Commerce Platform (Est. 1997)  
**Database**: Supabase (PostgreSQL 15+ with PostgREST, GoTrue Auth & RLS)  
**Security Audit Revision**: 6.0 (Verified Razorpay Order Binding & Defense-in-Depth)  
**Status**: AUDITED & LOCALLY VALIDATED (Pre-Execution Verification)

---

## 1. Executive Summary & Remediation Overview

This final security audit remediation (Revision 6.0) addresses all security findings and hardens the Deepali Ayurveda Supabase database against unauthorized access, payment tampering, race conditions, and privilege escalation:

1. **Unsafe Authorization Pattern Removed**: Completely eliminated any `CURRENT_USER = 'postgres'` inside `SECURITY DEFINER` functions. Administrator authorization now evaluates the caller's verified JWT claims (`service_role`) and protected database records (`customer_profiles.is_admin`).
2. **Safe Admin Bootstrap**: Implemented `bootstrap_initial_admin(admin_email)` protected by a transaction-level advisory lock (`pg_advisory_xact_lock`), zero-admin count precondition, and strict privilege revocation (`REVOKE ALL FROM PUBLIC, anon, authenticated`).
3. **Defense-in-Depth Privilege Hardening**: Beyond RLS, table-level write privileges (`INSERT, UPDATE, DELETE`) have been explicitly revoked on `orders`, `order_items`, `payments`, and `products` from `anon` and `authenticated` roles. Client API keys cannot mutate these tables directly through PostgREST under any circumstance.
4. **Razorpay Order ID Binding & Strict Validation**:
   - Added `orders.razorpay_order_id TEXT UNIQUE` column and index.
   - Created `set_order_razorpay_id(p_order_id, p_razorpay_order_id)` restricted strictly to `service_role`.
   - In `record_verified_payment()`: locks the order row (`FOR UPDATE`), rejects mismatched Razorpay order IDs, rejects incorrect amounts, rejects non-INR currency, rejects non-pending orders, validates identifier regex formats, and handles repeated webhooks idempotently without duplicate records or accepting conflicting data.
5. **No Guest Age Bypass & Unguessable Tokens**: Removed legacy `created_at >= now() - interval '1 hour'` guest bypasses. All checkouts flow through `submit_checkout()` which generates an unguessable 128-bit `guest_token`. Guest order lookup is handled via `get_guest_order(order_reference, guest_token)` without leaking the token.
6. **Stock & Inventory Concurrency Control**: `submit_checkout()` applies row-level locking (`SELECT ... FOR UPDATE` in deterministic sorted UUID order) on catalog items to serialize stock checks, prevent deadlocks, prevent overselling, and reject zero-stock purchases. Subtotals and totals are calculated strictly server-side from catalog prices.
7. **Post-Payment Order Item Immutability**: Trigger `tr_validate_order_item` executes on `BEFORE INSERT OR UPDATE ON public.order_items`. It strictly prevents adding or updating items on non-pending orders, prevents reassigning `order_id` or `product_id`, and rejects `NULL product_id`.
8. **Consultation Rate Limiting**: The ₹200 fee and pending status are locked by database check constraints and triggers. A transaction-level advisory lock on `hashtext(customer_phone)` serializes concurrent requests to enforce the 3-per-hour booking limit.
9. **Cleaned Product Catalog**: Retains only the 5 authorized products with clean slugs (`daaru-mukti-powder`, `b12`, `sea-buckthorn`, `apple-cider-vinegar`, `digest-guru`), exact authorized prices, stock initialized to 0, zero fabricated inventory, and zero unverified medical/ingredient claims. Stamon Gold is 100% excluded. Obsolete slugs are deactivated (`is_active = false`) rather than deleted, preserving historical foreign key integrity.
10. **Product Image Paths Aligned**: Paths directly match image assets in `public/images/products/`.
11. **Comprehensive Verification Suite**: `verification_queries.sql` contains read-only diagnostic queries (Section A) and safe rollback-based behavioral tests (Section B) with explicit assertion failures and honest reporting.

---

## 2. Technical Remediation Breakdown

### A. Razorpay Order Architecture & Validation Flow

To prevent payment tampering, order substitution, and replay attacks, the relationship between internal orders and Razorpay orders is strictly enforced:

```
[ Frontend ]               [ Edge Function ]               [ Supabase DB ]               [ Razorpay ]
     |                             |                              |                           |
     | 1. submit_checkout()        |                              |                           |
     |----------------------------------------------------------->|                           |
     |                             |                              | (Order created: pending)  |
     | 2. Initiate Payment         |                              |                           |
     |---------------------------->|                              |                           |
     |                             | 3. Read total_amount         |                           |
     |                             |----------------------------->|                           |
     |                             | 4. Create Order              |                           |
     |                             |--------------------------------------------------------->|
     |                             | 5. Return razorpay_order_id  |                           |
     |                             |<---------------------------------------------------------|
     |                             | 6. set_order_razorpay_id()   |                           |
     |                             |----------------------------->| (razorpay_order_id bound) |
     | 7. Return razorpay_order_id |                              |                           |
     |<----------------------------|                              |                           |
     |                             |                              |                           |
     | 8. Customer completes pay   |                              |                           |
     |--------------------------------------------------------------------------------------->|
     |                             |                              |                           |
     |                             | 9. Webhook / Verification    |                           |
     |                             |<---------------------------------------------------------|
     |                             | 10. Verify HMAC-SHA256 Sig   |                           |
     |                             | 11. record_verified_payment  |                           |
     |                             |----------------------------->|                           |
     |                             |                              | - Locks row (FOR UPDATE)  |
     |                             |                              | - Verifies order_id match |
     |                             |                              | - Verifies total match    |
     |                             |                              | - Verifies INR currency   |
     |                             |                              | - Verifies status=pending |
     |                             |                              | - Inserts captured pay    |
     |                             |                              | - Marks order 'paid'      |
```

#### Detailed Validation Rules in `record_verified_payment()`:
- **Authorization Check**: Caller must possess the `service_role` JWT claim. Direct client invocation is forbidden.
- **Identifier Format**: Validates `razorpay_payment_id ~ '^pay_[a-zA-Z0-9]+$'` and `razorpay_order_id ~ '^order_[a-zA-Z0-9]+$'`.
- **Idempotency Replay**: If `razorpay_payment_id` was already recorded with identical order ID, amount, and currency, the existing payment ID is returned immediately without creating duplicates.
- **Conflict Rejection**: If `razorpay_payment_id` was previously recorded with conflicting order, amount, or currency details, an exception is thrown.
- **Row Locking**: `SELECT * FROM public.orders WHERE id = p_order_id FOR UPDATE;` prevents concurrent status race conditions.
- **Order Status**: Rejects payment recording if order is not in `'pending'` status.
- **Razorpay Order ID Match**: If `orders.razorpay_order_id` is set, `p_razorpay_order_id` must match exactly.
- **Currency Lock**: Accepts only `'INR'`.
- **Exact Amount Match**: Paid amount must match `orders.total_amount` to the cent (avoiding rounding discrepancies).

---

### B. Defense-in-Depth Table Privileges & Function Execution Matrix

PostgREST exposes PostgreSQL tables based on roles and RLS policies. To guarantee zero possibility of direct database tampering, table-level write privileges are explicitly revoked:

| Table | `anon` | `authenticated` | `service_role` | Justification |
| :--- | :--- | :--- | :--- | :--- |
| `products` | SELECT | SELECT | ALL | Public reads active products; writes restricted to admin/service. |
| `customer_profiles` | SELECT (own) | SELECT, INSERT, UPDATE (own) | ALL | Users manage own profile; `is_admin` locked by trigger & RLS. |
| `customer_addresses` | None | SELECT, INSERT, UPDATE, DELETE (own) | ALL | Customers manage own addresses; no public exposure. |
| `orders` | SELECT (via function) | SELECT (own) | ALL | Direct INSERT/UPDATE/DELETE revoked from anon/auth; writes via `submit_checkout()`. |
| `order_items` | SELECT (via function) | SELECT (own) | ALL | Direct INSERT/UPDATE/DELETE revoked from anon/auth; writes via `submit_checkout()`. |
| `payments` | None | SELECT (own) | ALL | Direct INSERT/UPDATE/DELETE revoked from anon/auth; writes via `record_verified_payment()`. |
| `consultation_bookings` | INSERT (pending) | SELECT (own), INSERT (pending) | ALL | Public bookings allowed (₹200 locked); updates restricted to admin. |

#### Function Execute Privileges Matrix:

| Function | Owner | `anon` | `authenticated` | `service_role` | `public` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `is_admin()` | `postgres` | Yes | Yes | Yes | Revoked |
| `submit_checkout()` | `postgres` | Yes | Yes | Yes | Revoked |
| `get_guest_order()` | `postgres` | Yes | Yes | Yes | Revoked |
| `set_order_razorpay_id()` | `postgres` | **No** | **No** | **Yes** | Revoked |
| `record_verified_payment()` | `postgres` | **No** | **No** | **Yes** | Revoked |
| `bootstrap_initial_admin()` | `postgres` | **No** | **No** | **Yes** | Revoked |
| Internal Triggers & Helpers | `postgres` | **No** | **No** | **No** | Revoked |

---

### C. Product Catalog & Asset Alignment

Only the five authorized products are seeded with exact prices, stock initialized to 0, and unverified properties set to `NULL`:

| Product Name | Slug | Price (₹) | Initial Stock | Image Asset Path | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **Daaru Mukti Powder** | `daaru-mukti-powder` | ₹1,100.00 | 0 | `/images/products/daaru-mukti-powder.png` | Active |
| **B12** | `b12` | ₹599.00 | 0 | `/images/products/vitamin-b12.png` | Active |
| **Sea Buckthorn** | `sea-buckthorn` | ₹599.00 | 0 | `/images/products/sea-buckthorn.png` | Active |
| **Apple Cider Vinegar** | `apple-cider-vinegar` | ₹293.00 | 0 | `/images/products/apple-cider-vinegar.png` | Active |
| **Digest Guru** | `digest-guru` | ₹199.00 | 0 | `/images/products/digest-guru-churan.png` | Active |

- **Stamon Gold**: 100% excluded. Permanently deleted if unreferenced; deactivated if historical references exist.
- **Obsolete Slugs**: Deactivated (`is_active = false`) to prevent customer ordering while preserving past order foreign keys.
- **Unverified Attributes**: `volume`, `serving`, and `sanskrit_name` are set to `NULL`.

---

### D. Honest Test Reporting & Concurrency Testing

The verification test suite in `verification_queries.sql` separates tests into:
1. **Section A (Diagnostics)**: Read-only schema and permission inspection queries that verify table security, catalog rows, check constraints, unique constraints, and privilege grants.
2. **Section B (Behavioral Security Tests)**:
   - **B1**: Direct table insertion rejection (orders, order_items, payments under simulated non-admin role). Explicitly fails if insert succeeds.
   - **B2**: Customer self-promotion attack rejection (trigger and RLS check on `customer_profiles`).
   - **B3**: Zero-stock checkout rejection (confirms overselling is blocked).
   - **B4**: Sequential atomic stock-depletion test.
     > **NOTE ON CONCURRENCY**: Test B4 verifies sequential stock depletion and immediate purchase rejection within a single session. To test true multi-client concurrency under parallel HTTP requests, run two simultaneous transactions from separate `psql` connections:
     > ```sql
     > -- Connection 1:
     > BEGIN;
     > SELECT public.submit_checkout(...);
     > COMMIT;
     >
     > -- Connection 2 (executed simultaneously):
     > BEGIN;
     > SELECT public.submit_checkout(...);
     > COMMIT;
     > ```
     > Row-level locking (`SELECT ... FOR UPDATE` in UUID order) in `submit_checkout()` ensures one transaction acquires the lock while the second waits, correctly detecting zero remaining stock.
   - **B5**: Guest token isolation and post-payment order-item locking.
   - **B6**: Complete Razorpay validation test suite (B6a valid flow, B6b idempotent replay, B6c conflict rejection, B6d order ID mismatch rejection, B6e amount mismatch rejection, B6f currency mismatch rejection, B6g non-pending order rejection).

---

## 3. Safe First-Administrator Bootstrap Instructions

Follow this procedure after executing Migration 1:

1. Sign up an account for the store owner through the frontend application or via the Supabase Dashboard (**Authentication > Users > Add User**).
2. Note the user's email address (e.g. `deepaliintouch@gmail.com`).
3. In the Supabase Dashboard, open the **SQL Editor**.
4. Run:
   ```sql
   SELECT public.bootstrap_initial_admin('deepaliintouch@gmail.com');
   ```
5. Verify the account is an administrator:
   ```sql
   SELECT id, email, is_admin FROM public.customer_profiles WHERE email = 'deepaliintouch@gmail.com';
   ```
   *(Expected output: `is_admin = true`)*.
6. Attempting to call `bootstrap_initial_admin` a second time will fail with an exception (`'Initial admin bootstrap is permanently disabled because an administrator already exists.'`), locking out any further bootstrap operations.

---

## 4. Remaining Security Limitations & Required Edge Functions

Before accepting live payments in production, the following infrastructure must be completed:

1. **Supabase Edge Function: `create-razorpay-order`**:
   - Takes `order_reference` and `guest_token` (or user JWT).
   - Reads `total_amount` from `public.orders`.
   - Calls Razorpay API (`/v1/orders`) using server-side `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
   - Calls `public.set_order_razorpay_id(order_id, razorpay_order_id)` via `service_role` key to bind the Razorpay order ID.
   - Returns the Razorpay order ID to the frontend.
2. **Supabase Edge Function: `verify-razorpay-payment`**:
   - Receives payment completion payload or Razorpay webhook (`payment.captured`).
   - Computes HMAC-SHA256 signature over the payload using server-side `RAZORPAY_WEBHOOK_SECRET`.
   - If signature is valid, calls `public.record_verified_payment()` using the Supabase `SERVICE_ROLE_KEY`.
3. **Inventory Management**:
   - Products currently have `stock_quantity = 0`. The store owner must update stock quantities in `public.products` before items can be purchased.
