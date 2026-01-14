-- Fix remaining function search_path warnings

-- Fix encrypt_sensitive_data function 
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  encryption_key text;
BEGIN
  -- In production, this should use a proper key from secrets
  encryption_key := 'your-encryption-key-here';
  RETURN encode(encrypt(data::bytea, encryption_key::bytea, 'aes'), 'base64');
END;
$function$;

-- Fix decrypt_sensitive_data function
CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  encryption_key text;
BEGIN
  encryption_key := 'your-encryption-key-here';
  RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), encryption_key::bytea, 'aes'), 'UTF8');
END;
$function$;