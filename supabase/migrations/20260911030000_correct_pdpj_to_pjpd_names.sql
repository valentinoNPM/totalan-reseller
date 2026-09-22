-- Apply five user-approved canonical name corrections atomically.
DO $$
DECLARE
  v_rename record;
  v_product_id uuid;
BEGIN
  FOR v_rename IN
    SELECT * FROM (VALUES
      ('ZIZI PDPJ'::text,         'ZIZI PJPD'::text),
      ('HAGIA PDPJ'::text,        'HAGIA PJPD'::text),
      ('PDPJ JUMBO'::text,        'PJPD JUMBO'::text),
      ('PDPJ STD'::text,          'PJPD STANDAR'::text),
      ('VNECK PDPJ LD130'::text,  'VNECK PJPD LD130'::text)
    ) AS requested(old_name, new_name)
  LOOP
    v_product_id := NULL;

    SELECT id INTO v_product_id
    FROM public.products
    WHERE normalized_name = v_rename.old_name;

    IF v_product_id IS NULL THEN
      SELECT id INTO v_product_id
      FROM public.products
      WHERE normalized_name = v_rename.new_name
        AND name = v_rename.new_name;

      IF v_product_id IS NULL THEN
        RAISE EXCEPTION 'Produk % tidak ditemukan', v_rename.old_name;
      END IF;
    ELSE
      IF EXISTS (
        SELECT 1
        FROM public.product_names
        WHERE normalized_name = v_rename.new_name
          AND product_id <> v_product_id
      ) OR EXISTS (
        SELECT 1
        FROM public.products
        WHERE normalized_name = v_rename.new_name
          AND id <> v_product_id
      ) THEN
        RAISE EXCEPTION 'Nama % sudah digunakan produk atau alias lain', v_rename.new_name;
      END IF;

      DELETE FROM public.product_names
      WHERE normalized_name = v_rename.old_name
        AND product_id = v_product_id
        AND kind = 'canonical';
      UPDATE public.products
      SET name = v_rename.new_name,
          normalized_name = v_rename.new_name,
          version = version + 1,
          updated_at = now()
      WHERE id = v_product_id;
    END IF;

    INSERT INTO public.product_names (normalized_name, product_id, kind)
    VALUES (v_rename.new_name, v_product_id, 'canonical')
    ON CONFLICT (normalized_name) DO UPDATE
      SET product_id = EXCLUDED.product_id,
          kind = EXCLUDED.kind
      WHERE public.product_names.product_id = EXCLUDED.product_id
        AND public.product_names.kind = EXCLUDED.kind;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Namespace % bertentangan dengan produk lain', v_rename.new_name;
    END IF;
  END LOOP;
END
$$;
