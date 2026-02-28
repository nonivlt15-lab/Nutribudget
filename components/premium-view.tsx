"use client"

import {
  Crown,
  Users,
  BookOpen,
  Download,
  Sparkles,
  Check,
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Profils multiples",
    desc: "Gere les repas de ta colocation",
  },
  {
    icon: BookOpen,
    title: "Recettes detaillees",
    desc: "Instructions etape par etape",
  },
  {
    icon: Download,
    title: "Export PDF",
    desc: "Telecharge ton plan et ta liste",
  },
  {
    icon: Sparkles,
    title: "Optimisation avancee",
    desc: "Algorithme budget/nutrition IA",
  },
]

const plans = [
  {
    name: "Mensuel",
    price: "4.99",
    period: "/mois",
    popular: false,
  },
  {
    name: "Annuel",
    price: "2.99",
    period: "/mois",
    popular: true,
    savings: "Economise 40%",
  },
]

export function PremiumView() {
  return (
    <div className="flex flex-col gap-6 px-5 pt-12 pb-28">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">NutriBudget Pro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Debloquer toutes les fonctionnalites"}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="flex items-center gap-4 rounded-xl border border-border bg-secondary p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Check className="h-4 w-4 text-primary" />
            </div>
          )
        })}
      </div>

      {/* Pricing */}
      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <button
            key={plan.name}
            className={`relative flex flex-col items-center gap-1 rounded-xl border p-5 transition-all ${
              plan.popular
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold text-primary-foreground">
                Populaire
              </span>
            )}
            <span className="text-sm font-medium text-muted-foreground">{plan.name}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">EUR{plan.period}</span>
            </div>
            {plan.savings && (
              <span className="text-xs font-medium text-primary">{plan.savings}</span>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button className="flex h-12 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
        Commencer l{"'"}essai gratuit
      </button>
      <p className="text-center text-xs text-muted-foreground">
        7 jours d{"'"}essai gratuit, annulable a tout moment
      </p>
    </div>
  )
}
