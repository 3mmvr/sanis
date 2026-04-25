
export enum PetType {
  DOG = 'dog',
  CAT = 'cat'
}

export enum BowlSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export interface PetProfile {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  weight: number;
  age?: number; // in years
  healthGoals: string[];
  bowlSize: BowlSize;
  dailyWaterTarget?: number; // recommended cups per day
  dailyCalorieTarget?: number; // recommended calories per day
  avatar?: string;
  allergies?: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD format
  cups: number;
}

export interface MealAnalysis {
  id: string;
  timestamp: number;
  mealName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: string[];
  advice: string;
  insights: string[];
  fridgeAdvice: string[];
  imageUrl?: string;
}

export interface UserSession {
  pets: PetProfile[];
  currentPetId: string | null;
  history: Record<string, MealAnalysis[]>;
  waterLogs: Record<string, WaterLog[]>; // petId -> water logs
  isGuest: boolean;
}

export const HEALTH_GOALS = {
  [PetType.DOG]: [
    'Joint Health',
    'Hip Mobility',
    'Weight Management',
    'Shiny Coat',
    'Digestive Support'
  ],
  [PetType.CAT]: [
    'Kidney Health',
    'Hairball Control',
    'Urinary Tract Health',
    'Heart Health',
    'Dental Care'
  ]
};
