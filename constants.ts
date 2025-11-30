import { Account } from './types';

export const CHART_OF_ACCOUNTS: Account[] = [
  { id: '1', name: 'Kas', type: 'asset', category: 'current_asset' },
  { id: '2', name: 'Bank', type: 'asset', category: 'current_asset' },
  { id: '3', name: 'Piutang Usaha', type: 'asset', category: 'current_asset' },
  { id: '4', name: 'Persediaan', type: 'asset', category: 'current_asset' },
  { id: '5', name: 'Peralatan', type: 'asset', category: 'fixed_asset' },
  { id: '6', name: 'Hutang Usaha', type: 'liability', category: 'current_liability' },
  { id: '7', name: 'Hutang Bank', type: 'liability', category: 'long_term_liability' },
  { id: '8', name: 'Modal Pemilik', type: 'equity', category: 'capital' },
  { id: '9', name: 'Pendapatan Usaha', type: 'revenue', category: 'operating_revenue' },
  { id: '10', name: 'Beban Gaji', type: 'expense', category: 'operating_expense' },
  { id: '11', name: 'Beban Sewa', type: 'expense', category: 'operating_expense' },
  { id: '12', name: 'Beban Listrik', type: 'expense', category: 'operating_expense' }
];

export const SAMPLE_TRANSACTIONS = [
  { id: 1, date: '2024-01-01', accountId: '8', type: 'credit', amount: 50000000, description: 'Setoran modal awal', timestamp: Date.now() },
  { id: 2, date: '2024-01-02', accountId: '5', type: 'debit', amount: 15000000, description: 'Beli peralatan kantor', timestamp: Date.now() },
  { id: 3, date: '2024-01-05', accountId: '9', type: 'credit', amount: 25000000, description: 'Penjualan produk', timestamp: Date.now() },
  { id: 4, date: '2024-01-10', accountId: '10', type: 'debit', amount: 8000000, description: 'Gaji karyawan', timestamp: Date.now() },
  { id: 5, date: '2024-01-15', accountId: '11', type: 'debit', amount: 5000000, description: 'Beban sewa kantor', timestamp: Date.now() },
  { id: 6, date: '2024-01-20', accountId: '9', type: 'credit', amount: 15000000, description: 'Penjualan jasa', timestamp: Date.now() },
  { id: 7, date: '2024-01-25', accountId: '12', type: 'debit', amount: 1200000, description: 'Beban listrik', timestamp: Date.now() },
] as const;