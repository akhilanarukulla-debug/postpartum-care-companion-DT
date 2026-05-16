-- Postpartum Care Companion Database Schema
-- This schema uses the existing neon_auth schema for authentication
-- and adds application-specific tables in the public schema

-- ============= User Settings =============
-- Stores user preferences and streak data
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  water_goal INTEGER DEFAULT 8,
  mood_streak INTEGER DEFAULT 0,
  water_streak INTEGER DEFAULT 0,
  last_mood_date DATE,
  last_water_date DATE,
  show_onboarding BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- ============= Mood Entries =============
-- Stores mood log entries with optional notes
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  mood VARCHAR(50) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for mood queries
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at DESC);

-- ============= Water Entries =============
-- Tracks daily water intake
CREATE TABLE IF NOT EXISTS public.water_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  glasses INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for water queries
CREATE INDEX IF NOT EXISTS idx_water_entries_user_id ON public.water_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_water_entries_date ON public.water_entries(date DESC);

-- ============= Reminders =============
-- Stores user-created reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  time VARCHAR(10) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'self-care',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for reminder queries
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);

-- ============= Notes =============
-- All queries in the application filter by user_id to ensure
-- complete data isolation between users.
--
-- Example query pattern:
-- SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC
--
-- New users automatically start with:
-- - Empty mood history
-- - 0 glasses of water for today
-- - No reminders
-- - Default water goal of 8 glasses
-- - 0 day streaks for both mood and water
