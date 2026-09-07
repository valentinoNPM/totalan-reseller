-- 00000000000000_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema for private tables
CREATE SCHEMA IF NOT EXISTS private;

-- private.login_identities
CREATE TABLE private.login_identities (
  username_normalized text PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  auth_email text NOT NULL UNIQUE
);

-- staff_profiles
CREATE TABLE public.staff_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active boolean DEFAULT true NOT NULL,
  display_name text NOT NULL
);

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  normalized_name text UNIQUE NOT NULL,
  reseller_price bigint NOT NULL CHECK (reseller_price >= 0),
  wholesale_price bigint NOT NULL CHECK (wholesale_price >= 0),
  bulk_price bigint NOT NULL CHECK (bulk_price >= 0),
  active boolean DEFAULT true NOT NULL,
  version integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- product_names (namespace for aliases and canonical names)
CREATE TABLE public.product_names (
  normalized_name text PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('canonical', 'alias'))
);

-- customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  normalized_name text,
  phone text,
  normalized_phone text UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT customer_has_data CHECK (name IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_customers_normalized_name ON public.customers(normalized_name);

-- orders sequence
CREATE SEQUENCE public.order_number_seq START 1;

-- orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number bigint UNIQUE DEFAULT nextval('public.order_number_seq') NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  current_revision integer DEFAULT 1 NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- order_revisions
CREATE TABLE public.order_revisions (
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  version integer NOT NULL,
  raw_text text NOT NULL,
  customer_name_snapshot text,
  customer_phone_snapshot text,
  tier text NOT NULL CHECK (tier IN ('reseller', 'grosir', 'partai')),
  qty_total integer NOT NULL CHECK (qty_total > 0),
  goods_total bigint NOT NULL CHECK (goods_total >= 0),
  shipping_mode text NOT NULL CHECK (shipping_mode IN ('prepaid', 'collect')),
  shipping_amount bigint CHECK (shipping_amount >= 0),
  courier text,
  service text,
  down_payment_amount bigint DEFAULT 0 NOT NULL CHECK (down_payment_amount >= 0),
  transfer_total bigint NOT NULL CHECK (transfer_total >= 0),
  total_is_provisional boolean DEFAULT false NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (order_id, version)
);

-- order_items
CREATE TABLE public.order_items (
  order_id uuid NOT NULL,
  revision integer NOT NULL,
  position integer NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT,
  name_snapshot text NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  reseller_snapshot bigint NOT NULL CHECK (reseller_snapshot >= 0),
  wholesale_snapshot bigint NOT NULL CHECK (wholesale_snapshot >= 0),
  bulk_snapshot bigint NOT NULL CHECK (bulk_snapshot >= 0),
  unit_price bigint NOT NULL CHECK (unit_price >= 0),
  line_total bigint NOT NULL CHECK (line_total >= 0),
  PRIMARY KEY (order_id, revision, position),
  FOREIGN KEY (order_id, revision) REFERENCES public.order_revisions(order_id, version) ON DELETE CASCADE
);

-- save_requests (idempotency)
CREATE TABLE public.save_requests (
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  idempotency_key text NOT NULL,
  payload_hash text NOT NULL,
  order_id uuid NOT NULL,
  revision integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (actor_id, idempotency_key)
);

-- product_changes
CREATE TABLE public.product_changes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  before_data jsonb,
  after_data jsonb NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS Setup
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.save_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_changes ENABLE ROW LEVEL SECURITY;

-- Helper function for auth check
CREATE OR REPLACE FUNCTION public.is_active_staff() RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles 
    WHERE user_id = auth.uid() AND active = true
  );
$$;

-- Policies
CREATE POLICY staff_read_profiles ON public.staff_profiles FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_products ON public.products FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_product_names ON public.product_names FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_customers ON public.customers FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_orders ON public.orders FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_revisions ON public.order_revisions FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_items ON public.order_items FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_requests ON public.save_requests FOR SELECT TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_read_changes ON public.product_changes FOR SELECT TO authenticated USING (public.is_active_staff());

-- Direct writes only for products via explicit policies or RPCs
-- In MVP, UI will use standard select/insert/update for products if we add policies, or an RPC.
-- For M2 (Master Products), let's grant direct write to active staff to keep it simple, 
-- or we can build an RPC. The spec says "Master update melalui RPC terotorisasi atau kebijakan yang setara."
-- Let's use policies for products:
CREATE POLICY staff_insert_products ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_active_staff());
CREATE POLICY staff_update_products ON public.products FOR UPDATE TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_insert_product_names ON public.product_names FOR INSERT TO authenticated WITH CHECK (public.is_active_staff());
CREATE POLICY staff_delete_product_names ON public.product_names FOR DELETE TO authenticated USING (public.is_active_staff());
CREATE POLICY staff_insert_changes ON public.product_changes FOR INSERT TO authenticated WITH CHECK (public.is_active_staff());

-- However, for saving orders, it says: "Direct write orders/revisions/items/save_requests ditolak; gunakan RPC terjaga."
-- So no INSERT/UPDATE policies for orders tables.
