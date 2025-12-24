-- =====================================================
-- Orders Table RLS (Row Level Security) Policies
-- =====================================================
-- This file contains RLS policies for the orders table
-- Run this after the main schema.sql file
-- Allows public order creation and dashboard access

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Drop Existing Policies (if any)
-- =====================================================

DROP POLICY IF EXISTS "Allow anon inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow anon select on orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable read for service role" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for service role" ON public.orders;
DROP POLICY IF EXISTS "Enable update for service role" ON public.orders;

-- =====================================================
-- Anonymous User Policies
-- =====================================================

-- Allow anonymous users to insert orders (checkout)
CREATE POLICY "Allow anon inserts" ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to select/view orders
CREATE POLICY "Allow anon select on orders" ON public.orders
  FOR SELECT
  TO anon
  USING (true);

-- =====================================================
-- Authenticated User Policies
-- =====================================================

-- Enable insert for all authenticated users
CREATE POLICY "Enable insert for all users" ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own orders
CREATE POLICY "Enable read for authenticated users" ON public.orders
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- Service Role Policies
-- =====================================================

-- Enable read for service role (admin/dashboard)
CREATE POLICY "Enable read for service role" ON public.orders
  FOR SELECT
  TO service_role
  USING (true);

-- Enable delete for service role (admin management)
CREATE POLICY "Enable delete for service role" ON public.orders
  FOR DELETE
  TO service_role
  USING (true);

-- Enable update for service role (order management)
CREATE POLICY "Enable update for service role" ON public.orders
  FOR UPDATE
  TO service_role
  USING (true);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Ensure indexes exist for query performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- =====================================================
-- Notes
-- =====================================================
-- - Anonymous users can create orders during checkout (public insert)
-- - Anonymous users can view orders (for confirmation pages)
-- - Authenticated users have full read access (for customer accounts)
-- - Service role has full CRUD access (for admin dashboard)
-- - All RLS policies are permissive (allow access)
-- - For more security, consider restricting by customer_email or user_id
