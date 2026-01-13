"use client";

export function GlassBackground() {
  return (
    <>
      {/* Capa de fondo sólido - detrás de todo */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)]"
        style={{ zIndex: -2 }}
      />

      {/* Manchas de color animadas - contenedor con overflow visible */}
      <div
        className="fixed inset-[-50%] pointer-events-none animate-float-bg"
        style={{ zIndex: -1 }}
      >
        {/* Mancha primaria (verde en dark) */}
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[500px] rounded-full bg-primary/40 blur-[120px]" />

        {/* Mancha púrpura */}
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-[oklch(0.6_0.2_280)] opacity-40 blur-[120px]" />

        {/* Mancha azul */}
        <div className="absolute bottom-[25%] right-[30%] w-[450px] h-[600px] rounded-full bg-[oklch(0.65_0.18_200)] opacity-35 blur-[120px]" />

        {/* Mancha naranja/amarilla */}
        <div className="absolute bottom-[35%] left-[25%] w-[400px] h-[400px] rounded-full bg-[oklch(0.7_0.15_50)] opacity-35 blur-[100px]" />
      </div>
    </>
  );
}
