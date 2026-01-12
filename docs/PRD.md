# Product Requirements Document (PRD)

# GainOS - PWA de Tracking para Aumento de Peso Saludable

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto

**GainOS** es una Progressive Web App (PWA) diseñada para ayudar a personas con bajo peso a seguir un plan estructurado de aumento de peso saludable. La aplicación proporciona un sistema de tracking completo para comidas, peso corporal, preparación de alimentos y un sistema de accountability que previene el auto-engaño.

### 1.2 Problema que Resuelve

- **Dificultad para mantener consistencia** en planes de alimentación de alto volumen calórico
- **Falta de visibilidad** sobre el progreso real día a día
- **Auto-engaño** sobre el cumplimiento del plan nutricional
- **Desorganización** en la preparación de comidas semanales
- **Olvido de llevar comidas** al trabajo/actividades fuera de casa

### 1.3 Propuesta de Valor

Un sistema de tracking integral que hace **imposible mentirse a uno mismo** sobre el progreso, con una interfaz móvil intuitiva que funciona offline y gamifica el proceso de ganar peso.

---

## 2. Objetivos del Producto

### 2.1 Objetivos de Negocio

| Objetivo             | Métrica                     | Meta                                          |
| -------------------- | --------------------------- | --------------------------------------------- |
| Adopción del usuario | Uso diario activo           | 100% de días con al menos 1 comida registrada |
| Retención            | Semanas consecutivas de uso | ≥12 semanas                                   |
| Efectividad          | Progreso hacia meta de peso | Ganar 0.5-1 lb por semana                     |

### 2.2 Objetivos del Usuario

- Completar 56 comidas semanales (8 comidas × 7 días)
- Consumir ~4,050 calorías diarias
- Ganar peso de manera saludable (de 104 lb a 135+ lb)
- Mantener accountability a través de tracking visual
- Simplificar la preparación semanal de comidas

---

## 3. Perfil del Usuario

### 3.1 Persona Principal

| Atributo          | Descripción                                                          |
| ----------------- | -------------------------------------------------------------------- |
| **Nombre**        | Usuario con bajo peso                                                |
| **Edad**          | 20-35 años                                                           |
| **Perfil físico** | Altura ~1.62m, Peso actual ~104 lb (47 kg)                           |
| **Meta**          | Alcanzar 135+ lb (61 kg) de forma saludable                          |
| **Contexto**      | Trabaja tiempo completo, necesita comer fuera de casa                |
| **Pain Points**   | Olvida comer, se siente lleno rápidamente, pierde track del progreso |

### 3.2 Necesidades del Usuario

1. **Recordatorios estructurados** para cada una de las 8 comidas diarias
2. **Visualización clara** del progreso diario y semanal
3. **Checklist de preparación** para organizar comidas los domingos
4. **Lista de lo que debe llevar** en su mochila cada día
5. **Historial de peso** con gráficos de progreso
6. **Sistema de puntuación** que motive la consistencia

---

## 4. Alcance del Producto

### 4.1 Funcionalidades Core (MVP)

#### 4.1.1 Dashboard Principal

- **Anillo de progreso** mostrando comidas completadas del día (X/8)
- **Barra de calorías** consumidas vs. objetivo (4,050 cal)
- **Resumen de peso** actual vs. meta con % de progreso
- **Score semanal** con desglose de puntuación
- **Accesos rápidos** a todas las secciones

#### 4.1.2 Tracking de Comidas (`/meals`)

- Lista de las 8 comidas diarias con:
  - Nombre de la comida
  - Hora programada
  - Calorías objetivo
  - Descripción/contenido esperado
- Estados por comida: `pending`, `completed`, `skipped`, `partial`
- Capacidad de agregar notas por comida
- Visualización del día actual y días anteriores

#### 4.1.3 Registro de Peso (`/weight`)

- **Pesaje semanal** (domingos recomendado)
- **Gráfico de progreso** con Recharts
- **Captura de foto** opcional (evidencia de báscula)
- **Métricas calculadas:**
  - Peso ganado total
  - Peso restante para meta
  - Promedio de ganancia semanal
  - Proyección de fecha de meta

#### 4.1.4 Meal Prep (`/mealprep`)

- Checklist semanal de preparación (9 items predefinidos):
  - 15-20 huevos duros cocidos
  - 5 kg arroz cocido en porciones
  - 2+ kg proteína guisada
  - 3 kg habichuelas cocidas
  - 10 sandwiches armados
  - 5 bolsitas de maní (30g c/u)
  - Ingredientes de batidas en bolsas
  - Vegetales lavados y cortados
  - Mochila preparada para lunes
