import * as XLSX from 'xlsx';
import { Transaction } from '../types';
import { CHART_OF_ACCOUNTS } from '../constants';

// Helper to get current date string for filenames
const getDateString = () => new Date().toISOString().split('T')[0];

export const exportTransactionsToExcel = (transactions: Transaction[]) => {
  // 1. Prepare Transaction Data
  const transactionData = transactions.map(t => ({
    ID: t.id,
    Tanggal: t.date,
    'ID Akun': t.accountId,
    'Nama Akun': CHART_OF_ACCOUNTS.find(c => c.id === t.accountId)?.name || 'Unknown',
    Tipe: t.type,
    Jumlah: t.amount,
    Keterangan: t.description
  }));

  // 2. Prepare Chart of Accounts Data (for reference)
  const coaData = CHART_OF_ACCOUNTS.map(c => ({
    'ID Akun': c.id,
    'Nama Akun': c.name,
    'Tipe': c.type,
    'Kategori': c.category
  }));

  // 3. Create Workbook
  const wb = XLSX.utils.book_new();

  // 4. Create Sheets
  const wsTransactions = XLSX.utils.json_to_sheet(transactionData);
  const wsCOA = XLSX.utils.json_to_sheet(coaData);

  // 5. Append Sheets
  XLSX.utils.book_append_sheet(wb, wsTransactions, "Transaksi");
  XLSX.utils.book_append_sheet(wb, wsCOA, "Daftar Akun");

  // 6. Download
  XLSX.writeFile(wb, `Laporan_Keuangan_Financify_${getDateString()}.xlsx`);
};

export const downloadTemplate = () => {
  // Create a template with sample structure but empty data
  const templateData = [
    {
      Tanggal: getDateString(),
      'ID Akun': '1',
      Tipe: 'debit',
      Jumlah: 1000000,
      Keterangan: 'Contoh Transaksi (Hapus baris ini)'
    }
  ];

  // COA Reference for user convenience
  const coaData = CHART_OF_ACCOUNTS.map(c => ({
    'ID Akun': c.id,
    'Nama Akun': c.name,
    'Tipe': c.type
  }));

  const wb = XLSX.utils.book_new();
  const wsTemplate = XLSX.utils.json_to_sheet(templateData);
  const wsCOA = XLSX.utils.json_to_sheet(coaData);

  // Set column widths for better readability
  wsTemplate['!cols'] = [
    { wch: 15 }, // Tanggal
    { wch: 10 }, // ID Akun
    { wch: 10 }, // Tipe
    { wch: 15 }, // Jumlah
    { wch: 40 }  // Keterangan
  ];

  XLSX.utils.book_append_sheet(wb, wsTemplate, "Template_Transaksi");
  XLSX.utils.book_append_sheet(wb, wsCOA, "Referensi_Akun");

  XLSX.writeFile(wb, "Template_Import_Financify.xlsx");
};

export const parseExcelFile = (file: File): Promise<Omit<Transaction, 'id' | 'timestamp'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assume first sheet is the one we want
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform and Validate
        const parsedTransactions = jsonData.map((row: any) => {
          // Map Indonesian headers to English keys
          const date = row['Tanggal'] || row['date'];
          const accountId = String(row['ID Akun'] || row['accountId']);
          const type = (row['Tipe'] || row['type'] || '').toLowerCase();
          const amount = Number(row['Jumlah'] || row['amount']);
          const description = row['Keterangan'] || row['description'];

          // Basic validation
          if (!date || !accountId || !amount || !description) return null;
          if (type !== 'debit' && type !== 'credit') return null;

          return {
            date,
            accountId,
            type: type as 'debit' | 'credit',
            amount,
            description
          };
        }).filter((t): t is Omit<Transaction, 'id' | 'timestamp'> => t !== null);

        resolve(parsedTransactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};