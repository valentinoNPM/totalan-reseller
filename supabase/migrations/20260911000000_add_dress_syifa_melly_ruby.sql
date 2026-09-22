-- Add three user-approved products without changing existing catalog entries.
DO $$
DECLARE
  v_product record;
  v_existing public.products%ROWTYPE;
  v_id uuid;
BEGIN
  FOR v_product IN
    SELECT * FROM (VALUES
      ('DRESS SYIFA'::text, 69000::bigint, 67000::bigint, 66000::bigint),
      ('MELLY'::text,       80000::bigint, 78000::bigint, 77000::bigint),
      ('RUBY'::text,        78000::bigint, 76000::bigint, 75000::bigint)
    ) AS requested(name, reseller_price, wholesale_price, bulk_price)
  LOOP
    SELECT * INTO v_existing
    FROM public.products
    WHERE normalized_name = v_product.name;

    IF FOUND THEN
      IF v_existing.name <> v_product.name
        OR v_existing.reseller_price <> v_product.reseller_price
        OR v_existing.wholesale_price <> v_product.wholesale_price
        OR v_existing.bulk_price <> v_product.bulk_price
        OR NOT v_existing.active
      THEN
        RAISE EXCEPTION 'Produk % sudah ada dengan data berbeda; tidak ditimpa', v_product.name;
      END IF;
      v_id := v_existing.id;
    ELSE
      IF EXISTS (
        SELECT 1 FROM public.product_names WHERE normalized_name = v_product.name
      ) THEN
        RAISE EXCEPTION 'Nama % sudah digunakan sebagai nama/alias produk lain', v_product.name;
      END IF;

      INSERT INTO public.products (
        name,
        normalized_name,
        reseller_price,
        wholesale_price,
        bulk_price,
        active
      ) VALUES (
        v_product.name,
        v_product.name,
        v_product.reseller_price,
        v_product.wholesale_price,
        v_product.bulk_price,
        true
      )
      RETURNING id INTO v_id;
    END IF;

    INSERT INTO public.product_names (normalized_name, product_id, kind)
    VALUES (v_product.name, v_id, 'canonical')
    ON CONFLICT (normalized_name) DO UPDATE
      SET product_id = EXCLUDED.product_id,
          kind = EXCLUDED.kind
      WHERE public.product_names.product_id = EXCLUDED.product_id
        AND public.product_names.kind = EXCLUDED.kind;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Namespace nama % bertentangan dengan produk lain', v_product.name;
    END IF;
  END LOOP;
END
$$;
