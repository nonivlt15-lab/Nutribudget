"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Goal = "masse" | "seche" | "maintien"

export interface UserProfile {
  name: string
  age: number
  height: number
  weight: number
  goal: Goal
  weeklyBudget: number
  preferences: string[]
}

export interface MacroTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
  dailyBudget: number
}

export interface Meal {
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  cost: number
  items: string[]
}

export interface DayPlan {
  day: string
  meals: Meal[]
  totalCalories: number
  totalCost: number
}

export interface ShoppingItem {
  name: string
  quantity: string
  price: number
  category: string
  checked: boolean
}

interface AppState {
  currentView: string
  setCurrentView: (view: string) => void
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  onboardingStep: number
  setOnboardingStep: (step: number) => void
  macros: MacroTargets
  weekPlan: DayPlan[]
  shoppingList: ShoppingItem[]
  toggleShoppingItem: (index: number) => void
  weightLog: { date: string; weight: number }[]
}

function calculateMacros(profile: UserProfile): MacroTargets {
  // Mifflin-St Jeor
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  let tdee = bmr * 1.55 // moderately active
  let calories: number
  if (profile.goal === "masse") {
    calories = Math.round(tdee + 350)
  } else if (profile.goal === "seche") {
    calories = Math.round(tdee - 400)
  } else {
    calories = Math.round(tdee)
  }
  const protein = Math.round(profile.weight * 2)
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
  const dailyBudget = Math.round((profile.weeklyBudget / 7) * 100) / 100

  return { calories, protein, carbs, fat, dailyBudget }
}

function generateWeekPlan(macros: MacroTargets, profile: UserProfile): DayPlan[] {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  const breakfastOptions: Meal[] = [
    {
      name: "Flocons d'avoine proteine",
      time: "07:30",
      calories: Math.round(macros.calories * 0.25),
      protein: Math.round(macros.protein * 0.25),
      carbs: Math.round(macros.carbs * 0.3),
      fat: Math.round(macros.fat * 0.2),
      cost: +(macros.dailyBudget * 0.2).toFixed(2),
      items: ["Flocons d'avoine", "Lait", "Banane", "Whey"],
    },
    {
      name: "Tartines oeuf & fromage",
      time: "07:30",
      calories: Math.round(macros.calories * 0.25),
      protein: Math.round(macros.protein * 0.25),
      carbs: Math.round(macros.carbs * 0.28),
      fat: Math.round(macros.fat * 0.25),
      cost: +(macros.dailyBudget * 0.22).toFixed(2),
      items: ["Pain complet", "Oeufs", "Fromage", "Beurre"],
    },
  ]

  const lunchOptions: Meal[] = [
    {
      name: "Poulet riz brocoli",
      time: "12:30",
      calories: Math.round(macros.calories * 0.35),
      protein: Math.round(macros.protein * 0.35),
      carbs: Math.round(macros.carbs * 0.35),
      fat: Math.round(macros.fat * 0.3),
      cost: +(macros.dailyBudget * 0.3).toFixed(2),
      items: ["Filet de poulet", "Riz basmati", "Brocoli", "Huile d'olive"],
    },
    {
      name: "Pates bolognaise maison",
      time: "12:30",
      calories: Math.round(macros.calories * 0.35),
      protein: Math.round(macros.protein * 0.33),
      carbs: Math.round(macros.carbs * 0.38),
      fat: Math.round(macros.fat * 0.28),
      cost: +(macros.dailyBudget * 0.28).toFixed(2),
      items: ["Pates completes", "Boeuf hache 5%", "Sauce tomate", "Oignon"],
    },
  ]

  const dinnerOptions: Meal[] = [
    {
      name: "Saumon patate douce",
      time: "19:30",
      calories: Math.round(macros.calories * 0.3),
      protein: Math.round(macros.protein * 0.3),
      carbs: Math.round(macros.carbs * 0.25),
      fat: Math.round(macros.fat * 0.35),
      cost: +(macros.dailyBudget * 0.35).toFixed(2),
      items: ["Pave de saumon", "Patate douce", "Haricots verts"],
    },
    {
      name: "Omelette legumes",
      time: "19:30",
      calories: Math.round(macros.calories * 0.3),
      protein: Math.round(macros.protein * 0.28),
      carbs: Math.round(macros.carbs * 0.22),
      fat: Math.round(macros.fat * 0.35),
      cost: +(macros.dailyBudget * 0.25).toFixed(2),
      items: ["Oeufs", "Poivron", "Champignons", "Fromage rape"],
    },
  ]

  const snackOptions: Meal[] = [
    {
      name: "Collation proteinee",
      time: "16:00",
      calories: Math.round(macros.calories * 0.1),
      protein: Math.round(macros.protein * 0.1),
      carbs: Math.round(macros.carbs * 0.1),
      fat: Math.round(macros.fat * 0.1),
      cost: +(macros.dailyBudget * 0.15).toFixed(2),
      items: ["Yaourt grec", "Amandes", "Miel"],
    },
    {
      name: "Shake post-training",
      time: "16:00",
      calories: Math.round(macros.calories * 0.1),
      protein: Math.round(macros.protein * 0.12),
      carbs: Math.round(macros.carbs * 0.12),
      fat: Math.round(macros.fat * 0.05),
      cost: +(macros.dailyBudget * 0.13).toFixed(2),
      items: ["Whey", "Banane", "Lait"],
    },
  ]

  return days.map((day, i) => {
    const meals = [
      breakfastOptions[i % 2],
      lunchOptions[i % 2],
      dinnerOptions[i % 2],
      snackOptions[i % 2],
    ]
    return {
      day,
      meals,
      totalCalories: meals.reduce((s, m) => s + m.calories, 0),
      totalCost: +meals.reduce((s, m) => s + m.cost, 0).toFixed(2),
    }
  })
}

