'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useMeals } from '@/hooks/useMeals';
import { useWeight } from '@/hooks/useWeight';
import { useMealPrep } from '@/hooks/useMealPrep';
import { useBackpack } from '@/hooks/useBackpack';
import { ProgressRing } from '@/components/ProgressRing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Utensils,
  Scale,
  ClipboardList,
  Backpack,
  TrendingUp,
  Target,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DAILY_CALORIES_TARGET } from '@/lib/constants';

export default function Dashboard() {
  const { meals, stats: mealStats, initializeDayMeals } = useMeals();
  const { currentWeight, goalWeight, startWeight, progressPercent, gained } = useWeight();
  const { stats: prepStats, initializeMealPrep } = useMealPrep();
  const { stats: backpackStats, initializeBackpack } = useBackpack();

  useEffect(() => {
    initializeDayMeals();
    initializeMealPrep();
    initializeBackpack();
  }, []);

  const completedCalories = meals
    .filter((m) => m.status === 'completed')
    .reduce((sum, m) => sum + m.calories, 0);

  const mealProgress = (mealStats.completed / mealStats.total) * 100;
  const isSunday = new Date().getDay() === 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">GainOS</h1>
        <p className="text-muted-foreground capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Main Progress Ring */}
      <Card className="p-6 mb-6 flex flex-col items-center">
        <ProgressRing progress={mealProgress} size={160} strokeWidth={12}>
          <div className="text-center">
            <p className="text-4xl font-bold">{mealStats.completed}/{mealStats.total}</p>
            <p className="text-xs text-muted-foreground">comidas</p>
          </div>
        </ProgressRing>

        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">Calorias</span>
            </div>
            <span className="font-medium">
              {completedCalories.toLocaleString()} / {DAILY_CALORIES_TARGET.toLocaleString()}
            </span>
          </div>
          <Progress value={(completedCalories / DAILY_CALORIES_TARGET) * 100} className="h-2" />
        </div>
      </Card>

      {/* Weight Progress */}
      <Card className="p-4 mb-4">
        <Link href="/weight" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{currentWeight} lb</p>
              <p className="text-xs text-muted-foreground">
                +{gained.toFixed(1)} lb ganadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Meta</p>
              <p className="text-sm font-medium">{goalWeight} lb</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
        <Progress value={progressPercent} className="h-1.5 mt-3" />
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/meals">
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Comidas</span>
            </div>
            <p className="text-2xl font-bold">{mealStats.completed}/{mealStats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(mealProgress)}% completado
            </p>
          </Card>
        </Link>

        <Link href="/mealprep">
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Meal Prep</span>
            </div>
            <p className="text-2xl font-bold">{prepStats.completed}/{prepStats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {prepStats.isFullyCompleted ? 'Completado' : isSunday ? 'Hoy es domingo' : 'Pendiente'}
            </p>
          </Card>
        </Link>

        <Link href="/backpack">
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Backpack className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Mochila</span>
            </div>
            <p className="text-2xl font-bold">{backpackStats.checked}/{backpackStats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {backpackStats.allChecked ? 'Lista' : 'Pendiente'}
            </p>
          </Card>
        </Link>

        <Link href="/weight">
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Progreso</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              hacia meta de {goalWeight} lb
            </p>
          </Card>
        </Link>
      </div>

      {/* Today's Focus */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <h2 className="text-sm font-semibold mb-2">Enfoque de Hoy</h2>
        <ul className="text-xs text-muted-foreground space-y-1">
          {mealStats.completed < 8 && (
            <li>• Completar las {8 - mealStats.completed} comidas restantes</li>
          )}
          {!backpackStats.allChecked && (
            <li>• Preparar mochila para manana</li>
          )}
          {isSunday && !prepStats.isFullyCompleted && (
            <li>• Meal prep del domingo</li>
          )}
          {isSunday && (
            <li>• Pesaje semanal (si no lo has hecho)</li>
          )}
          {mealStats.completed === 8 && backpackStats.allChecked && (
            <li className="text-primary font-medium">• Excelente dia - todo completado</li>
          )}
        </ul>
      </Card>

      {/* Motivational Quote */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground italic">
          "La consistencia vence al talento. Cada comida cuenta."
        </p>
      </div>
    </div>
  );
}
