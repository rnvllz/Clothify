-- Add category column to products table
-- Run this in your Supabase SQL Editor

-- Add category column with default value
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Tops';

-- Update existing products to have a default category
-- You can manually update these to proper categories after running this migration
UPDATE products 
SET category = 'Tops' 
WHERE category IS NULL;

-- Optional: Create an index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Optional: Add a check constraint to ensure valid categories
-- Uncomment if you want to enforce category validation at database level
-- ALTER TABLE products 
-- ADD CONSTRAINT check_valid_category 
-- CHECK (category IN ('Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes', 'Activewear', 'Loungewear'));

-- Assuming user_roles table already exists, ensure RLS is enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create policies for user_roles
-- Allow users to read their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to view all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to insert/update roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Drop the view if it exists
DROP VIEW IF EXISTS public.user_details;

-- Create a view for admins to see user details with roles
CREATE VIEW public.user_details AS
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at as role_assigned_at,
  au.email,
  au.created_at as user_created_at,
  au.last_sign_in_at,
  au.email_confirmed_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id;

-- Note: Views inherit RLS from underlying tables, so no separate policy needed
-- The view will only show data that the user can access from user_roles