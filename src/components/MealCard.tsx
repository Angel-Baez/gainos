"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";
import { MealInfo, MealStatus } from "@/types";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  MessageSquare,
  MinusCircle,
  PieChart,
  X,
} from "lucide-react";
import { useState } from "react";

interface MealCardProps {
  meal: MealInfo & { status: MealStatus; completedAt?: Date; notes?: string };
  onToggle: () => void;
  onStatusChange?: (status: MealStatus) => void;
  onNotesChange?: (notes: string) => void;
}

const STATUS_CONFIG: Record<
  MealStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: "Pendiente",
    icon: <Clock className="h-4 w-4" />,
    color: "text-muted-foreground",
  },
  completed: {
    label: "Completada",
    icon: <Check className="h-4 w-4" />,
    color: "text-primary",
  },
  skipped: {
    label: "Saltada",
    icon: <X className="h-4 w-4" />,
    color: "text-destructive",
  },
  partial: {
    label: "Parcial",
    icon: <PieChart className="h-4 w-4" />,
    color: "text-yellow-500",
  },
};

export function MealCard({
  meal,
  onToggle,
  onStatusChange,
  onNotesChange,
}: MealCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState(meal.notes || "");
  const { mediumTap, success } = useHaptics();
  const isCompleted = meal.status === "completed";
  const isSkipped = meal.status === "skipped";
  const isPartial = meal.status === "partial";
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

  const handleStatusChange = (status: MealStatus) => {
    if (status === "completed" && meal.status !== "completed") {
      setIsAnimating(true);
      success();
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      mediumTap();
    }
    onStatusChange?.(status);
    setIsExpanded(false);
  };

  const handleSaveNotes = () => {
    onNotesChange?.(notesText);
    setShowNotes(false);
    mediumTap();
  };

  const getCardStyle = () => {
    if (isCompleted) return "!bg-primary/20 border-primary/50";
    if (isSkipped) return "!bg-destructive/20 border-destructive/50";
    if (isPartial) return "!bg-yellow-500/20 border-yellow-500/50";
    if (isPast) return "!bg-destructive/10 border-destructive/40";
    return "hover:border-primary/40 hover:shadow-lg hover:scale-[1.01]";
  };

  const getCheckboxStyle = () => {
    if (isCompleted) return "bg-primary border-primary";
    if (isSkipped) return "bg-destructive border-destructive";
    if (isPartial) return "bg-yellow-500 border-yellow-500";
    return "border-muted-foreground/30";
  };

  const getCheckIcon = () => {
    if (isCompleted)
      return <Check className="h-4 w-4 text-primary-foreground" />;
    if (isSkipped) return <X className="h-4 w-4 text-destructive-foreground" />;
    if (isPartial) return <MinusCircle className="h-4 w-4 text-yellow-900" />;
    return null;
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 border hover:cursor-pointer hover:glass-elevated-hover",
        getCardStyle(),
        isAnimating && "animate-scale-up"
      )}
    >
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className={cn("pt-1", isAnimating && "animate-check-bounce")}>
          <div
            className={cn(
              "relative h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
              getCheckboxStyle()
            )}
          >
            {getCheckIcon()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-base transition-all",
                (isCompleted || isSkipped) &&
                  "line-through text-muted-foreground"
              )}
            >
              {meal.name}
            </h3>
            <div className="flex items-center gap-1">
              {meal.notes && (
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  isCompleted
                    ? "bg-primary/20 text-primary"
                    : isSkipped
                    ? "bg-destructive/20 text-destructive"
                    : isPartial
                    ? "bg-yellow-500/20 text-yellow-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                #{meal.number}
              </span>
            </div>
          </div>

          <p
            className={cn(
              "text-sm text-muted-foreground mt-1 line-clamp-1",
              (isCompleted || isSkipped) && "line-through"
            )}
          >
            {meal.description}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isPast && !isCompleted && !isSkipped
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

      {/* Expand/Collapse Button */}
      <div className="flex justify-center mt-2 border-t border-border/50 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground hover:text-foreground"
          data-testid={`meal-${meal.number}-options`}
          aria-expanded={isExpanded}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
            mediumTap();
          }}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Menos opciones
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Más opciones
            </>
          )}
        </Button>
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3 animate-slide-up">
          {/* Status Options */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Cambiar estado:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CONFIG) as MealStatus[]).map((status) => {
                const config = STATUS_CONFIG[status];
                const isActive = meal.status === status;
                return (
                  <Button
                    key={status}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    data-testid={`meal-${meal.number}-status-${status}`}
                    aria-pressed={isActive}
                    className={cn(
                      "h-8 text-xs justify-start",
                      isActive && status === "completed" && "bg-primary",
                      isActive && status === "skipped" && "bg-destructive",
                      isActive && status === "partial" && "bg-yellow-500",
                      !isActive && config.color
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                  >
                    {config.icon}
                    <span className="ml-1">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {showNotes
                ? "Ocultar notas"
                : meal.notes
                ? "Editar notas"
                : "Agregar notas"}
            </Button>

            {showNotes && (
              <div className="mt-2 space-y-2">
                <textarea
                  className="w-full p-2 text-sm bg-background border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={2}
                  placeholder="Escribe notas sobre esta comida..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveNotes();
                    }}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotesText(meal.notes || "");
                      setShowNotes(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Show existing notes */}
            {meal.notes && !showNotes && (
              <p className="mt-1 text-xs text-muted-foreground italic px-2">
                &quot;{meal.notes}&quot;
              </p>
            )}
          </div>
        </div>
      )}
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
