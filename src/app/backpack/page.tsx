'use client';

import { useEffect } from 'react';
import { useBackpack } from '@/hooks/useBackpack';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Backpack, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function BackpackPage() {
  const { items, stats, initializeBackpack, toggleItem, dateString } = useBackpack();

  useEffect(() => {
    initializeBackpack();
  }, [dateString]);

  const progressPercent = stats.total > 0 ? (stats.checked / stats.total) * 100 : 0;
  const now = new Date();
  const isEvening = now.getHours() >= 20; // Despues de 8pm

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mochila</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Evening Reminder */}
      {isEvening && !stats.allChecked && (
        <Card className="p-4 mb-6 bg-primary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Prepara tu mochila para manana</p>
              <p className="text-xs text-muted-foreground mt-1">
                Mejor preparar ahora (8:00pm - 8:15pm)
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
            {stats.checked}/{stats.total} items
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />

        {stats.allChecked && (
          <div className="flex items-center gap-2 mt-3 text-primary">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Mochila lista</span>
          </div>
        )}
      </Card>

      {/* Status Icon */}
      <div className="flex justify-center mb-6">
        <div
          className={cn(
            'p-6 rounded-full',
            stats.allChecked ? 'bg-primary/20' : 'bg-secondary'
          )}
        >
          <Backpack
            className={cn(
              'h-16 w-16',
              stats.allChecked ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          CONTENIDO OBLIGATORIO
        </h2>

        {items.map((item, index) => (
          <Card
            key={index}
            className={cn(
              'p-4 cursor-pointer transition-all border',
              item.checked
                ? 'bg-primary/10 border-primary/30'
                : 'bg-card border-border hover:border-primary/50'
            )}
            onClick={() => toggleItem(index)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleItem(index)}
                className="h-5 w-5"
              />
              <span
                className={cn(
                  'text-sm',
                  item.checked && 'line-through text-muted-foreground'
                )}
              >
                {item.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Warning */}
      <Card className="p-4 mt-6 bg-destructive/10 border-destructive/30">
        <h3 className="text-sm font-semibold mb-2 text-destructive">Si olvidas la mochila:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• NO justifiques saltarte comidas</li>
          <li>• Compra INMEDIATAMENTE lo mas parecido</li>
          <li>• Anota el error para evitarlo manana</li>
        </ul>
      </Card>
    </div>
  );
}
