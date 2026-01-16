import { BackpackItem, MealInfo, MealPrepItem, ShoppingItem } from "@/types";

// Informacion de las 5 comidas diarias (Plan Maestro 2,600 kcal)
export const MEALS: MealInfo[] = [
  {
    number: 1,
    name: "Desayuno",
    time: "06:00",
    calories: 650,
    description: "Licuado (leche, avena, guineos, mani) + 2 huevos hervidos",
  },
  {
    number: 2,
    name: "Snack AM",
    time: "10:00",
    calories: 400,
    description: "Sandwich: pan + 2 huevos + mantequilla de mani",
  },
  {
    number: 3,
    name: "Almuerzo",
    time: "13:00",
    calories: 750,
    description: "Arroz + habichuelas + pollo + platano frito + aceite",
  },
  {
    number: 4,
    name: "Snack PM",
    time: "17:00",
    calories: 400,
    description: "Batido (leche, avena, mani, guineo) O pasta con sardinas",
  },
  {
    number: 5,
    name: "Cena",
    time: "21:30",
    calories: 400,
    description: "Bowl: arroz + pollo + habichuelas O vianda + sardinas",
  },
];

export type WeeklyMeal = {
  day: string;
  desayuno: string;
  snackAM: string;
  almuerzo: string;
  snackPM: string;
  cena: string;
};

