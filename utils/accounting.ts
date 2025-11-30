import { Transaction, AccountBalance, FinancialReport } from '../types';
import { CHART_OF_ACCOUNTS } from '../constants';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateBalances = (transactions: Transaction[]): AccountBalance[] => {
  return CHART_OF_ACCOUNTS.map(account => {
    let debit = 0;
    let credit = 0;

    transactions.filter(t => t.accountId === account.id).forEach(t => {
      if (t.type === 'debit') debit += t.amount;
      else credit += t.amount;
    });

    let balance = 0;
    // Basic Accounting Equation Logic
    if (account.type === 'asset' || account.type === 'expense') {
      balance = debit - credit;
    } else {
      balance = credit - debit;
    }

    return {
      accountId: account.id,
      accountName: account.name,
      accountType: account.type,
      category: account.category,
      debit,
      credit,
      balance
    };
  });
};

export const generateReport = (transactions: Transaction[]): FinancialReport => {
  const balances = calculateBalances(transactions);

  const assets = balances.filter(b => b.accountType === 'asset');
  const liabilities = balances.filter(b => b.accountType === 'liability');
  const equity = balances.filter(b => b.accountType === 'equity');
  const revenue = balances.filter(b => b.accountType === 'revenue');
  const expenses = balances.filter(b => b.accountType === 'expense');

  const totalAssets = assets.reduce((sum, b) => sum + b.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, b) => sum + b.balance, 0);
  const totalEquity = equity.reduce((sum, b) => sum + b.balance, 0);
  const totalRevenue = revenue.reduce((sum, b) => sum + b.balance, 0);
  const totalExpenses = expenses.reduce((sum, b) => sum + b.balance, 0);

  return {
    assets,
    liabilities,
    equity,
    revenue,
    expenses,
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses
  };
};