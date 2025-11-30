export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type AccountCategory = 
  | 'current_asset' 
  | 'fixed_asset' 
  | 'current_liability' 
  | 'long_term_liability' 
  | 'capital' 
  | 'operating_revenue' 
  | 'operating_expense';

export type TransactionType = 'debit' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
}

export interface Transaction {
  id: number;
  date: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: number;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  category: AccountCategory;
  debit: number;
  credit: number;
  balance: number;
}

export interface FinancialReport {
  assets: AccountBalance[];
  liabilities: AccountBalance[];
  equity: AccountBalance[];
  revenue: AccountBalance[];
  expenses: AccountBalance[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}