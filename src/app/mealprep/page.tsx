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
  BookOpen,
  Calendar,
  Carrot,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Milk,
  Moon,
  Plus,
  Refrigerator,
  ShoppingCart,
  Snowflake,
  Sun,
  Trash2,
  Utensils,
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

// Cronograma del Meal Prep
const CRONOGRAMA = [
  { time: "8:00", activity: "Compras en mercado (proteínas, vegetales frescos)", icon: ShoppingCart },
  { time: "9:00", activity: "Compras en supermercado (granos, lácteos, pan)", icon: ShoppingCart },
  { time: "10:00", activity: "Organizar compras, lavar todo, preparar estación", icon: ClipboardList },
  { time: "10:30", activity: "ESTACIÓN 1: Proteínas (pollo, huevos, habichuelas)", icon: Beef },
  { time: "11:30", activity: "ESTACIÓN 2: Carbohidratos (arroz, avena, viandas)", icon: Wheat },
  { time: "12:30", activity: "ESTACIÓN 3: Extras + Ensamblaje de tuppers", icon: Utensils },
  { time: "14:00", activity: "Distribución en nevera/congelador + Limpieza", icon: Refrigerator },
];

// Instrucciones detalladas por estación
const ESTACION_INSTRUCCIONES = {
  proteinas: [
    { que: "Pollo guisado (5 lb)", como: "Desmenuzar después de cocinar. Guardar caldo aparte.", almacenamiento: "4 porc NEVERA, resto CONGELADOR" },
    { que: "15 huevos hervidos", como: "10 min agua hirviendo. NO pelar hasta usar.", almacenamiento: "NEVERA (duran 7 días sin pelar)" },
    { que: "Habichuelas guisadas (2 lb)", como: "Remojar noche anterior. Guisar con sofrito.", almacenamiento: "4 porc NEVERA, resto CONGELADOR" },
  ],
  carbohidratos: [
    { que: "Arroz cocido (5 tazas)", como: "Punto exacto, no pasado. Enfriar destapado.", almacenamiento: "NEVERA solo 3-4 días. JUEVES cocinar fresco." },
    { que: "Avena pre-cocida (4 porc)", como: "Con leche y canela. Consistencia espesa.", almacenamiento: "NEVERA en potes individuales" },
    { que: "Batata y yuca hervidas", como: "Con cáscara 25-30 min. Verificar con tenedor.", almacenamiento: "NEVERA (yuca NO congelar)" },
    { que: "7 plátanos fritos", como: "Maduros, rodajas gruesas, dorar ambos lados.", almacenamiento: "NEVERA en tupper con papel" },
  ],
  extras: [
    { que: "Pasta cocida (1 lb)", como: "Al dente con aceite para que no pegue.", almacenamiento: "NEVERA 4-5 días" },
    { que: "Sofrito extra", como: "Cebolla, ajo, ají, tomate picados y sofritos.", almacenamiento: "NEVERA en pote de vidrio" },
  ],
};

// Distribución de almacenamiento
const DISTRIBUCION_NEVERA = [
  "4 tuppers ALMUERZO (Lun-Jue)",
  "4 tuppers CENA (Lun-Jue)",
  "4 bolsas SNACKS",
  "Huevos hervidos (sin pelar)",
  "Sofrito, yuca, batata",
  "Leche, mantequilla de maní",
];

const DISTRIBUCION_CONGELADOR = [
  "2 tuppers ALMUERZO (Vie-Sáb)",
  "2 tuppers CENA (Vie-Dom)",
  "3 bolsas SNACKS",
  "Pollo extra desmenuzado",
  "Habichuelas extra",
  "Pan (si sobra)",
];

// Contenido de cada tupper
const TUPPER_CONTENIDO = {
  almuerzo: "1.5 tazas arroz + 1 taza pollo desmenuzado + 0.5 taza habichuelas + 1 plátano frito + 1 cda aceite",
  cena: "Variable según día: Bowl arroz/pollo O Vianda con sardinas O Pasta con huevos",
  snacks: "2 panes + 2 huevos hervidos + 1 guineo + bolsita (3 cdas avena + 2 cdas maní)",
};

