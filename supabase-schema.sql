-- ============================================
-- SANIS - Pet Nutrition AI Database Schema
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_stage INTEGER DEFAULT 0, -- Track 5-stage onboarding progress
  subscription_tier TEXT DEFAULT 'free', -- free, premium, pro
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PETS TABLE
-- ============================================
CREATE TABLE public.pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
  breed TEXT NOT NULL,
  weight DECIMAL(5,2) NOT NULL, -- in kg
  weight_goal DECIMAL(5,2), -- target weight in kg
  date_of_birth DATE,
  age_years INTEGER,
  bowl_size TEXT NOT NULL CHECK (bowl_size IN ('small', 'medium', 'large')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PET HEALTH GOALS TABLE
-- ============================================
CREATE TABLE public.pet_health_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  goal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEAL LOGS TABLE (Main nutrition tracking)
-- ============================================
CREATE TABLE public.meal_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meal_name TEXT NOT NULL,
  image_url TEXT,
  
  -- Nutrition Data
  calories INTEGER NOT NULL,
  protein DECIMAL(6,2) NOT NULL, -- grams
  fat DECIMAL(6,2) NOT NULL, -- grams
  carbs DECIMAL(6,2) NOT NULL, -- grams
  
  -- AI Analysis Results
  ingredients TEXT[], -- Array of ingredients
  advice TEXT,
  insights TEXT[], -- Array of health insights
  fridge_advice TEXT[], -- Array of suggested additions
  
  -- Metadata
  meal_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  portion_multiplier DECIMAL(3,2) DEFAULT 1.0, -- For adjusting portions
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HYDRATION LOGS TABLE
-- ============================================
CREATE TABLE public.hydration_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cups_consumed INTEGER NOT NULL DEFAULT 0,
  daily_goal INTEGER NOT NULL DEFAULT 8, -- cups per day
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN daily_goal > 0 THEN (cups_consumed::DECIMAL / daily_goal * 100)
      ELSE 0 
    END
  ) STORED,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one hydration log per pet per day
  UNIQUE(pet_id, log_date)
);

-- ============================================
-- WEIGHT TRACKING TABLE
-- ============================================
CREATE TABLE public.weight_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL, -- in kg
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTIVITY STREAKS TABLE
-- ============================================
CREATE TABLE public.activity_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One streak record per pet
  UNIQUE(pet_id)
);

-- ============================================
-- DAILY TARGETS TABLE (Calorie goals per day)
-- ============================================
CREATE TABLE public.daily_targets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  target_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Calculated targets based on weight (60-70 kcal per kg)
  target_calories INTEGER NOT NULL,
  consumed_calories INTEGER DEFAULT 0,
  
  -- Calculated from meal_logs
  total_protein DECIMAL(6,2) DEFAULT 0,
  total_fat DECIMAL(6,2) DEFAULT 0,
  total_carbs DECIMAL(6,2) DEFAULT 0,
  total_meals INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One target per pet per day
  UNIQUE(pet_id, target_date)
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Settings from UI
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  cloud_backup_enabled BOOLEAN DEFAULT TRUE,
  vision_quality TEXT DEFAULT 'high' CHECK (vision_quality IN ('low', 'medium', 'high')),
  
  -- Notification preferences
  daily_reminder_enabled BOOLEAN DEFAULT TRUE,
  daily_reminder_time TIME DEFAULT '09:00:00',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- ONBOARDING STAGES TABLE (Track user journey)
-- ============================================
CREATE TABLE public.onboarding_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 5),
  stage_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, stage_number)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- User queries
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_pets_user_active ON public.pets(user_id, is_active);

-- Meal logs queries (most frequent)
CREATE INDEX idx_meal_logs_pet_id ON public.meal_logs(pet_id);
CREATE INDEX idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX idx_meal_logs_meal_time ON public.meal_logs(meal_time DESC);
CREATE INDEX idx_meal_logs_pet_date ON public.meal_logs(pet_id, meal_time DESC);

-- Hydration queries
CREATE INDEX idx_hydration_pet_date ON public.hydration_logs(pet_id, log_date DESC);

-- Weight tracking
CREATE INDEX idx_weight_logs_pet_date ON public.weight_logs(pet_id, log_date DESC);

-- Daily targets
CREATE INDEX idx_daily_targets_pet_date ON public.daily_targets(pet_id, target_date DESC);