- Indicador de completado por semana
- Historial de semanas anteriores

#### 4.1.5 Mochila Diaria (`/backpack`)

- Checklist diario de items a llevar al trabajo:
  - 2 sandwiches (comidas 2 y 3)
  - 2 frutas
  - 2 bolsitas maní
  - 2 yogurts
  - 1 botella de agua (1L)
  - 1 pote mantequilla de maní
- Reset automático cada día
- Indicador de completitud

#### 4.1.6 Sistema de Puntuación Semanal

Puntuación máxima: **100 puntos/semana**

| Categoría | Puntos Máx. | Criterio                                   |
| --------- | ----------- | ------------------------------------------ |
| Comidas   | 50          | ~0.89 pts por comida completada (56 total) |
| Meal Prep | 20          | Completo: 20 pts, Parcial: 10 pts          |
| Tracking  | 15          | Consistencia de registro diario            |
| Peso      | 15          | Según ganancia: 0.7-1.5 lb = 15 pts        |

#### 4.1.7 Reportes (`/reports`)

- **Reporte semanal:**
  - Comidas completadas vs. total
  - Desglose por número de comida
  - Cambio de peso en la semana
  - Score total
- **Reporte mensual:**
  - Resumen de semanas
  - Promedio de scores
  - Cambio de peso acumulado

#### 4.1.8 Historial (`/history`)

- Vista de calendario con días pasados
- Acceso a registros históricos
- Visualización de tendencias

#### 4.1.9 Configuración (`/settings`)

- Peso inicial y meta
- Fecha de inicio del plan
- Tema (light/dark/system)
- Onboarding completado

### 4.2 Funcionalidades PWA

- **Instalable** en dispositivos móviles (Add to Home Screen)
- **Funciona offline** con datos almacenados localmente
- **Service Worker** para caching de assets
- **Manifest** con iconos y configuración de app

### 4.3 Fuera del Alcance (v1.0)

- Sincronización en la nube
- Múltiples usuarios/perfiles
- Integración con wearables
- Notificaciones push (alarmas se manejan externamente)
- Recetas detalladas con pasos
- Lista de compras automática
- Social features / compartir progreso

---

## 5. Especificaciones Técnicas

### 5.1 Stack Tecnológico

| Categoría     | Tecnología             | Versión |
| ------------- | ---------------------- | ------- |
| Framework     | Next.js (App Router)   | 16.x    |
| Lenguaje      | TypeScript             | 5.x     |
| UI Library    | React                  | 19.x    |
| Estilos       | Tailwind CSS           | 4.x     |
| Componentes   | shadcn/ui + Radix UI   | Latest  |
| Base de Datos | IndexedDB via Dexie.js | 4.x     |
| Gráficos      | Recharts               | 3.x     |
| Iconos        | Lucide React           | Latest  |
| Fechas        | date-fns               | 4.x     |

### 5.2 Arquitectura de Datos

#### Esquema de Base de Datos (IndexedDB)

```
GainOSDatabase
├── meals        → DailyMeal[]      (id: YYYY-MM-DD-mealNumber)
├── weights      → WeightRecord[]   (id: YYYY-MM-DD)
├── mealPreps    → MealPrepRecord[] (id: YYYY-WW)
├── backpacks    → BackpackCheck[]  (id: YYYY-MM-DD)
├── scores       → WeeklyScore[]    (id: YYYY-WW)
└── settings     → UserSettings[]   (id: 'default')
```

#### Modelos de Datos Principales

**DailyMeal**

```typescript
{
  id: string;           // YYYY-MM-DD-mealNumber
  date: string;         // YYYY-MM-DD
  mealNumber: 1-8;
  status: 'pending' | 'completed' | 'skipped' | 'partial';
  completedAt?: Date;
  notes?: string;
}
```

**WeightRecord**

```typescript
{
  id: string;           // YYYY-MM-DD
  date: string;
  weight: number;       // en libras
  photoUri?: string;    // base64
  notes?: string;
}
```

**WeeklyScore**

```typescript
{
  id: string; // YYYY-WW
  weekStart: string;
  mealsScore: number; // max 50
  mealPrepScore: number; // max 20
  trackingScore: number; // max 15
  weightScore: number; // max 15
  total: number; // max 100
}
```

