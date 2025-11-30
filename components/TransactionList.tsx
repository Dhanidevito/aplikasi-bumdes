import React from 'react';
import { Transaction } from '../types';
import { CHART_OF_ACCOUNTS } from '../constants';
import { formatCurrency } from '../utils/accounting';
import { Search } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const getAccountName = (id: string) => {
    return CHART_OF_ACCOUNTS.find(a => a.id === id)?.name || 'Unknown Account';
  };

  // Sort by date descending (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredTransactions = sortedTransactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAccountName(t.accountId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Jurnal Umum</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari transaksi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Akun</th>
              <th className="px-6 py-4 font-semibold">Keterangan</th>
              <th className="px-6 py-4 font-semibold text-right">Debit</th>
              <th className="px-6 py-4 font-semibold text-right">Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <span className="inline-block px-2 py-1 rounded bg-slate-100 text-xs text-slate-600 mr-2 border border-slate-200">
                      {t.accountId}
                    </span>
                    {getAccountName(t.accountId)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{t.description}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    {t.type === 'debit' ? formatCurrency(t.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-red-600">
                    {t.type === 'credit' ? formatCurrency(t.amount) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Tidak ada transaksi yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;