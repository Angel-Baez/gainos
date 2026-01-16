# GainOS

PWA para tracking del Plan Maestro de Ganancia de Peso.

## Funcionalidades

- **Dashboard** - Resumen diario con progreso de comidas y peso
- **Tracking de Comidas** - 5 comidas diarias con horarios y calorias
- **Registro de Peso** - Pesaje semanal con grafico de progreso
- **Meal Prep** - Checklist de preparacion (LUNES SAGRADO)
- **Mochila** - Checklist diario de items para llevar al trabajo
- **Lista de Compras** - Semanal con presupuesto RD$3,000

## Stack

- **Framework:** Next.js 16 (App Router)
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

## Plan de Alimentacion (2,600 kcal/dia)

| # | Comida | Hora | Calorias | Descripcion |
|---|--------|------|----------|-------------|
| 1 | Desayuno | 6:00am | 650 | Licuado (leche, avena, guineos, mani) + 2 huevos |
| 2 | Snack AM | 10:00am | 400 | Sandwich: pan + 2 huevos + mantequilla mani |
| 3 | Almuerzo | 1:00pm | 750 | Arroz + habichuelas + pollo + platano frito |
| 4 | Snack PM | 5:00pm | 400 | Batido O pasta con sardinas |
| 5 | Cena | 9:30pm | 400 | Bowl: arroz + pollo + habichuelas O vianda |

**Total: 2,600 kcal en 5 comidas**

## Meal Prep (LUNES SAGRADO)

El lunes es el dia de preparacion:
- **8:00-10:00 AM:** Compras (mercado + supermercado)
- **10:30-12:30 PM:** Batch cooking (proteinas, carbohidratos, extras)
- **12:30-2:00 PM:** Ensamblaje de tuppers

### Items de Preparacion:
- Pollo guisado (5 lb) desmenuzado
- 15 huevos hervidos (sin pelar)
- Habichuelas guisadas (2 lb)
- Arroz cocido (5 tazas secas)
- Avena pre-cocida (4 porciones)
- Batata/yuca hervidas
- 7 platanos fritos
- Pasta cocida (1 lb)
- 6 tuppers almuerzo + 7 tuppers cena + 7 bolsas snacks

## Lista de Compras Semanal (RD$3,000)

### Proteinas (RD$1,060)
- 30 huevos, 5 lb muslos pollo, 4 latas sardinas, 2 lb habichuelas

### Carbohidratos (RD$1,080)
- 10 lb arroz, 2 lb avena, 14 guineos, 7 platanos, 3 lb batata, 2 lb yuca, 2 paq pan, 1 lb pasta

### Grasas y Lacteos (RD$590)
- 1 galon leche, mantequilla mani 500g, aceite, 1/2 lb mani

### Condimentos (RD$270)
- Cebollas, ajo, aji, tomate, sal, oregano, cubitos, canela

## PWA

La app es instalable como PWA:
- Funciona offline (datos guardados localmente)
- Se puede agregar a la pantalla de inicio

## Expectativa de Resultados

Con 80% de consistencia en 12 semanas:
- Semanas 1-4: +1.5-2 kg
- Semanas 5-8: +1-1.5 kg
- Semanas 9-12: +1-1.5 kg
- **Total: +4-5 kg** (de 47kg a ~52kg)

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
