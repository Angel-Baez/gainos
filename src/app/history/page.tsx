"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DAILY_CALORIES_TARGET, MEALS } from "@/lib/constants";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { DailyMeal, MealStatus } from "@/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronLeft, ChevronRight, Clock, Flame } from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obtener todas las comidas del mes
  const monthMeals = useLiveQuery(async () => {
    const startStr = format(monthStart, "yyyy-MM-dd");
    const endStr = format(monthEnd, "yyyy-MM-dd");
    return db.meals
      .where("date")
      .between(startStr, endStr, true, true)
      .toArray();
  }, [format(monthStart, "yyyy-MM")]);

  // Comidas del día seleccionado
  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const selectedDayMeals = useLiveQuery(
    async () => {
      if (!selectedDateStr) return [];
      return db.meals.where("date").equals(selectedDateStr).toArray();
    },
    [selectedDateStr],
    []
  );

  // Calcular estadísticas del día
  const getMealStats = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayMeals = monthMeals?.filter((m) => m.date === dateStr) ?? [];
    const completed = dayMeals.filter((m) => m.status === "completed").length;
    return { completed, total: 8 };
  };

  // Actualizar estado de comida
  const toggleMeal = async (mealNumber: number) => {
    if (!selectedDateStr) return;

    const id = `${selectedDateStr}-${mealNumber}`;
    const meal = await db.meals.get(id);

    if (meal) {
      const newStatus: MealStatus =
        meal.status === "completed" ? "pending" : "completed";
      await db.meals.update(id, {
        status: newStatus,
        completedAt: newStatus === "completed" ? new Date() : undefined,
      });
    } else {
      // Crear la comida si no existe
      await db.meals.put({
        id,
        date: selectedDateStr,
        mealNumber: mealNumber as DailyMeal["mealNumber"],
        status: "completed",
        completedAt: new Date(),
      });
    }
  };

  // Obtener info de comida del día
  const getMealInfo = (mealNumber: number) => {
    const dayMeal = selectedDayMeals?.find((m) => m.mealNumber === mealNumber);
    return {
      ...MEALS[mealNumber - 1],
      status: dayMeal?.status ?? "pending",
      completedAt: dayMeal?.completedAt,
    };
  };

  // Navegación
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Padding para alinear días de la semana
  const startDayOfWeek = getDay(monthStart);

  const completedCalories =
    selectedDayMeals
      ?.filter((m) => m.status === "completed")
      .reduce((sum, m) => {
        const meal = MEALS.find((meal) => meal.number === m.mealNumber);
        return sum + (meal?.calories ?? 0);
      }, 0) ?? 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Historial</h1>
        <p className="text-muted-foreground">Revisa y edita días anteriores</p>
      </div>

      {/* Calendario */}
      <Card className="p-4 mb-6">
        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {/* Espacios vacíos */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {monthDays.map((day) => {
            const stats = getMealStats(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isFuture = day > new Date();
            const hasData = stats.completed > 0;

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                disabled={isFuture}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-primary/20 text-primary"
                    : isFuture
                    ? "text-muted-foreground/30"
                    : "hover:bg-muted"
                )}
              >
                <span className="text-sm font-medium">{format(day, "d")}</span>
                {hasData && !isSelected && (
                  <div className="absolute bottom-1">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        stats.completed === 8
                          ? "bg-green-500"
                          : stats.completed >= 4
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      )}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">8/8</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">4-7</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">1-3</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="w-full mt-4"
        >
          Ir a hoy
        </Button>
      </Card>

      {/* Detalle del día seleccionado */}
      {selectedDate && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
            <span className="text-sm text-muted-foreground">
              {getMealStats(selectedDate).completed}/8 comidas
            </span>
          </div>

          {/* Resumen de calorías */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>
              {completedCalories.toLocaleString()} /{" "}
              {DAILY_CALORIES_TARGET.toLocaleString()} cal
            </span>
          </div>

          {/* Lista de comidas */}
          <div className="space-y-2">
            {MEALS.map((meal) => {
              const mealInfo = getMealInfo(meal.number);
              const isCompleted = mealInfo.status === "completed";

              return (
                <div
                  key={meal.number}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleMeal(meal.number)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleMeal(meal.number);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer",
                    isCompleted
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={isCompleted}
                    className="h-5 w-5 pointer-events-none"
                  />
                  <div className="flex-1 text-left">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCompleted && "line-through text-muted-foreground"
                      )}
                    >
                      {meal.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meal.time}
                      </span>
                      <span>{meal.calories} cal</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    #{meal.number}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
