export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Rent' | 'Travel' | 'Shopping' | 'Other';
  date: Date;
  type: 'income' | 'expense' | 'reimbursement';
}
