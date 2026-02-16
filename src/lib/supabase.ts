import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Database Schema (run in Supabase SQL Editor)
// ============================================================
//
// CREATE TABLE services (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name TEXT NOT NULL,
//   price DECIMAL NOT NULL,
//   duration_minutes INT NOT NULL,
//   description TEXT
// );
//
// CREATE TABLE barbers (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name TEXT NOT NULL,
//   photo_url TEXT,
//   specialty TEXT,
//   is_active BOOLEAN DEFAULT true
// );
//
// CREATE TABLE appointments (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   service_id UUID REFERENCES services(id),
//   barber_id UUID REFERENCES barbers(id),
//   customer_name TEXT NOT NULL,
//   customer_phone TEXT NOT NULL,
//   customer_email TEXT,
//   appointment_date DATE NOT NULL,
//   appointment_time TIME NOT NULL,
//   status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
//   created_at TIMESTAMPTZ DEFAULT now()
// );
//
// CREATE TABLE blocked_slots (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   barber_id UUID REFERENCES barbers(id),
//   blocked_date DATE NOT NULL,
//   start_time TIME,
//   end_time TIME,
//   reason TEXT
// );
