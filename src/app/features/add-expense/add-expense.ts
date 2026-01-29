import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '../../core/services/expense.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-expense.html',
})
export class AddExpense {
  form: any;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['Food', Validators.required],
      type: ['expense', Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.expenseService.addExpense({
      id: uuidv4(),
      ...this.form.value,
    });

    this.form.reset({
      category: 'Food',
      type: 'expense',
      date: new Date(),
    });
  }
}
