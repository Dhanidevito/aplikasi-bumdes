import React, { useState, useRef } from 'react';
import { Transaction } from '../types';
import { exportTransactionsToExcel, downloadTemplate, parseExcelFile } from '../utils/excel';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface DataManagementProps {
  transactions: Transaction[];
  onImportTransactions: (newTransactions: Omit<Transaction, 'id' | 'timestamp'>[]) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ transactions, onImportTransactions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      exportTransactionsToExcel(transactions);
      setMessage({ type: 'success', text: 'Data berhasil diekspor ke Excel!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengekspor data.' });
    }
  };

  const handleDownloadTemplate = () => {
    try {
      downloadTemplate();
      setMessage({ type: 'success', text: 'Template berhasil diunduh!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengunduh template.' });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const parsedData = await parseExcelFile(file);
      
      if (parsedData.length === 0) {
        throw new Error("Tidak ada data valid yang ditemukan dalam file.");
      }

      onImportTransactions(parsedData);
      setMessage({ type: 'success', text: `Berhasil mengimpor ${parsedData.length} transaksi!` });
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Gagal membaca file. Pastikan format sesuai template.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Data</h2>
        <p className="text-slate-500">Ekspor laporan, unduh template, atau impor transaksi dari Excel.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Download className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Ekspor Data</h3>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Unduh semua data transaksi dan laporan saat ini ke dalam format Excel (.xlsx).
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2 px-4 bg-white border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Download Laporan
          </button>
        </div>

        {/* Template Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Template Excel</h3>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Unduh template kosong untuk mengisi data transaksi secara massal sebelum diimpor.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="w-full py-2 px-4 bg-white border border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Download Template
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-600">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Impor Data</h3>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Upload file Excel (.xlsx) yang sudah diisi untuk memasukkan banyak transaksi sekaligus.
          </p>
          
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="excel-upload"
            disabled={isLoading}
          />
          <label
            htmlFor="excel-upload"
            className={`w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? 'Memproses...' : 'Pilih File Excel'}
          </label>
        </div>
      </div>

      <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-slate-500" />
          Catatan Penting
        </h4>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
          <li>Gunakan fitur <strong>Download Template</strong> untuk memastikan format kolom sesuai.</li>
          <li>Pastikan <strong>ID Akun</strong> sesuai dengan Daftar Akun yang tersedia di sistem.</li>
          <li>Kolom <strong>Tipe</strong> hanya boleh diisi dengan "debit" atau "credit".</li>
          <li>Format tanggal sebaiknya <strong>YYYY-MM-DD</strong> (Contoh: 2024-01-30).</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManagement;