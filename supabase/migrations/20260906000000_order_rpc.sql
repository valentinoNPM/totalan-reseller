-- 20260906000000_order_rpc.sql

-- Drop existing if any
DROP FUNCTION IF EXISTS public.save_order_transaction(jsonb);

CREATE OR REPLACE FUNCTION public.save_order_transaction(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- Run as owner so we can bypass RLS for internal inserts, but we validate auth
AS $$
DECLARE
  v_actor_id uuid;
  v_idempotency_key text;
  v_payload_hash text;
  
  v_customer_id uuid;
  v_customer_name text;
  v_customer_phone text;
  v_normalized_phone text;
  
  v_order_id uuid;
  v_revision_num integer;
  
  v_tier text;
  v_qty_total integer;
  v_goods_total bigint;
  v_shipping_mode text;
  v_shipping_amount bigint;
  
  v_existing_req record;
  v_item jsonb;
  v_product record;
  v_unit_price bigint;
  v_line_qty integer;
  v_line_total bigint;
  
BEGIN
  -- 1. Auth check
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL OR NOT public.is_active_staff() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 2. Extract base fields
  v_idempotency_key := payload->>'idempotency_key';
  v_payload_hash := payload->>'payload_hash';
  
  IF v_idempotency_key IS NULL OR v_payload_hash IS NULL THEN
    RAISE EXCEPTION 'Missing idempotency or hash';
  END IF;

  -- 3. Idempotency Check
  SELECT * INTO v_existing_req FROM public.save_requests 
  WHERE actor_id = v_actor_id AND idempotency_key = v_idempotency_key;
  
  IF FOUND THEN
    IF v_existing_req.payload_hash != v_payload_hash THEN
      RAISE EXCEPTION 'Idempotency conflict';
    END IF;
    -- Return success immediately with the existing order_id
    RETURN jsonb_build_object('order_id', v_existing_req.order_id, 'revision', v_existing_req.revision, 'status', 'idempotent_ok');
  END IF;

  -- 4. Customer Handling
  v_customer_name := payload->'customer'->>'name';
  v_customer_phone := payload->'customer'->>'phone';
  v_normalized_phone := payload->'customer'->>'normalized_phone';
  
  IF v_normalized_phone IS NOT NULL AND v_normalized_phone != '' THEN
    SELECT id INTO v_customer_id FROM public.customers WHERE normalized_phone = v_normalized_phone LIMIT 1;
  END IF;
  
  IF v_customer_id IS NULL AND (v_customer_name IS NOT NULL OR v_customer_phone IS NOT NULL) THEN
    INSERT INTO public.customers (name, normalized_name, phone, normalized_phone)
    VALUES (
      v_customer_name,
      UPPER(v_customer_name),
      v_customer_phone,
      v_normalized_phone
    )
    ON CONFLICT (normalized_phone) DO UPDATE 
    SET name = EXCLUDED.name, updated_at = now()
    RETURNING id INTO v_customer_id;
  END IF;

  -- 5. Order Handling
  v_order_id := (payload->>'order_id')::uuid;
  IF v_order_id IS NULL THEN
    -- New order
    INSERT INTO public.orders (customer_id, created_by)
    VALUES (v_customer_id, v_actor_id)
    RETURNING id INTO v_order_id;
    v_revision_num := 1;
  ELSE
    -- Update existing order (increment revision)
    UPDATE public.orders 
    SET current_revision = current_revision + 1, updated_at = now(), customer_id = v_customer_id
    WHERE id = v_order_id
    RETURNING current_revision INTO v_revision_num;
    
    IF v_revision_num IS NULL THEN
      RAISE EXCEPTION 'Order not found';
    END IF;
  END IF;

  -- 6. Server-Side Price Calculation & Order Items Logic
  v_tier := payload->>'tier';
  IF v_tier NOT IN ('reseller', 'grosir', 'partai') THEN
    RAISE EXCEPTION 'Invalid tier';
  END IF;

  v_shipping_mode := payload->>'shipping_mode';
  v_shipping_amount := (payload->>'shipping_amount')::bigint;

  v_goods_total := 0;
  v_qty_total := 0;

  -- Temporary table or array to hold validated items to insert later
  -- We'll just loop twice or we can insert into a temp table. 
  -- But actually, we need to insert the revision FIRST due to foreign key constraints, 
  -- so we must calculate total first before inserting the revision.

  -- Let's calculate totals first:
  FOR v_item IN SELECT * FROM jsonb_array_elements(payload->'items')
  LOOP
    SELECT reseller_price, wholesale_price, bulk_price INTO v_product
    FROM public.products WHERE id = (v_item->>'product_id')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found %', v_item->>'product_id';
    END IF;

    IF v_tier = 'partai' THEN
      v_unit_price := v_product.bulk_price;
    ELSIF v_tier = 'grosir' THEN
      v_unit_price := v_product.wholesale_price;
    ELSE
      v_unit_price := v_product.reseller_price;
    END IF;

    v_line_qty := (v_item->>'qty')::integer;
    v_line_total := v_line_qty * v_unit_price;

    v_goods_total := v_goods_total + v_line_total;
    v_qty_total := v_qty_total + v_line_qty;
  END LOOP;
  
  -- Insert Revision
  INSERT INTO public.order_revisions (
    order_id, version, raw_text, customer_name_snapshot, customer_phone_snapshot,
    tier, qty_total, goods_total, shipping_mode, shipping_amount, transfer_total,
    total_is_provisional, actor_id
  ) VALUES (
    v_order_id, v_revision_num, payload->>'raw_text', v_customer_name, v_customer_phone,
    v_tier, v_qty_total, v_goods_total, v_shipping_mode, v_shipping_amount,
    -- We could recalculate transfer total on server too, but since shipping amount might be provisional 
    -- we just let client define it, OR we compute it:
    (v_goods_total + COALESCE(v_shipping_amount, 0)),
    COALESCE((payload->>'total_is_provisional')::boolean, false),
    v_actor_id
  );

  -- Insert Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(payload->'items')
  LOOP
    SELECT reseller_price, wholesale_price, bulk_price, name INTO v_product
    FROM public.products WHERE id = (v_item->>'product_id')::uuid;
    
    IF v_tier = 'partai' THEN
      v_unit_price := v_product.bulk_price;
    ELSIF v_tier = 'grosir' THEN
      v_unit_price := v_product.wholesale_price;
    ELSE
      v_unit_price := v_product.reseller_price;
    END IF;
    
    v_line_qty := (v_item->>'qty')::integer;

    INSERT INTO public.order_items (
      order_id, revision, position, product_id, name_snapshot, qty,
      reseller_snapshot, wholesale_snapshot, bulk_snapshot, unit_price, line_total
    ) VALUES (
      v_order_id,
      v_revision_num,
      (v_item->>'position')::integer,
      (v_item->>'product_id')::uuid,
      v_product.name, -- Fetch true name from DB
      v_line_qty,
      v_product.reseller_price,
      v_product.wholesale_price,
      v_product.bulk_price,
      v_unit_price,
      v_line_qty * v_unit_price
    );
  END LOOP;

  -- 8. Save Idempotency Request
  INSERT INTO public.save_requests (actor_id, idempotency_key, payload_hash, order_id, revision)
  VALUES (v_actor_id, v_idempotency_key, v_payload_hash, v_order_id, v_revision_num);

  RETURN jsonb_build_object('order_id', v_order_id, 'revision', v_revision_num, 'status', 'created');
END;
$$;
