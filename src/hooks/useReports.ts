"use client";

import { db } from "@/lib/db";
import { ExportData, MonthlyReport, WeeklyReport } from "@/types";
import {
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

const getWeekId = (date: Date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return format(weekStart, "yyyy-'W'ww");
};

export function useReports() {
  // Obtener todas las comidas
  const allMeals = useLiveQuery(() => db.meals.toArray(), [], []);

  // Obtener todos los pesos
  const allWeights = useLiveQuery(
    () => db.weights.orderBy("date").toArray(),
    [],
    []
  );

  // Obtener todos los meal preps
  const allMealPreps = useLiveQuery(() => db.mealPreps.toArray(), [], []);

  // Obtener todos los scores
  const allScores = useLiveQuery(() => db.scores.toArray(), [], []);

  // Obtener settings
  const settings = useLiveQuery(
    () => db.settings.get("user-settings"),
    [],
    null
  );

  // Generar reporte semanal
  const getWeeklyReport = (weekStart: Date): WeeklyReport => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const weekId = getWeekId(weekStart);
    const startStr = format(weekStart, "yyyy-MM-dd");
    const endStr = format(weekEnd, "yyyy-MM-dd");

    // Filtrar comidas de la semana
    const weekMeals =
      allMeals?.filter((m) => m.date >= startStr && m.date <= endStr) ?? [];
    const completedMeals = weekMeals.filter(
      (m) => m.status === "completed"
    ).length;

    // Contar por número de comida
    const mealsByNumber: Record<number, { completed: number; total: number }> =
      {};
    for (let i = 1; i <= 8; i++) {
      const mealsForNumber = weekMeals.filter((m) => m.mealNumber === i);
      mealsByNumber[i] = {
        completed: mealsForNumber.filter((m) => m.status === "completed")
          .length,
        total: 7,
      };
    }

    // Pesos de la semana
    const weekWeights =
      allWeights?.filter((w) => w.date >= startStr && w.date <= endStr) ?? [];
    const weightStart = weekWeights[0]?.weight;
    const weightEnd = weekWeights[weekWeights.length - 1]?.weight;

    // Meal prep
    const mealPrep = allMealPreps?.find((mp) => mp.id === weekId);
    const mealPrepCompleted =
      mealPrep?.items.every((i) => i.completed) ?? false;

    // Días con tracking
    const uniqueDates = new Set(weekMeals.map((m) => m.date));

    // Score
    const score = allScores?.find((s) => s.id === weekId);

    return {
      weekId,
      weekStart: startStr,
      weekEnd: endStr,
      mealsCompleted: completedMeals,
      mealsTotal: 56,
      mealsPercentage: Math.round((completedMeals / 56) * 100),
      mealsByNumber,
      weightStart,
      weightEnd,
      weightChange:
        weightStart && weightEnd ? weightEnd - weightStart : undefined,
      mealPrepCompleted,
      trackingDays: uniqueDates.size,
      score,
    };
  };

  // Generar reporte mensual
  const getMonthlyReport = (month: Date): MonthlyReport => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 0 }
    ).map((weekStart) => getWeeklyReport(weekStart));

    const totalMealsCompleted = weeks.reduce(
      (sum, w) => sum + w.mealsCompleted,
      0
    );
    const totalMealsPossible = weeks.length * 56;

    const scoresWithValues = weeks.filter((w) => w.score);
    const averageScore =
      scoresWithValues.length > 0
        ? Math.round(
            scoresWithValues.reduce(
              (sum, w) => sum + (w.score?.total ?? 0),
              0
            ) / scoresWithValues.length
          )
        : 0;

    // Pesos del mes
    const monthStr = format(month, "yyyy-MM");
    const monthWeights =
      allWeights?.filter((w) => w.date.startsWith(monthStr)) ?? [];

    return {
      month: monthStr,
      weeks,
      totalMealsCompleted,
      totalMealsPossible,
      averageScore,
      weightStart: monthWeights[0]?.weight,
      weightEnd: monthWeights[monthWeights.length - 1]?.weight,
      weightChange:
        monthWeights.length >= 2
          ? monthWeights[monthWeights.length - 1].weight -
            monthWeights[0].weight
          : undefined,
    };
  };

  // Obtener últimas N semanas (solo las que tienen datos o desde fecha de inicio)
  const getRecentWeeks = (count: number = 4): WeeklyReport[] => {
    // Usar fecha de inicio de settings, o fecha por defecto si no hay settings
    // No usar allMeals como fallback porque puede tener datos de prueba antiguos
    const startDate = settings?.startDate
      ? new Date(settings.startDate)
      : new Date(); // Si no hay settings, mostrar solo semana actual

    const startWeek = startOfWeek(startDate, { weekStartsOn: 0 });
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });

    const weeks: WeeklyReport[] = [];
    const weekStart = new Date(currentWeek);

    // Solo retroceder hasta la semana de inicio
    while (weeks.length < count && weekStart.getTime() >= startWeek.getTime()) {
      weeks.unshift(getWeeklyReport(new Date(weekStart)));
      weekStart.setDate(weekStart.getDate() - 7);
    }

    return weeks;
  };

  // Obtener últimos N meses (solo los que tienen datos o desde fecha de inicio)
  const getRecentMonths = (count: number = 3): MonthlyReport[] => {
    // Usar fecha de inicio de settings, o fecha por defecto si no hay settings
    // No usar allMeals como fallback porque puede tener datos de prueba antiguos
    const startDate = settings?.startDate
      ? new Date(settings.startDate)
      : new Date(); // Si no hay settings, mostrar solo mes actual

    const startMonth = startOfMonth(startDate);
    const currentMonth = startOfMonth(new Date());

    const months: MonthlyReport[] = [];
    let month = new Date(currentMonth);

    // Solo retroceder hasta el mes de inicio
    while (months.length < count && month.getTime() >= startMonth.getTime()) {
      months.unshift(getMonthlyReport(new Date(month)));
      month = subMonths(month, 1);
    }

    return months;
  };

  // Exportar datos
  const exportData = async (format: "json" | "csv"): Promise<string> => {
    const data: ExportData = {
      exportedAt: new Date().toISOString(),
      settings: settings ?? {
        id: "user-settings",
        startWeight: 104,
        goalWeight: 135,
        startDate: "2025-01-20",
      },
      meals: allMeals ?? [],
      weights: allWeights ?? [],
      mealPreps: allMealPreps ?? [],
      scores: allScores ?? [],
    };

    if (format === "json") {
      return JSON.stringify(data, null, 2);
    }

    // CSV: crear múltiples secciones
    let csv = "";

    // Sección de pesos
    csv += "WEIGHTS\n";
    csv += "date,weight,notes\n";
    data.weights.forEach((w) => {
      csv += `${w.date},${w.weight},"${w.notes || ""}"\n`;
    });
    csv += "\n";

    // Sección de comidas
    csv += "MEALS\n";
    csv += "date,mealNumber,status\n";
    data.meals.forEach((m) => {
      csv += `${m.date},${m.mealNumber},${m.status}\n`;
    });
    csv += "\n";

    // Sección de scores
    csv += "SCORES\n";
    csv +=
      "weekStart,mealsScore,mealPrepScore,trackingScore,weightScore,total\n";
    data.scores.forEach((s) => {
      csv += `${s.weekStart},${s.mealsScore},${s.mealPrepScore},${s.trackingScore},${s.weightScore},${s.total}\n`;
    });

    return csv;
  };

  // Descargar archivo
  const downloadExport = async (format: "json" | "csv") => {
    const content = await exportData(format);
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `gainos-export-${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    getWeeklyReport,
    getMonthlyReport,
    getRecentWeeks,
    getRecentMonths,
    exportData,
    downloadExport,
    allMeals,
    allWeights,
    allScores,
  };
}
