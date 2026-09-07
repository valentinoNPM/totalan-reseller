-- Add an immutable DP snapshot and calculate the remaining payment on the server.

ALTER TABLE public.order_revisions
  ADD COLUMN IF NOT EXISTS down_payment_amount bigint NOT NULL DEFAULT 0
  CHECK (down_payment_amount >= 0);

CREATE OR REPLACE FUNCTION public.save_order_transaction(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
  v_order_id uuid;
  v_revision integer;
  v_down_payment bigint;
  v_payment_before_dp bigint;
BEGIN
  v_down_payment := COALESCE((payload->>'down_payment_amount')::bigint, 0);

  IF v_down_payment < 0 THEN
    RAISE EXCEPTION 'DP tidak boleh negatif';
  END IF;

  v_result := public.save_order_transaction_without_courier(payload);
  v_order_id := (v_result->>'order_id')::uuid;
  v_revision := (v_result->>'revision')::integer;

  SELECT goods_total + CASE
    WHEN shipping_mode = 'prepaid' THEN COALESCE(shipping_amount, 0)
    ELSE 0
  END
  INTO v_payment_before_dp
  FROM public.order_revisions
  WHERE order_id = v_order_id AND version = v_revision;

  IF v_down_payment > v_payment_before_dp THEN
    RAISE EXCEPTION 'DP tidak boleh melebihi total pembayaran';
  END IF;

  UPDATE public.order_revisions
  SET courier = NULLIF(BTRIM(payload->>'courier'), ''),
      down_payment_amount = v_down_payment,
      transfer_total = v_payment_before_dp - v_down_payment
  WHERE order_id = v_order_id AND version = v_revision;

  RETURN v_result;
END;
$$;
