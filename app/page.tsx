"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { DashboardView } from "@/components/dashboard-view"
import { MealPlanView } from "@/components/meal-plan-view"
import { ShoppingListView } from "@/components/shopping-list-view"
import { PremiumView } from "@/components/premium-view"
import { ProfileView } from "@/components/profile-view"
import { BottomNav } from "@/components/bottom-nav"

function AppContent() {
  const { currentView } = useApp()

  if (currentView === "onboarding") {
    return <OnboardingFlow />
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md">
      {currentView === "dashboard" && <DashboardView />}
      {currentView === "meals" && <MealPlanView />}
      {currentView === "shopping" && <ShoppingListView />}
      {currentView === "premium" && <PremiumView />}
      {currentView === "profile" && <ProfileView />}
      <BottomNav />
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <main className="mx-auto min-h-screen max-w-md bg-background">
        <AppContent />
      </main>
    </AppProvider>
  )
}