### 5.3 Estructura de Archivos

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── meals/page.tsx     # Tracking comidas
│   ├── weight/page.tsx    # Registro peso
│   ├── mealprep/page.tsx  # Checklist prep
│   ├── backpack/page.tsx  # Checklist mochila
│   ├── reports/page.tsx   # Reportes
│   ├── history/page.tsx   # Historial
│   └── settings/page.tsx  # Configuración
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── MealCard.tsx
│   ├── WeightChart.tsx
│   ├── ProgressRing.tsx
│   ├── WeeklyScoreCard.tsx
│   └── Navigation.tsx
├── hooks/                 # Custom React hooks
│   ├── useMeals.ts
│   ├── useWeight.ts
│   ├── useMealPrep.ts
│   ├── useBackpack.ts
│   ├── useScore.ts
│   └── useSettings.ts
├── lib/
│   ├── db.ts             # Configuración Dexie/IndexedDB
│   ├── constants.ts      # Datos estáticos
│   └── utils.ts
└── types/
    └── index.ts          # TypeScript interfaces
```

---

## 6. Plan de Comidas Base

### 6.1 Estructura de 8 Comidas Diarias (~4,050 calorías)

| #   | Comida             | Hora  | Calorías | Descripción                                        |
| --- | ------------------ | ----- | -------- | -------------------------------------------------- |
| 1   | Batida Matutina    | 06:30 | 500      | Leche, avena, mantequilla de maní, guineo, miel    |
| 2   | Desayuno Sólido    | 09:30 | 600      | 3 huevos, pan con mantequilla de maní, fruta, maní |
| 3   | Snack Media Mañana | 11:30 | 300      | Sandwich jamón y queso, yogurt                     |
| 4   | Almuerzo Principal | 13:00 | 900      | Arroz, proteína, habichuelas, plátano, aguacate    |
| 5   | Merienda Tarde     | 16:00 | 400      | Pan con queso/jamón, leche, fruta                  |
| 6   | Pre-Cena           | 19:00 | 350      | Batida rápida o huevos con pan                     |
| 7   | Cena Principal     | 21:30 | 700      | Mangú completo o sobras del almuerzo               |
| 8   | Batida Nocturna    | 22:30 | 300      | Leche, avena, miel - antes de dormir               |

---

## 7. User Experience (UX)

### 7.1 Principios de Diseño

1. **Mobile-first**: Diseñado principalmente para uso en smartphone
2. **Accesibilidad rápida**: Máximo 2 taps para cualquier acción principal
3. **Feedback visual inmediato**: Animaciones y colores que refuerzan el progreso
4. **Motivación constante**: Scores, streaks y visualización de logros

### 7.2 Navegación

- **Bottom Navigation Bar** fija con 5 secciones principales:
  - 🏠 Dashboard
  - 🍽️ Comidas
  - ⚖️ Peso
  - 📋 Prep
  - 🎒 Mochila
- **Header contextual** por página
- **Drawer/Modal** para configuración y reportes

### 7.3 Flujo Principal del Usuario

```
1. Usuario abre la app (Dashboard)
   ↓
2. Ve su progreso del día (X/8 comidas)
   ↓
3. Tap en "Comidas" para marcar una completada
   ↓
4. Regresa al Dashboard, ve actualización instantánea
   ↓
5. Al final del día: revisa score
   ↓
