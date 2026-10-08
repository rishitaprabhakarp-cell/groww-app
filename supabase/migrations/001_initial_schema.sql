-- ============================================================
-- Groww GenZ — Initial Schema
-- ============================================================

-- GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '🎯',
  description   TEXT,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- STREAKS TABLE
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak     INT NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  badges             JSONB NOT NULL DEFAULT '[]',
  xp                 INT NOT NULL DEFAULT 0,
  updated_at         TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- FEED EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.feed_events (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name   TEXT NOT NULL,
  avatar_url     TEXT,
  event_type     TEXT NOT NULL CHECK (event_type IN ('streak', 'goal_met', 'micro_save', 'sip_start', 'milestone')),
  event_text     TEXT NOT NULL,
  event_subtitle TEXT,
  event_badge    TEXT,
  kudos_count    INT NOT NULL DEFAULT 0,
  comment_count  INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_events ENABLE ROW LEVEL SECURITY;

-- Goals: users can only see/edit their own goals
CREATE POLICY "goals_select_own" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "goals_insert_own" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "goals_delete_own" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Streaks: users can only see/edit their own streak
CREATE POLICY "streaks_select_own" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "streaks_insert_own" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streaks_update_own" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Feed events: visible to all authenticated users (social feed)
CREATE POLICY "feed_events_select_all_auth" ON public.feed_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "feed_events_insert_own" ON public.feed_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow kudos update by any authenticated user
CREATE POLICY "feed_events_update_kudos" ON public.feed_events
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (for demo / prototype)
-- ============================================================

-- NOTE: Replace 'YOUR-DEMO-USER-UUID' with a real auth.users uuid
-- after running Supabase Auth setup, or use the Supabase dashboard
-- to manually insert rows.

-- Example seed (comment out after initial setup):
-- INSERT INTO public.feed_events (user_id, display_name, avatar_url, event_type, event_text, event_subtitle, event_badge, kudos_count, comment_count)
-- VALUES
--   ('YOUR-DEMO-USER-UUID', 'Rahul S.', 'https://api.dicebear.com/9.x/avataaars/svg?seed=rahul', 'sip_start', 'Rahul just started a new SIP bucket! 🚀', 'Automated weekly micro-SIP 🚀', 'ACTIVE', 24, 3),
--   ('YOUR-DEMO-USER-UUID', 'Ananya K.', 'https://api.dicebear.com/9.x/avataaars/svg?seed=ananya', 'goal_met', 'Ananya reached 100% of Emergency Fund! 🎉🥳', '6 Months Secured', 'Goal Met', 58, 11),
--   ('YOUR-DEMO-USER-UUID', 'Dev P.', 'https://api.dicebear.com/9.x/avataaars/svg?seed=devp', 'micro_save', 'Dev added spare change to Goa Trip pot 🏖️', 'Roundup spare change automation', 'STASHED', 19, 1),
--   ('YOUR-DEMO-USER-UUID', 'Priya M.', 'https://api.dicebear.com/9.x/avataaars/svg?seed=priya', 'streak', 'Priya completed 10-day streak! 🔥', 'Unlocked Silver Level', 'Tier 2', 41, 7);
