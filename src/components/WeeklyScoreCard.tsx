'use client';

import { useScore } from '@/hooks/useScore';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Utensils, ClipboardList, BarChart3, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreItemProps {
  icon: React.ReactNode;
  label: string;
  score: number;
  maxScore: number;
}

function ScoreItem({ icon, label, score, maxScore }: ScoreItemProps) {
  const percent = (score / maxScore) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium">{score}/{maxScore}</span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  );
}

export function WeeklyScoreCard() {
  const { scores, getGrade } = useScore();
  const grade = getGrade(scores.total);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          Puntuacion Semanal
        </h3>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', grade.color)}>
            {scores.total}
          </span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className={cn(
          'px-4 py-2 rounded-full text-sm font-semibold',
          grade.color,
          'bg-current/10'
        )}>
          <span className={grade.color}>{grade.grade} - {grade.label}</span>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreItem
          icon={<Utensils className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Comidas"
          score={scores.mealsScore}
          maxScore={50}
        />
        <ScoreItem
          icon={<ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Meal Prep"
          score={scores.mealPrepScore}
          maxScore={20}
        />
        <ScoreItem
          icon={<BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Tracking"
          score={scores.trackingScore}
          maxScore={15}
        />
        <ScoreItem
          icon={<Scale className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Peso"
          score={scores.weightScore}
          maxScore={15}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {scores.completedMeals}/{scores.totalPossibleMeals} comidas esta semana
        </p>
      </div>
    </Card>
  );
}
