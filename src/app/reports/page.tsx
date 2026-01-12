"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReports } from "@/hooks/useReports";
import { useScore } from "@/hooks/useScore";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  FileJson,
  FileSpreadsheet,
  Scale,
  TrendingUp,
  Trophy,
  Utensils,
} from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const { getRecentWeeks, getRecentMonths, downloadExport, allWeights } =
    useReports();
  const { getGrade } = useScore();
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const recentWeeks = getRecentWeeks(8);
  const recentMonths = getRecentMonths(3);

  const handleExport = async (format: "json" | "csv") => {
    await downloadExport(format);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">Analiza tu progreso</p>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="weekly" className="flex-1">
            Semanal
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">
            Mensual
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex-1">
            Tendencias
          </TabsTrigger>
        </TabsList>

        {/* Reportes Semanales */}
        <TabsContent value="weekly" className="space-y-4">
          {recentWeeks.map((week) => {
            const isExpanded = expandedWeek === week.weekId;
            const grade = week.score ? getGrade(week.score.total) : null;

            return (
              <Card key={week.weekId} className="overflow-hidden">
                <button
                  className="w-full p-4 text-left"
                  onClick={() =>
                    setExpandedWeek(isExpanded ? null : week.weekId)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {format(parseISO(week.weekStart), "d MMM", {
                          locale: es,
                        })}{" "}
                        -{" "}
                        {format(parseISO(week.weekEnd), "d MMM", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {week.mealsCompleted}/56 comidas ({week.mealsPercentage}
                        %)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {grade && (
                        <span className={cn("text-lg font-bold", grade.color)}>
                          {grade.grade}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={week.mealsPercentage}
                    className="h-1.5 mt-2"
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border space-y-4">
                    {/* Desglose por comida */}
                    <div className="pt-4">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        Desglose por Comida
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(week.mealsByNumber).map(
                          ([num, data]) => (
                            <div
                              key={num}
                              className="text-center p-2 rounded-lg bg-muted/50"
                            >
                              <p className="text-xs text-muted-foreground">
                                #{num}
                              </p>
                              <p className="font-semibold text-sm">
                                {data.completed}/{data.total}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Peso */}
                    {(week.weightStart || week.weightEnd) && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Peso
                        </p>
                        <div className="flex justify-between text-sm">
                          <span>Inicio: {week.weightStart ?? "-"} lb</span>
                          <span>Final: {week.weightEnd ?? "-"} lb</span>
                          {week.weightChange !== undefined && (
                            <span
                              className={
                                week.weightChange >= 0
                                  ? "text-primary"
                                  : "text-destructive"
                              }
                            >
                              {week.weightChange >= 0 ? "+" : ""}
                              {week.weightChange.toFixed(1)} lb
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Score detallado */}
                    {week.score && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Puntuación ({week.score.total}/100)
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Comidas
                            </span>
                            <span>{week.score.mealsScore}/50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Meal Prep
                            </span>
                            <span>{week.score.mealPrepScore}/20</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Tracking
                            </span>
                            <span>{week.score.trackingScore}/15</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Peso</span>
                            <span>{week.score.weightScore}/15</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Otros datos */}
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">
                        Meal Prep: {week.mealPrepCompleted ? "✅" : "❌"}
                      </span>
                      <span className="text-muted-foreground">
                        Días con tracking: {week.trackingDays}/7
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        {/* Reportes Mensuales */}
        <TabsContent value="monthly" className="space-y-4">
          {recentMonths.map((month) => (
            <Card key={month.month} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold capitalize">
                  {format(parseISO(`${month.month}-01`), "MMMM yyyy", {
                    locale: es,
                  })}
                </h3>
                {month.averageScore > 0 && (
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getGrade(month.averageScore).color
                      )}
                    >
                      {month.averageScore}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /100 prom.
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Comidas completadas
                  </span>
                  <span className="font-medium">
                    {month.totalMealsCompleted}/{month.totalMealsPossible}
                  </span>
                </div>
                <Progress
                  value={
                    (month.totalMealsCompleted / month.totalMealsPossible) * 100
                  }
                  className="h-2"
                />

                {month.weightChange !== undefined && (
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">
                      Cambio de peso
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        month.weightChange >= 0
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {month.weightChange >= 0 ? "+" : ""}
                      {month.weightChange.toFixed(1)} lb
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Semanas</span>
                  <span className="font-medium">{month.weeks.length}</span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Tendencias */}
        <TabsContent value="trends" className="space-y-4">
          {/* Gráfico de comidas por semana */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Comidas por Semana
            </h3>
            <div className="space-y-2">
              {recentWeeks.slice(-6).map((week) => (
                <div key={week.weekId} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">
                    {format(parseISO(week.weekStart), "d/M", { locale: es })}
                  </span>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${week.mealsPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">
                    {week.mealsPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tendencia de peso */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Tendencia de Peso
            </h3>
            {allWeights && allWeights.length > 0 ? (
              <div className="space-y-2">
                {allWeights.slice(-10).map((record, index, arr) => {
                  const prevWeight =
                    index > 0 ? arr[index - 1].weight : record.weight;
                  const change = record.weight - prevWeight;

                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {format(parseISO(record.date), "d 'de' MMM", {
                          locale: es,
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{record.weight} lb</span>
                        {index > 0 && (
                          <span
                            className={cn(
                              "text-xs",
                              change >= 0 ? "text-primary" : "text-destructive"
                            )}
                          >
                            {change >= 0 ? "+" : ""}
                            {change.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay registros de peso aún
              </p>
            )}
          </Card>

          {/* Puntuaciones */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Historial de Puntuaciones
            </h3>
            <div className="space-y-2">
              {recentWeeks
                .filter((w) => w.score)
                .slice(-6)
                .map((week) => {
                  const grade = getGrade(week.score!.total);
                  return (
                    <div
                      key={week.weekId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {format(parseISO(week.weekStart), "d 'de' MMM", {
                          locale: es,
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {week.score!.total}/100
                        </span>
                        <span className={cn("font-bold", grade.color)}>
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exportar datos */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          Exportar Datos
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Descarga tus datos para respaldo o análisis externo
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleExport("json")}
          >
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleExport("csv")}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </Card>
    </div>
  );
}
