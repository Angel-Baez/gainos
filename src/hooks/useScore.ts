'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { WeeklyScore } from '@/types';
import { SCORING } from '@/lib/constants';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const getWeekId = (date: Date = new Date()) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return format(weekStart, "yyyy-'W'ww");
};

const getWeekStartString = (date: Date = new Date()) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return format(weekStart, 'yyyy-MM-dd');
};

export function useScore(date: Date = new Date()) {
  const weekId = getWeekId(date);
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  // Obtener score guardado
  const savedScore = useLiveQuery(
    () => db.scores.get(weekId),
    [weekId]
  );

  // Obtener datos para calcular score
  const weekMeals = useLiveQuery(async () => {
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');
    return db.meals
      .where('date')
      .between(startStr, endStr, true, true)
      .toArray();
  }, [weekId]);

  const mealPrep = useLiveQuery(
    () => db.mealPreps.get(weekId),
    [weekId]
  );

  const weights = useLiveQuery(async () => {
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');
    return db.weights
      .where('date')
      .between(startStr, endStr, true, true)
      .toArray();
  }, [weekId]);

  const prevWeekWeights = useLiveQuery(async () => {
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(weekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
    return db.weights
      .where('date')
      .between(format(prevWeekStart, 'yyyy-MM-dd'), format(prevWeekEnd, 'yyyy-MM-dd'), true, true)
      .toArray();
  }, [weekId]);

  // Calcular scores
  const calculateScores = () => {
    // Meals score (max 50)
    const completedMeals = weekMeals?.filter(m => m.status === 'completed').length ?? 0;
    const totalPossibleMeals = 56; // 8 meals x 7 days
    const mealsScore = Math.round((completedMeals / totalPossibleMeals) * SCORING.meals.max);

    // Meal prep score (max 20)
    let mealPrepScore = 0;
    if (mealPrep) {
      const completedItems = mealPrep.items.filter(i => i.completed).length;
      const totalItems = mealPrep.items.length;
      if (completedItems === totalItems) {
        mealPrepScore = SCORING.mealPrep.complete;
      } else if (completedItems > 0) {
        mealPrepScore = SCORING.mealPrep.partial;
      }
    }

    // Tracking score (max 15) - based on how many days have tracking
    const daysWithTracking = new Set(weekMeals?.map(m => m.date) ?? []).size;
    const trackingScore = Math.round((daysWithTracking / 7) * SCORING.tracking.max);

    // Weight score (max 15) - based on weekly change
    let weightScore = 0;
    const currentWeekWeight = weights?.[weights.length - 1]?.weight;
    const prevWeekWeight = prevWeekWeights?.[prevWeekWeights.length - 1]?.weight;

    if (currentWeekWeight && prevWeekWeight) {
      const change = currentWeekWeight - prevWeekWeight;
      if (change >= 0.7 && change <= 1.5) {
        weightScore = SCORING.weight.excellent;
      } else if (change >= 0.3 && change < 0.7) {
        weightScore = SCORING.weight.good;
      } else if (change > 0 && change < 0.3) {
        weightScore = SCORING.weight.acceptable;
      }
    }

    const total = mealsScore + mealPrepScore + trackingScore + weightScore;

    return {
      mealsScore,
      mealPrepScore,
      trackingScore,
      weightScore,
      total,
      completedMeals,
      totalPossibleMeals,
    };
  };

  const scores = calculateScores();

  // Guardar score
  const saveScore = async () => {
    const scoreData: WeeklyScore = {
      id: weekId,
      weekStart: getWeekStartString(date),
      mealsScore: scores.mealsScore,
      mealPrepScore: scores.mealPrepScore,
      trackingScore: scores.trackingScore,
      weightScore: scores.weightScore,
      total: scores.total,
    };
    await db.scores.put(scoreData);
  };

  // Obtener todos los scores historicos
  const allScores = useLiveQuery(
    () => db.scores.orderBy('weekStart').toArray(),
    []
  );

  // Interpretacion del score
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Sobresaliente', color: 'text-green-500' };
    if (score >= 85) return { grade: 'A', label: 'Excelente', color: 'text-green-500' };
    if (score >= 80) return { grade: 'B+', label: 'Muy Bueno', color: 'text-blue-500' };
    if (score >= 75) return { grade: 'B', label: 'Bueno', color: 'text-blue-500' };
    if (score >= 70) return { grade: 'C', label: 'Suficiente', color: 'text-yellow-500' };
    return { grade: 'D', label: 'Insuficiente', color: 'text-red-500' };
  };

  return {
    scores,
    savedScore,
    allScores,
    saveScore,
    getGrade,
    weekId,
  };
}
