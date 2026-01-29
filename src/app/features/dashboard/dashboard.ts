import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/expense.model';
import { Budget } from '../../core/models/budget.model';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, AfterViewInit {
  // ===== Platform safety =====
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // ===== THE FIX FLAGS =====
  private dataLoaded = false;
  private viewReady = false;

  // ===== Theme =====
  darkMode = false;

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    }
  }

  // ===== Totals =====
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  expenses: Expense[] = [];
  budgets: Budget[] = [];

  budgetStatus: {
    category: Expense['category'];
    spent: number;
    limit: number;
    percent: number;
    nearLimit: boolean;
    exceeded: boolean;
  }[] = [];

  // ===== Charts =====
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  private pieChart?: Chart;
  private barChart?: Chart;

  constructor(
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar
  ) {}

  // ================= INIT =================
  ngOnInit() {
    if (this.isBrowser) {
      this.darkMode = localStorage.getItem('theme') === 'dark';
    }

    // ✅ Load expenses
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses.map(e => ({
        ...e,
        date: new Date(e.date),
      }));

      this.calculateTotals();
      this.dataLoaded = true;
      this.tryRenderCharts();
    });

    // ✅ Load budgets
    this.expenseService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
      this.updateBudgetStatus();
    });
  }

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryRenderCharts();
  }

  // ================= SAFE CHART TRIGGER =================
  private tryRenderCharts() {
    if (!this.isBrowser) return;
    if (!this.dataLoaded) return;
    if (!this.viewReady) return;

    this.renderCharts();
  }

  // ================= TOTALS =================
  calculateTotals() {
    this.totalIncome = this.expenses
      .filter(e => e.type === 'income')
      .reduce((s, e) => s + e.amount, 0);

    this.totalExpense = this.expenses
      .filter(e => e.type === 'expense')
      .reduce((s, e) => s + e.amount, 0);

    this.balance = this.totalIncome - this.totalExpense;
  }

  // ================= BUDGET STATUS + ALERTS =================
  updateBudgetStatus() {
    if (!this.isBrowser) return;

    const shown: Record<string, boolean> =
      JSON.parse(localStorage.getItem('alerts') || '{}');

    this.budgetStatus = this.budgets.map(b => {
      const spent = this.expenses
        .filter(e => e.type === 'expense' && e.category === b.category)
        .reduce((s, e) => s + e.amount, 0);

      const percent = (spent / b.limit) * 100;
      const nearLimit = percent >= 80 && percent < 100;
      const exceeded = percent >= 100;

      if (!shown[b.category]) {
        if (exceeded) {
          this.snackBar.open(`🚨 ${b.category} budget exceeded`, 'OK', {
            duration: 4000,
          });
          shown[b.category] = true;
        } else if (nearLimit) {
          this.snackBar.open(`⚠️ ${b.category} budget almost full`, 'OK', {
            duration: 3000,
          });
          shown[b.category] = true;
        }
      }

      localStorage.setItem('alerts', JSON.stringify(shown));

      return {
        category: b.category,
        spent,
        limit: b.limit,
        percent: Math.min(percent, 100),
        nearLimit,
        exceeded,
      };
    });
  }

  // ================= CHARTS =================
  renderCharts() {
    if (!this.pieCanvas || !this.barCanvas) return;

    this.renderPieChart();
    this.renderBarChart();
  }

  renderPieChart() {
    this.pieChart?.destroy();

    const totals: Record<string, number> = {};
    this.expenses
      .filter(e => e.type === 'expense')
      .forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      });

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Object.keys(totals),
        datasets: [{ data: Object.values(totals) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  renderBarChart() {
    this.barChart?.destroy();

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [
          {
            label: 'Amount',
            data: [this.totalIncome, this.totalExpense],
            backgroundColor: ['#66bb6a', '#ef5350'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  }
}
