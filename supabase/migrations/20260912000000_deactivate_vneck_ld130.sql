-- Soft-delete two VNECK LD130 products so historical order snapshots remain valid.

DO $$
DECLARE
  v_matching_count integer;
  v_active_count integer;
BEGIN
  SELECT COUNT(*) INTO v_matching_count
  FROM public.products
  WHERE normalized_name IN ('VNECK PDPD LD130', 'VNECK PJPD LD130');

  IF v_matching_count <> 2 THEN
    RAISE EXCEPTION 'Diharapkan tepat 2 produk VNECK LD130, ditemukan %', v_matching_count;
  END IF;

  SELECT COUNT(*) INTO v_active_count
  FROM public.products
  WHERE normalized_name IN ('VNECK PDPD LD130', 'VNECK PJPD LD130')
    AND active = true;

  IF v_active_count <> 2 THEN
    RAISE EXCEPTION 'Diharapkan kedua produk masih aktif, ditemukan % produk aktif', v_active_count;
  END IF;

  UPDATE public.products
  SET active = false,
      version = version + 1,
      updated_at = now()
  WHERE normalized_name IN ('VNECK PDPD LD130', 'VNECK PJPD LD130');
END;
$$;
