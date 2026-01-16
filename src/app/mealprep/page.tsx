"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMealPrep } from "@/hooks/useMealPrep";
import { useShoppingList } from "@/hooks/useShoppingList";
import { SHOPPING_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ShoppingCategory } from "@/types";
import { format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import {
  Beef,
  Calendar,
  Carrot,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Milk,
  Plus,
  ShoppingCart,
  Trash2,
  Wheat,
} from "lucide-react";
import { useEffect, useState } from "react";

// Iconos por categoría
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  proteinas: <Beef className="h-4 w-4" />,
  carbohidratos: <Wheat className="h-4 w-4" />,
  grasas: <Milk className="h-4 w-4" />,
  condimentos: <Carrot className="h-4 w-4" />,
};

export default function MealPrepPage() {
  const { items: prepItems, stats: prepStats, initializeMealPrep, toggleItem: togglePrepItem, weekId } =
    useMealPrep();
  const {
    stats: shoppingStats,
    initializeShoppingList,
    toggleItem: toggleShoppingItem,
    addItem,
    removeItem,
    getItemsByCategory,
    listId,
  } = useShoppingList();

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ShoppingCategory>("condimentos");
  const [showAddForm, setShowAddForm] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeMealPrep();
    initializeShoppingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId, listId]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Semana inicia lunes
  const prepProgressPercent =
    prepStats.total > 0 ? (prepStats.completed / prepStats.total) * 100 : 0;
  const isMonday = new Date().getDay() === 1;

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    await addItem({
      name: newItemName,
      quantity: parseFloat(newItemQuantity) || 1,
      unit: newItemUnit || "unidades",
      category: newItemCategory,
    });
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnit("");
    setNewItemCategory("condimentos");
    setShowAddForm(false);
  };

  const toggleCategory = (categoryId: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

  const itemsByCategory = getItemsByCategory();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meal Prep</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            Semana del {format(weekStart, "d 'de' MMMM", { locale: es })}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="preparacion" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="preparacion" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Preparación
          </TabsTrigger>
          <TabsTrigger value="compras" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Compras
          </TabsTrigger>
        </TabsList>

        {/* Tab: Preparación */}
        <TabsContent value="preparacion" className="space-y-4">
          {/* Monday Reminder */}
          {isMonday && !prepStats.isFullyCompleted && (
            <Card className="p-4 !bg-primary/20 border-primary/40">
              <div className="flex items-start gap-3">
                <ClipboardList className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    LUNES SAGRADO - Dia de Meal Prep
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Horario: 8:00am compras, 10:30am cocina, 12:30pm tuppers
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Progress Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="text-sm font-semibold">
                {prepStats.completed}/{prepStats.total} items
              </span>
            </div>
            <Progress value={prepProgressPercent} className="h-2" />

            {prepStats.isFullyCompleted && (
              <div className="flex items-center gap-2 mt-3 text-primary">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Meal prep completado</span>
              </div>
            )}
          </Card>

          {/* Checklist por Secciones */}
          <div className="space-y-4">
            {/* Estación 1 - Proteínas */}
            <div>
              <h2 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <Beef className="h-4 w-4" />
                ESTACIÓN 1 - PROTEÍNAS (10:30-11:30)
              </h2>
              <div className="space-y-2">
                {prepItems.slice(0, 3).map((item, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "p-3 cursor-pointer transition-all border",
                      item.completed
                        ? "!bg-primary/20 border-primary/40"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => togglePrepItem(index)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => togglePrepItem(index)}
                        className="h-5 w-5"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Estación 2 - Carbohidratos */}
            <div>
              <h2 className="text-sm font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                <Wheat className="h-4 w-4" />
                ESTACIÓN 2 - CARBOHIDRATOS (11:00-12:00)
              </h2>
              <div className="space-y-2">
                {prepItems.slice(3, 7).map((item, index) => (
                  <Card
                    key={index + 3}
                    className={cn(
                      "p-3 cursor-pointer transition-all border",
                      item.completed
                        ? "!bg-yellow-500/20 border-yellow-500/40"
                        : "hover:border-yellow-500/50"
                    )}
                    onClick={() => togglePrepItem(index + 3)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => togglePrepItem(index + 3)}
                        className="h-5 w-5"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Estación 3 - Extras */}
            <div>
              <h2 className="text-sm font-semibold text-orange-500 mb-2 flex items-center gap-2">
                <Carrot className="h-4 w-4" />
                ESTACIÓN 3 - EXTRAS (12:00-12:30)
              </h2>
              <div className="space-y-2">
                {prepItems.slice(7, 9).map((item, index) => (
                  <Card
                    key={index + 7}
                    className={cn(
                      "p-3 cursor-pointer transition-all border",
                      item.completed
                        ? "!bg-orange-500/20 border-orange-500/40"
                        : "hover:border-orange-500/50"
                    )}
                    onClick={() => togglePrepItem(index + 7)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => togglePrepItem(index + 7)}
                        className="h-5 w-5"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ensamblaje */}
            <div>
              <h2 className="text-sm font-semibold text-blue-500 mb-2 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                ENSAMBLAJE DE TUPPERS (12:30-14:00)
              </h2>
              <div className="space-y-2">
                {prepItems.slice(9).map((item, index) => (
                  <Card
                    key={index + 9}
                    className={cn(
                      "p-3 cursor-pointer transition-all border",
                      item.completed
                        ? "!bg-blue-500/20 border-blue-500/40"
                        : "hover:border-blue-500/50"
                    )}
                    onClick={() => togglePrepItem(index + 9)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => togglePrepItem(index + 9)}
                        className="h-5 w-5"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <Card className="p-4 bg-secondary/50">
            <h3 className="text-sm font-semibold mb-2">Tips del Plan Maestro</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Arroz: solo 3-4 dias en nevera. JUEVES cocina fresco.</li>
              <li>• Huevos: NO pelar hasta usar (duran 7 dias)</li>
              <li>• Pollo/habichuelas: 4 porc nevera, resto congelador</li>
              <li>• La yuca NO se congela bien, solo refrigerar</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Tab: Compras */}
        <TabsContent value="compras" className="space-y-4">
          {/* Progress Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso de compras</span>
              <span className="text-sm font-semibold">
                {shoppingStats.purchased}/{shoppingStats.total} items
              </span>
            </div>
            <Progress value={shoppingStats.percentage} className="h-2" />

            {shoppingStats.isComplete && (
              <div className="flex items-center gap-2 mt-3 text-primary">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Compras completadas</span>
              </div>
            )}
          </Card>

          {/* Add Item Button/Form */}
          {!showAddForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar item
            </Button>
          ) : (
            <Card className="p-4 space-y-3">
              <Input
                placeholder="Nombre del item"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Cantidad"
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="Unidad"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {SHOPPING_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={newItemCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewItemCategory(cat.id)}
                    className="text-xs"
                  >
                    {CATEGORY_ICONS[cat.id]}
                    <span className="ml-1">{cat.label}</span>
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddItem} className="flex-1">
                  Agregar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          )}

          {/* Items by Category */}
          <div className="space-y-3">
            {itemsByCategory.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                <button
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[category.id]}
                    <span className="font-semibold text-sm">{category.label}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.items.filter((i) => i.purchased).length}/
                      {category.items.length})
                    </span>
                  </div>
                  {collapsedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Category Items */}
                {!collapsedCategories.has(category.id) && (
                  <div className="space-y-2 mt-2">
                    {category.items.map((item) => (
                      <Card
                        key={item.originalIndex}
                        className={cn(
                          "p-3 transition-all border",
                          item.purchased
                            ? "!bg-primary/20 border-primary/40"
                            : "hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.purchased}
                            onCheckedChange={() =>
                              toggleShoppingItem(item.originalIndex)
                            }
                            className="h-5 w-5"
                          />
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                              toggleShoppingItem(item.originalIndex)
                            }
                          >
                            <span
                              className={cn(
                                "text-sm",
                                item.purchased &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({item.quantity} {item.unit})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.originalIndex)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {itemsByCategory.length === 0 && (
            <Card className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay items en la lista de compras
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer item
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
