'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { WeightRecord } from '@/types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeightChartProps {
  weights: WeightRecord[];
  goalWeight: number;
  startWeight: number;
}

export function WeightChart({ weights, goalWeight, startWeight }: WeightChartProps) {
  const data = weights.map((w) => ({
    date: format(parseISO(w.date), 'd MMM', { locale: es }),
    weight: w.weight,
    fullDate: w.date,
  }));

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No hay registros de peso aun
      </div>
    );
  }

  // Calcular limites del eje Y
  const allWeights = [startWeight, goalWeight, ...weights.map((w) => w.weight)];
  const minY = Math.floor(Math.min(...allWeights) - 2);
  const maxY = Math.ceil(Math.max(...allWeights) + 2);

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value} lb`, 'Peso']}
            labelFormatter={(label) => label}
          />
          <ReferenceLine
            y={goalWeight}
            stroke="hsl(var(--primary))"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
          <ReferenceLine
            y={startWeight}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
