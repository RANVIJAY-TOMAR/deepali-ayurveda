/**
 * ============================================================================
 * DEEPALI AYURVEDA — SUPABASE DATABASE SCHEMA TYPES
 * ============================================================================
 * Generated for tables defined in Supabase migrations:
 * - products
 * - customer_profiles
 * - customer_addresses
 * - orders
 * - order_items
 * - payments
 * - consultation_bookings
 * ============================================================================
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'captured'
  | 'failed'
  | 'refunded';

export type ConsultationStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          image_url: string;
          stock_quantity: number;
          is_active: boolean;
          category: string | null;
          volume: string | null;
          serving: string | null;
          sanskrit_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          image_url: string;
          stock_quantity?: number;
          is_active?: boolean;
          category?: string | null;
          volume?: string | null;
          serving?: string | null;
          sanskrit_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          image_url?: string;
          stock_quantity?: number;
          is_active?: boolean;
          category?: string | null;
          volume?: string | null;
          serving?: string | null;
          sanskrit_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          prakriti: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          prakriti?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          prakriti?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          full_name: string;
          phone: string;
          address_line: string;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          full_name: string;
          phone: string;
          address_line: string;
          city: string;
          state?: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          full_name?: string;
          phone?: string;
          address_line?: string;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_reference: string;
          guest_token: string;
          razorpay_order_id: string | null;
          customer_id: string | null;
          delivery_address: Json;
          subtotal: number;
          discount_amount: number;
          shipping_fee: number;
          total_amount: number;
          payment_method: string;
          status: OrderStatus;
          customer_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_reference?: string;
          guest_token?: string;
          razorpay_order_id?: string | null;
          customer_id?: string | null;
          delivery_address: Json;
          subtotal: number;
          discount_amount?: number;
          shipping_fee?: number;
          total_amount: number;
          payment_method?: string;
          status?: OrderStatus;
          customer_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_reference?: string;
          guest_token?: string;
          razorpay_order_id?: string | null;
          customer_id?: string | null;
          delivery_address?: Json;
          subtotal?: number;
          discount_amount?: number;
          shipping_fee?: number;
          total_amount?: number;
          payment_method?: string;
          status?: OrderStatus;
          customer_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          verification_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          amount: number;
          currency?: string;
          status?: PaymentStatus;
          verification_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          amount?: number;
          currency?: string;
          status?: PaymentStatus;
          verification_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultation_bookings: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          health_concern: string | null;
          preferred_time_slot: string | null;
          preferred_datetime: string | null;
          consultation_fee: number;
          booking_status: ConsultationStatus;
          payment_status: 'pending' | 'paid' | 'refunded';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          health_concern?: string | null;
          preferred_time_slot?: string | null;
          preferred_datetime?: string | null;
          consultation_fee?: number;
          booking_status?: ConsultationStatus;
          payment_status?: 'pending' | 'paid' | 'refunded';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          health_concern?: string | null;
          preferred_time_slot?: string | null;
          preferred_datetime?: string | null;
          consultation_fee?: number;
          booking_status?: ConsultationStatus;
          payment_status?: 'pending' | 'paid' | 'refunded';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
