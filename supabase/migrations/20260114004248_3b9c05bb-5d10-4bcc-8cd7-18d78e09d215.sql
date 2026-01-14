-- Fix: Remove permissive SELECT policy and create secure server-side lookup function
-- This prevents rainbow table attacks and restricts access to the aadhaar_dbt_records table

-- Step 1: Drop the permissive SELECT policy
DROP POLICY IF EXISTS "Users can query DBT records by hash only" ON aadhaar_dbt_records;

-- Step 2: Create a secure lookup function that validates input and returns only non-PII data
CREATE OR REPLACE FUNCTION public.lookup_dbt_status(aadhaar_input text)
RETURNS TABLE (
  status text,
  bank_name text,
  account_number_last4 text,
  message text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate Aadhaar format (12 digits only)
  IF aadhaar_input !~ '^[0-9]{12}$' THEN
    RAISE EXCEPTION 'Invalid Aadhaar format';
  END IF;
  
  -- Return only minimal non-PII data (exclude full_name and aadhaar_number)
  RETURN QUERY
  SELECT r.status, r.bank_name, r.account_number_last4, r.message
  FROM aadhaar_dbt_records r
  WHERE r.aadhaar_hash = encode(extensions.digest(aadhaar_input::bytea, 'sha256'), 'hex');
END;
$$;

-- Step 3: Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.lookup_dbt_status(text) TO authenticated;

-- Step 4: Revoke direct SELECT access from authenticated users
REVOKE SELECT ON aadhaar_dbt_records FROM authenticated;

-- Step 5: Create a restrictive policy that only allows admins to view the table directly
CREATE POLICY "Only admins can view DBT records directly"
ON aadhaar_dbt_records
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));