# SANIS - Complete Implementation Guide

## 📊 Database Structure Overview

### Core Tables
1. **profiles** - User accounts (extends Supabase auth)
2. **pets** - Pet profiles with goals
3. **meal_logs** - Complete nutrition tracking
4. **hydration_logs** - Daily water intake
5. **weight_logs** - Weight tracking over time
6. **activity_streaks** - Streak counting system
7. **daily_targets** - Daily nutrition goals & achievements
8. **user_preferences** - App settings
9. **onboarding_progress** - 5-stage onboarding tracker

---

## 🎯 Features Implementation Checklist

### Home Page (Dashboard)
- [x] ✅ Multiple pet profiles support
- [ ] 🔲 Streak counter (resets if no log for 24h) - **DB automated**
- [ ] 🔲 Calendar filter for meal logs by date
- [ ] 🔲 Real-time Kcal Today counter - **DB automated via triggers**
- [ ] 🔲 Hydration tracker (cups/8 with percentage) - **DB automated**
- [x] ✅ Meal logs display

### Analytics Page (formerly Progress)
- [ ] 🔲 Weight goals tracking with history
- [ ] 🔲 Active streak display from DB
- [ ] 🔲 Metabolic trends chart with working filters
- [ ] 🔲 Average intake cycle from real data

### Auth System
- [ ] 🔲 Sign up page
- [ ] 🔲 Login page
- [ ] 🔲 Password reset
- [ ] 🔲 Email verification

### Onboarding (5 Stages)
- [ ] 🔲 Stage 1: Welcome & App Purpose
- [ ] 🔲 Stage 2: Why Pet Nutrition Matters
- [ ] 🔲 Stage 3: How AI Scanning Works
- [ ] 🔲 Stage 4: Understanding Streaks & Goals
- [ ] 🔲 Stage 5: Create First Pet Profile

---

## 🚀 Implementation Steps

### Step 1: Setup Supabase
```bash
# 1. Create a new Supabase project at https://supabase.com
# 2. Copy the SQL from supabase-schema.sql
# 3. Run it in the SQL Editor in Supabase Dashboard
# 4. Enable Email Auth in Authentication > Providers
```

### Step 2: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 3: Environment Variables
Add to `.env.local`:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📝 Key Features Explained

### 1. Streak System (Automated)
- **Trigger**: `update_activity_streak()` 
- Runs automatically when a meal is logged
- Checks if last log was yesterday (continues) or older (resets)
- Updates `current_streak` and `longest_streak`

### 2. Daily Targets (Automated)
- **Trigger**: `update_daily_target()`
- Calculates target: `weight * 65 kcal/kg`
- Aggregates all meals logged that day
- Provides real-time progress tracking

### 3. Hydration Tracking
- One record per pet per day
- Auto-calculates percentage: `(cups_consumed / daily_goal) * 100`
- Updates increment the cup count

### 4. Weight Goals
- Track weight over time in `weight_logs`
- Set target weight in `pets.weight_goal`
- Compare current vs. goal for progress

### 5. Calendar Filtering
Query meals by date:
```sql
SELECT * FROM meal_logs 
WHERE pet_id = $1 
AND DATE(meal_time) = $2
ORDER BY meal_time DESC;
```

### 6. Analytics/Trends
Use the `weekly_nutrition_trends` view:
```sql
SELECT * FROM weekly_nutrition_trends 
WHERE pet_id = $1 
ORDER BY week_start DESC 
LIMIT 12; -- Last 12 weeks
```

---

## 🔐 Row Level Security (RLS)

All tables are protected with RLS policies:
- Users can only access their own data
- Automatic user_id validation via `auth.uid()`
- No risk of data leakage between users

---

## 🎨 5-Stage Onboarding Flow

### Stage 1: Welcome
**Message**: "Welcome to Sanis - where your pet's health becomes your mission"
- Show app logo and hero image
- "Track nutrition with AI precision"
- "Just like you count your calories, now count theirs"

### Stage 2: The Why
**Message**: "Your pet's longevity depends on what they eat"
- Show statistic: "Proper nutrition can extend pet life by 2-3 years"
- "75% of pets are overweight or obese"
- "You care about your health. They deserve the same."

### Stage 3: How It Works
**Message**: "AI-powered food scanning in seconds"
- Show scanning animation
- "1. Snap a photo of their bowl"
- "2. AI analyzes calories, protein, fats, carbs"
- "3. Get instant nutrition advice"

### Stage 4: Streaks & Goals
**Message**: "Build healthy habits, one meal at a time"
- Show streak flame icon
- "Log daily to maintain your streak"
- "Set weight goals and track progress"
- "Your dedication = their vitality"

### Stage 5: Create Profile
**Message**: "Let's meet your companion"
- Pet type selection
- Name, breed, weight
- Health goals selection
- Bowl size calibration

---

## 📊 Database Relationships

```
profiles (user)
  ↓
  ├── pets (1:many)
  │     ├── pet_health_goals (1:many)
  │     ├── meal_logs (1:many)
  │     ├── hydration_logs (1:many)
  │     ├── weight_logs (1:many)
  │     ├── activity_streaks (1:1)
  │     └── daily_targets (1:many)
  │
  ├── user_preferences (1:1)
  └── onboarding_progress (1:many)
```

---

## 🔄 Data Sync Strategy

### On App Load:
1. Check auth state
2. Fetch user profile
3. Fetch active pets
4. Load today's data (meals, hydration, targets)
5. Load current streak

### On Meal Log:
1. Upload image to Supabase Storage
2. Get AI analysis from Gemini
3. Insert into `meal_logs`
4. Triggers auto-update `daily_targets` and `activity_streaks`
5. Refresh UI with new data

### On Hydration Update:
1. Upsert `hydration_logs` (increment cups)
2. Auto-calculates percentage
3. Update UI

---

## 🎯 Success Metrics

Track these in a future `analytics` table:
- Daily active users (DAU)
- Meals logged per user
- Average streak length
- Pets per user
- Feature usage (scanning, manual entry, etc.)

---

## 🚀 Next Steps

1. **Run the SQL schema** in Supabase
2. **Install Supabase client** in your app
3. **Create authentication pages** (Sign up, Login)
4. **Build 5-stage onboarding** flow
5. **Connect existing components** to Supabase
6. **Implement real-time subscriptions** for live updates
7. **Add image upload** to Supabase Storage for meal photos

---

## 💡 Pro Tips

- Use Supabase Realtime for live updates
- Store meal images in Supabase Storage (5GB free tier)
- Use `daily_pet_summary` view for dashboard data
- Batch updates for better performance
- Add indexes if queries slow down (already included)

---

## 📞 Support

Database structure supports:
✅ Multi-pet households
✅ Automatic streak tracking
✅ Real-time calorie counting
✅ Hydration monitoring
✅ Weight goal tracking
✅ Analytics & trends
✅ User preferences
✅ Secure data isolation (RLS)
✅ Onboarding progress tracking

Ready to make pets as healthy as their owners! 🐾
