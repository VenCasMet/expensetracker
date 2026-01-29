import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ExpenseService } from '../../core/services/expense.service';
import { Budget } from '../../core/models/budget.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './budget.html',
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    // form initialized AFTER fb exists
    this.form = this.fb.group({
      category: ['Food', Validators.required],
      limit: [0, [Validators.required, Validators.min(1)]],
    });

    this.expenseService.getBudgets().subscribe((data: Budget[]) => {
      this.budgets = data;
    });
  }

  save() {
    if (this.form.invalid) return;

    const budget: Budget = {
      category: this.form.value.category,
      limit: this.form.value.limit,
    };

    this.expenseService.setBudget(budget);
    this.form.reset({ category: 'Food', limit: 0 });
  }
}
