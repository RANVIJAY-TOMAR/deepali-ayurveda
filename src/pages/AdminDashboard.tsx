import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Package, 
  PhoneCall, 
  Users, 
  RefreshCw, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  verifyAdminStatus, 
  fetchAdminOrders, 
  fetchAdminConsultations, 
  fetchAdminCustomers,
  AdminOrderRecord,
  AdminConsultationRecord,
  AdminCustomerRecord
} from '../lib/admin';
import { formatPrice } from '../lib/format';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'consultations' | 'customers'>('orders');

  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [consultations, setConsultations] = useState<AdminConsultationRecord[]>([]);
  const [customers, setCustomers] = useState<AdminCustomerRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign-in state for admin login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAuthAndLoadData = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
      setLoading(false);
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setIsAdmin(false);
        setUserEmail(null);
        setLoading(false);
        return;
      }

      setUserEmail(user.email || null);
      const adminVerified = await verifyAdminStatus();
      setIsAdmin(adminVerified);

      if (!adminVerified) {
        setErrorMessage('Access Denied: The signed-in account is not registered as an administrator in customer_profiles.');
        setLoading(false);
        return;
      }

      // Fetch admin data concurrently
      const [ordersRes, consultsRes, custsRes] = await Promise.all([
        fetchAdminOrders(),
        fetchAdminConsultations(),
        fetchAdminCustomers()
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders);
      if (consultsRes.success) setConsultations(consultsRes.consultations);
      if (custsRes.success) setCustomers(custsRes.customers);

      if (ordersRes.error) setErrorMessage(ordersRes.error);
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to initialize administrative dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput
      });

      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }

      await checkAuthAndLoadData();
    } catch (err: any) {
      setAuthError(err.message || 'Sign in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserEmail(null);
    setOrders([]);
    setConsultations([]);
    setCustomers([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#35251F] text-left">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#35251F]/15">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#35251F] hover:text-[#A7835E] mb-2 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#A7835E]" />
            <h1 className="font-serif-luxury text-3xl font-bold text-[#35251F]">
              Dispensary Administration Portal
            </h1>
          </div>
          <p className="text-xs text-[#35251F]/70 font-light mt-1">
            Secure order fulfillment, consultation appointments, and customer records protected by Row Level Security.
          </p>
        </div>

        {userEmail && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-[#F5EFE5] px-3 py-1.5 rounded-sm border border-[#A7835E]/30 text-[#35251F]">
              Admin: <strong>{userEmail}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-[#35251F] text-[#FBF8F2] text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-[#49352B] transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#A7835E] animate-spin mx-auto" />
          <p className="text-sm font-medium">Verifying administrator credentials & loading data...</p>
        </div>
      )}

      {/* Non-configured Supabase Warning */}
      {!loading && !isSupabaseConfigured() && (
        <div className="p-6 bg-[#FFF9E6] border border-[#E6C687] rounded-sm space-y-3 text-[#5A4510]">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-[#C98B1E]" />
            <span>Supabase Configuration Required</span>
          </div>
          <p className="text-xs leading-relaxed">
            The admin portal requires an active connection to your Supabase project. Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> and execute the schema migrations to activate this dashboard.
          </p>
        </div>
      )}

      {/* Unauthenticated / Sign-in form */}
      {!loading && isSupabaseConfigured() && !isAdmin && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-premium space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#F5EFE5] flex items-center justify-center text-[#A7835E] mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              Administrator Authentication
            </h3>
            <p className="text-xs text-[#35251F]/70 font-light">
              Sign in with your verified administrative account to inspect dispensary records.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {authError}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@deepaliayurveda.com"
                className="w-full px-3.5 py-2 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">
                Password
              </label>
              <input
                required
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 btn-espresso rounded-sm text-xs uppercase tracking-widest font-bold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : 'Authenticate & Enter'}
            </button>
          </form>

          <p className="text-[11px] text-[#35251F]/60 text-center font-light">
            Initial administrator must be provisioned via <code>bootstrap_initial_admin(admin_email)</code> in the Supabase SQL console.
          </p>
        </div>
      )}

      {/* Authenticated Admin Dashboard */}
      {!loading && isAdmin && (
        <div className="space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#35251F]/15 gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-xs uppercase tracking-wider font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[#35251F] text-[#35251F]'
                  : 'border-transparent text-[#35251F]/50 hover:text-[#35251F]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`pb-3 text-xs uppercase tracking-wider font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'consultations'
                  ? 'border-[#35251F] text-[#35251F]'
                  : 'border-transparent text-[#35251F]/50 hover:text-[#35251F]'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Vaidya Consultations ({consultations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`pb-3 text-xs uppercase tracking-wider font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'customers'
                  ? 'border-[#35251F] text-[#35251F]'
                  : 'border-transparent text-[#35251F]/50 hover:text-[#35251F]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Profiles ({customers.length})</span>
            </button>

            <button
              onClick={checkAuthAndLoadData}
              title="Refresh Data"
              className="ml-auto pb-3 text-xs text-[#35251F]/60 hover:text-[#35251F] flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-sm border border-[#35251F]/10 space-y-2">
                  <Package className="w-8 h-8 text-[#A7835E] mx-auto" />
                  <p className="text-sm font-medium">No customer orders recorded yet.</p>
                  <p className="text-xs text-[#35251F]/60 font-light">New orders submitted through checkout will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-sm border border-[#35251F]/15 shadow-subtle">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EFE5] text-[#35251F] uppercase tracking-wider font-bold border-b border-[#35251F]/15">
                      <tr>
                        <th className="p-3.5">Reference</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Destination</th>
                        <th className="p-3.5">Items</th>
                        <th className="p-3.5">Total</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#35251F]/10">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FBF8F2] transition">
                          <td className="p-3.5 font-mono font-bold text-[#35251F]">
                            {ord.orderReference}
                          </td>
                          <td className="p-3.5 text-[#35251F]/70">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold">{ord.deliveryAddress.fullName || 'Guest'}</div>
                            <div className="text-[11px] text-[#35251F]/70">{ord.deliveryAddress.phone}</div>
                          </td>
                          <td className="p-3.5 text-[#35251F]/80">
                            <div>{ord.deliveryAddress.city}, {ord.deliveryAddress.state}</div>
                            <div className="text-[11px] font-mono text-[#35251F]/60">PIN: {ord.deliveryAddress.pincode}</div>
                          </td>
                          <td className="p-3.5">
                            <ul className="space-y-0.5 text-[11px]">
                              {ord.orderItems.map((item) => (
                                <li key={item.id} className="text-[#35251F]">
                                  <strong>{item.quantity}×</strong> {item.productName} ({formatPrice(item.unitPrice)})
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-3.5 font-bold font-serif-luxury text-[#35251F]">
                            {formatPrice(ord.totalAmount)}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                              ord.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {consultations.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-sm border border-[#35251F]/10 space-y-2">
                  <PhoneCall className="w-8 h-8 text-[#A7835E] mx-auto" />
                  <p className="text-sm font-medium">No Vaidya consultations booked yet.</p>
                  <p className="text-xs text-[#35251F]/60 font-light">Submissions from the "Talk to a Vaidya" modal appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-sm border border-[#35251F]/15 shadow-subtle">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EFE5] text-[#35251F] uppercase tracking-wider font-bold border-b border-[#35251F]/15">
                      <tr>
                        <th className="p-3.5">Booking Date</th>
                        <th className="p-3.5">Patient Name</th>
                        <th className="p-3.5">Contact Phone</th>
                        <th className="p-3.5">Preferred Time Window</th>
                        <th className="p-3.5">Health Concern</th>
                        <th className="p-3.5">Fee</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#35251F]/10">
                      {consultations.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FBF8F2] transition">
                          <td className="p-3.5 text-[#35251F]/70">
                            {new Date(c.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-3.5 font-bold text-[#35251F]">
                            {c.customerName}
                          </td>
                          <td className="p-3.5 font-mono text-[#A7835E] font-semibold">
                            {c.customerPhone}
                          </td>
                          <td className="p-3.5 text-[#35251F]">
                            {c.preferredTimeSlot || 'Not specified'}
                          </td>
                          <td className="p-3.5 max-w-xs text-[#35251F]/80 truncate" title={c.healthConcern || ''}>
                            {c.healthConcern || <span className="text-[#35251F]/40 italic">None provided</span>}
                          </td>
                          <td className="p-3.5 font-serif-luxury font-bold">
                            ₹{c.consultationFee}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800">
                              {c.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOMER PROFILES */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              {customers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-sm border border-[#35251F]/10 space-y-2">
                  <Users className="w-8 h-8 text-[#A7835E] mx-auto" />
                  <p className="text-sm font-medium">No customer profiles found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-sm border border-[#35251F]/15 shadow-subtle">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EFE5] text-[#35251F] uppercase tracking-wider font-bold border-b border-[#35251F]/15">
                      <tr>
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Prakriti</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Saved Addresses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#35251F]/10">
                      {customers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-[#FBF8F2] transition">
                          <td className="p-3.5 font-bold text-[#35251F]">
                            {cust.fullName || 'Anonymous'}
                          </td>
                          <td className="p-3.5 text-[#35251F]/80">
                            {cust.email || '-'}
                          </td>
                          <td className="p-3.5 font-mono text-[#35251F]/80">
                            {cust.phone || '-'}
                          </td>
                          <td className="p-3.5 text-[#A7835E] font-medium">
                            {cust.prakriti || 'Unset'}
                          </td>
                          <td className="p-3.5">
                            {cust.isAdmin ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-700">
                                Customer
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-[11px] text-[#35251F]/70">
                            {cust.addresses.length} registered
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

