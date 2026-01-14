-- Fix security issues identified in scan

-- 1. Restrict profiles table to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Restrict user_roles table to authenticated users only
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;

CREATE POLICY "Authenticated users can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- 3. Add encryption function for sensitive data (Aadhaar numbers)
-- This will use pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key text;
BEGIN
  -- In production, this should use a proper key from secrets
  -- For now, using a placeholder that should be replaced
  encryption_key := 'your-encryption-key-here';
  RETURN encode(encrypt(data::bytea, encryption_key::bytea, 'aes'), 'base64');
END;
$$;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key text;
BEGIN
  encryption_key := 'your-encryption-key-here';
  RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), encryption_key::bytea, 'aes'), 'UTF8');
END;
$$;

-- Add index for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_lesson ON public.bookmarks(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_created ON public.chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dbt_checks_user_created ON public.dbt_checks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_lesson ON public.progress_tracking(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_completed ON public.progress_tracking(user_id, completed) WHERE completed = true;