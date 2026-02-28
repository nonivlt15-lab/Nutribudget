"use client"

import { useApp } from "@/lib/app-context"
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Wallet,
  Beef,
  Wheat,
  Droplets,
} from "lucide-react"

function CalorieRing({
  current,
  target,
  size = 160,
}: {
  current: number
  target: number
  size?: number
}) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(current / target, 1)
  const offset = circumference - percent * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums text-foreground">{current}</span>
        <span className="text-xs text-muted-foreground">/ {target} kcal</span>
      </div>
    </div>
  )
}

function MacroBar({
  label,
  current,
  target,
  color,
  unit,
  icon: Icon,
}: {
  label: string
  current: number
  target: number
  color: string
  unit: string
  icon: typeof Beef
}) {
  const percent = Math.min((current / target) * 100, 100)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color }} />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{unit}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums text-foreground">{current}g</span>
        <span className="text-xs text-muted-foreground">/ {target}g</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  )
}

function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  if (data.length === 0) return null
  const min = Math.min(...data.map((d) => d.weight)) - 0.5
  const max = Math.max(...data.map((d) => d.weight)) + 0.5
  const range = max - min

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((d.weight - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Suivi poids</span>
        </div>
        <span className="text-xs text-muted-foreground">Cette semaine</span>
      </div>
      <div className="relative h-24">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#chartGrad)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.date} className="text-[10px] text-muted-foreground">
            {d.date}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
        <span className="text-xs text-muted-foreground">Variation</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          <TrendingDown className="h-3 w-3" />
          -{(data[0].weight - data[data.length - 1].weight).toFixed(1)} kg
        </span>
      </div>
    </div>
  )
}

export function DashboardView() {
  const { profile, macros, weekPlan, weightLog } = useApp()

  const todayPlan = weekPlan[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  // Simulate consumed about 65% of the day
  const consumedRatio = 0.65
  const consumed = {
    calories: Math.round(macros.calories * consumedRatio),
    protein: Math.round(macros.protein * consumedRatio),
    carbs: Math.round(macros.carbs * consumedRatio),
    fat: Math.round(macros.fat * consumedRatio),
    cost: todayPlan ? +(todayPlan.totalCost * consumedRatio).toFixed(2) : 0,
  }

  const goalLabel =
    profile?.goal === "masse"
      ? "Prise de masse"
      : profile?.goal === "seche"
        ? "Seche"
        : "Maintien"

  return (
    <div className="flex flex-col gap-5 px-5 pt-12 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Salut,</p>
          <h1 className="text-2xl font-bold text-foreground">{profile?.name || "Etudiant"}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{goalLabel}</span>
        </div>
      </div>

      {/* Calorie Ring */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary p-6">
        <CalorieRing current={consumed.calories} target={macros.calories} />
        <div className="flex w-full items-center justify-around">
          <div className="flex flex-col items-center">
            <Flame className="h-4 w-4 text-primary mb-1" />
            <span className="text-lg font-bold tabular-nums text-foreground">{macros.calories}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Objectif</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Flame className="h-4 w-4 text-chart-5 mb-1" />
            <span className="text-lg font-bold tabular-nums text-foreground">{consumed.calories}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Consomme</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Flame className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-lg font-bold tabular-nums text-foreground">
              {macros.calories - consumed.calories}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Restant</span>
          </div>
        </div>
      </div>

      {/* Budget card */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Budget du jour</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {macros.dailyBudget.toFixed(2)} EUR
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold tabular-nums text-foreground">
            {consumed.cost.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">EUR depenses</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{
              width: `${Math.min((consumed.cost / macros.dailyBudget) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Reste {(macros.dailyBudget - consumed.cost).toFixed(2)} EUR pour aujourd{"'"}hui
        </p>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-3 gap-3">
        <MacroBar
          label="Proteines"
          current={consumed.protein}
          target={macros.protein}
          color="#22c55e"
          unit="P"
          icon={Beef}
        />
        <MacroBar
          label="Glucides"
          current={consumed.carbs}
          target={macros.carbs}
          color="#f59e0b"
          unit="G"
          icon={Wheat}
        />
        <MacroBar
          label="Lipides"
          current={consumed.fat}
          target={macros.fat}
          color="#3b82f6"
          unit="L"
          icon={Droplets}
        />
      </div>

      {/* Today's meals */}
      {todayPlan && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {"Aujourd'hui"}
          </h3>
          {todayPlan.meals.map((meal, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{meal.name}</p>
                <p className="text-xs text-muted-foreground">
                  {meal.calories} kcal - {meal.cost.toFixed(2)} EUR
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{meal.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Weight Chart */}
      <WeightChart data={weightLog} />
    </div>
  )
}
