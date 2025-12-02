# Database Setup

This directory contains all SQL schemas and seed data for the Clothify database.

## Files

- **schema.sql** - Complete database schema with tables, indexes, and RLS policies
- **seed.sql** - Sample product data for development and testing

## Setup Instructions

### 1. Create Tables and Policies

In your Supabase dashboard:
1. Go to **SQL Editor**
2. Copy the contents of `schema.sql`
3. Click **Run** to execute

This will create:
- `products` table with indexes
- `orders` table with indexes
- Row Level Security (RLS) policies

### 2. (Optional) Add Sample Data

To add sample products for testing:
1. Go to **SQL Editor**
2. Copy the contents of `seed.sql`
3. Click **Run** to execute

## Schema Overview

### Products Table
```sql
- id (TEXT) - Primary key
- title (TEXT) - Product name
- description (TEXT) - Product description
- price (NUMERIC) - Product price (must be >= 0)
- image (TEXT) - Image URL
- created_at (TIMESTAMPTZ) - Timestamp
```

### Orders Table
```sql
- id (TEXT) - Primary key
- customer_name (TEXT) - Customer's name
- customer_email (TEXT) - Customer's email
- items (JSONB) - Array of order items
- total (NUMERIC) - Total order amount (must be >= 0)
- created_at (TIMESTAMPTZ) - Timestamp
```

## Security

Row Level Security (RLS) is enabled on all tables:

- **Products**: Public read access, service role can insert/update/delete
- **Orders**: Public can create orders, service role can read all orders

## Indexes

Performance indexes are created on:
- `products.created_at` (DESC) - For product listing
- `orders.created_at` (DESC) - For order history
- `orders.customer_email` - For customer order lookups