// Rutina diaria
const RUTINA_DIARIA = [
  { time: "Noche anterior", task: "Sacar tupper del congelador a nevera (si aplica)" },
  { time: "5:30 AM", task: "Preparar licuado: leche + avena + guineo + maní + hielo" },
  { time: "6:00 AM", task: "COMIDA 1: Licuado + 2 huevos hervidos" },
  { time: "Salir", task: "Empacar mochila: tupper almuerzo + tupper cena + bolsa snacks + termo" },
  { time: "10:00 AM", task: "COMIDA 2: Snack AM (sandwich de la bolsa)" },
  { time: "13:00 PM", task: "COMIDA 3: Almuerzo (calentar tupper)" },
  { time: "17:00 PM", task: "COMIDA 4: Snack PM (batido o pasta)" },
  { time: "21:30 PM", task: "COMIDA 5: Cena (calentar tupper)" },
];

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["cronograma"]));

  useEffect(() => {
    initializeMealPrep();
    initializeShoppingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId, listId]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Semana inicia lunes
  const prepProgressPercent =
    prepStats.total > 0 ? (prepStats.completed / prepStats.total) * 100 : 0;
  const isMonday = new Date().getDay() === 1;
  const isThursday = new Date().getDay() === 4;

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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="preparacion" className="gap-1 text-xs">
            <ClipboardList className="h-3 w-3" />
            Prep
          </TabsTrigger>
          <TabsTrigger value="compras" className="gap-1 text-xs">
            <ShoppingCart className="h-3 w-3" />
            Compras
          </TabsTrigger>
          <TabsTrigger value="guia" className="gap-1 text-xs">
            <BookOpen className="h-3 w-3" />
            Guía
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

          {/* Thursday Reminder */}
          {isThursday && (
            <Card className="p-4 !bg-yellow-500/20 border-yellow-500/40">
              <div className="flex items-start gap-3">
                <Moon className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-yellow-500">
                    PAUSA DEL JUEVES NOCHE
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cocinar arroz fresco (3 tazas) + Sacar tuppers del congelador
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

        {/* Tab: Guía Completa */}
        <TabsContent value="guia" className="space-y-4">
          {/* Cronograma */}
          <Card className="p-4">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("cronograma")}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Cronograma del Lunes</h3>
              </div>
              {expandedSections.has("cronograma") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("cronograma") && (
              <div className="mt-4 space-y-3">
                {CRONOGRAMA.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 text-xs font-mono text-primary">
                      {item.time}
                    </div>
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.activity}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Instrucciones por Estación */}
          <Card className="p-4">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("instrucciones")}
            >
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Cómo Cocinar</h3>
              </div>
              {expandedSections.has("instrucciones") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("instrucciones") && (
              <div className="mt-4 space-y-4">
                {/* Proteínas */}
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                    <Beef className="h-3 w-3" /> PROTEÍNAS
                  </h4>
                  {ESTACION_INSTRUCCIONES.proteinas.map((item, idx) => (
                    <div key={idx} className="mb-3 p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs font-medium">{item.que}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.como}</p>
                      <p className="text-xs text-primary/80 mt-1 italic">{item.almacenamiento}</p>
                    </div>
                  ))}
                </div>

                {/* Carbohidratos */}
                <div>
                  <h4 className="text-xs font-semibold text-yellow-500 mb-2 flex items-center gap-1">
                    <Wheat className="h-3 w-3" /> CARBOHIDRATOS
                  </h4>
                  {ESTACION_INSTRUCCIONES.carbohidratos.map((item, idx) => (
                    <div key={idx} className="mb-3 p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs font-medium">{item.que}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.como}</p>
                      <p className="text-xs text-yellow-500/80 mt-1 italic">{item.almacenamiento}</p>
                    </div>
                  ))}
                </div>

                {/* Extras */}
                <div>
                  <h4 className="text-xs font-semibold text-orange-500 mb-2 flex items-center gap-1">
                    <Carrot className="h-3 w-3" /> EXTRAS
                  </h4>
                  {ESTACION_INSTRUCCIONES.extras.map((item, idx) => (
                    <div key={idx} className="mb-3 p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs font-medium">{item.que}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.como}</p>
                      <p className="text-xs text-orange-500/80 mt-1 italic">{item.almacenamiento}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Distribución de Almacenamiento */}
          <Card className="p-4">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("almacenamiento")}
            >
              <div className="flex items-center gap-2">
                <Refrigerator className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Distribución Nevera/Congelador</h3>
              </div>
              {expandedSections.has("almacenamiento") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("almacenamiento") && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* Nevera */}
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-1 mb-2">
                    <Refrigerator className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-500">NEVERA</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {DISTRIBUCION_NEVERA.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Congelador */}
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center gap-1 mb-2">
                    <Snowflake className="h-3 w-3 text-cyan-500" />
                    <span className="text-xs font-semibold text-cyan-500">CONGELADOR</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {DISTRIBUCION_CONGELADOR.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>

          {/* Contenido de Tuppers */}
          <Card className="p-4">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("tuppers")}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Contenido de Tuppers</h3>
              </div>
              {expandedSections.has("tuppers") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("tuppers") && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs font-semibold text-primary mb-1">TUPPER ALMUERZO</p>
                  <p className="text-xs text-muted-foreground">{TUPPER_CONTENIDO.almuerzo}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <p className="text-xs font-semibold text-yellow-500 mb-1">TUPPER CENA</p>
                  <p className="text-xs text-muted-foreground">{TUPPER_CONTENIDO.cena}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <p className="text-xs font-semibold text-orange-500 mb-1">BOLSA SNACKS</p>
                  <p className="text-xs text-muted-foreground">{TUPPER_CONTENIDO.snacks}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Pausa del Jueves */}
          <Card className="p-4 !bg-yellow-500/10 border-yellow-500/30">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("jueves")}
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-yellow-500" />
                <h3 className="font-semibold text-sm text-yellow-500">Pausa del Jueves Noche</h3>
              </div>
              {expandedSections.has("jueves") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("jueves") && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  El arroz solo dura 3-4 días refrigerado. El jueves por la noche:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>1. Cocinar arroz fresco (3 tazas secas = 6 porciones)</li>
                  <li>2. Sacar tuppers Vie-Dom del congelador a la nevera</li>
                  <li>3. Re-ensamblar tuppers de Vie-Dom con arroz fresco</li>
                  <li>4. Verificar que hay suficientes snacks</li>
                </ul>
                <p className="text-xs text-yellow-500 mt-2 font-medium">
                  Tiempo estimado: 30-40 minutos
                </p>
              </div>
            )}
          </Card>

          {/* Rutina Diaria */}
          <Card className="p-4 !bg-yellow-500/10 border-yellow-500/30">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection("rutina")}
            >
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Rutina Diaria</h3>
              </div>
              {expandedSections.has("rutina") ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("rutina") && (
              <div className="mt-4 space-y-2">
                {RUTINA_DIARIA.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30">
                    <div className="flex-shrink-0 w-20 text-xs font-mono text-primary">
                      {item.time}
                    </div>
                    <span className="text-xs text-muted-foreground">{item.task}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Reference Card */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Resumen Rápido
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-primary">Meta Diaria</p>
                <p className="text-muted-foreground">5 comidas = 2,600 kcal</p>
              </div>
              <div>
                <p className="font-medium text-primary">Presupuesto</p>
                <p className="text-muted-foreground">RD$3,000/semana</p>
              </div>
              <div>
                <p className="font-medium text-primary">Prep Day</p>
                <p className="text-muted-foreground">Lunes 8am-2pm</p>
              </div>
              <div>
                <p className="font-medium text-primary">Refresh</p>
                <p className="text-muted-foreground">Jueves noche</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