6. Domingos: Pesaje + Meal Prep + Revisar reporte semanal
```

### 7.4 Estados de UI

- **Empty State**: Primer uso / sin datos
- **Loading State**: Cargando datos de IndexedDB
- **Active State**: Datos disponibles, interacción normal
- **Success State**: Acción completada (check animado)
- **Warning State**: Comida saltada o parcial

---

## 8. Métricas de Éxito

### 8.1 KPIs del Producto

| Métrica         | Definición                           | Meta                 |
| --------------- | ------------------------------------ | -------------------- |
| DAU/MAU         | Usuarios activos diarios/mensuales   | >90%                 |
| Completion Rate | Comidas completadas vs. totales      | >80% (45/56 semanal) |
| Weight Progress | Usuarios alcanzando ganancia semanal | 0.5-1 lb/semana      |
| Retention       | Semanas consecutivas de uso          | >12 semanas          |
| Score Average   | Promedio de puntuación semanal       | >75/100              |

### 8.2 Eventos a Trackear (Analytics futuro)

- `meal_completed` - Comida marcada como completada
- `meal_skipped` - Comida marcada como saltada
- `weight_recorded` - Peso registrado
- `mealprep_completed` - Meal prep semanal terminado
- `backpack_checked` - Mochila verificada
- `score_saved` - Score semanal guardado

---

## 9. Consideraciones de Seguridad y Privacidad

### 9.1 Datos del Usuario

- **Almacenamiento local**: Todos los datos se guardan únicamente en IndexedDB del navegador
- **Sin backend**: No hay transmisión de datos a servidores externos
- **Fotos**: Las fotos de peso se almacenan como base64 en IndexedDB local
- **Exportación**: Futuro feature para exportar datos propios

### 9.2 Riesgos Mitigados

- **Pérdida de datos**: Advertir sobre limpieza de cache del navegador
- **Privacidad**: Datos sensibles (peso, fotos) nunca salen del dispositivo

---

## 10. Roadmap

### 10.1 Fase 1: MVP (Actual - v0.1.0)

- [x] Dashboard con progreso diario
- [x] Tracking de 8 comidas diarias
- [x] Registro de peso con gráfico
- [x] Checklist de Meal Prep
- [x] Checklist de Mochila
- [x] Sistema de puntuación semanal
- [x] PWA instalable y offline
- [x] Onboarding inicial
- [x] Tema oscuro/claro

### 10.2 Fase 2: Mejoras (v0.2.0)

- [ ] Notificaciones locales/recordatorios
- [ ] Exportar datos (JSON/CSV)
- [ ] Widgets de pantalla de inicio
- [ ] Comparativas mes a mes
- [ ] Logros y badges

### 10.3 Fase 3: Avanzado (v1.0.0)

- [ ] Sincronización en la nube (opcional)
- [ ] Múltiples planes de comida
- [ ] Personalización de comidas
- [ ] Integración con Apple Health/Google Fit
- [ ] Modo tablet/desktop optimizado

---

## 11. Dependencias y Riesgos

### 11.1 Dependencias Técnicas

| Dependencia       | Impacto | Mitigación                                             |
| ----------------- | ------- | ------------------------------------------------------ |
| IndexedDB support | Alto    | Navegadores modernos soportan; fallback a localStorage |
| Service Worker    | Medio   | Degradación graciosa sin offline                       |
| PWA install       | Bajo    | Funciona como web app normal sin instalar              |

### 11.2 Riesgos de Usuario

| Riesgo                   | Probabilidad | Impacto | Mitigación                   |
| ------------------------ | ------------ | ------- | ---------------------------- |
| Abandono por complejidad | Media        | Alto    | UI simple, onboarding guiado |
| Pérdida de datos (cache) | Baja         | Alto    | Educación + futuro backup    |
| Falta de motivación      | Media        | Alto    | Gamificación con scores      |

---

## 12. Glosario

| Término       | Definición                                                              |
| ------------- | ----------------------------------------------------------------------- |
| **Meal Prep** | Preparación anticipada de comidas para la semana (típicamente domingos) |
| **Mochila**   | Kit de comidas que el usuario lleva al trabajo cada día                 |
| **Score**     | Puntuación semanal basada en cumplimiento del plan                      |
| **PWA**       | Progressive Web App - aplicación web instalable con capacidades offline |
| **Tracking**  | Seguimiento y registro de comidas/peso                                  |

---

## 13. Apéndices

### A. Referencias de Documentación

- [01_PLAN_ALIMENTICIO_DIARIO.md](01_PLAN_ALIMENTICIO_DIARIO.md) - Detalle completo del plan de comidas
- [02_REGLAS_NO_NEGOCIABLES.md](02_REGLAS_NO_NEGOCIABLES.md) - Reglas del sistema
- [04_SISTEMA_ACCOUNTABILITY.md](04_SISTEMA_ACCOUNTABILITY.md) - Sistema de seguimiento
- [09_GUIA_MEAL_PREP.md](09_GUIA_MEAL_PREP.md) - Guía de preparación semanal

### B. Cálculos de Scoring

```
Comidas Score:
  completadas × (50 / 56) = pts
  Ejemplo: 50 comidas × 0.89 = 44.5 pts

Meal Prep Score:
  100% completado = 20 pts
  50%+ completado = 10 pts
  <50% = 0 pts

Weight Score:
  Ganancia 0.7-1.5 lb = 15 pts
  Ganancia 0.3-0.7 lb = 10 pts
  Ganancia <0.3 lb = 5 pts
  Sin ganancia/pérdida = 0 pts
```

---

**Documento creado:** Enero 2026  
**Versión:** 1.0  
**Autor:** GainOS Team
