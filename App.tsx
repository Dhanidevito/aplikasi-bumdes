import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType } from './types';
import { SAMPLE_TRANSACTIONS } from './constants';
import { generateReport } from './utils/accounting';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import DataManagement from './components/DataManagement';
import { Menu } from 'lucide-react';
import { CHART_OF_ACCOUNTS } from './constants';

const App: React.FC = () => {
  // State initialization with localStorage check
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('financify_transactions');
    return saved ? JSON.parse(saved) : [...SAMPLE_TRANSACTIONS];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('financify_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Derived state for reports
  const report = useMemo(() => generateReport(transactions), [transactions]);

  const handleAddTransaction = (
    date: string, 
    accountId: string, 
    type: TransactionType, 
    amount: number, 
    description: string
  ) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1, // Simple auto-increment
      date,
      accountId,
      type,
      amount,
      description,
      timestamp: Date.now()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleImportTransactions = (newItems: Omit<Transaction, 'id' | 'timestamp'>[]) => {
    // Determine start ID
    const maxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) : 0;
    
    const importedTransactions: Transaction[] = newItems.map((item, index) => ({
      ...item,
      id: maxId + index + 1,
      timestamp: Date.now()
    }));

    setTransactions(prev => [...prev, ...importedTransactions]);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center md:hidden z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-3 text-lg font-bold text-slate-800">Financify</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard report={report} />}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                 <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Input Transaksi</h2>
                  <p className="text-slate-500">Tambahkan catatan keuangan baru ke dalam sistem.</p>
                </div>
                <TransactionForm onAddTransaction={handleAddTransaction} />
              </div>
            )}
            
            {activeTab === 'journal' && <TransactionList transactions={transactions} />}
            
            {activeTab === 'report' && <Reports report={report} />}

            {activeTab === 'data' && (
              <DataManagement 
                transactions={transactions} 
                onImportTransactions={handleImportTransactions} 
              />
            )}

            {activeTab === 'accounts' && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Daftar Akun (Chart of Accounts)</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-600">ID</th>
                          <th className="px-6 py-4 font-semibold text-slate-600">Nama Akun</th>
                          <th className="px-6 py-4 font-semibold text-slate-600">Tipe</th>
                          <th className="px-6 py-4 font-semibold text-slate-600">Kategori</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {CHART_OF_ACCOUNTS.map((acc) => (
                          <tr key={acc.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium text-slate-700">{acc.id}</td>
                            <td className="px-6 py-3 text-slate-700 font-bold">{acc.name}</td>
                            <td className="px-6 py-3 text-slate-500 capitalize">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                acc.type === 'asset' ? 'bg-green-100 text-green-700' :
                                acc.type === 'liability' ? 'bg-orange-100 text-orange-700' :
                                acc.type === 'equity' ? 'bg-purple-100 text-purple-700' :
                                acc.type === 'revenue' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {acc.type}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-slate-500 capitalize">{acc.category.replace('_', ' ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;