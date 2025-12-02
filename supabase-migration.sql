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
