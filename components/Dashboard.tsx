import React from 'react';
import { FinancialReport } from '../types';
import { formatCurrency } from '../utils/accounting';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  report: FinancialReport;
}

const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const chartData = [
    { name: 'Pendapatan', value: report.totalRevenue, color: '#10b981' },
    { name: 'Beban', value: report.totalExpenses, color: '#ef4444' },
    { name: 'Laba Bersih', value: report.netIncome, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Aset</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(report.totalAssets)}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-xs text-slate-400">Total kekayaan perusahaan</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Pendapatan</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(report.totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-xs text-slate-400">Pemasukan operasional</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Beban</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(report.totalExpenses)}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-xs text-slate-400">Pengeluaran operasional</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Laba Bersih</p>
              <h3 className={`text-2xl font-bold mt-1 ${report.netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(report.netIncome)}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-xs text-slate-400">Revenue - Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Analisa Performa</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b' }} 
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;