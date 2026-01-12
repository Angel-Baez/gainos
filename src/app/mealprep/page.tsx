'use client';

import { useEffect } from 'react';
import { useMealPrep } from '@/hooks/useMealPrep';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Check, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function MealPrepPage() {
  const { items, stats, initializeMealPrep, toggleItem, weekId } = useMealPrep();

  useEffect(() => {
    initializeMealPrep();
  }, [weekId]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const isSunday = new Date().getDay() === 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meal Prep</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            Semana del {format(weekStart, "d 'de' MMMM", { locale: es })}
          </span>
        </div>
      </div>

      {/* Sunday Reminder */}
      {isSunday && !stats.isFullyCompleted && (
        <Card className="p-4 mb-6 bg-primary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <ClipboardList className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Hoy es domingo de Meal Prep</p>
              <p className="text-xs text-muted-foreground mt-1">
                Horario recomendado: 12:00pm - 3:00pm
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Progress Card */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progreso</span>
          <span className="text-sm font-semibold">
            {stats.completed}/{stats.total} items
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />

        {stats.isFullyCompleted && (
          <div className="flex items-center gap-2 mt-3 text-primary">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Meal prep completado</span>
          </div>
        )}
      </Card>

      {/* Checklist */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          CHECKLIST DE PREPARACION
        </h2>

        {items.map((item, index) => (
          <Card
            key={index}
            className={cn(
              'p-4 cursor-pointer transition-all border',
              item.completed
                ? 'bg-primary/10 border-primary/30'
                : 'bg-card border-border hover:border-primary/50'
            )}
            onClick={() => toggleItem(index)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(index)}
                className="h-5 w-5"
              />
              <span
                className={cn(
                  'text-sm',
                  item.completed && 'line-through text-muted-foreground'
                )}
              >
                {item.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="p-4 mt-6 bg-secondary/50">
        <h3 className="text-sm font-semibold mb-2">Tips de Meal Prep</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Cocina arroz/proteina para 2-3 dias</li>
          <li>• Huevos duros duran 1 semana refrigerados</li>
          <li>• Congela porciones individuales</li>
          <li>• Los sandwiches se pueden congelar</li>
        </ul>
      </Card>
    </div>
  );
}
