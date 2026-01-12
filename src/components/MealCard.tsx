"use client";

import { Card } from "@/components/ui/card";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";
import { MealInfo, MealStatus } from "@/types";
import { Check, Clock, Flame } from "lucide-react";
import { useState } from "react";

interface MealCardProps {
  meal: MealInfo & { status: MealStatus; completedAt?: Date };
  onToggle: () => void;
}

export function MealCard({ meal, onToggle }: MealCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { mediumTap, success } = useHaptics();
  const isCompleted = meal.status === "completed";
  const isPast = isTimePast(meal.time);

  const handleToggle = () => {
    if (!isCompleted) {
      setIsAnimating(true);
      success();
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      mediumTap();
    }
    onToggle();
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 cursor-pointer border",
        isCompleted
          ? "bg-primary/10 border-primary/30"
          : isPast
          ? "bg-destructive/5 border-destructive/20"
          : "bg-card border-border hover:border-primary/50 hover:shadow-md",
        isAnimating && "animate-scale-up"
      )}
      onClick={handleToggle}
    >
      <div className="flex items-start gap-4">
        <div className={cn("pt-1", isAnimating && "animate-check-bounce")}>
          <div
            className={cn(
              "relative h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
              isCompleted
                ? "bg-primary border-primary"
                : "border-muted-foreground/30"
            )}
          >
            {isCompleted && (
              <Check className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-base transition-all",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {meal.name}
            </h3>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isCompleted
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              #{meal.number}
            </span>
          </div>

          <p
            className={cn(
              "text-sm text-muted-foreground mt-1 line-clamp-1",
              isCompleted && "line-through"
            )}
          >
            {meal.description}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isPast && !isCompleted
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
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
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const mealTime = new Date();
  mealTime.setHours(hours, minutes, 0, 0);

  return now > mealTime;
}
