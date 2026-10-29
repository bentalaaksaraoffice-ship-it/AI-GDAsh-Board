import React, { useState, useMemo } from 'react';
import {
  FinancialTransaction,
  TransactionType,
  RevenueCategory,
  ExpenseCategory,
  UserRole,
} from '../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatDateIndo,
  exportToCSV,
} from '../utils/formatters';
import {
  Receipt,
  Search,
  Plus,
  Download,
  Printer,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart,
  Trash2,
  Pencil,
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface FinancialLedgerViewProps {
  transactions: FinancialTransaction[];
  userRole: UserRole;
  onOpenNewTransactionModal: () => void;
  onToggleVerifyTransaction: (id: string) => void;
  onEditTransaction: (trx: FinancialTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteMultipleTransactions: (ids: string[]) => void;
}

export const FinancialLedgerView: React.FC<FinancialLedgerViewProps> = ({
  transactions,
  userRole,
  onOpenNewTransactionModal,
  onToggleVerifyTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onDeleteMultipleTransactions,
}) => {
  const isAdmin = userRole === 'admin';
  const [activeSubTab, setActiveSubTab] = useState<'statement' | 'transactions'>('statement');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTrxIds, setSelectedTrxIds] = useState<string[]>([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    targetId?: string;
    isBatch?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === 'all' ? true : t.type === filterType;
      const matchCat = filterCategory === 'all' ? true : t.category === filterCategory;

      return matchSearch && matchType && matchCat;
    });
  }, [transactions, searchQuery, filterType, filterCategory]);

  // Financial calculations
  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalExpense = 0;

    const revenueByCat: Record<string, number> = {};
    const expenseByCat: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'pemasukan') {
        totalRevenue += t.amount;
        revenueByCat[t.category] = (revenueByCat[t.category] || 0) + t.amount;
      } else {
        totalExpense += t.amount;
        expenseByCat[t.category] = (expenseByCat[t.category] || 0) + t.amount;
      }
    });

    const netProfit = totalRevenue - totalExpense;
    const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

    // Direct Cost vs Operational Cost
    const directProductionCost =
      (expenseByCat['Percetakan & Kertas'] || 0) +
      (expenseByCat['Royalti Penulis'] || 0);

    const grossProfit = totalRevenue - directProductionCost;
    const operationalCost = totalExpense - directProductionCost;

    return {
      totalRevenue,
      totalExpense,
      netProfit,
      margin,
      revenueByCat,
      expenseByCat,
      directProductionCost,
      grossProfit,
      operationalCost,
    };
  }, [transactions]);

  // Bulk selection
  const handleToggleSelectAll = () => {
    if (!isAdmin) return;
    if (selectedTrxIds.length === filteredTransactions.length) {
      setSelectedTrxIds([]);
    } else {
      setSelectedTrxIds(filteredTransactions.map((t) => t.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (!isAdmin) return;
    setSelectedTrxIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = () => {
    if (deleteModal.isBatch) {
      onDeleteMultipleTransactions(selectedTrxIds);
      setSelectedTrxIds([]);
    } else if (deleteModal.targetId) {
      onDeleteTransaction(deleteModal.targetId);
      setSelectedTrxIds((prev) => prev.filter((id) => id !== deleteModal.targetId));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const data = filteredTransactions.map((t) => ({
      NoTransaksi: t.transactionNumber,
      Tanggal: t.date,
      Jenis: t.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.category,
      Deskripsi: t.description,
      Nominal: t.amount,
      MetodePembayaran: t.paymentMethod,
      StatusVerifikasi: t.verified ? 'Terverifikasi' : 'Pending',
    }));
    exportToCSV(`Laporan_Keuangan_Bentala_${new Date().toISOString().slice(0, 10)}`, data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Sistem Akuntansi & Pembukuan</span>
            <span aria-hidden="true">·</span>
            <span>Bentala Aksara Bestari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Laporan Keuangan & Transaksi Perusahaan
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Integrasi otomatis laporan laba rugi, pemantauan pengeluaran percetakan/operasional, serta hak edit transaksi bagi admin.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {isAdmin && selectedTrxIds.length > 0 && activeSubTab === 'transactions' && (
            <button
              onClick={() =>
                setDeleteModal({
                  isOpen: true,
                  title: `Hapus ${selectedTrxIds.length} Transaksi Terpilih`,
                  message: `Anda akan menghapus ${selectedTrxIds.length} catatan transaksi dari buku kas. Laporan laba rugi akan otomatis disesuaikan.`,
                  itemDetails: `${selectedTrxIds.length} baris jurnal akan dihapus permanen.`,
                  isBatch: true,
                })
              }
              className="px-3 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedTrxIds.length})</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          {isAdmin && (
            <button
              onClick={onOpenNewTransactionModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Transaksi Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Letterhead (Only visible during print) */}
      <div className="hidden print-only mb-6 border-b-2 border-neutral-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              PENERBIT BENTALA AKSARA BESTARI
            </h1>
            <p className="text-xs text-neutral-600">
              Laporan Keuangan Eksekutif & Buku Kas Perusahaan · Periode Berjalan 2026
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <div>Status: TERVERIFIKASI</div>
            <div>Mata Uang: IDR (Rupiah)</div>
          </div>
        </div>
      </div>

      {/* Executive Financial Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Total Pemasukan (Inflow)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-emerald-700">
            {formatRupiah(summary.totalRevenue)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Paket penerbitan & penjualan buku
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Total Pengeluaran (Outflow)</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-rose-600">
            {formatRupiah(summary.totalExpense)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Percetakan, honor redaksi & operasional
          </div>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Laba Bersih Perusahaan</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-emerald-800">
            {formatRupiah(summary.netProfit)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Net Profit Margin: {summary.margin}%
          </div>
        </div>

        {/* Laba Kotor */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Laba Kotor (Gross Profit)</span>
            <PieChart className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-neutral-900">
            {formatRupiah(summary.grossProfit)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Setelah HPP & royalti langsung naskah
          </div>
        </div>
      </div>

      {/* Subtab Segmented Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 no-print">
        <button
          onClick={() => setActiveSubTab('statement')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'statement'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Laporan Laba Rugi Otomatis (P&L Statement)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'transactions'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Buku Kas & Riwayat Transaksi ({transactions.length})</span>
        </button>
      </div>

      {/* Subtab 1: Laporan Laba Rugi Otomatis (Income Statement) */}
      {activeSubTab === 'statement' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Statement Table */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Laporan Laba Rugi Otomatis (Income Statement)
              </h2>
              <p className="text-xs text-neutral-500">
                Penerbit Bentala Aksara Bestari · Standar Akuntansi Keuangan Entitas Mikro (Menyesuaikan secara otomatis dengan perubahan data transaksi)
              </p>
            </div>

            <div className="space-y-6 text-xs">
              {/* SECTION 1: PENDAPATAN */}
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300 font-bold text-neutral-900 uppercase text-[11px] tracking-wide">
                  <span>1. Pendapatan Usaha Penerbitan</span>
                  <span>Nominal (IDR)</span>
                </div>
                <div className="divide-y divide-neutral-100 pt-1">
                  {Object.entries(summary.revenueByCat).map(([cat, val]) => (
                    <div key={cat} className="py-2 flex items-center justify-between pl-4">
                      <span className="text-neutral-700">{cat}</span>
                      <span className="font-mono tabular-nums text-neutral-900">
                        {formatRupiah(val)}
                      </span>
                    </div>
                  ))}
                  <div className="py-2.5 flex items-center justify-between font-bold text-emerald-800 bg-emerald-50/50 px-2 rounded">
                    <span>Total Pendapatan Usaha (A)</span>
                    <span className="font-mono tabular-nums text-sm">
                      {formatRupiah(summary.totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BIAYA POKOK PRODUKSI */}
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300 font-bold text-neutral-900 uppercase text-[11px] tracking-wide">
                  <span>2. Biaya Pokok Produksi & Hak Cipta Langsung (HPP)</span>
                  <span>Nominal (IDR)</span>
                </div>
                <div className="divide-y divide-neutral-100 pt-1">
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Percetakan & Kertas Bookpaper</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Percetakan & Kertas'] || 0)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Royalti Penulis (Hak Cipta)</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Royalti Penulis'] || 0)}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between font-bold text-neutral-900 bg-neutral-100 px-2 rounded">
                    <span>Total Beban Pokok Produksi (B)</span>
                    <span className="font-mono tabular-nums text-sm">
                      {formatRupiah(summary.directProductionCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* LABA KOTOR STRIP */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between font-bold text-neutral-900">
                <span>LABA KOTOR (A - B)</span>
                <span className="font-mono text-base tabular-nums text-emerald-800">
                  {formatRupiah(summary.grossProfit)}
                </span>
              </div>

              {/* SECTION 3: BEBAN OPERASIONAL */}
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300 font-bold text-neutral-900 uppercase text-[11px] tracking-wide">
                  <span>3. Beban Operasional & Manajemen Redaksi</span>
                  <span>Nominal (IDR)</span>
                </div>
                <div className="divide-y divide-neutral-100 pt-1">
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Honor Tim Redaksi & Editor Naskah</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Fee Editor & Layout'] || 0)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Desain Cover & Ilustrasi</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Desain Cover & Ilustrasi'] || 0)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Pemasaran Digital, Meta Ads & Promosi</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Pemasaran & Iklan'] || 0)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Sewa Kantor, Internet & Utilitas</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Operasional & Kantor'] || 0)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between pl-4">
                    <span className="text-neutral-700">Ekspedisi & Distribusi Buku Fisik</span>
                    <span className="font-mono tabular-nums text-neutral-900">
                      {formatRupiah(summary.expenseByCat['Pengiriman & Ekspedisi'] || 0)}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between font-bold text-rose-700 bg-rose-50/50 px-2 rounded">
                    <span>Total Beban Operasional (C)</span>
                    <span className="font-mono tabular-nums text-sm">
                      {formatRupiah(summary.operationalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* FINAL NET PROFIT BANNER */}
              <div className="p-4 bg-emerald-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold block">
                    LABA BERSIH PERUSAHAAN (NET PROFIT)
                  </span>
                  <span className="text-xs text-emerald-200">
                    Net Profit Margin: {summary.margin}% dari total omset
                  </span>
                </div>
                <span className="font-mono text-2xl font-extrabold tabular-nums text-emerald-300">
                  {formatRupiah(summary.netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Breakdown & Quick Analytics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Visual Expense Share */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Struktur Komposisi Pengeluaran
              </h3>
              <div className="space-y-3">
                {Object.entries(summary.expenseByCat).map(([cat, val]) => {
                  const pct = summary.totalExpense > 0 ? (val / summary.totalExpense) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-700 truncate">{cat}</span>
                        <span className="font-mono font-medium text-neutral-900 tabular-nums">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rekening & Kas Bank */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">
                Akun Kas & Bank Penerbit
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 block">BCA Bisnis (Utama)</span>
                    <span className="text-neutral-500 font-mono text-[11px]">883-092-1188</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    Aktif
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 block">Mandiri Giro Operasional</span>
                    <span className="text-neutral-500 font-mono text-[11px]">137-00-9821034-1</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    Aktif
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 block">Kas Tunai Redaksi</span>
                    <span className="text-neutral-500 text-[11px]">Petty Cash Kantor</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-700">
                    Rp 3.500.000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Daftar Transaksi / Buku Kas */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. transaksi, deskripsi, vendor, akun..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-700"
              >
                <option value="all">Semua Jenis (In / Out)</option>
                <option value="pemasukan">Pemasukan Saja</option>
                <option value="pengeluaran">Pengeluaran Saja</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-700"
              >
                <option value="all">Semua Kategori</option>
                <option value="Pemesanan Paket Penerbitan">Pemesanan Paket Penerbitan</option>
                <option value="Penjualan Buku Fisik">Penjualan Buku Fisik</option>
                <option value="Penjualan E-Book">Penjualan E-Book</option>
                <option value="Percetakan & Kertas">Percetakan & Kertas</option>
                <option value="Fee Editor & Layout">Fee Editor & Layout</option>
                <option value="Desain Cover & Ilustrasi">Desain Cover & Ilustrasi</option>
                <option value="Royalti Penulis">Royalti Penulis</option>
                <option value="Pemasaran & Iklan">Pemasaran & Iklan</option>
                <option value="Operasional & Kantor">Operasional & Kantor</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    {isAdmin && (
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredTransactions.length > 0 &&
                            selectedTrxIds.length === filteredTransactions.length
                          }
                          onChange={handleToggleSelectAll}
                          className="rounded border-neutral-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer"
                          title="Pilih semua baris"
                        />
                      </th>
                    )}
                    <th className="py-3 px-4">No. Transaksi & Tanggal</th>
                    <th className="py-3 px-4">Deskripsi Transaksi</th>
                    <th className="py-3 px-4">Kategori Akuntansi</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4 text-right">Nominal (IDR)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7} className="py-12 text-center text-neutral-500">
                        Tidak ada catatan transaksi yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((trx) => {
                      const isIncome = trx.type === 'pemasukan';
                      const isChecked = selectedTrxIds.includes(trx.id);

                      return (
                        <tr
                          key={trx.id}
                          className={`hover:bg-neutral-50/80 transition-colors ${
                            isChecked ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          {isAdmin && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectRow(trx.id)}
                                className="rounded border-neutral-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer"
                              />
                            </td>
                          )}

                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-neutral-900">
                              {trx.transactionNumber}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {formatDateIndo(trx.date)}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="font-semibold text-neutral-900 leading-snug">
                              {trx.description}
                            </div>
                            {trx.referenceId && (
                              <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                Ref: {trx.referenceId}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                isIncome
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {trx.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-neutral-600 font-medium">
                            {trx.paymentMethod}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                            <span
                              className={
                                isIncome ? 'text-emerald-700' : 'text-rose-600'
                              }
                            >
                              {isIncome ? '+' : '-'} {formatRupiah(trx.amount)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {isAdmin ? (
                              <button
                                onClick={() => onToggleVerifyTransaction(trx.id)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                  trx.verified
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                }`}
                                title="Klik untuk mengubah verifikasi"
                              >
                                {trx.verified ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Valid</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Pending</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-neutral-600">
                                {trx.verified ? 'Valid' : 'Pending'}
                              </span>
                            )}
                          </td>

                          {isAdmin && (
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onEditTransaction(trx)}
                                  className="p-1 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                  title="Edit catatan transaksi"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      title: 'Hapus Catatan Transaksi',
                                      message: `Apakah Anda yakin ingin menghapus catatan transaksi ${trx.transactionNumber} (${trx.description})?`,
                                      itemDetails: `Transaksi: ${trx.transactionNumber} - Nominal: ${formatRupiah(trx.amount)}`,
                                      targetId: trx.id,
                                    })
                                  }
                                  className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Hapus transaksi (Admin)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        itemDetails={deleteModal.itemDetails}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
