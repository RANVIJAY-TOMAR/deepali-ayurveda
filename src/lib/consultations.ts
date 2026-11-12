import { supabase, isSupabaseConfigured } from './supabase';

export interface ConsultationBookingInput {
  name: string;
  phone: string;
  preferredTime: string;
  concern?: string;
}

export interface ConsultationValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ConsultationBookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

/**
 * Validates consultation form inputs against database check constraints.
 */
export function validateConsultationBooking(
  input: ConsultationBookingInput
): ConsultationValidationResult {
  const errors: Record<string, string> = {};

  // Customer Name: >= 2 chars
  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Patient name must be at least 2 characters.';
  }

  // Customer Phone: 10-15 digits conforming to regex ^[0-9+ -]{10,15}$
  const phoneRegex = /^[0-9+ -]{10,15}$/;
  const cleanPhone = input.phone ? input.phone.trim() : '';
  if (!cleanPhone || !phoneRegex.test(cleanPhone) || cleanPhone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number for the Vaidya callback.';
  }

  // Preferred time slot
  if (!input.preferredTime || input.preferredTime.trim().length === 0) {
    errors.preferredTime = 'Please select a preferred consultation time window.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Inserts a consultation booking into public.consultation_bookings.
 * Enforces:
 * - Fee: strictly 200.00
 * - booking_status: 'pending'
 * - payment_status: 'pending'
 * - Rate limiting: enforced by tr_check_consultation_rate_limit trigger
 */
export async function bookVaidyaConsultation(
  input: ConsultationBookingInput
): Promise<ConsultationBookingResult> {
  const validation = validateConsultationBooking(input);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to register consultation bookings.'
    };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      customer_id: currentUser?.id || null,
      customer_name: input.name.trim(),
      customer_phone: input.phone.trim(),
      customer_email: currentUser?.email || null,
      preferred_time_slot: input.preferredTime.trim(),
      health_concern: input.concern && input.concern.trim().length > 0 ? input.concern.trim() : null,
      consultation_fee: 200.00,
      booking_status: 'pending' as const,
      payment_status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('consultation_bookings')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || 'Consultation booking could not be completed.'
      };
    }

    return {
      success: true,
      bookingId: data.id
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Network or unexpected error while booking consultation: ${msg}`
    };
  }
}

