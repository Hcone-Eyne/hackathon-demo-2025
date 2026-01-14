-- Create bookmarks table for saved lessons
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate bookmarks
CREATE UNIQUE INDEX idx_bookmarks_user_lesson ON public.bookmarks(user_id, lesson_id);

-- Enable RLS on bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create chat_history table for AI assistant conversations
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient chat history queries
CREATE INDEX idx_chat_history_user_created ON public.chat_history(user_id, created_at DESC);

-- Enable RLS on chat_history
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_history
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages"
  ON public.chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
  ON public.chat_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create dbt_checks table for DBT verification history
CREATE TABLE public.dbt_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  aadhaar_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('linked', 'seeded', 'not_linked')),
  bank_name TEXT,
  account_number_last4 TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient history queries
CREATE INDEX idx_dbt_checks_user_created ON public.dbt_checks(user_id, created_at DESC);

-- Enable RLS on dbt_checks
ALTER TABLE public.dbt_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dbt_checks
CREATE POLICY "Users can view their own DBT checks"
  ON public.dbt_checks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own DBT checks"
  ON public.dbt_checks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DBT checks"
  ON public.dbt_checks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create progress_tracking table for learning analytics
CREATE TABLE public.progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique constraint and index
CREATE UNIQUE INDEX idx_progress_user_lesson ON public.progress_tracking(user_id, lesson_id);
CREATE INDEX idx_progress_user_updated ON public.progress_tracking(user_id, updated_at DESC);

-- Enable RLS on progress_tracking
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for progress_tracking
CREATE POLICY "Users can view their own progress"
  ON public.progress_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.progress_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.progress_tracking
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.progress_tracking
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for progress_tracking updated_at
CREATE TRIGGER update_progress_tracking_updated_at
  BEFORE UPDATE ON public.progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat_history
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_history;