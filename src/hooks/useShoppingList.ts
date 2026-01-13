"use client";

import { DEFAULT_SHOPPING_ITEMS, SHOPPING_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db";
import { ShoppingCategory, ShoppingItem, ShoppingList } from "@/types";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

// Obtener ID de la quincena actual (YYYY-MM-Q1 o YYYY-MM-Q2)
const getQuincenaId = (date: Date = new Date()) => {
  const day = date.getDate();
  const quincena = day <= 15 ? "Q1" : "Q2";
  return `${format(date, "yyyy-MM")}-${quincena}`;
};

// Obtener fecha de inicio de la quincena
const getQuincenaStart = (date: Date = new Date()) => {
  const day = date.getDate();
  const startDay = day <= 15 ? 1 : 16;
  const startDate = new Date(date.getFullYear(), date.getMonth(), startDay);
  return format(startDate, "yyyy-MM-dd");
};

export function useShoppingList(date: Date = new Date()) {
  const listId = getQuincenaId(date);

  // Obtener lista reactiva
  const shoppingList = useLiveQuery(
    () => db.shoppingLists.get(listId),
    [listId]
  );

  // Inicializar lista si no existe
  const initializeShoppingList = async () => {
    const existing = await db.shoppingLists.get(listId);
    if (!existing) {
      const newList: ShoppingList = {
        id: listId,
        startDate: getQuincenaStart(date),
        items: DEFAULT_SHOPPING_ITEMS.map((item) => ({ ...item })),
      };
      await db.shoppingLists.add(newList);
    }
  };

  // Marcar/desmarcar item como comprado
  const toggleItem = async (index: number) => {
    if (!shoppingList) return;
    const updatedItems = [...shoppingList.items];
    updatedItems[index] = {
      ...updatedItems[index],
      purchased: !updatedItems[index].purchased,
    };
    const allPurchased = updatedItems.every((item) => item.purchased);
    await db.shoppingLists.update(listId, {
      items: updatedItems,
      completedAt: allPurchased ? new Date() : undefined,
    });
  };

  // Agregar nuevo item
  const addItem = async (item: Omit<ShoppingItem, "purchased">) => {
    if (!shoppingList) return;
    const newItem: ShoppingItem = { ...item, purchased: false };
    const updatedItems = [...shoppingList.items, newItem];
    await db.shoppingLists.update(listId, { items: updatedItems });
  };

  // Eliminar item
  const removeItem = async (index: number) => {
    if (!shoppingList) return;
    const updatedItems = shoppingList.items.filter((_, i) => i !== index);
    await db.shoppingLists.update(listId, { items: updatedItems });
  };

  // Actualizar item
  const updateItem = async (
    index: number,
    updates: Partial<ShoppingItem>
  ) => {
    if (!shoppingList) return;
    const updatedItems = [...shoppingList.items];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    await db.shoppingLists.update(listId, { items: updatedItems });
  };

  // Obtener items agrupados por categoría
  const getItemsByCategory = () => {
    if (!shoppingList) return [];

    return SHOPPING_CATEGORIES.map((category) => ({
      ...category,
      items: shoppingList.items
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter((item) => item.category === category.id),
    })).filter((category) => category.items.length > 0);
  };

  // Estadísticas
  const stats = {
    total: shoppingList?.items.length ?? 0,
    purchased: shoppingList?.items.filter((i) => i.purchased).length ?? 0,
    remaining: shoppingList?.items.filter((i) => !i.purchased).length ?? 0,
    isComplete: shoppingList?.completedAt !== undefined,
    percentage:
      shoppingList && shoppingList.items.length > 0
        ? Math.round(
            (shoppingList.items.filter((i) => i.purchased).length /
              shoppingList.items.length) *
              100
          )
        : 0,
  };

  return {
    shoppingList,
    items: shoppingList?.items ?? [],
    stats,
    initializeShoppingList,
    toggleItem,
    addItem,
    removeItem,
    updateItem,
    getItemsByCategory,
    listId,
  };
}
