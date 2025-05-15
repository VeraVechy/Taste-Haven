/*
  # Initial Schema Setup

  1. New Tables
    - orders
      - id (uuid, primary key)
      - user_id (references auth.users)
      - status (order status)
      - total (numeric)
      - created_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (references orders)
      - product_id (references products)
      - quantity (integer)
      - price (numeric)
    
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - image_url (text)
      - category (text)
      - available (boolean)
    
    - reservations
      - id (uuid, primary key)
      - user_id (references auth.users)
      - date (date)
      - time (time)
      - guests (integer)
      - status (text)
      - notes (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reservations table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  guests integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their reservations" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);