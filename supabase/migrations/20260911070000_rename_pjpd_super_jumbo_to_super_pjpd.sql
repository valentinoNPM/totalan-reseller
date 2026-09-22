-- Rename the canonical product while preserving prices and order snapshots.
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  SELECT id INTO v_product_id
  FROM public.products
  WHERE normalized_name = 'PJPD SUPER JUMBO';

  IF v_product_id IS NULL THEN
    SELECT id INTO v_product_id
    FROM public.products
    WHERE normalized_name = 'SUPER PJPD'
      AND name = 'SUPER PJPD';

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Produk PJPD SUPER JUMBO tidak ditemukan';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.product_names
      WHERE normalized_name = 'SUPER PJPD'
        AND product_id <> v_product_id
    ) OR EXISTS (
      SELECT 1 FROM public.products
      WHERE normalized_name = 'SUPER PJPD'
        AND id <> v_product_id
    ) THEN
      RAISE EXCEPTION 'Nama SUPER PJPD sudah digunakan produk atau alias lain';
    END IF;

    DELETE FROM public.product_names
    WHERE normalized_name = 'PJPD SUPER JUMBO'
      AND product_id = v_product_id
      AND kind = 'canonical';

    UPDATE public.products
    SET name = 'SUPER PJPD',
        normalized_name = 'SUPER PJPD',
        version = version + 1,
        updated_at = now()
    WHERE id = v_product_id;
  END IF;

  INSERT INTO public.product_names (normalized_name, product_id, kind)
  VALUES ('SUPER PJPD', v_product_id, 'canonical')
  ON CONFLICT (normalized_name) DO UPDATE
    SET product_id = EXCLUDED.product_id,
        kind = EXCLUDED.kind
    WHERE public.product_names.product_id = EXCLUDED.product_id
      AND public.product_names.kind = EXCLUDED.kind;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Namespace SUPER PJPD bertentangan dengan produk lain';
  END IF;
END
$$;
