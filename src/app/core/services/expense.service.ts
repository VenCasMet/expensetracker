import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Expense } from '../models/expense.model';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  // SSR safety
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // ===== STATE =====
  private expenses$ = new BehaviorSubject<Expense[]>([]);
  private budgets$ = new BehaviorSubject<Budget[]>([]);

  constructor() {
    if (this.isBrowser) {
      const storedExpenses = localStorage.getItem('expenses');
      this.expenses$.next(storedExpenses ? JSON.parse(storedExpenses) : []);

      const storedBudgets = localStorage.getItem('budgets');
      this.budgets$.next(storedBudgets ? JSON.parse(storedBudgets) : []);
    }
  }

  // =========================
  // EXPENSE METHODS
  // =========================

  getExpenses() {
    return this.expenses$.asObservable();
  }

  addExpense(expense: Expense) {
    const updated = [...this.expenses$.value, expense];
    this.expenses$.next(updated);

    if (this.isBrowser) {
      localStorage.setItem('expenses', JSON.stringify(updated));
    }
  }

  deleteExpense(id: string) {
    const updated = this.expenses$.value.filter(e => e.id !== id);
    this.expenses$.next(updated);

    if (this.isBrowser) {
      localStorage.setItem('expenses', JSON.stringify(updated));
    }
  }

  // =========================
  // BUDGET METHODS
  // =========================

  getBudgets() {
    return this.budgets$.asObservable();
  }

  setBudget(budget: Budget) {
    const filtered = this.budgets$.value.filter(
      b => b.category !== budget.category
    );

    const updated = [...filtered, budget];
    this.budgets$.next(updated);

    if (this.isBrowser) {
      localStorage.setItem('budgets', JSON.stringify(updated));
    }
  }

  // =========================
  // BUDGET ANALYTICS / WARNINGS
  // =========================

getNetSpentByCategory(category: Expense['category']): number {
  const expenses = this.expenses$.value
    .filter(e => e.category === category);

  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  return totalExpense - totalIncome;
}



  getBudgetStatus(category: Expense['category']) {
  const budget = this.budgets$.value.find(b => b.category === category);
  if (!budget) return null;

  const spent = this.getNetSpentByCategory(category);
  const percent = (spent / budget.limit) * 100;

  return {
    category,
    spent,
    limit: budget.limit,
    percent,
    nearLimit: percent >= 80 && percent < 100,
    exceeded: percent >= 100,
  };
}

}
