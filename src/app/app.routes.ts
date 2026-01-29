import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { AddExpense } from './features/add-expense/add-expense';
import { ExpenseListComponent } from './features/expense-list/expense-list.component';
import { BudgetComponent } from './features/budget/budget';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'add', component: AddExpense },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'budget', component: BudgetComponent },
];
