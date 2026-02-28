"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Wallet,
  Beef,
  Wheat,
  Droplets,
  UtensilsCrossed,
} from "lucide-react"

export function MealPlanView() {
  const { weekPlan, macros } = useApp()
  const [selectedDay, setSelectedDay] = useState(0)

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  const currentPlan = weekPlan[selectedDay]

  if (!currentPlan) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-muted-foreground">Aucun plan disponible</p>
      </div>
    )
  }

  const weeklyTotal = weekPlan.reduce((sum, day) => sum + day.totalCost, 0)

  return (
    <div className="flex flex-col gap-5 px-5 pt-12 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plan alimentaire</h1>
          <p className="text-sm text-muted-foreground">
            Total semaine : {weeklyTotal.toFixed(2)} EUR
          </p>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-foreground"
          aria-label="Jour precedent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          {days.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-medium transition-all ${
                i === selectedDay
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-foreground"
          aria-label="Jour suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day summary */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-4">
        <div className="flex flex-1 flex-col items-center gap-1">
          <Flame className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold tabular-nums text-foreground">
            {currentPlan.totalCalories}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">kcal</span>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex flex-1 flex-col items-center gap-1">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold tabular-nums text-foreground">
            {currentPlan.totalCost.toFixed(2)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">EUR</span>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex flex-1 flex-col items-center gap-1">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold tabular-nums text-foreground">
            {currentPlan.meals.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">repas</span>
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-3">
        {currentPlan.meals.map((meal, i) => {
          const mealLabels = ["Petit-dejeuner", "Dejeuner", "Diner", "Collation"]
          return (
            <div key={i} className="rounded-xl border border-border bg-secondary overflow-hidden">
              {/* Meal header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UtensilsCrossed className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{mealLabels[i] || "Repas"}</p>
                    <p className="text-sm font-semibold text-foreground">{meal.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {meal.time}
                </div>
              </div>

              {/* Macros row */}
              <div className="flex items-center gap-4 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-foreground">{meal.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Beef className="h-3 w-3" style={{ color: "#22c55e" }} />
                  <span className="text-xs text-muted-foreground">{meal.protein}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wheat className="h-3 w-3" style={{ color: "#f59e0b" }} />
                  <span className="text-xs text-muted-foreground">{meal.carbs}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3 w-3" style={{ color: "#3b82f6" }} />
                  <span className="text-xs text-muted-foreground">{meal.fat}g</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="border-t border-border px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {meal.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2.5 bg-muted/30">
                <span className="text-xs text-muted-foreground">Cout du repas</span>
                <span className="text-sm font-semibold text-primary">{meal.cost.toFixed(2)} EUR</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Calorie comparison */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Calories du jour</span>
          <span className="text-sm font-medium text-foreground">
            {currentPlan.totalCalories} / {macros.calories} kcal
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.min((currentPlan.totalCalories / macros.calories) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
