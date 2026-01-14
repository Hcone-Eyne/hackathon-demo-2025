-- Grant the postgres role (function owner) permission to access the table
-- This is needed because the SECURITY DEFINER function runs as the function owner
GRANT SELECT ON aadhaar_dbt_records TO postgres;

-- Also ensure the function has proper permissions through authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_dbt_status(text) TO authenticated;