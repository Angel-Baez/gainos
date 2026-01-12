'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { WeightRecord } from '@/types';
import { getDateString } from './useMeals';
import { DEFAULT_USER_SETTINGS } from '@/lib/constants';

export function useWeight() {
  // Obtener todos los registros de peso (ordenados por fecha)
  const weights = useLiveQuery(
    () => db.weights.orderBy('date').toArray(),
    [],
    []
  );

  // Obtener el ultimo peso registrado
  const latestWeight = weights && weights.length > 0
    ? weights[weights.length - 1]
    : null;

  // Registrar nuevo peso
  const addWeight = async (weight: number, photoUri?: string, notes?: string) => {
    const date = getDateString();
    const record: WeightRecord = {
      id: date,
      date,
      weight,
      photoUri,
      notes,
    };

    // Usar put para actualizar si ya existe
    await db.weights.put(record);
  };

  // Obtener peso de una fecha especifica
  const getWeightByDate = async (date: string) => {
    return db.weights.get(date);
  };

  // Calcular progreso
  const startWeight = DEFAULT_USER_SETTINGS.startWeight;
  const goalWeight = DEFAULT_USER_SETTINGS.goalWeight;
  const currentWeight = latestWeight?.weight ?? startWeight;

  const totalToGain = goalWeight - startWeight;
  const gained = currentWeight - startWeight;
  const progressPercent = Math.max(0, Math.min(100, (gained / totalToGain) * 100));

  // Cambio desde la semana pasada
  const getWeeklyChange = () => {
    if (!weights || weights.length < 2) return 0;
    const lastTwo = weights.slice(-2);
    return lastTwo[1].weight - lastTwo[0].weight;
  };

  return {
    weights,
    latestWeight,
    currentWeight,
    startWeight,
    goalWeight,
    gained,
    progressPercent,
    weeklyChange: getWeeklyChange(),
    addWeight,
    getWeightByDate,
  };
}
