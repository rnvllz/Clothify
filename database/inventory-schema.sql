-- =====================================================
-- Inventory Management Schema for Clothify
-- =====================================================
-- This file contains the inventory-related table definitions
-- Run this after the main schema.sql file

-- Create uuid extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Product Inventory Table
-- =====================================================
-- Tracks stock levels for each product variant (size/color)
CREATE TABLE IF NOT EXISTS product_inventory (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  sku TEXT UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
  location TEXT, -- warehouse location
  supplier_id TEXT,
  cost_price NUMERIC CHECK (cost_price >= 0),
  last_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_inventory_product_id ON product_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_product_inventory_sku ON product_inventory(sku);
CREATE INDEX IF NOT EXISTS idx_product_inventory_stock_quantity ON product_inventory(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_product_inventory_location ON product_inventory(location);

-- =====================================================
-- Inventory Movements Table
-- =====================================================
-- Tracks all stock movements (in/out/adjustments)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL REFERENCES product_inventory(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'return', 'damage')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  reference_id TEXT, -- order_id, adjustment_id, etc.
  reference_type TEXT, -- 'order', 'adjustment', 'restock', etc.
  performed_by TEXT, -- user_id who performed the action
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for inventory movements
CREATE INDEX IF NOT EXISTS idx_inventory_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_reference_id ON inventory_movements(reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_movement_type ON inventory_movements(movement_type);

-- =====================================================
-- Suppliers Table
-- =====================================================
-- Stores supplier information for inventory management
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT, -- e.g., 'Net 30', 'Net 60'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);

-- =====================================================
-- Low Stock Alerts Table
-- =====================================================
-- Tracks low stock alerts and notifications
CREATE TABLE IF NOT EXISTS low_stock_alerts (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL REFERENCES product_inventory(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock')),
  threshold INTEGER NOT NULL,
  current_stock INTEGER NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for low stock alerts
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_inventory_id ON low_stock_alerts(inventory_id);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_is_resolved ON low_stock_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_created_at ON low_stock_alerts(created_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies for Inventory
-- =====================================================

-- Enable RLS on inventory tables
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE low_stock_alerts ENABLE ROW LEVEL SECURITY;

-- Product Inventory policies
-- Allow service role full access
CREATE POLICY "Enable full access for service role on product_inventory" ON product_inventory
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow authenticated users to read inventory (for employees/admins)
CREATE POLICY "Enable read access for authenticated users on product_inventory" ON product_inventory
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Inventory Movements policies
CREATE POLICY "Enable full access for service role on inventory_movements" ON inventory_movements
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users on inventory_movements" ON inventory_movements
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Suppliers policies
CREATE POLICY "Enable full access for service role on suppliers" ON suppliers
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users on suppliers" ON suppliers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Low Stock Alerts policies
CREATE POLICY "Enable full access for service role on low_stock_alerts" ON low_stock_alerts
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users on low_stock_alerts" ON low_stock_alerts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_product_inventory_updated_at
  BEFORE UPDATE ON product_inventory
  FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at_column();

-- Function to automatically create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if stock is below threshold and no active alert exists
  IF NEW.stock_quantity <= NEW.low_stock_threshold THEN
    -- Check if there's already an unresolved alert for this inventory item
    IF NOT EXISTS (
      SELECT 1 FROM low_stock_alerts
      WHERE inventory_id = NEW.id
      AND is_resolved = false
      AND alert_type = CASE WHEN NEW.stock_quantity = 0 THEN 'out_of_stock' ELSE 'low_stock' END
    ) THEN
      INSERT INTO low_stock_alerts (id, inventory_id, alert_type, threshold, current_stock)
      VALUES (
        uuid_generate_v4()::text,
        NEW.id,
        CASE WHEN NEW.stock_quantity = 0 THEN 'out_of_stock' ELSE 'low_stock' END,
        NEW.low_stock_threshold,
        NEW.stock_quantity
      );
    END IF;
  ELSE
    -- Resolve existing alerts if stock is back above threshold
    UPDATE low_stock_alerts
    SET is_resolved = true, resolved_at = NOW()
    WHERE inventory_id = NEW.id AND is_resolved = false;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for low stock alerts
CREATE TRIGGER trigger_check_low_stock
  AFTER INSERT OR UPDATE OF stock_quantity, low_stock_threshold ON product_inventory
  FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- Function to create inventory movement records
CREATE OR REPLACE FUNCTION create_inventory_movement()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create movement record if stock_quantity actually changed
  IF OLD.stock_quantity != NEW.stock_quantity THEN
    INSERT INTO inventory_movements (
      id,
      inventory_id,
      movement_type,
      quantity,
      previous_quantity,
      new_quantity,
      reason
    ) VALUES (
      uuid_generate_v4()::text,
      NEW.id,
      CASE
        WHEN NEW.stock_quantity > OLD.stock_quantity THEN 'in'
        WHEN NEW.stock_quantity < OLD.stock_quantity THEN 'out'
        ELSE 'adjustment'
      END,
      ABS(NEW.stock_quantity - OLD.stock_quantity),
      OLD.stock_quantity,
      NEW.stock_quantity,
      'Automatic stock update'
    );
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for inventory movements (only on updates, not inserts)
CREATE TRIGGER trigger_create_inventory_movement
  AFTER UPDATE OF stock_quantity ON product_inventory
  FOR EACH ROW EXECUTE FUNCTION create_inventory_movement();