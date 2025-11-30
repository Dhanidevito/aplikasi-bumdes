import React, { useState } from 'react';
import { CHART_OF_ACCOUNTS } from '../constants';
import { TransactionType } from '../types';
import { Plus, Save } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (
    date: string, 
    accountId: string, 
    type: TransactionType, 
    amount: number, 
    description: string
  ) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState<TransactionType>('debit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !amount || !description) return;

    onAddTransaction(date, accountId, type, parseFloat(amount), description);
    
    // Reset form
    setAmount('');
    setDescription('');
    setAccountId('');
    setNotification('Transaksi berhasil disimpan!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Input Transaksi Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">Catat transaksi kas, bank, atau jurnal penyesuaian.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {notification && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center animate-pulse">
              ✓ {notification}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Transaksi</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('debit')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                    type === 'debit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Debit (Masuk)
                </button>
                <button
                  type="button"
                  onClick={() => setType('credit')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                    type === 'credit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Kredit (Keluar)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Akun</label>
            <select
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="">Pilih Akun...</option>
              {CHART_OF_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.id} - {acc.name} ({acc.type.toUpperCase().replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 font-medium">Rp</span>
              <input
                type="number"
                required
                min="0"
                step="1000"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Keterangan</label>
            <textarea
              required
              rows={3}
              placeholder="Contoh: Pembayaran listrik bulan Januari"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;