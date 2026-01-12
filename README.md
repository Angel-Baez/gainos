# GainOS

PWA para tracking de plan de aumento de peso saludable.

## Funcionalidades

- **Dashboard** - Resumen diario con progreso de comidas y peso
- **Tracking de Comidas** - 8 comidas diarias con horarios y calorias
- **Registro de Peso** - Pesaje semanal con grafico de progreso
- **Meal Prep** - Checklist de preparacion de comidas (domingos)
- **Mochila** - Checklist diario de items para llevar al trabajo

## Stack

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Base de datos:** IndexedDB (Dexie.js)
- **Graficos:** Recharts

## Instalacion

```bash
# Clonar repositorio
git clone https://github.com/Angel-Baez/gainos.git
cd gainos

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── meals/            # Tracking de comidas
│   ├── weight/           # Registro de peso
│   ├── mealprep/         # Checklist meal prep
│   └── backpack/         # Checklist mochila
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   ├── MealCard.tsx
│   ├── WeightChart.tsx
│   ├── ProgressRing.tsx
│   └── Navigation.tsx
├── hooks/
│   ├── useMeals.ts
│   ├── useWeight.ts
│   ├── useMealPrep.ts
│   └── useBackpack.ts
├── lib/
│   ├── db.ts             # Configuracion IndexedDB
│   ├── constants.ts      # Datos de comidas y configuracion
│   └── utils.ts
└── types/
    └── index.ts
```

## PWA

La app es instalable como PWA:
- Funciona offline (datos guardados localmente)
- Se puede agregar a la pantalla de inicio

## Plan de Alimentacion

El tracking esta basado en un plan de 8 comidas diarias (~4,050 calorias):

| # | Comida | Hora | Calorias |
|---|--------|------|----------|
| 1 | Batida Matutina | 6:30am | 500 |
| 2 | Desayuno Solido | 9:30am | 600 |
| 3 | Snack Media Manana | 11:30am | 300 |
| 4 | Almuerzo Principal | 1:00pm | 900 |
| 5 | Merienda Tarde | 4:00pm | 400 |
| 6 | Pre-Cena | 7:00pm | 350 |
| 7 | Cena Principal | 9:30pm | 700 |
| 8 | Batida Nocturna | 10:30pm | 300 |

## Deploy

```bash
# Build de produccion
pnpm build

# Iniciar en produccion
pnpm start
```

Compatible con Vercel, Netlify, o cualquier hosting que soporte Next.js.

## Licencia

MIT
