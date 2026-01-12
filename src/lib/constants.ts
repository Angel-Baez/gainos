import { BackpackItem, MealInfo, MealPrepItem } from "@/types";

// Informacion de las 8 comidas diarias
export const MEALS: MealInfo[] = [
  {
    number: 1,
    name: "Batida Matutina",
    time: "06:30",
    calories: 500,
    description: "Leche, avena, mantequilla de mani, guineo, miel",
  },
  {
    number: 2,
    name: "Desayuno Solido",
    time: "09:30",
    calories: 600,
    description: "3 huevos, pan con mantequilla de mani, fruta, mani",
  },
  {
    number: 3,
    name: "Snack Media Manana",
    time: "11:30",
    calories: 300,
    description: "Sandwich jamon y queso, yogurt",
  },
  {
    number: 4,
    name: "Almuerzo Principal",
    time: "13:00",
    calories: 900,
    description: "Arroz, proteina, habichuelas, platano, aguacate",
  },
  {
    number: 5,
    name: "Merienda Tarde",
    time: "16:00",
    calories: 400,
    description: "Pan con queso/jamon, leche, fruta",
  },
  {
    number: 6,
    name: "Pre-Cena",
    time: "19:00",
    calories: 350,
    description: "Batida rapida o huevos con pan",
  },
  {
    number: 7,
    name: "Cena Principal",
    time: "21:30",
    calories: 700,
    description: "Mangu completo o sobras del almuerzo",
  },
  {
    number: 8,
    name: "Batida Nocturna",
    time: "22:30",
    calories: 300,
    description: "Leche, avena, miel - antes de dormir",
  },
];

// Total calorias diarias objetivo
export const DAILY_CALORIES_TARGET = 4050;

// Items predefinidos para Meal Prep (domingos)
export const DEFAULT_MEAL_PREP_ITEMS: MealPrepItem[] = [
  { name: "15-20 huevos duros cocidos", completed: false },
  { name: "5 kg arroz cocido (porciones individuales)", completed: false },
  { name: "2+ kg proteina guisada (pollo/carne)", completed: false },
  { name: "3 kg habichuelas cocidas", completed: false },
  { name: "10 sandwiches armados (congelar 6)", completed: false },
  { name: "5 bolsitas con 30g mani cada una", completed: false },
  { name: "Ingredientes batidas medidos en bolsas ziploc", completed: false },
  { name: "Vegetales lavados y cortados", completed: false },
  { name: "Mochila preparada para el lunes", completed: false },
];

// Items predefinidos para la mochila diaria
export const DEFAULT_BACKPACK_ITEMS: BackpackItem[] = [
  { name: "2 sandwiches (comidas 2 y 3)", checked: false },
  { name: "2 frutas", checked: false },
  { name: "2 bolsitas mani (30g cada una)", checked: false },
  { name: "2 yogurts", checked: false },
  { name: "1 botella agua (1 litro)", checked: false },
  { name: "1 pote mantequilla de mani", checked: false },
];

// Configuracion inicial del usuario
export const DEFAULT_USER_SETTINGS = {
  startWeight: 104, // lb
  goalWeight: 135, // lb
  startDate: new Date().toISOString().split("T")[0], // Fecha actual
  theme: "dark" as const,
  onboardingCompleted: false,
};

// Sistema de puntuacion semanal
export const SCORING = {
  meals: {
    max: 50,
    perMeal: 50 / 56, // 56 comidas por semana (8 x 7)
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
    excellent: 15, // 0.7-1.5 lb
    good: 10, // 0.3-0.7 lb
    acceptable: 5, // <0.3 lb
  },
};
