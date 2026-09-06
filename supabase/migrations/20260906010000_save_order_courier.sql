-- Persist the optional courier on the same transaction as the order revision.
-- Keep the verified pricing/save implementation intact and wrap it so this
-- migration also applies to databases that already ran 20260906000000.

ALTER FUNCTION public.save_order_transaction(jsonb)
  RENAME TO save_order_transaction_without_courier;

CREATE OR REPLACE FUNCTION public.save_order_transaction(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  v_result := public.save_order_transaction_without_courier(payload);

  UPDATE public.order_revisions
  SET courier = NULLIF(BTRIM(payload->>'courier'), '')
  WHERE order_id = (v_result->>'order_id')::uuid
    AND version = (v_result->>'revision')::integer;

  RETURN v_result;
END;
$$;
