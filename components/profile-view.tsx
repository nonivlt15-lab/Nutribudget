"use client"

import { useApp } from "@/lib/app-context"
import {
  User,
  Dumbbell,
  TrendingDown,
  Scale,
  Ruler,
  Calendar,
  Wallet,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Moon,
} from "lucide-react"

export function ProfileView() {
  const { profile, macros, setCurrentView, setOnboardingStep } = useApp()

  if (!profile) return null

  const goalIcons = {
    masse: Dumbbell,
    seche: TrendingDown,
    maintien: Scale,
  }
  const goalLabels = {
    masse: "Prise de masse",
    seche: "Seche",
    maintien: "Maintien",
  }

  const GoalIcon = goalIcons[profile.goal]

  const stats = [
    { label: "Age", value: `${profile.age} ans`, icon: Calendar },
    { label: "Taille", value: `${profile.height} cm`, icon: Ruler },
    { label: "Poids", value: `${profile.weight} kg`, icon: Scale },
    { label: "Budget", value: `${profile.weeklyBudget} EUR/sem`, icon: Wallet },
  ]

  const menuItems = [
    { label: "Notifications", icon: Bell },
    { label: "Apparence", icon: Moon },
    { label: "Parametres", icon: Settings },
  ]

  return (
    <div className="flex flex-col gap-5 px-5 pt-12 pb-28">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
            <GoalIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {goalLabels[profile.goal]}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Macros summary */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Objectifs nutritionnels
        </p>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">{macros.calories}</span>
            <span className="text-[10px] text-muted-foreground">kcal/jour</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">{macros.protein}g</span>
            <span className="text-[10px] text-muted-foreground">proteines</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">{macros.carbs}g</span>
            <span className="text-[10px] text-muted-foreground">glucides</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">{macros.fat}g</span>
            <span className="text-[10px] text-muted-foreground">lipides</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      {profile.preferences.length > 0 && (
        <div className="rounded-xl border border-border bg-secondary p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preferences
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.preferences.map((pref) => (
              <span
                key={pref}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="flex flex-col gap-1 rounded-xl border border-border bg-secondary overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      {/* Edit profile */}
      <button
        onClick={() => {
          setOnboardingStep(0)
          setCurrentView("onboarding")
        }}
        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-secondary font-medium text-foreground transition-colors hover:bg-muted"
      >
        Modifier le profil
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          setOnboardingStep(0)
          setCurrentView("onboarding")
        }}
        className="flex items-center justify-center gap-2 py-3 text-sm text-destructive transition-colors hover:opacity-80"
      >
        <LogOut className="h-4 w-4" />
        Deconnexion
      </button>
    </div>
  )
}
