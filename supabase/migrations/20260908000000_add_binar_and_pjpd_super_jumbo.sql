-- Add two catalog products requested by the operator.
-- Abort without changing anything if either name is already registered.

DO $$
DECLARE
  v_binar_id uuid;
  v_pjpd_super_jumbo_id uuid;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.product_names
    WHERE normalized_name IN ('BINAR', 'PJPD SUPER JUMBO')
  ) OR EXISTS (
    SELECT 1 FROM public.products
    WHERE normalized_name IN ('BINAR', 'PJPD SUPER JUMBO')
  ) THEN
    RAISE EXCEPTION 'BINAR atau PJPD SUPER JUMBO sudah terdaftar';
  END IF;

  INSERT INTO public.products (
    name, normalized_name, reseller_price, wholesale_price, bulk_price, active
  ) VALUES (
    'BINAR', 'BINAR', 80000, 78000, 77000, true
  ) RETURNING id INTO v_binar_id;

  INSERT INTO public.products (
    name, normalized_name, reseller_price, wholesale_price, bulk_price, active
  ) VALUES (
    'PJPD SUPER JUMBO', 'PJPD SUPER JUMBO', 74000, 72000, 71000, true
  ) RETURNING id INTO v_pjpd_super_jumbo_id;

  INSERT INTO public.product_names (normalized_name, product_id, kind)
  VALUES
    ('BINAR', v_binar_id, 'canonical'),
    ('PJPD SUPER JUMBO', v_pjpd_super_jumbo_id, 'canonical');
END;
$$;
