import React, { useState } from 'react';
import { FinancialReport } from '../types';
import { formatCurrency } from '../utils/accounting';

interface ReportsProps {
  report: FinancialReport;
}

const Reports: React.FC<ReportsProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'neraca' | 'labarugi'>('neraca');

  const ReportRow = ({ label, value, isTotal = false, indent = false }: { label: string, value: number, isTotal?: boolean, indent?: boolean }) => (
    <div className={`flex justify-between items-center py-3 border-b border-slate-50 hover:bg-slate-50 px-2 rounded transition-colors ${isTotal ? 'font-bold bg-slate-50' : ''}`}>
      <span className={`${indent ? 'pl-6 text-slate-500' : 'text-slate-700'}`}>{label}</span>
      <span className={`${isTotal ? 'text-slate-900' : 'text-slate-600'}`}>{formatCurrency(value)}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('neraca')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'neraca' 
              ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Neraca (Balance Sheet)
        </button>
        <button
          onClick={() => setActiveTab('labarugi')}
          className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'labarugi' 
              ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Laba Rugi (Income Statement)
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'neraca' && (
          <div className="space-y-8 animate-fadeIn">
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Laporan Posisi Keuangan</h3>
                <p className="text-sm text-slate-500">Per {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Assets Side */}
              <div>
                <h4 className="text-lg font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-100">ASET</h4>
                <div className="space-y-1">
                  {report.assets.map(acc => (
                    acc.balance !== 0 && <ReportRow key={acc.accountId} label={acc.accountName} value={acc.balance} indent />
                  ))}
                  <div className="pt-4">
                    <ReportRow label="TOTAL ASET" value={report.totalAssets} isTotal />
                  </div>
                </div>
              </div>

              {/* Liabilities & Equity Side */}
              <div>
                <h4 className="text-lg font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-100">KEWAJIBAN & EKUITAS</h4>
                
                <div className="mb-6">
                  <h5 className="font-semibold text-slate-700 mb-2">Kewajiban</h5>
                  <div className="space-y-1">
                    {report.liabilities.map(acc => (
                      acc.balance !== 0 && <ReportRow key={acc.accountId} label={acc.accountName} value={acc.balance} indent />
                    ))}
                    {report.liabilities.every(acc => acc.balance === 0) && <p className="text-sm text-slate-400 pl-6 py-2 italic">Tidak ada kewajiban</p>}
                    <ReportRow label="Total Kewajiban" value={report.totalLiabilities} isTotal />
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-700 mb-2">Ekuitas</h5>
                  <div className="space-y-1">
                    {report.equity.map(acc => (
                      acc.balance !== 0 && <ReportRow key={acc.accountId} label={acc.accountName} value={acc.balance} indent />
                    ))}
                    {/* Add Net Income to Equity for balancing */}
                    <ReportRow label="Laba Tahun Berjalan" value={report.netIncome} indent />
                    
                    <div className="pt-4">
                      <ReportRow label="Total Ekuitas" value={report.totalEquity + report.netIncome} isTotal />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-slate-200">
                  <ReportRow label="TOTAL KEWAJIBAN & EKUITAS" value={report.totalLiabilities + report.totalEquity + report.netIncome} isTotal />
                </div>
              </div>
            </div>

            {/* Balance Check */}
            <div className={`mt-8 p-4 rounded-lg text-center text-sm font-medium ${
              Math.abs(report.totalAssets - (report.totalLiabilities + report.totalEquity + report.netIncome)) < 1 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }`}>
              {Math.abs(report.totalAssets - (report.totalLiabilities + report.totalEquity + report.netIncome)) < 1 
                ? "✓ Neraca Seimbang (Balance)" 
                : "⚠ Neraca Tidak Seimbang"}
            </div>
          </div>
        )}

        {activeTab === 'labarugi' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Laporan Laba Rugi</h3>
                <p className="text-sm text-slate-500">Periode Berjalan</p>
             </div>

            <div>
              <h4 className="text-lg font-bold text-emerald-700 mb-4 pb-2 border-b border-slate-200">PENDAPATAN</h4>
              <div className="space-y-1">
                {report.revenue.map(acc => (
                   acc.balance !== 0 && <ReportRow key={acc.accountId} label={acc.accountName} value={acc.balance} indent />
                ))}
                {report.revenue.every(acc => acc.balance === 0) && <p className="text-sm text-slate-400 pl-6 py-2 italic">Belum ada pendapatan</p>}
                <div className="pt-2">
                  <ReportRow label="Total Pendapatan" value={report.totalRevenue} isTotal />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-red-700 mb-4 pb-2 border-b border-slate-200">BEBAN OPERASIONAL</h4>
              <div className="space-y-1">
                {report.expenses.map(acc => (
                   acc.balance !== 0 && <ReportRow key={acc.accountId} label={acc.accountName} value={acc.balance} indent />
                ))}
                 {report.expenses.every(acc => acc.balance === 0) && <p className="text-sm text-slate-400 pl-6 py-2 italic">Belum ada beban</p>}
                <div className="pt-2">
                  <ReportRow label="Total Beban" value={report.totalExpenses} isTotal />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-slate-800">
               <div className="flex justify-between items-center py-4 px-4 bg-slate-900 text-white rounded-lg shadow-lg">
                  <span className="font-bold text-lg">LABA BERSIH (NET INCOME)</span>
                  <span className={`font-bold text-xl ${report.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(report.netIncome)}
                  </span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;