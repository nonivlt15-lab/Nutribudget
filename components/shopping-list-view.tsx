"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ShoppingCart,
  Check,
  Users,
  Download,
  ChevronDown,
} from "lucide-react"

export function ShoppingListView() {
  const { shoppingList, toggleShoppingItem, profile } = useApp()
  const [colocationMode, setColocationMode] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categories = useMemo(() => {
    const cats = new Map<string, typeof shoppingList>()
    shoppingList.forEach((item, index) => {
      const cat = item.category
      if (!cats.has(cat)) cats.set(cat, [])
      cats.get(cat)!.push({ ...item, checked: shoppingList[index].checked })
    })
    return cats
  }, [shoppingList])

  // Maintain original indices for toggling
  const indexMap = useMemo(() => {
    const map = new Map<string, number>()
    shoppingList.forEach((item, i) => {
      map.set(item.name, i)
    })
    return map
  }, [shoppingList])

  const totalPrice = shoppingList.reduce(
    (sum, item) => sum + (colocationMode ? item.price / 2 : item.price),
    0
  )
  const checkedCount = shoppingList.filter((i) => i.checked).length
  const checkedPrice = shoppingList
    .filter((i) => i.checked)
    .reduce((sum, item) => sum + (colocationMode ? item.price / 2 : item.price), 0)

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const allExpanded = expandedCategories.length === categories.size

  return (
    <div className="flex flex-col gap-5 px-5 pt-12 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Liste de courses</h1>
          <p className="text-sm text-muted-foreground">
            {checkedCount}/{shoppingList.length} articles coches
          </p>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground" aria-label="Exporter en PDF">
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Budget summary */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Estimation totale</span>
          </div>
          {colocationMode && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Mode coloc
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold tabular-nums text-foreground">
            {totalPrice.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">EUR</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted mb-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min((checkedPrice / totalPrice) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {checkedPrice.toFixed(2)} EUR achetes
          </span>
          <span className="text-xs text-muted-foreground">
            Budget : {profile?.weeklyBudget || 50} EUR/sem
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setColocationMode(!colocationMode)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
            colocationMode
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-muted-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Colocation
        </button>
        <button
          onClick={() => {
            if (allExpanded) {
              setExpandedCategories([])
            } else {
              setExpandedCategories(Array.from(categories.keys()))
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${allExpanded ? "rotate-180" : ""}`} />
          {allExpanded ? "Reduire" : "Tout voir"}
        </button>
      </div>

      {/* Shopping list by category */}
      <div className="flex flex-col gap-3">
        {Array.from(categories.entries()).map(([category, items]) => {
          const isExpanded = expandedCategories.includes(category)
          const catChecked = items.filter((i) => i.checked).length
          const catTotal = items.reduce(
            (s, i) => s + (colocationMode ? i.price / 2 : i.price),
            0
          )

          return (
            <div key={category} className="rounded-xl border border-border bg-secondary overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{category}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {catChecked}/{items.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">{catTotal.toFixed(2)} EUR</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border">
                  {items.map((item) => {
                    const originalIndex = indexMap.get(item.name) ?? 0
                    const isChecked = shoppingList[originalIndex]?.checked
                    return (
                      <button
                        key={item.name}
                        onClick={() => toggleShoppingItem(originalIndex)}
                        className="flex w-full items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                            isChecked
                              ? "border-primary bg-primary"
                              : "border-border bg-transparent"
                          }`}
                        >
                          {isChecked && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span
                          className={`flex-1 text-left text-sm transition-all ${
                            isChecked
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.quantity}</span>
                        <span className="text-xs font-medium text-foreground min-w-[48px] text-right">
                          {(colocationMode ? item.price / 2 : item.price).toFixed(2)} EUR
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
