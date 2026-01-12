'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { BackpackCheck } from '@/types';
import { DEFAULT_BACKPACK_ITEMS } from '@/lib/constants';
import { getDateString } from './useMeals';

export function useBackpack(date: Date = new Date()) {
  const dateString = getDateString(date);

  // Obtener checklist del dia
  const backpack = useLiveQuery(
    () => db.backpacks.get(dateString),
    [dateString]
  );

  // Inicializar checklist del dia si no existe
  const initializeBackpack = async () => {
    const existing = await db.backpacks.get(dateString);

    if (!existing) {
      const newBackpack: BackpackCheck = {
        id: dateString,
        date: dateString,
        items: DEFAULT_BACKPACK_ITEMS.map((item) => ({ ...item })),
      };

      await db.backpacks.add(newBackpack);
    }
  };

  // Toggle item
  const toggleItem = async (index: number) => {
    if (!backpack) return;

    const updatedItems = [...backpack.items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked,
    };

    await db.backpacks.update(dateString, {
      items: updatedItems,
    });
  };

  // Estadisticas
  const stats = {
    total: backpack?.items.length ?? 0,
    checked: backpack?.items.filter((i) => i.checked).length ?? 0,
    allChecked: backpack?.items.every((i) => i.checked) ?? false,
  };

  return {
    backpack,
    items: backpack?.items ?? [],
    stats,
    initializeBackpack,
    toggleItem,
    dateString,
  };
}