export const WEEKLY_MEAL_PLAN: WeeklyMeal[] = [
  { day: "LUN", desayuno: "Licuado + 2 huevos", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Batido", cena: "Pasta con huevos" },
  { day: "MAR", desayuno: "Avena+leche+canela+guineo", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Batido", cena: "Bowl: arroz+pollo+habichuelas" },
  { day: "MIÉ", desayuno: "Licuado + 2 huevos", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+sardinas+habichuelas", snackPM: "Pasta con sardinas", cena: "Batata + huevos" },
  { day: "JUE", desayuno: "Avena+leche+canela+guineo", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Batido", cena: "Sándwich maní+guineo x2" },
  { day: "VIE", desayuno: "Licuado + 2 huevos", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Batido", cena: "Bowl: arroz+pollo+habichuelas" },
  { day: "SÁB", desayuno: "Avena+leche+canela+guineo", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Pasta con sardinas", cena: "Yuca + sardinas" },
  { day: "DOM", desayuno: "Licuado + 2 huevos", snackAM: "Sándwich pan+huevo+maní", almuerzo: "Arroz+pollo+habichuelas+plátano", snackPM: "Batido", cena: "Batata + huevos" },
];

// Total calorias diarias objetivo
export const DAILY_CALORIES_TARGET = 2600;

// Items predefinidos para Meal Prep (LUNES SAGRADO)
export const DEFAULT_MEAL_PREP_ITEMS: MealPrepItem[] = [
  // Estacion 1 - Proteinas
  { name: "Pollo guisado (5 lb) - desmenuzar", completed: false },
  { name: "15 huevos hervidos (NO pelar)", completed: false },
  { name: "Habichuelas guisadas (2 lb)", completed: false },
  // Estacion 2 - Carbohidratos
  { name: "Arroz cocido (5 tazas secas)", completed: false },
  { name: "Avena pre-cocida (4 porciones con leche y canela)", completed: false },
  { name: "Batata y yuca hervidas (con cascara)", completed: false },
  { name: "7 platanos fritos", completed: false },
  // Estacion 3 - Extras
  { name: "Pasta cocida (1 lb con aceite)", completed: false },
  { name: "Sofrito extra (cebolla, ajo, aji, tomate)", completed: false },
  // Ensamblaje
  { name: "6 tuppers ALMUERZO ensamblados", completed: false },
  { name: "7 tuppers CENA ensamblados", completed: false },
  { name: "7 bolsas de SNACKS preparadas", completed: false },
  { name: "Distribuir en nevera y congelador", completed: false },
];

// Items predefinidos para la mochila diaria
export const DEFAULT_BACKPACK_ITEMS: BackpackItem[] = [
  { name: "Tupper ALMUERZO (arroz+pollo+habichuelas+platano)", checked: false },
  { name: "Tupper CENA", checked: false },
  { name: "Bolsa SNACKS (pan, 2 huevos, guineo)", checked: false },
  { name: "Bolsita batido (3 cdas avena + 2 cdas mani)", checked: false },
  { name: "Termo para licuado", checked: false },
  { name: "Botella agua (1 litro)", checked: false },
];

// Configuracion inicial del usuario
export const DEFAULT_USER_SETTINGS = {
  startWeight: 47, // kg
  goalWeight: 52, // kg (meta 12 semanas)
  startDate: new Date().toISOString().split("T")[0],
  theme: "dark" as const,
  onboardingCompleted: false,
};

// Sistema de puntuacion semanal
export const SCORING = {
  meals: {
    max: 50,
    perMeal: 50 / 35, // 35 comidas por semana (5 x 7)
  },
  mealPrep: {
    max: 20,
    complete: 20,
    partial: 10,
  },
  tracking: {
    max: 15,
  },
  weight: {
    max: 15,
    excellent: 15, // 0.3-0.5 kg/semana
    good: 10, // 0.2-0.3 kg
    acceptable: 5, // <0.2 kg
  },
};

// Categorias de la lista de compras
export const SHOPPING_CATEGORIES = [
  { id: "proteinas" as const, label: "Proteinas", icon: "Beef" },
  { id: "carbohidratos" as const, label: "Carbohidratos", icon: "Wheat" },
  { id: "grasas" as const, label: "Grasas y Lacteos", icon: "Milk" },
  { id: "condimentos" as const, label: "Condimentos", icon: "Carrot" },
];

// Items predefinidos para la lista de compras semanal (RD$3,000)
export const DEFAULT_SHOPPING_ITEMS: ShoppingItem[] = [
  // Proteinas (RD$1,060)
  { name: "Huevos", quantity: 30, unit: "unidades", category: "proteinas", purchased: false },
  { name: "Muslos de pollo", quantity: 5, unit: "lb", category: "proteinas", purchased: false },
  { name: "Sardinas en aceite", quantity: 4, unit: "latas", category: "proteinas", purchased: false },
  { name: "Habichuelas rojas secas", quantity: 2, unit: "lb", category: "proteinas", purchased: false },

  // Carbohidratos (RD$1,080)
  { name: "Arroz blanco", quantity: 10, unit: "lb", category: "carbohidratos", purchased: false },
  { name: "Avena en hojuelas", quantity: 2, unit: "lb", category: "carbohidratos", purchased: false },
  { name: "Guineos maduros", quantity: 14, unit: "unidades", category: "carbohidratos", purchased: false },
  { name: "Platanos maduros (freir)", quantity: 7, unit: "unidades", category: "carbohidratos", purchased: false },
  { name: "Batata", quantity: 3, unit: "lb", category: "carbohidratos", purchased: false },
  { name: "Yuca", quantity: 2, unit: "lb", category: "carbohidratos", purchased: false },
  { name: "Pan de agua/viga", quantity: 2, unit: "paquetes", category: "carbohidratos", purchased: false },
  { name: "Pasta/Espaguetis", quantity: 1, unit: "lb", category: "carbohidratos", purchased: false },

  // Grasas y Lacteos (RD$590)
  { name: "Leche entera", quantity: 1, unit: "galon", category: "grasas", purchased: false },
  { name: "Mantequilla de mani", quantity: 500, unit: "g", category: "grasas", purchased: false },
  { name: "Aceite vegetal", quantity: 1, unit: "botella", category: "grasas", purchased: false },
  { name: "Mani sin sal", quantity: 0.5, unit: "lb", category: "grasas", purchased: false },

  // Condimentos (RD$270)
  { name: "Cebolla", quantity: 3, unit: "unidades", category: "condimentos", purchased: false },
  { name: "Ajo", quantity: 1, unit: "cabeza", category: "condimentos", purchased: false },
  { name: "Aji cubanela", quantity: 4, unit: "unidades", category: "condimentos", purchased: false },
  { name: "Tomate", quantity: 3, unit: "unidades", category: "condimentos", purchased: false },
  { name: "Sal, oregano, cubitos", quantity: 1, unit: "set", category: "condimentos", purchased: false },
  { name: "Canela en polvo", quantity: 1, unit: "sobre", category: "condimentos", purchased: false },
];
