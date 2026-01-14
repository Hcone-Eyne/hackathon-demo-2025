-- Fix security issues identified in scan

-- 1. Update profiles table RLS - first check if old policy exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    DROP POLICY "Profiles are viewable by everyone" ON public.profiles;
  END IF;
END $$;

-- Create new restrictive policy for profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Authenticated users can view all profiles'
  ) THEN
    CREATE POLICY "Authenticated users can view all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- 2. Update user_roles table RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles' 
    AND policyname = 'User roles are viewable by everyone'
  ) THEN
    DROP POLICY "User roles are viewable by everyone" ON public.user_roles;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles' 
    AND policyname = 'Authenticated users can view user roles'
  ) THEN
    CREATE POLICY "Authenticated users can view user roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- 3. Add pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 4. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_lesson ON public.bookmarks(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_created ON public.chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dbt_checks_user_created ON public.dbt_checks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_lesson ON public.progress_tracking(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_completed ON public.progress_tracking(user_id, completed) WHERE completed = true;