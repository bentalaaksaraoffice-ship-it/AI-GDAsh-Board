import React, { useState } from 'react';
import {
  Author,
  Book,
  BookSale,
  FinancialTransaction,
  Lead,
  PublishingOrder,
} from '../types';
import {
  ShieldAlert,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  FileSpreadsheet,
  Users,
  BookOpen,
  ShoppingBag,
  Receipt,
  CheckCircle2,
  Database,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminDataManagementViewProps {
  leads: Lead[];
  books: Book[];
  authors: Author[];
  orders: PublishingOrder[];
  sales: BookSale[];
  transactions: FinancialTransaction[];
  onClearCategory: (category: 'leads' | 'books' | 'authors' | 'orders' | 'sales' | 'transactions' | 'all') => void;
  onRestoreDefaults: () => void;
  onImportBackupData: (importedData: any) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (newPass: string) => void;
}

export const AdminDataManagementView: React.FC<AdminDataManagementViewProps> = ({
  leads,
  books,
  authors,
  orders,
  sales,
  transactions,
  onClearCategory,
  onRestoreDefaults,
  onImportBackupData,
  adminPassword = 'bentala2025',
  onUpdateAdminPassword,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    confirmLabel?: string;
    category?: 'leads' | 'books' | 'authors' | 'orders' | 'sales' | 'transactions' | 'all';
    isRestore?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBackupAllJSON = () => {
    const backupData = {
      app: 'Bentala Aksara Bestari Publishing System',
      backupDate: new Date().toISOString(),
      leads,
      books,
      authors,
      orders,
      sales,
      transactions,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_Bentala_Aksara_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Backup seluruh data berhasil diunduh.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportBackupData(json);
        showNotification('Data backup berhasil dipulihkan!');
      } catch (err) {
        alert('Gagal membaca file JSON. Format file tidak valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-900 text-white rounded-lg shadow-md flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-300 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panel Administrator & Penghapusan Data</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Pusat Kontrol & Pembersihan Data Admin
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Kelola izin pembersihan basis data, hapus massal per kategori, kosongkan data untuk sistem baru, atau buat berkas cadangan (*backup*).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <label className="cursor-pointer px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-neutral-500" />
            <span>Pulihkan JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleBackupAllJSON}
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Cadangkan JSON</span>
          </button>
        </div>
      </div>

      {/* Total Data Footprint Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Data Leads</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{leads.length}</span>
            <span className="text-[10px] text-neutral-400">Kontak</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Judul Buku</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{books.length}</span>
            <span className="text-[10px] text-neutral-400">Katalog</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Mitra Penulis</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{authors.length}</span>
            <span className="text-[10px] text-neutral-400">Profil</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Pesanan Terbit</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{orders.length}</span>
            <span className="text-[10px] text-neutral-400">Kontrak</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Penjualan Buku</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{sales.length}</span>
            <span className="text-[10px] text-neutral-400">Transaksi</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Transaksi Kas</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold text-neutral-900">{transactions.length}</span>
            <span className="text-[10px] text-neutral-400">Jurnal</span>
          </div>
        </div>
      </div>

      {/* Granular Module Deletion Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              Pembersihan Data Berdasarkan Modul Bisnis
            </h2>
            <p className="text-xs text-neutral-500">
              Hapus hanya modul data tertentu tanpa mengganggu modul lainnya.
            </p>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {/* 1. Leads */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Database Leads & Calon Penulis</span>
                <span className="text-neutral-500">
                  Menghapus semua entri calon naskah, log follow-up, dan status ketertarikan ({leads.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Semua Data Leads & Calon Penulis',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${leads.length} data calon penulis dan pipeline naskah? Data yang dihapus tidak dapat dipulihkan.`,
                  itemDetails: `${leads.length} kontak leads akan dihapus permanen.`,
                  category: 'leads',
                })
              }
              disabled={leads.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data Leads ({leads.length})</span>
            </button>
          </div>

          {/* 2. Books */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Katalog Judul Buku & ISBN</span>
                <span className="text-neutral-500">
                  Menghapus seluruh judul buku terbit dan naskah yang berada di tahapan redaksi ({books.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Seluruh Katalog Buku',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${books.length} judul buku dari database katalog penerbit?`,
                  itemDetails: `${books.length} judul buku dan status ISBN akan dihapus.`,
                  category: 'books',
                })
              }
              disabled={books.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Katalog Buku ({books.length})</span>
            </button>
          </div>

          {/* 3. Authors */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Direktori Mitra Penulis</span>
                <span className="text-neutral-500">
                  Menghapus profil penulis, informasi rekening royalti, dan riwayat kontak ({authors.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Semua Mitra Penulis',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${authors.length} profil mitra penulis dari sistem?`,
                  itemDetails: `${authors.length} data penulis dan catatan royalti akan dihapus.`,
                  category: 'authors',
                })
              }
              disabled={authors.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Mitra Penulis ({authors.length})</span>
            </button>
          </div>

          {/* 4. Publishing Orders */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg mt-0.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Pesanan Paket Penerbitan</span>
                <span className="text-neutral-500">
                  Menghapus seluruh kontrak order paket mandiri, kolaborasi, dan dosen ({orders.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Semua Pesanan Penerbitan',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${orders.length} data pesanan paket penerbitan?`,
                  itemDetails: `${orders.length} order kontrak penerbitan akan dihapus.`,
                  category: 'orders',
                })
              }
              disabled={orders.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Pesanan ({orders.length})</span>
            </button>
          </div>

          {/* 5. Book Sales */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Riwayat Penjualan Buku Fisik</span>
                <span className="text-neutral-500">
                  Menghapus catatan invoice penjualan marketplace, toko buku offline, dan bazar ({sales.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Riwayat Penjualan Buku',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${sales.length} riwayat invoice penjualan buku?`,
                  itemDetails: `${sales.length} invoice penjualan akan dihapus permanen.`,
                  category: 'sales',
                })
              }
              disabled={sales.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Penjualan ({sales.length})</span>
            </button>
          </div>

          {/* 6. Financial Transactions */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg mt-0.5">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block text-sm">Buku Kas & Transaksi Keuangan</span>
                <span className="text-neutral-500">
                  Menghapus seluruh catatan jurnal arus kas pemasukan dan pengeluaran ({transactions.length} data tersimpan).
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'Hapus Semua Transaksi Keuangan',
                  message: `Apakah Anda yakin ingin menghapus seluruh ${transactions.length} catatan transaksi keuangan dari buku kas? Laporan laba rugi otomatis akan direset.`,
                  itemDetails: `${transactions.length} transaksi pemasukan dan pengeluaran akan dihapus.`,
                  category: 'transactions',
                })
              }
              disabled={transactions.length === 0}
              className="px-3.5 py-1.5 font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Transaksi ({transactions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Security & Password Settings */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-800" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Pengaturan Kata Sandi & Keamanan Administrator
              </h2>
              <p className="text-xs text-neutral-500">
                Ubah kata sandi yang digunakan saat beralih dari Mode Viewer ke Mode Admin.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg gap-2">
            <div>
              <span className="font-semibold text-neutral-700 block">Kata Sandi Admin Saat Ini:</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="font-mono font-bold text-sm bg-white px-2 py-0.5 border border-neutral-300 rounded text-neutral-900">
                  {showPassword ? adminPassword : '••••••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-neutral-500 hover:text-neutral-800 rounded"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <span className="text-[11px] text-neutral-500">
              Default sistem: <strong className="font-mono">bentala2025</strong>
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPasswordError(null);
              setPasswordSuccess(null);

              if (newPassword.length < 4) {
                setPasswordError('Kata sandi baru minimal 4 karakter.');
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordError('Konfirmasi kata sandi tidak cocok.');
                return;
              }

              if (onUpdateAdminPassword) {
                onUpdateAdminPassword(newPassword);
              }
              setPasswordSuccess('Kata sandi administrator berhasil diperbarui!');
              setNewPassword('');
              setConfirmPassword('');
              setTimeout(() => setPasswordSuccess(null), 4000);
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketik password baru..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Ulangi Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            {passwordError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Kata Sandi</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone: Global Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wipe Entire Database */}
        <div className="border border-rose-300 bg-rose-50/40 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Zona Kritis: Kosongkan Seluruh Data (Wipe All)</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            Menghapus seluruh data dari semua modul sekaligus (leads, buku, penulis, pesanan, penjualan, dan keuangan). Digunakan jika ingin memulai operasional baru dari kanvas kosong.
          </p>
          <button
            onClick={() =>
              setConfirmModal({
                isOpen: true,
                title: 'PERINGATAN: Kosongkan Seluruh Database',
                message:
                  'Semua data perusahaan di sistem akan dihapus permanen tanpa sisa. Pastikan Anda telah membuat cadangan JSON jika sewaktu-waktu membutuhkan data kembali.',
                itemDetails: 'Total rekaman yang akan dihapus: ' + (leads.length + books.length + authors.length + orders.length + sales.length + transactions.length) + ' data.',
                category: 'all',
              })
            }
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Seluruh Data Sistem</span>
          </button>
        </div>

        {/* Restore Initial Sample Data */}
        <div className="border border-neutral-200 bg-white rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>Pulihkan Data Contoh Bentala Aksara</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Mengembalikan seluruh data simulasi resmi Penerbit Bentala Aksara Bestari (penulis, buku terbit, ISBN, pesanan, omset, dan laporan laba rugi lengkap).
          </p>
          <button
            onClick={() =>
              setConfirmModal({
                isOpen: true,
                title: 'Pulihkan Data Standar Bentala Aksara',
                message:
                  'Tindakan ini akan menimpa data yang saat ini ada dengan data simulasi default penerbit Bentala Aksara Bestari.',
                confirmLabel: 'Pulihkan Sekarang',
                isRestore: true,
              })
            }
            className="w-full py-2.5 px-4 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>Kembalikan Contoh Data Default</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        itemDetails={confirmModal.itemDetails}
        confirmLabel={confirmModal.confirmLabel || 'Hapus Permanen'}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          if (confirmModal.isRestore) {
            onRestoreDefaults();
            showNotification('Data simulasi default Bentala Aksara berhasil dipulihkan!');
          } else if (confirmModal.category) {
            onClearCategory(confirmModal.category);
            showNotification(`Data ${confirmModal.category} berhasil dihapus.`);
          }
        }}
      />
    </div>
  );
};
