-- =====================================================
-- Payment Management Schema for Clothify
-- =====================================================
-- This file contains the payment-related table definitions
-- Run this after the main schema.sql file

-- Create uuid extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Payment Transactions Table
-- =====================================================
-- Tracks all payment transactions and their statuses
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL, -- 'credit_card', 'debit_card', 'paypal', 'bank_transfer', etc.
  payment_provider TEXT, -- 'stripe', 'paypal', 'square', etc.
  provider_transaction_id TEXT, -- external payment provider's transaction ID
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  failure_reason TEXT,
  card_last4 TEXT, -- last 4 digits of card
  card_brand TEXT, -- 'visa', 'mastercard', 'amex', etc.
  card_expiry_month INTEGER,
  card_expiry_year INTEGER,
  billing_address JSONB, -- full billing address
  customer_id TEXT, -- reference to user/customers table if exists
  customer_email TEXT,
  customer_name TEXT,
  metadata JSONB, -- additional payment data
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payment transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer_email ON payment_transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_transaction_id ON payment_transactions(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_method ON payment_transactions(payment_method);

-- =====================================================
-- Payment Refunds Table
-- =====================================================
-- Tracks refund transactions
CREATE TABLE IF NOT EXISTS payment_refunds (
  id TEXT PRIMARY KEY,
  payment_transaction_id TEXT NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  reason TEXT, -- 'customer_request', 'product_defect', 'duplicate_charge', etc.
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  provider_refund_id TEXT, -- external payment provider's refund ID
  notes TEXT,
  processed_by TEXT, -- user_id who processed the refund
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payment refunds
CREATE INDEX IF NOT EXISTS idx_payment_refunds_payment_transaction_id ON payment_refunds(payment_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_order_id ON payment_refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_status ON payment_refunds(status);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_created_at ON payment_refunds(created_at DESC);

-- =====================================================
-- Payment Methods Table
-- =====================================================
-- Stores saved payment methods for customers
CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL, -- reference to user/customers table
  payment_method_type TEXT NOT NULL, -- 'card', 'paypal', 'bank_account'
  provider_payment_method_id TEXT, -- external provider's payment method ID
  card_last4 TEXT,
  card_brand TEXT,
  card_expiry_month INTEGER,
  card_expiry_year INTEGER,
  billing_address JSONB,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for saved payment methods
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_customer_id ON saved_payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_is_default ON saved_payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_is_active ON saved_payment_methods(is_active);

-- =====================================================
-- Payment Disputes Table
-- =====================================================
-- Tracks payment disputes and chargebacks
CREATE TABLE IF NOT EXISTS payment_disputes (
  id TEXT PRIMARY KEY,
  payment_transaction_id TEXT NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  dispute_type TEXT NOT NULL, -- 'chargeback', 'dispute', 'inquiry'
  status TEXT NOT NULL CHECK (status IN ('open', 'won', 'lost', 'closed')),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  reason TEXT, -- 'fraudulent', 'product_not_received', 'product_unacceptable', etc.
  provider_dispute_id TEXT, -- external provider's dispute ID
  evidence_due_by TIMESTAMPTZ,
  evidence_submitted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payment disputes
CREATE INDEX IF NOT EXISTS idx_payment_disputes_payment_transaction_id ON payment_disputes(payment_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_order_id ON payment_disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_status ON payment_disputes(status);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_created_at ON payment_disputes(created_at DESC);

-- =====================================================
-- Payment Webhooks Table
-- =====================================================
-- Stores webhook events from payment providers
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL, -- 'stripe', 'paypal', etc.
  event_type TEXT NOT NULL, -- 'payment_intent.succeeded', 'charge.dispute.created', etc.
  event_id TEXT UNIQUE NOT NULL, -- external provider's event ID
  payment_transaction_id TEXT REFERENCES payment_transactions(id) ON DELETE SET NULL,
  payload JSONB NOT NULL, -- full webhook payload
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payment webhooks
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_id ON payment_webhooks(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_created_at ON payment_webhooks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_payment_transaction_id ON payment_webhooks(payment_transaction_id);

-- =====================================================
-- Row Level Security (RLS) Policies for Payments
-- =====================================================

-- Enable RLS on payment tables
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Payment Transactions policies
-- Allow service role full access
CREATE POLICY "Enable full access for service role on payment_transactions" ON payment_transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow authenticated users (admins/employees) to read payment data
CREATE POLICY "Enable read access for authenticated users on payment_transactions" ON payment_transactions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow anonymous users to create payment transactions (for checkout)
CREATE POLICY "Enable insert for anonymous users on payment_transactions" ON payment_transactions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Payment Refunds policies
CREATE POLICY "Enable full access for service role on payment_refunds" ON payment_refunds
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users on payment_refunds" ON payment_refunds
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Saved Payment Methods policies
CREATE POLICY "Enable full access for service role on saved_payment_methods" ON saved_payment_methods
  FOR ALL
  USING (auth.role() = 'service_role');

-- Users can only see their own saved payment methods
CREATE POLICY "Enable read access for users on their saved_payment_methods" ON saved_payment_methods
  FOR SELECT
  USING (auth.uid()::text = customer_id);

CREATE POLICY "Enable insert for users on saved_payment_methods" ON saved_payment_methods
  FOR INSERT
  WITH CHECK (auth.uid()::text = customer_id);

CREATE POLICY "Enable update for users on their saved_payment_methods" ON saved_payment_methods
  FOR UPDATE
  USING (auth.uid()::text = customer_id);

CREATE POLICY "Enable delete for users on their saved_payment_methods" ON saved_payment_methods
  FOR DELETE
  USING (auth.uid()::text = customer_id);

-- Payment Disputes policies
CREATE POLICY "Enable full access for service role on payment_disputes" ON payment_disputes
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users on payment_disputes" ON payment_disputes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Payment Webhooks policies
CREATE POLICY "Enable full access for service role on payment_webhooks" ON payment_webhooks
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at on payment tables
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at_column();

CREATE TRIGGER update_payment_refunds_updated_at
  BEFORE UPDATE ON payment_refunds
  FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at_column();

CREATE TRIGGER update_saved_payment_methods_updated_at
  BEFORE UPDATE ON saved_payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at_column();

CREATE TRIGGER update_payment_disputes_updated_at
  BEFORE UPDATE ON payment_disputes
  FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at_column();

-- Function to update payment transaction status when refund is processed
CREATE OR REPLACE FUNCTION update_payment_status_on_refund()
RETURNS TRIGGER AS $$
BEGIN
  -- If refund is completed, update the original payment status
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Check if this is a full refund or partial refund
    IF NEW.amount = (SELECT amount FROM payment_transactions WHERE id = NEW.payment_transaction_id) THEN
      UPDATE payment_transactions
      SET status = 'refunded', updated_at = NOW()
      WHERE id = NEW.payment_transaction_id;
    ELSE
      UPDATE payment_transactions
      SET status = 'partially_refunded', updated_at = NOW()
      WHERE id = NEW.payment_transaction_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for refund status updates
CREATE TRIGGER trigger_update_payment_status_on_refund
  AFTER UPDATE OF status ON payment_refunds
  FOR EACH ROW EXECUTE FUNCTION update_payment_status_on_refund();

-- Function to ensure only one default payment method per customer
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a payment method as default, unset all others for this customer
  IF NEW.is_default = true THEN
    UPDATE saved_payment_methods
    SET is_default = false, updated_at = NOW()
    WHERE customer_id = NEW.customer_id
    AND id != NEW.id
    AND is_default = true;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for default payment method
CREATE TRIGGER trigger_ensure_single_default_payment_method
  BEFORE INSERT OR UPDATE OF is_default ON saved_payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment_method();

-- Function to process payment webhooks
CREATE OR REPLACE FUNCTION process_payment_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark webhook as processed
  NEW.processed = true;
  NEW.processed_at = NOW();

  -- Here you would add logic to handle different webhook event types
  -- For example, updating payment status based on webhook events

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: The webhook processing trigger would be added when implementing webhook handling
-- CREATE TRIGGER trigger_process_payment_webhook
--   BEFORE INSERT ON payment_webhooks
--   FOR EACH ROW EXECUTE FUNCTION process_payment_webhook();