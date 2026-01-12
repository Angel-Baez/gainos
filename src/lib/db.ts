import Dexie, { type EntityTable } from 'dexie';
import {
  DailyMeal,
  WeightRecord,
  MealPrepRecord,
  BackpackCheck,
  WeeklyScore,
  UserSettings,
} from '@/types';

// Definicion de la base de datos
const db = new Dexie('GainOSDatabase') as Dexie & {
  meals: EntityTable<DailyMeal, 'id'>;
  weights: EntityTable<WeightRecord, 'id'>;
  mealPreps: EntityTable<MealPrepRecord, 'id'>;
  backpacks: EntityTable<BackpackCheck, 'id'>;
  scores: EntityTable<WeeklyScore, 'id'>;
  settings: EntityTable<UserSettings, 'id'>;
};

// Esquema de la base de datos
db.version(1).stores({
  meals: 'id, date, mealNumber, status',
  weights: 'id, date',
  mealPreps: 'id, weekStart',
  backpacks: 'id, date',
  scores: 'id, weekStart',
  settings: 'id',
});

export { db };
