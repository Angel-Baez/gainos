// Tipos para GainOS - PWA de tracking de aumento de peso

export type MealStatus = "pending" | "completed" | "skipped" | "partial";

export interface DailyMeal {
  id: string; // YYYY-MM-DD-mealNumber
  date: string; // YYYY-MM-DD
  mealNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  status: MealStatus;
  completedAt?: Date;
  notes?: string;
}

export interface WeightRecord {
  id: string; // YYYY-MM-DD
  date: string;
  weight: number; // en libras
  photoUri?: string; // base64
  notes?: string;
}

export interface MealPrepItem {
  name: string;
  completed: boolean;
}

export interface MealPrepRecord {
  id: string; // YYYY-WW (semana del ano)
  weekStart: string;
  items: MealPrepItem[];
  completedAt?: Date;
}

export interface BackpackItem {
  name: string;
  checked: boolean;
}

export interface BackpackCheck {
  id: string; // YYYY-MM-DD
  date: string;
  items: BackpackItem[];
}

// Lista de compras
export type ShoppingCategory = "proteinas" | "lacteos" | "granos" | "frutas" | "vegetales" | "otros";

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
  purchased: boolean;
}

export interface ShoppingList {
  id: string; // YYYY-MM-Q1 o YYYY-MM-Q2 (quincena)
  startDate: string;
  items: ShoppingItem[];
  completedAt?: Date;
}

export interface WeeklyScore {
  id: string; // YYYY-WW
  weekStart: string;
  mealsScore: number; // max 50
  mealPrepScore: number; // max 20
  trackingScore: number; // max 15
  weightScore: number; // max 15
  total: number; // max 100
}

// Informacion de cada comida
export interface MealInfo {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  time: string;
  calories: number;
  description: string;
}

// Configuracion del usuario
export interface UserSettings {
  id: string;
  startWeight: number;
  goalWeight: number;
  startDate: string;
  theme?: "light" | "dark" | "system";
  onboardingCompleted?: boolean;
}

// Tipos para reportes
export interface WeeklyReport {
  weekId: string;
  weekStart: string;
  weekEnd: string;
  mealsCompleted: number;
  mealsTotal: number;
  mealsPercentage: number;
  mealsByNumber: Record<number, { completed: number; total: number }>;
  weightStart?: number;
  weightEnd?: number;
  weightChange?: number;
  mealPrepCompleted: boolean;
  trackingDays: number;
  score?: WeeklyScore;
}

export interface MonthlyReport {
  month: string; // YYYY-MM
  weeks: WeeklyReport[];
  totalMealsCompleted: number;
  totalMealsPossible: number;
  averageScore: number;
  weightStart?: number;
  weightEnd?: number;
  weightChange?: number;
}

// Tipos para exportacion
export interface ExportData {
  exportedAt: string;
  settings: UserSettings;
  meals: DailyMeal[];
  weights: WeightRecord[];
  mealPreps: MealPrepRecord[];
  scores: WeeklyScore[];
}