-- Activity streaks
CREATE INDEX idx_activity_streaks_user ON public.activity_streaks(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pets: Users can only manage their own pets
CREATE POLICY "Users can view own pets" ON public.pets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets" ON public.pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets" ON public.pets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets" ON public.pets
  FOR DELETE USING (auth.uid() = user_id);

-- Pet Health Goals
CREATE POLICY "Users can manage own pet health goals" ON public.pet_health_goals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_health_goals.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Meal Logs
CREATE POLICY "Users can view own meal logs" ON public.meal_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal logs" ON public.meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal logs" ON public.meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal logs" ON public.meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Hydration Logs
CREATE POLICY "Users can manage own hydration logs" ON public.hydration_logs
  FOR ALL USING (auth.uid() = user_id);

-- Weight Logs
CREATE POLICY "Users can manage own weight logs" ON public.weight_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = weight_logs.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Activity Streaks
CREATE POLICY "Users can view own streaks" ON public.activity_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.activity_streaks
  FOR ALL USING (auth.uid() = user_id);

-- Daily Targets
CREATE POLICY "Users can manage own daily targets" ON public.daily_targets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = daily_targets.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- User Preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Onboarding Progress
CREATE POLICY "Users can manage own onboarding" ON public.onboarding_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_logs_updated_at BEFORE UPDATE ON public.meal_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hydration_logs_updated_at BEFORE UPDATE ON public.hydration_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_streaks_updated_at BEFORE UPDATE ON public.activity_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_targets_updated_at BEFORE UPDATE ON public.daily_targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update streak on meal log insert
CREATE OR REPLACE FUNCTION update_activity_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_date DATE := CURRENT_DATE;
  streak_record RECORD;
BEGIN
  -- Get or create streak record
  SELECT * INTO streak_record
  FROM public.activity_streaks
  WHERE pet_id = NEW.pet_id;

  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO public.activity_streaks (user_id, pet_id, current_streak, longest_streak, last_activity_date, streak_start_date)
    VALUES (NEW.user_id, NEW.pet_id, 1, 1, current_date, current_date);
  ELSE
    last_date := streak_record.last_activity_date;
    
    -- Check if this is a new day
    IF last_date != current_date THEN
      -- Check if streak continues (logged yesterday)
      IF last_date = current_date - INTERVAL '1 day' THEN
        -- Continue streak
        UPDATE public.activity_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = current_date,
            updated_at = NOW()
        WHERE pet_id = NEW.pet_id;
      ELSIF last_date < current_date - INTERVAL '1 day' THEN
        -- Streak broken, reset
        UPDATE public.activity_streaks
        SET current_streak = 1,
            last_activity_date = current_date,
            streak_start_date = current_date,
            updated_at = NOW()
        WHERE pet_id = NEW.pet_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak AFTER INSERT ON public.meal_logs
  FOR EACH ROW EXECUTE FUNCTION update_activity_streak();

-- Function: Update daily targets when meal is logged
CREATE OR REPLACE FUNCTION update_daily_target()
RETURNS TRIGGER AS $$
DECLARE
  target_date DATE := DATE(NEW.meal_time);
  pet_weight DECIMAL;
  calculated_target INTEGER;
BEGIN
  -- Get pet weight for calculating target
  SELECT weight INTO pet_weight FROM public.pets WHERE id = NEW.pet_id;
  calculated_target := (pet_weight * 65)::INTEGER; -- 65 kcal per kg

  -- Upsert daily target
  INSERT INTO public.daily_targets (
    pet_id, 
    target_date, 
    target_calories,
    consumed_calories,
    total_protein,
    total_fat,
    total_carbs,
    total_meals
  )
  VALUES (
    NEW.pet_id,
    target_date,
    calculated_target,
    NEW.calories,
    NEW.protein,
    NEW.fat,
    NEW.carbs,
    1
  )
  ON CONFLICT (pet_id, target_date)
  DO UPDATE SET
    consumed_calories = daily_targets.consumed_calories + NEW.calories,
    total_protein = daily_targets.total_protein + NEW.protein,
    total_fat = daily_targets.total_fat + NEW.fat,
    total_carbs = daily_targets.total_carbs + NEW.carbs,
    total_meals = daily_targets.total_meals + 1,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_target AFTER INSERT ON public.meal_logs
  FOR EACH ROW EXECUTE FUNCTION update_daily_target();

-- Function: Create default preferences on profile creation
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_preferences AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_preferences();

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View: Daily summary per pet
CREATE OR REPLACE VIEW daily_pet_summary AS
SELECT 
  p.id as pet_id,
  p.name as pet_name,
  p.user_id,
  dt.target_date,
  dt.target_calories,
  dt.consumed_calories,
  dt.total_protein,
  dt.total_fat,
  dt.total_carbs,
  dt.total_meals,
  ROUND((dt.consumed_calories::DECIMAL / NULLIF(dt.target_calories, 0) * 100), 2) as calorie_percentage,
  hl.cups_consumed,
  hl.daily_goal as hydration_goal,
  hl.percentage as hydration_percentage,
  asts.current_streak
FROM public.pets p
LEFT JOIN public.daily_targets dt ON p.id = dt.pet_id AND dt.target_date = CURRENT_DATE
LEFT JOIN public.hydration_logs hl ON p.id = hl.pet_id AND hl.log_date = CURRENT_DATE
LEFT JOIN public.activity_streaks asts ON p.id = asts.pet_id
WHERE p.is_active = true;

-- View: Weekly nutrition trends
CREATE OR REPLACE VIEW weekly_nutrition_trends AS
SELECT 
  pet_id,
  DATE_TRUNC('week', target_date) as week_start,
  AVG(consumed_calories) as avg_calories,
  AVG(total_protein) as avg_protein,
  AVG(total_fat) as avg_fat,
  AVG(total_carbs) as avg_carbs,
  SUM(total_meals) as total_meals,
  COUNT(*) as days_logged
FROM public.daily_targets
WHERE target_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY pet_id, DATE_TRUNC('week', target_date)
ORDER BY week_start DESC;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Note: After creating a user through Supabase Auth,
-- you can insert test data using their UUID

