import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.getExpenses().subscribe((data: Expense[]) => {
      this.expenses = data;
    });
  }

  delete(id: string) {
    this.expenseService.deleteExpense(id);
  }
}
