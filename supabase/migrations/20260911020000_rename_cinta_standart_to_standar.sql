-- Correct the canonical spelling while preserving historical order snapshots.
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  SELECT id INTO v_product_id
  FROM public.products
  WHERE normalized_name = 'CINTA STANDART';

  IF v_product_id IS NULL THEN
    SELECT id INTO v_product_id
    FROM public.products
    WHERE normalized_name = 'CINTA STANDAR'
      AND name = 'CINTA STANDAR';

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Produk CINTA STANDART tidak ditemukan';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1
      FROM public.product_names
      WHERE normalized_name = 'CINTA STANDAR'
        AND product_id <> v_product_id
    ) OR EXISTS (
      SELECT 1
      FROM public.products
      WHERE normalized_name = 'CINTA STANDAR'
        AND id <> v_product_id
    ) THEN
      RAISE EXCEPTION 'Nama CINTA STANDAR sudah digunakan produk atau alias lain';
    END IF;

    DELETE FROM public.product_names
    WHERE normalized_name = 'CINTA STANDART'
      AND product_id = v_product_id
      AND kind = 'canonical';

    UPDATE public.products
    SET name = 'CINTA STANDAR',
        normalized_name = 'CINTA STANDAR',
        version = version + 1,
        updated_at = now()
    WHERE id = v_product_id;
  END IF;

  INSERT INTO public.product_names (normalized_name, product_id, kind)
  VALUES ('CINTA STANDAR', v_product_id, 'canonical')
  ON CONFLICT (normalized_name) DO UPDATE
    SET product_id = EXCLUDED.product_id,
        kind = EXCLUDED.kind
    WHERE public.product_names.product_id = EXCLUDED.product_id
      AND public.product_names.kind = EXCLUDED.kind;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Namespace CINTA STANDAR bertentangan dengan produk lain';
  END IF;
END
$$;
