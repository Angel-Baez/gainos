"use client";

import { PhotoCapture } from "@/components/PhotoCapture";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { WeightChart } from "@/components/WeightChart";
import { useWeight } from "@/hooks/useWeight";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Camera, Plus, Scale, Target, TrendingUp, X } from "lucide-react";
import { useState } from "react";

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
  const [showCamera, setShowCamera] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setIsSubmitting(true);
    await addWeight(
      parseFloat(newWeight),
      photoUri ?? undefined,
      notes || undefined
    );
    setNewWeight("");
    setPhotoUri(null);
    setNotes("");
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handlePhotoCapture = (uri: string) => {
    setPhotoUri(uri);
    setShowCamera(false);
  };

  const isSunday = new Date().getDay() === 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onCancel={() => setShowCamera(false)}
        />
      )}

      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setViewingPhoto(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={viewingPhoto}
            alt="Progress photo"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Registro de Peso</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Current Weight Card */}
      <Card className="p-6 mb-6 bg-linear-to-br from-primary/20 to-primary/5 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peso Actual</p>
            <p className="text-4xl font-bold">
              {currentWeight} <span className="text-lg font-normal">lb</span>
            </p>
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
            <span className="text-primary font-medium">
              +{gained.toFixed(1)} lb ganadas
            </span>
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
          <p
            className={`text-xl font-bold ${
              weeklyChange >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {weeklyChange >= 0 ? "+" : ""}
            {weeklyChange.toFixed(1)} lb
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Faltan</span>
          </div>
          <p className="text-xl font-bold">
            {(goalWeight - currentWeight).toFixed(1)} lb
          </p>
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
        <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Registrar Peso {!isSunday && "(fuera de horario)"}
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

            {/* Photo Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Foto de progreso (opcional)
              </label>
              {photoUri ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUri}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setPhotoUri(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 border-dashed"
                  onClick={() => setShowCamera(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Tomar foto
                    </span>
                  </div>
                </Button>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Notas (opcional)
              </label>
              <Input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Pesaje en ayunas"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setPhotoUri(null);
                  setNotes("");
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!newWeight || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
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
              .map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {record.photoUri && (
                      <button
                        onClick={() => setViewingPhoto(record.photoUri!)}
                        className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={record.photoUri}
                          alt="Progress"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(record.date), "d 'de' MMMM", {
                          locale: es,
                        })}
                      </span>
                      {record.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-37.5">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold">{record.weight} lb</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
