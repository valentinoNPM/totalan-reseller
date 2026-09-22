-- Add the user-approved product without modifying existing catalog entries.
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  SELECT id INTO v_product_id
  FROM public.products
  WHERE normalized_name = 'SUPER PDPD';

  IF v_product_id IS NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.product_names WHERE normalized_name = 'SUPER PDPD'
    ) THEN
      RAISE EXCEPTION 'Nama SUPER PDPD sudah digunakan sebagai nama atau alias produk lain';
    END IF;

    INSERT INTO public.products (
      name,
      normalized_name,
      reseller_price,
      wholesale_price,
      bulk_price,
      active
    ) VALUES (
      'SUPER PDPD',
      'SUPER PDPD',
      64000,
      62000,
      61000,
      true
    )
    RETURNING id INTO v_product_id;
  ELSE
    IF NOT EXISTS (
      SELECT 1
      FROM public.products
      WHERE id = v_product_id
        AND name = 'SUPER PDPD'
        AND reseller_price = 64000
        AND wholesale_price = 62000
        AND bulk_price = 61000
        AND active
    ) THEN
      RAISE EXCEPTION 'Produk SUPER PDPD sudah ada dengan data berbeda; tidak ditimpa';
    END IF;
  END IF;

  INSERT INTO public.product_names (normalized_name, product_id, kind)
  VALUES ('SUPER PDPD', v_product_id, 'canonical')
  ON CONFLICT (normalized_name) DO UPDATE
    SET product_id = EXCLUDED.product_id,
        kind = EXCLUDED.kind
    WHERE public.product_names.product_id = EXCLUDED.product_id
      AND public.product_names.kind = EXCLUDED.kind;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Namespace SUPER PDPD bertentangan dengan produk lain';
  END IF;
END
$$;
