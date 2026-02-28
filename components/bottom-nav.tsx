"use client"

import { useApp } from "@/lib/app-context"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Crown,
  User,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Accueil", icon: LayoutDashboard },
  { id: "meals", label: "Repas", icon: UtensilsCrossed },
  { id: "shopping", label: "Courses", icon: ShoppingCart },
  { id: "premium", label: "Premium", icon: Crown },
  { id: "profile", label: "Profil", icon: User },
]

export function BottomNav() {
  const { currentView, setCurrentView } = useApp()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-6 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -top-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
