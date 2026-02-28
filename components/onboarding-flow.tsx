"use client"

import { useState } from "react"
import { useApp, type Goal } from "@/lib/app-context"
import {
  Dumbbell,
  TrendingDown,
  Scale,
  ChevronRight,
  ChevronLeft,
  Leaf,
  User,
  Target,
  Wallet,
} from "lucide-react"

const goals: { id: Goal; label: string; desc: string; icon: typeof Dumbbell }[] = [
  { id: "masse", label: "Prise de masse", desc: "+350 kcal / jour", icon: Dumbbell },
  { id: "seche", label: "Seche", desc: "-400 kcal / jour", icon: TrendingDown },
  { id: "maintien", label: "Maintien", desc: "Equilibre calorique", icon: Scale },
]

const preferenceOptions = [
  "Sans lactose",
  "Sans gluten",
  "Vegetarien",
  "Halal",
  "Pas de porc",
  "Bio prefere",
]

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, setProfile, setCurrentView } = useApp()
  const [name, setName] = useState("")
  const [age, setAge] = useState(21)
  const [height, setHeight] = useState(178)
  const [weight, setWeight] = useState(75)
  const [goal, setGoal] = useState<Goal>("masse")
  const [budget, setBudget] = useState(50)
  const [preferences, setPreferences] = useState<string[]>([])

  const steps = [
    { icon: Leaf, title: "Bienvenue" },
    { icon: User, title: "Profil" },
    { icon: Target, title: "Objectif" },
    { icon: Wallet, title: "Budget" },
  ]

  function handleComplete() {
    setProfile({
      name: name || "Etudiant",
      age,
      height,
      weight,
      goal,
      weeklyBudget: budget,
      preferences,
    })
    setCurrentView("dashboard")
  }

  function togglePref(pref: string) {
    setPreferences((p) => (p.includes(pref) ? p.filter((x) => x !== pref) : [...p, pref]))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 px-6 pt-12 pb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{
              background:
                i <= onboardingStep
                  ? "var(--primary)"
                  : "var(--secondary)",
            }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        {/* Step 0: Welcome */}
        {onboardingStep === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                NutriBudget Student
              </h1>
              <p className="max-w-xs text-base leading-relaxed text-muted-foreground">
                {"Nutrition intelligente pour etudiants sportifs. Atteins tes objectifs sans exploser ton budget."}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <input
                type="text"
                placeholder="Ton prenom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step 1: Profile */}
        {onboardingStep === 1 && (
          <div className="flex flex-1 flex-col gap-8 pt-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ton profil</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {"Pour calculer tes besoins caloriques"}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Age
                </label>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary px-4 py-3">
                  <input
                    type="range"
                    min={16}
                    max={40}
                    value={age}
                    onChange={(e) => setAge(+e.target.value)}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-12 text-right font-mono text-lg font-semibold text-foreground">
                    {age}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Taille (cm)
                </label>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary px-4 py-3">
                  <input
                    type="range"
                    min={150}
                    max={210}
                    value={height}
                    onChange={(e) => setHeight(+e.target.value)}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-12 text-right font-mono text-lg font-semibold text-foreground">
                    {height}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Poids (kg)
                </label>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary px-4 py-3">
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={weight}
                    onChange={(e) => setWeight(+e.target.value)}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-12 text-right font-mono text-lg font-semibold text-foreground">
                    {weight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {onboardingStep === 2 && (
          <div className="flex flex-1 flex-col gap-8 pt-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ton objectif</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {"Quel est ton objectif physique ?"}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {goals.map((g) => {
                const Icon = g.icon
                const selected = goal === g.id
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{g.label}</p>
                      <p className="text-sm text-muted-foreground">{g.desc}</p>
                    </div>
                    {selected && (
                      <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preferences alimentaires
              </p>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => togglePref(pref)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                      preferences.includes(pref)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {onboardingStep === 3 && (
          <div className="flex flex-1 flex-col gap-8 pt-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ton budget</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {"Budget alimentaire par semaine"}
              </p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-bold tabular-nums text-foreground">{budget}</span>
                <span className="text-2xl font-medium text-primary">{"EUR/sem"}</span>
              </div>
              <div className="w-full flex flex-col gap-2">
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={5}
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>20 EUR</span>
                  <span>120 EUR</span>
                </div>
              </div>
              <div className="w-full rounded-xl border border-border bg-secondary p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Budget / jour</span>
                  <span className="font-semibold text-foreground">
                    {(budget / 7).toFixed(2)} EUR
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-muted-foreground">Budget / repas</span>
                  <span className="font-semibold text-foreground">
                    {(budget / 7 / 3).toFixed(2)} EUR
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-auto flex items-center gap-3 pt-6">
          {onboardingStep > 0 && (
            <button
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => {
              if (onboardingStep < 3) {
                setOnboardingStep(onboardingStep + 1)
              } else {
                handleComplete()
              }
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {onboardingStep === 3 ? "Generer mon plan" : "Continuer"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