function generateShoppingList(weekPlan: DayPlan[]): ShoppingItem[] {
  const itemMap = new Map<string, { quantity: number; price: number; category: string }>()
  const categoryMap: Record<string, string> = {
    "Flocons d'avoine": "Epicerie",
    "Lait": "Frais",
    "Banane": "Fruits & Legumes",
    "Whey": "Complements",
    "Pain complet": "Boulangerie",
    "Oeufs": "Frais",
    "Fromage": "Frais",
    "Beurre": "Frais",
    "Filet de poulet": "Viandes",
    "Riz basmati": "Epicerie",
    "Brocoli": "Fruits & Legumes",
    "Huile d'olive": "Epicerie",
    "Pates completes": "Epicerie",
    "Boeuf hache 5%": "Viandes",
    "Sauce tomate": "Epicerie",
    "Oignon": "Fruits & Legumes",
    "Pave de saumon": "Poissons",
    "Patate douce": "Fruits & Legumes",
    "Haricots verts": "Fruits & Legumes",
    "Poivron": "Fruits & Legumes",
    "Champignons": "Fruits & Legumes",
    "Fromage rape": "Frais",
    "Yaourt grec": "Frais",
    "Amandes": "Epicerie",
    "Miel": "Epicerie",
  }

  const priceMap: Record<string, number> = {
    "Flocons d'avoine": 1.5,
    "Lait": 1.1,
    "Banane": 1.3,
    "Whey": 4.5,
    "Pain complet": 1.8,
    "Oeufs": 2.5,
    "Fromage": 2.2,
    "Beurre": 1.9,
    "Filet de poulet": 5.5,
    "Riz basmati": 2.0,
    "Brocoli": 1.8,
    "Huile d'olive": 3.5,
    "Pates completes": 1.4,
    "Boeuf hache 5%": 4.5,
    "Sauce tomate": 1.2,
    "Oignon": 0.8,
    "Pave de saumon": 6.0,
    "Patate douce": 2.0,
    "Haricots verts": 1.5,
    "Poivron": 1.5,
    "Champignons": 1.8,
    "Fromage rape": 1.5,
    "Yaourt grec": 2.0,
    "Amandes": 3.0,
    "Miel": 2.5,
  }

  weekPlan.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.items.forEach((item) => {
        const existing = itemMap.get(item)
        if (existing) {
          existing.quantity++
        } else {
          itemMap.set(item, {
            quantity: 1,
            price: priceMap[item] || 2.0,
            category: categoryMap[item] || "Autre",
          })
        }
      })
    })
  })

  return Array.from(itemMap.entries()).map(([name, data]) => ({
    name,
    quantity: `x${data.quantity}`,
    price: +(data.price * Math.ceil(data.quantity / 3)).toFixed(2),
    category: data.category,
    checked: false,
  }))
}

const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState("onboarding")
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [macros, setMacros] = useState<MacroTargets>({
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 70,
    dailyBudget: 7.14,
  })
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [weightLog] = useState([
    { date: "Lun", weight: 75 },
    { date: "Mar", weight: 75.2 },
    { date: "Mer", weight: 74.8 },
    { date: "Jeu", weight: 74.9 },
    { date: "Ven", weight: 74.6 },
    { date: "Sam", weight: 74.7 },
    { date: "Dim", weight: 74.5 },
  ])

  function setProfile(p: UserProfile) {
    setProfileState(p)
    const m = calculateMacros(p)
    setMacros(m)
    const plan = generateWeekPlan(m, p)
    setWeekPlan(plan)
    setShoppingList(generateShoppingList(plan))
  }

  function toggleShoppingItem(index: number) {
    setShoppingList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    )
  }

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        profile,
        setProfile,
        onboardingStep,
        setOnboardingStep,
        macros,
        weekPlan,
        shoppingList,
        toggleShoppingItem,
        weightLog,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
