'use client';

import { useState } from 'react';
import { useWeight } from '@/hooks/useWeight';
import { WeightChart } from '@/components/WeightChart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Scale, TrendingUp, Target, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WeightPage() {
  const {
    weights,
    currentWeight,
    startWeight,
    goalWeight,
    gained,
    progressPercent,
    weeklyChange,
    addWeight,
  } = useWeight();

  const [showForm, setShowForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setIsSubmitting(true);
    await addWeight(parseFloat(newWeight));
    setNewWeight('');
    setShowForm(false);
    setIsSubmitting(false);
  };

  const isSunday = new Date().getDay() === 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Registro de Peso</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Current Weight Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peso Actual</p>
            <p className="text-4xl font-bold">{currentWeight} <span className="text-lg font-normal">lb</span></p>
          </div>
          <Scale className="h-10 w-10 text-primary opacity-80" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso hacia meta</span>
            <span className="font-medium">{goalWeight} lb</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{startWeight} lb (inicio)</span>
            <span className="text-primary font-medium">+{gained.toFixed(1)} lb ganadas</span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Esta semana</span>
          </div>
          <p className={`text-xl font-bold ${weeklyChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)} lb
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Faltan</span>
          </div>
          <p className="text-xl font-bold">{(goalWeight - currentWeight).toFixed(1)} lb</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4 mb-6">
        <h2 className="text-sm font-semibold mb-4">Historial de Peso</h2>
        <WeightChart
          weights={weights || []}
          goalWeight={goalWeight}
          startWeight={startWeight}
        />
      </Card>

      {/* Add Weight Button/Form */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Registrar Peso {!isSunday && '(fuera de horario)'}
        </Button>
      ) : (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nuevo peso (lb)
              </label>
              <Input
                type="number"
                step="0.1"
                min="50"
                max="300"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Ej: 106.5"
                className="text-lg"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!newWeight || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Weight History List */}
      {weights && weights.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3">Registros Recientes</h2>
          <div className="space-y-2">
            {weights
              .slice()
              .reverse()
              .slice(0, 5)
              .map((record, index) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center p-3 bg-card border border-border rounded-lg"
                >
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(record.date), "d 'de' MMMM", { locale: es })}
                  </span>
                  <span className="font-semibold">{record.weight} lb</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
