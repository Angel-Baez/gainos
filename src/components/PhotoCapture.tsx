"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Check, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PhotoCaptureProps {
  onCapture: (photoUri: string) => void;
  onCancel: () => void;
}

export function PhotoCapture({ onCapture, onCancel }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Detener stream anterior si existe
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  }, [facingMode, stream]);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!photo) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setPhoto(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Voltear horizontalmente si es cámara frontal
    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0);

    const dataUri = canvas.toDataURL("image/jpeg", 0.8);
    setPhoto(dataUri);

    // Detener stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const retake = () => {
    setPhoto(null);
  };

  const confirm = () => {
    if (photo) {
      onCapture(photo);
    }
  };

  return (
    <Card className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-6 w-6 text-white" />
        </Button>
        <span className="text-white font-medium">Foto de Progreso</span>
        <Button variant="ghost" size="icon" onClick={switchCamera}>
          <RotateCcw className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-4">
            <p className="text-white text-center">{error}</p>
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              Cerrar
            </Button>
          </div>
        ) : photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${
              facingMode === "user" ? "scale-x-[-1]" : ""
            }`}
          />
        )}

        {/* Guide overlay */}
        {!photo && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-64 border-2 border-white/50 rounded-lg" />
          </div>
        )}
      </div>

      {/* Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="p-6 bg-black/50 flex justify-center gap-6">
        {photo ? (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={retake}
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Repetir
            </Button>
            <Button size="lg" onClick={confirm} className="bg-primary">
              <Check className="h-5 w-5 mr-2" />
              Usar Foto
            </Button>
          </>
        ) : (
          <button
            onClick={capturePhoto}
            disabled={!!error}
            className="w-16 h-16 rounded-full bg-white border-4 border-primary flex items-center justify-center disabled:opacity-50"
          >
            <Camera className="h-7 w-7 text-primary" />
          </button>
        )}
      </div>
    </Card>
  );
}
