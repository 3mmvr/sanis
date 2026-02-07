import { MealAnalysis } from '../types';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
  streakDays: boolean[]; // Last 7 days
}

export function calculateStreak(history: MealAnalysis[]): StreakData {
  if (!history || history.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null,
      streakDays: [false, false, false, false, false, false, false]
    };
  }

  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
  
  // Get unique days with logs
  const uniqueDays = new Set<string>();
  sortedHistory.forEach(meal => {
    const dateStr = new Date(meal.timestamp).toDateString();
    uniqueDays.add(dateStr);
  });
  
  const daysArray = Array.from(uniqueDays).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if there's a log today or yesterday to start counting
  const lastLogDate = daysArray.length > 0 ? new Date(daysArray[0]) : null;
  
  if (lastLogDate) {
    lastLogDate.setHours(0, 0, 0, 0);
    const daysSinceLastLog = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastLog <= 1) {
      // Start counting from last log date
      let checkDate = new Date(lastLogDate);
      
      for (let i = 0; i < daysArray.length; i++) {
        const dayDate = new Date(daysArray[i]);
        dayDate.setHours(0, 0, 0, 0);
        
        if (dayDate.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  daysArray.forEach((dateStr) => {
    const currentDate = new Date(dateStr);
    currentDate.setHours(0, 0, 0, 0);

    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    prevDate = currentDate;
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate last 7 days for visual indicator
  const streakDays: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toDateString();
    streakDays.push(uniqueDays.has(checkDateStr));
  }

  return {
    currentStreak,
    longestStreak,
    lastLogDate: lastLogDate ? lastLogDate.toISOString() : null,
    streakDays
  };
}

export interface WeeklyStats {
  weeklyAverage: number;
  weeklyTotal: number;
  dailyCalories: number[]; // Last 7 days
  percentChange: number;
}

export function calculateWeeklyStats(history: MealAnalysis[]): WeeklyStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyCalories: number[] = [];
  let weeklyTotal = 0;
  let previousWeekTotal = 0;

  // Calculate last 7 days
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const nextDate = new Date(checkDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayTotal = history
      .filter(meal => {
        const mealDate = new Date(meal.timestamp);
        return mealDate >= checkDate && mealDate < nextDate;
      })
      .reduce((sum, meal) => sum + meal.calories, 0);

    dailyCalories.push(dayTotal);
    weeklyTotal += dayTotal;
  }

  // Calculate previous 7 days for comparison
  for (let i = 13; i >= 7; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const nextDate = new Date(checkDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayTotal = history
      .filter(meal => {
        const mealDate = new Date(meal.timestamp);
        return mealDate >= checkDate && mealDate < nextDate;
      })
      .reduce((sum, meal) => sum + meal.calories, 0);

    previousWeekTotal += dayTotal;
  }

  const weeklyAverage = weeklyTotal / 7;
  const previousAverage = previousWeekTotal / 7;
  const percentChange = previousAverage > 0 
    ? ((weeklyAverage - previousAverage) / previousAverage) * 100 
    : 0;

  return {
    weeklyAverage,
    weeklyTotal,
    dailyCalories,
    percentChange
  };
}
