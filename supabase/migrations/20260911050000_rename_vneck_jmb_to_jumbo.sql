-- Correct the canonical product name while preserving historical snapshots.
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  SELECT id INTO v_product_id
  FROM public.products
  WHERE normalized_name = 'VNECK JMB';

  IF v_product_id IS NULL THEN
    SELECT id INTO v_product_id
    FROM public.products
    WHERE normalized_name = 'VNECK JUMBO'
      AND name = 'VNECK JUMBO';

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Produk VNECK JMB tidak ditemukan';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.product_names
      WHERE normalized_name = 'VNECK JUMBO'
        AND product_id <> v_product_id
    ) OR EXISTS (
      SELECT 1 FROM public.products
      WHERE normalized_name = 'VNECK JUMBO'
        AND id <> v_product_id
    ) THEN
      RAISE EXCEPTION 'Nama VNECK JUMBO sudah digunakan produk atau alias lain';
    END IF;

    DELETE FROM public.product_names
    WHERE normalized_name = 'VNECK JMB'
      AND product_id = v_product_id
      AND kind = 'canonical';

    UPDATE public.products
    SET name = 'VNECK JUMBO',
        normalized_name = 'VNECK JUMBO',
        version = version + 1,
        updated_at = now()
    WHERE id = v_product_id;
  END IF;

  INSERT INTO public.product_names (normalized_name, product_id, kind)
  VALUES ('VNECK JUMBO', v_product_id, 'canonical')
  ON CONFLICT (normalized_name) DO UPDATE
    SET product_id = EXCLUDED.product_id,
        kind = EXCLUDED.kind
    WHERE public.product_names.product_id = EXCLUDED.product_id
      AND public.product_names.kind = EXCLUDED.kind;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Namespace VNECK JUMBO bertentangan dengan produk lain';
  END IF;
END
$$;
