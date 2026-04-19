# Streak & Analytics Data Sync

## Overview
All streak counters and analytics data have been synced to use real meal log data from the pet's account history.

## What Was Changed

### 1. **Streak Calculator Utility** (`utils/streakCalculator.ts`)
Created a comprehensive utility to calculate:
- **Current Streak**: Counts consecutive days with at least one logged meal
  - Resets if user misses a day
  - Handles edge cases (today, yesterday, etc.)
- **Longest Streak**: Tracks the best streak ever achieved
- **Last 7 Days Visual**: Boolean array showing which days had logs
- **Weekly Stats**: 
  - Average daily calories (last 7 days)
  - Total weekly calories
  - Daily breakdown for bar chart
  - Percent change vs previous week

### 2. **Dashboard.tsx Updates**
- ✅ Streak badge in header now shows **real current streak**
- ✅ Uses `useMemo` for performance optimization
- ✅ Automatically resets if user misses a day
- ✅ Updates in real-time when new meals are logged

### 3. **ProgressView.tsx (Analytics) Updates**
- ✅ **Current Streak Card**: Shows real current streak with fire emoji
- ✅ **Longest Streak Display**: Shows "Best: X days" if longer than current
- ✅ **7-Day Visual Indicators**: Green checkmarks for days with logs
- ✅ **Metabolic Trend Chart**: Uses last 10 days of real calorie data
  - Dynamic scaling based on actual values
  - Handles empty states gracefully
- ✅ **Weekly Bar Chart**: 
  - Shows actual calories per day (Mon-Sun)
  - Highlights today in yellow
  - Shows percent change vs previous week (↑ green or ↓ red)
- ✅ **Average Daily Intake**: Calculates from real 7-day average

## How It Works

### Streak Logic
```typescript
// Counts consecutive days with meals
// Example: User logs meals on:
// Jan 1, Jan 2, Jan 3, Jan 5, Jan 6, Jan 7 (today)
// Current streak: 3 days (Jan 5-7)
// Longest streak: 3 days (Jan 1-3 or Jan 5-7)
```

### Weekly Stats Logic
```typescript
// Calculates last 7 days vs previous 7 days
// Example:
// This week: [800, 0, 900, 850, 920, 880, 1000] = 860 cal/day avg
// Last week: [750, 800, 770, 820, 0, 850, 800] = 770 cal/day avg
// Change: +11.7% ↑ (green)
```

### Real-Time Updates
All calculations use `useMemo` hooks that depend on the `history` array:
- When user logs a new meal → history updates
- useMemo detects change → recalculates streak/stats
- UI automatically re-renders with new data

## Empty State Handling
- **No meals logged**: Shows "0" streak, empty bar chart
- **First meal**: Starts streak at 1, shows in bar chart
- **Missing days**: Resets current streak, preserves longest streak
- **Insufficient data**: Uses graceful defaults (single data point for trend)

## Testing Scenarios

### Test 1: Fresh Account
- No meal logs → Streak shows 0
- Analytics show empty charts with minimum heights
- Weekly average shows 0 cal/day

### Test 2: Consistent Daily Logs
- Log meals for 7 consecutive days
- Streak increments to 7
- Bar chart fills with actual calories
- Percent change shows N/A or 0% (no previous data)

### Test 3: Missed Day
- Log meals for 3 days → Streak = 3
- Skip a day
- Log again → Streak resets to 1
- Analytics still show all historical data

### Test 4: Long-Term Usage
- After 14+ days of logs
- Percent change becomes meaningful
- Trend chart shows meaningful patterns
- Longest streak preserved even if current resets

## Future Enhancements
- [ ] Add streak milestones (7 day, 30 day, 100 day badges)
- [ ] Show streak recovery countdown ("Log today to keep streak!")
- [ ] Add monthly/yearly analytics views
- [ ] Export analytics as PDF report
- [ ] Compare multiple pets' streaks side-by-side
- [ ] Streak notifications/reminders

## Migration from Hardcoded Data
**Before:**
- Streak: Always showed "21"
- Bar chart: Static heights `[30, 45, 60, 95, 70, 85, 55]`
- Average: Always "861 cal/day"
- Percent change: Always "↑ 12%"

**After:**
- Everything calculates from `session.history[currentPet.id]`
- Real-time updates as user logs meals
- Accurate analytics for each pet individually
- No mock data, 100% real user data
