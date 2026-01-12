'use client';

import { MealInfo, MealStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Clock, Flame } from 'lucide-react';

interface MealCardProps {
  meal: MealInfo & { status: MealStatus; completedAt?: Date };
  onToggle: () => void;
}

export function MealCard({ meal, onToggle }: MealCardProps) {
  const isCompleted = meal.status === 'completed';
  const isPast = isTimePast(meal.time);

  return (
    <Card
      className={cn(
        'p-4 transition-all cursor-pointer border',
        isCompleted
          ? 'bg-primary/10 border-primary/30'
          : isPast
          ? 'bg-destructive/5 border-destructive/20'
          : 'bg-card border-border hover:border-primary/50'
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="h-6 w-6"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                'font-semibold text-base',
                isCompleted && 'line-through text-muted-foreground'
              )}
            >
              {meal.name}
            </h3>
            <span className="text-xs font-medium text-primary">
              #{meal.number}
            </span>
          </div>

          <p
            className={cn(
              'text-sm text-muted-foreground mt-1 line-clamp-1',
              isCompleted && 'line-through'
            )}
          >
            {meal.description}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{meal.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5" />
              <span>{meal.calories} cal</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper para determinar si la hora ya paso
function isTimePast(timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const mealTime = new Date();
  mealTime.setHours(hours, minutes, 0, 0);

  return now > mealTime;
}
