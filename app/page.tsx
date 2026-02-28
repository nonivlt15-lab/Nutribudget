"use client";

import { useState } from "react";

type Entry = {
  id: number;
  label: string;
  amount: number;
  calories: number;
};

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [calories, setCalories] = useState("");

  const totalSpent = entries.reduce((sum, e) => sum + e.amount, 0);
  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);

  const budgetLimit = 300;
  const calorieLimit = 2200;

  const spendProgress = Math.min((totalSpent / budgetLimit) * 100, 100);
  const calorieProgress = Math.min((totalCalories / calorieLimit) * 100, 100);

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!label || !amount || !calories) return;

    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        label,
        amount: Number(amount),
        calories: Number(calories),
      },
    ]);
    setLabel("");
    setAmount("");
    setCalories("");
  }

  function removeEntry(id: number) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="p-4 border-b border-sidebar-border">
          <div className="inline-flex items-center gap-2 rounded-lg bg-sidebar-primary/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-medium tracking-tight">
              Nutribudget
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Balance your wallet and your plate.
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <button className="w-full flex items-center justify-between rounded-md px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
            Overview
            <span className="text-[10px] rounded-full bg-sidebar-primary/20 px-2 py-0.5">
              Today
            </span>
          </button>
          <button className="w-full flex items-center justify-between rounded-md px-3 py-2 hover:bg-sidebar-accent/50 transition-colors">
            History
          </button>
          <button className="w-full flex items-center justify-between rounded-md px-3 py-2 hover:bg-sidebar-accent/50 transition-colors">
            Goals
          </button>
          <button className="w-full flex items-center justify-between rounded-md px-3 py-2 hover:bg-sidebar-accent/50 transition-colors">
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>Tip: keep daily spend and calories under your targets.</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 space-y-6 page-enter page-enter-active">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Today&apos;s snapshot
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your spending and calories in one place.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_12px_theme(colors.success)]" />
            Sync with devices
          </button>
        </header>

        {/* Top cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Money spent
            </p>
            <p className="mt-2 text-2xl font-semibold">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Daily budget ${budgetLimit.toFixed(0)}
            </p>
            <ProgressBar value={spendProgress} colorClass="bg-chart-1" />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Calories
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalCalories.toFixed(0)} kcal
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Target {calorieLimit} kcal
            </p>
            <ProgressBar value={calorieProgress} colorClass="bg-chart-3" />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-center">
            <ProgressRing value={calorieProgress} />
          </div>
        </section>

        {/* Form + list */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
          <form
            onSubmit={addEntry}
            className="rounded-xl border border-border bg-card p-4 space-y-4"
          >
            <h2 className="text-sm font-medium">Add entry</h2>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Label (meal or purchase)
              </label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Lunch, groceries, coffee..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save entry
            </button>
          </form>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-sm font-medium">Today&apos;s overview</h2>
            {entries.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No entries yet. Add your first meal or expense on the left.
              </p>
            ) : (
              <ul className="space-y-2 max-h-[260px] overflow-y-auto">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-[13px]">{e.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {e.calories.toFixed(0)} kcal
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-chart-1">
                        ${e.amount.toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeEntry(e.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove entry"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgressBar({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) {
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-28 w-28">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-muted"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ strokeDasharray: circumference }}
        />
        <circle
          className="text-chart-2 animate-[progress-ring_1.2s_ease-out_forwards]"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Calories</p>
          <p className="text-lg font-semibold">{Math.round(value)}%</p>
        </div>
      </div>
    </div>
  );
}
