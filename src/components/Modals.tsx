import React, { useState } from 'react';
import {
  Author,
  Book,
  FinancialTransaction,
  Lead,
  LeadStatus,
  PublicationStatus,
  PublishingOrder,
  BookSale,
  TransactionType,
  RevenueCategory,
  ExpenseCategory,
} from '../types';
import { X, Check } from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  subtitle,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

// 1. New Lead Modal
export const NewLeadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [manuscriptTitle, setManuscriptTitle] = useState('');
  const [genre, setGenre] = useState('Fiksi / Novel');
  const [status, setStatus] = useState<LeadStatus>('tertarik');
  const [contacted, setContacted] = useState(true);
  const [estimatedPackage, setEstimatedPackage] = useState('Paket Kolaborasi Mitra');
  const [estimatedValue, setEstimatedValue] = useState<number>(7500000);
  const [source, setSource] = useState('Website Bentala');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !manuscriptTitle) return;

    onSubmit({
      name,
      email,
      phone,
      city,
      manuscriptTitle,
      genre,
      status,
      contacted,
      lastContactedAt: new Date().toISOString().slice(0, 10),
      estimatedPackage,
      estimatedValue: Number(estimatedValue) || 0,
      source,
      notes,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Tambah Lead Calon Penulis Baru"
      subtitle="Input calon penulis dan naskah yang masuk ke redaksi"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Nama Lengkap Calon Penulis *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Dr. Anita Susanto, M.Si."
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Nomor WhatsApp / HP *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kota / Domisili
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Yogyakarta"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Naskah Yang Ditawarkan *
          </label>
          <input
            type="text"
            required
            value={manuscriptTitle}
            onChange={(e) => setManuscriptTitle(e.target.value)}
            placeholder="Contoh: Langkah Kecil Menuju Kebebasan Finansial"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Fiksi / Novel">Fiksi / Novel</option>
              <option value="Akademik / Dosen">Akademik / Dosen</option>
              <option value="Sastra & Puisi">Sastra & Puisi</option>
              <option value="Bisnis & Pengembangan Diri">Bisnis & Pengembangan Diri</option>
              <option value="Pendidikan Anak">Pendidikan Anak</option>
              <option value="Agama & Spiritualitas">Agama & Spiritualitas</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Status Respon Leads *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-semibold text-emerald-800"
            >
              <option value="tertarik">Tertarik (Berminat)</option>
              <option value="closing">Closing (Deal SPK)</option>
              <option value="tidak_saat_ini">Tidak Saat Ini (Tunda)</option>
              <option value="tidak_tertarik">Tidak Tertarik</option>
              <option value="tidak_ada_respon">Tidak Ada Respon</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Estimasi Paket
            </label>
            <input
              type="text"
              value={estimatedPackage}
              onChange={(e) => setEstimatedPackage(e.target.value)}
              placeholder="Paket Kolaborasi Mitra"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Estimasi Nilai Kontrak (Rp)
            </label>
            <input
              type="number"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Catatan Tambahan
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preferensi cetak hardcover, batas waktu akreditasi, dsb."
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Simpan Lead
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 2. New Transaction Modal
export const NewTransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trx: Omit<FinancialTransaction, 'id' | 'transactionNumber' | 'verified'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<TransactionType>('pengeluaran');
  const [category, setCategory] = useState<string>('Percetakan & Kertas');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(2500000);
  const [paymentMethod, setPaymentMethod] = useState<'BCA Bisnis' | 'Mandiri Giro' | 'QRIS' | 'Kas Tunai'>('BCA Bisnis');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onSubmit({
      date,
      type,
      category: category as RevenueCategory | ExpenseCategory,
      description,
      amount: Number(amount),
      paymentMethod,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Catat Transaksi Keuangan"
      subtitle="Input arus kas masuk (pemasukan) atau pengeluaran operasional penerbit"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setType('pemasukan');
              setCategory('Pemesanan Paket Penerbitan');
            }}
            className={`py-2 font-semibold rounded-md transition-colors ${
              type === 'pemasukan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pemasukan (Inflow)
          </button>
          <button
            type="button"
            onClick={() => {
              setType('pengeluaran');
              setCategory('Percetakan & Kertas');
            }}
            className={`py-2 font-semibold rounded-md transition-colors ${
              type === 'pengeluaran'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pengeluaran (Outflow)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Tanggal</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kategori Transaksi *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {type === 'pemasukan' ? (
                <>
                  <option value="Pemesanan Paket Penerbitan">Pemesanan Paket Penerbitan</option>
                  <option value="Penjualan Buku Fisik">Penjualan Buku Fisik</option>
                  <option value="Penjualan E-Book">Penjualan E-Book</option>
                  <option value="Jasa Layanan (ISBN/Layout/Cover)">Jasa Layanan (ISBN/Layout/Cover)</option>
                  <option value="Distribusi & Konsinyasi">Distribusi & Konsinyasi</option>
                </>
              ) : (
                <>
                  <option value="Percetakan & Kertas">Percetakan & Kertas</option>
                  <option value="Fee Editor & Layout">Fee Editor & Layout</option>
                  <option value="Desain Cover & Ilustrasi">Desain Cover & Ilustrasi</option>
                  <option value="Royalti Penulis">Royalti Penulis</option>
                  <option value="Pemasaran & Iklan">Pemasaran & Iklan</option>
                  <option value="Operasional & Kantor">Operasional & Kantor</option>
                  <option value="Pengiriman & Ekspedisi">Pengiriman & Ekspedisi</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Deskripsi Transaksi *
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Pembayaran cetak buku 300 eks a.n Wahyudi"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Nominal Transaksi (IDR) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="1000000"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="BCA Bisnis">BCA Bisnis</option>
              <option value="Mandiri Giro">Mandiri Giro</option>
              <option value="QRIS">QRIS</option>
              <option value="Kas Tunai">Kas Tunai</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className={`px-4 py-2 font-semibold text-white rounded-lg ${
              type === 'pemasukan' ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-rose-700 hover:bg-rose-800'
            }`}
          >
            Simpan Transaksi
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 3. New Book Modal
export const NewBookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  authors: Author[];
  genres?: string[];
  onAddGenre?: (newGenre: string) => void;
  onSubmit: (book: Omit<Book, 'id'>) => void;
}> = ({ isOpen, onClose, authors, genres = [], onAddGenre, onSubmit }) => {
  const [title, setTitle] = useState('');
  
  // Author selection: dropdown from authors directory or custom
  const [selectedAuthorOption, setSelectedAuthorOption] = useState<string>(
    authors[0]?.name || '__custom__'
  );
  const [customAuthorName, setCustomAuthorName] = useState('');
  
  const [legalType, setLegalType] = useState<'ISBN' | 'QRCBN' | 'Nomor Legalitas Lainnya'>('ISBN');
  const [legalNumber, setLegalNumber] = useState('978-623-');
  const [genre, setGenre] = useState(genres[0] || 'Fiksi Sastra / Novel');
  const [isAddingNewGenre, setIsAddingNewGenre] = useState(false);
  const [newGenreInput, setNewGenreInput] = useState('');
  
  // Model Penerbitan (Berbayar vs Sistem Mayor)
  const [publishingModel, setPublishingModel] = useState<'berbayar' | 'mayor'>('berbayar');
  const [paidPublishingFee, setPaidPublishingFee] = useState<number>(8500000);
  const [paidPublishingTrxNumber, setPaidPublishingTrxNumber] = useState(
    `TRX/IN/${new Date().toISOString().slice(0, 7).replace('-', '')}/${Math.floor(100 + Math.random() * 900)}`
  );
  const [paidPublishingStatus, setPaidPublishingStatus] = useState<'lunas' | 'dp' | 'belum_bayar'>('lunas');
  const [initialPrintCopies, setInitialPrintCopies] = useState<number>(300);
  const [publicationDate, setPublicationDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const [pageCount, setPageCount] = useState(240);
  const [pageDetails, setPageDetails] = useState('');
  const [publishYear, setPublishYear] = useState('2026');
  const [editor, setEditor] = useState('');
  const [proofreader, setProofreader] = useState('');
  const [coverDesigner, setCoverDesigner] = useState('');
  const [layoutArtist, setLayoutArtist] = useState('');
  const [salesLink, setSalesLink] = useState('');
  const [price, setPrice] = useState(90000); // Harga jual buku
  const [productionCost, setProductionCost] = useState(30000);
  const [status, setStatus] = useState<PublicationStatus>('naskah_masuk');
  const [packageType, setPackageType] = useState('Paket Mandiri Pro');
  const [printRun, setPrintRun] = useState(300);

  if (!isOpen) return null;

  // Determine actual author name & check if in author directory
  const effectiveAuthorName =
    selectedAuthorOption === '__custom__' ? customAuthorName.trim() : selectedAuthorOption;

  const matchedAuthorInDirectory = authors.find(
    (a) => a.name.toLowerCase() === effectiveAuthorName.toLowerCase()
  );

  const handleCreateNewGenre = () => {
    const trimmed = newGenreInput.trim();
    if (!trimmed) return;
    if (onAddGenre) {
      onAddGenre(trimmed);
    }
    setGenre(trimmed);
    setNewGenreInput('');
    setIsAddingNewGenre(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !effectiveAuthorName) return;

    onSubmit({
      title,
      authorId: matchedAuthorInDirectory
        ? matchedAuthorInDirectory.id
        : `aut-unreg-${Date.now().toString().slice(-4)}`,
      authorName: effectiveAuthorName,
      legalType,
      legalNumber: legalNumber || (legalType === 'ISBN' ? 'Antrean ISBN' : 'Antrean Legalitas'),
      isbn: legalNumber || 'Antrean ISBN',
      genre,
      pageCount: Number(pageCount) || 0,
      pageDetails: pageDetails.trim() || undefined,
      publishYear: publishYear.trim() || undefined,
      editor: editor.trim() || undefined,
      proofreader: proofreader.trim() || undefined,
      coverDesigner: coverDesigner.trim() || undefined,
      layoutArtist: layoutArtist.trim() || undefined,
      salesLink: salesLink.trim() || undefined,
      price: Number(price) || 0,
      productionCost: Number(productionCost) || 0,
      status,
      packageType: publishingModel === 'mayor' ? 'Sistem Penerbitan Mayor' : packageType,
      publishingModel,
      initialPrintCopies: Number(initialPrintCopies) || Number(printRun) || 0,
      paidPublishingFee: publishingModel === 'berbayar' ? Number(paidPublishingFee) : undefined,
      paidPublishingTrxNumber: publishingModel === 'berbayar' ? paidPublishingTrxNumber : undefined,
      paidPublishingStatus: publishingModel === 'berbayar' ? paidPublishingStatus : undefined,
      publicationDate: publicationDate || new Date().toISOString().slice(0, 10),
      printRun: Number(printRun) || Number(initialPrintCopies) || 0,
      stock: status === 'terbit_distribusi' ? (Number(initialPrintCopies) || Number(printRun) || 0) : 0,
      soldCopies: 0,
      publishDate: publicationDate || new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Daftarkan Judul Buku Baru"
      subtitle="Input katalog judul buku, direktori penulis, model penerbitan & harga jual"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Section 1: Data Pokok */}
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Buku *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Sang Pengelana Samudra"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        {/* Penulis dari Direktori Penulis (Dropdown) */}
        <div className="p-3 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2">
          <label className="font-semibold text-neutral-800 block">
            Nama Penulis (Terhubung ke Direktori Penulis) *
          </label>
          <select
            value={selectedAuthorOption}
            onChange={(e) => setSelectedAuthorOption(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <optgroup label="Pilih dari Data Direktori Penulis">
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} — {a.city} ({a.publishedCount} buku terbit)
                </option>
              ))}
            </optgroup>
            <option value="__custom__" className="font-bold text-amber-700">
              ➕ Masukkan Penulis Baru / Belum Ada di Direktori...
            </option>
          </select>

          {selectedAuthorOption === '__custom__' && (
            <div className="mt-2 space-y-1">
              <input
                type="text"
                required
                placeholder="Ketik nama lengkap penulis..."
                value={customAuthorName}
                onChange={(e) => setCustomAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Directory Verification Status Badge */}
          {effectiveAuthorName && (
            <div className="pt-1">
              {matchedAuthorInDirectory ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terverifikasi di Direktori Penulis ({matchedAuthorInDirectory.city})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-medium">
                  <span>⚠️ Penulis ini belum terdaftar di Direktori Penulis! Katalog akan menampilkan peringatan agar didaftarkan ke direktori.</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Model Penerbitan: Paket Berbayar vs Sistem Mayor */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
          <label className="font-semibold text-neutral-800 block">
            Model & Skema Penerbitan Buku *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setPublishingModel('berbayar');
                setPackageType('Paket Kolaborasi Mitra');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                publishingModel === 'berbayar'
                  ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Paket Penerbitan Berbayar</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Biaya penerbitan dibayar oleh penulis/mitra (ada transaksi paket penerbitan).
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPublishingModel('mayor');
                setPackageType('Sistem Penerbitan Mayor');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                publishingModel === 'mayor'
                  ? 'bg-purple-50/80 border-purple-600 text-purple-950 ring-1 ring-purple-600'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Sistem Mayor (Seleksi Redaksi)</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Biaya 100% ditanggung penerbit Bentala Aksara Bestari, sistem bagi hasil royalti.
              </div>
            </button>
          </div>

          {/* Transaksi Penerbitan Berbayar Fields */}
          {publishingModel === 'berbayar' ? (
            <div className="p-3 bg-white border border-emerald-200 rounded-lg space-y-2.5 mt-2">
              <span className="font-semibold text-emerald-900 block text-xs">
                Detail Transaksi Paket Penerbitan Berbayar:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">Biaya Paket (Rp)</label>
                  <input
                    type="number"
                    value={paidPublishingFee}
                    onChange={(e) => setPaidPublishingFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">No. Transaksi</label>
                  <input
                    type="text"
                    value={paidPublishingTrxNumber}
                    onChange={(e) => setPaidPublishingTrxNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">Status Bayar</label>
                  <select
                    value={paidPublishingStatus}
                    onChange={(e) => setPaidPublishingStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-emerald-800"
                  >
                    <option value="lunas">Lunas</option>
                    <option value="dp">DP Masuk</option>
                    <option value="belum_bayar">Belum Bayar</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded text-[11px] text-purple-900">
              ✨ <strong>Penerbitan Mayor:</strong> Naskah lolos kurasi redaksi. Bebas biaya bagi penulis dan didistribusikan secara nasional.
            </div>
          )}
        </div>

        {/* Data Penerbitan & Jumlah Awal Penerbitan */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tanggal / Data Penerbitan *
            </label>
            <input
              type="date"
              required
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Awal Penerbitan (Cetak Perdana) *
            </label>
            <input
              type="number"
              min={1}
              required
              value={initialPrintCopies}
              onChange={(e) => {
                setInitialPrintCopies(Number(e.target.value));
                setPrintRun(Number(e.target.value));
              }}
              placeholder="Contoh: 500"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-xs"
            />
          </div>
        </div>

        {/* Genre & Legalitas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Genre Buku (Dropdown) *
            </label>
            {!isAddingNewGenre ? (
              <div className="space-y-1">
                <select
                  value={genre}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setIsAddingNewGenre(true);
                    } else {
                      setGenre(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                  <option value="__add_new__" className="font-bold text-emerald-800">
                    ➕ Tambah Genre Baru...
                  </option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  placeholder="Ketik genre baru..."
                  value={newGenreInput}
                  onChange={(e) => setNewGenreInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-500 rounded-md text-xs"
                />
                <button
                  type="button"
                  onClick={handleCreateNewGenre}
                  className="px-2.5 py-1.5 bg-emerald-800 text-white rounded-md text-[11px] font-semibold hover:bg-emerald-900"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewGenre(false)}
                  className="px-2 py-1.5 bg-neutral-200 text-neutral-700 rounded-md text-[11px] hover:bg-neutral-300"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tahap Produksi Naskah *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublicationStatus)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-semibold text-emerald-800"
            >
              <option value="naskah_masuk">Naskah Masuk</option>
              <option value="editing_layout">Editing & Layout</option>
              <option value="proofreading">Proofreading</option>
              <option value="desain_cover">Desain Cover</option>
              <option value="percetakan">Percetakan</option>
              <option value="terbit_distribusi">Terbit & Distribusi</option>
            </select>
          </div>
        </div>

        {/* Legalitas: ISBN vs QRCBN vs Lainnya */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
          <label className="font-semibold text-neutral-800 block">
            Identifikasi Legalitas Buku *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['ISBN', 'QRCBN', 'Nomor Legalitas Lainnya'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setLegalType(type);
                  if (type === 'ISBN' && !legalNumber.startsWith('978-')) {
                    setLegalNumber('978-623-');
                  } else if (type === 'QRCBN' && !legalNumber.startsWith('QRCBN-')) {
                    setLegalNumber('QRCBN-62-');
                  }
                }}
                className={`py-1.5 px-2 rounded-md font-semibold text-[11px] transition-colors border ${
                  legalType === type
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={legalNumber}
              onChange={(e) => setLegalNumber(e.target.value)}
              placeholder={
                legalType === 'ISBN'
                  ? 'Contoh: 978-623-91820-1-4'
                  : legalType === 'QRCBN'
                  ? 'Contoh: QRCBN-62-098-7712-4'
                  : 'Nomor pendaftaran / proses legalitas'
              }
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono text-xs"
            />
          </div>
        </div>

        {/* Spesifikasi Halaman & Tahun Cetak */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Halaman Total *
            </label>
            <input
              type="number"
              min={1}
              required
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              placeholder="Contoh: 216"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tahun Terbit / Tahun Cetak
            </label>
            <input
              type="text"
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              placeholder="Contoh: 2026 (Cetakan ke-1)"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        {/* Detail Halaman Khusus / Warna */}
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Detail Halaman (Opsional, e.g. halaman warna di mana saja & jenis kertas)
          </label>
          <textarea
            rows={2}
            value={pageDetails}
            onChange={(e) => setPageDetails(e.target.value)}
            placeholder="Contoh: Halaman 1-12 full color art paper 150gsm, sisa hlm 13-216 bookpaper 72gsm hitam putih..."
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        {/* Tim Redaksi & Artistik Produksi */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2.5">
          <span className="font-semibold text-neutral-800 block text-xs">
            Tim Redaksi & Artistik Produksi
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Nama Penyunting / Editor
              </label>
              <input
                type="text"
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                placeholder="Penyunting Naskah"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Penyelaras Aksara (Proofreader)
              </label>
              <input
                type="text"
                value={proofreader}
                onChange={(e) => setProofreader(e.target.value)}
                placeholder="Penyelaras Aksara"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Perancang Sampul (Cover)
              </label>
              <input
                type="text"
                value={coverDesigner}
                onChange={(e) => setCoverDesigner(e.target.value)}
                placeholder="Desainer Sampul"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Penata Visual & Tata Letak
              </label>
              <input
                type="text"
                value={layoutArtist}
                onChange={(e) => setLayoutArtist(e.target.value)}
                placeholder="Penata Layout Buku"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
          </div>
        </div>

        {/* Harga Jual & HPP Cetak */}
        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-emerald-950 block mb-0.5">
                Harga Jual Buku (Rp) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg font-mono font-bold text-sm text-neutral-900 focus:ring-1 focus:ring-emerald-600"
              />
              <span className="text-[10px] text-emerald-800 mt-1 block">
                ⭐ Harga jual ini yang akan otomatis digunakan untuk transaksi penjualan buku.
              </span>
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-0.5">
                HPP Biaya Cetak per Unit (Rp)
              </label>
              <input
                type="number"
                value={productionCost}
                onChange={(e) => setProductionCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono text-sm"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Digunakan untuk menghitung profit bersih penjualan.
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Link Penjualan Buku (Shopee / Tokopedia / Website)
          </label>
          <input
            type="url"
            value={salesLink}
            onChange={(e) => setSalesLink(e.target.value)}
            placeholder="https://shopee.co.id/bentalaaksara/judul-buku"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Daftarkan Judul Buku
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 4. New Author Modal
export const NewAuthorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialAuthorName?: string;
  onSubmit: (author: Omit<Author, 'id' | 'joinedDate' | 'publishedCount' | 'activeContracts' | 'totalRoyaltyEarned'>) => void;
}> = ({ isOpen, onClose, initialAuthorName = '', onSubmit }) => {
  const [name, setName] = useState(initialAuthorName);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [royaltyRate, setRoyaltyRate] = useState(12);
  const [bankAccount, setBankAccount] = useState('BCA ');

  React.useEffect(() => {
    if (initialAuthorName) {
      setName(initialAuthorName);
    }
  }, [initialAuthorName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSubmit({
      name,
      email,
      phone,
      city,
      bio,
      royaltyRate: Number(royaltyRate),
      bankAccount,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Daftarkan Penulis Baru ke Direktori"
      subtitle="Tambah profil mitra penulis dan data perjanjian royalti Bentala"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Nama Lengkap & Gelar *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prof. / Dr. / Nama Lengkap"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="penulis@email.com"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">No. WhatsApp *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Kota Asal</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Yogyakarta"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Bagi Hasil Royalti (%)
            </label>
            <input
              type="number"
              value={royaltyRate}
              onChange={(e) => setRoyaltyRate(Number(e.target.value))}
              placeholder="12"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Akun Bank Pencairan Royalti
          </label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="BCA 123456789 a.n Penulis"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
          />
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">Biografi Singkat</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Latar belakang akademis atau bidang kepenulisan..."
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Simpan Penulis ke Direktori
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 5. New Sale Modal
// Otomatis terhubung dengan data katalog judul buku dan direktori penulis
export const NewSaleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  authors?: Author[];
  onSubmit: (sale: Omit<BookSale, 'id' | 'invoiceNumber'>) => void;
}> = ({ isOpen, onClose, books, authors = [], onSubmit }) => {
  const [bookId, setBookId] = useState(books[0]?.id || '');
  const [channel, setChannel] = useState<BookSale['channel']>('Marketplace (Shopee/Tokopedia)');
  const [quantity, setQuantity] = useState(10);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    if (books.length > 0 && !bookId) {
      setBookId(books[0].id);
      setCustomPrice(books[0].price);
    }
  }, [books, bookId]);

  if (!isOpen) return null;

  const selectedBook = books.find((b) => b.id === bookId) || books[0];
  const unitPrice = customPrice !== null ? customPrice : selectedBook?.price || 0;
  const productionCostPerUnit = selectedBook?.productionCost || Math.round(unitPrice * 0.35);

  const discountAmount = Math.round((unitPrice * (Number(discountPercent) || 0)) / 100);
  const priceAfterDiscount = Math.max(0, unitPrice - discountAmount);
  const totalAmount = priceAfterDiscount * (Number(quantity) || 0);
  const totalProductionCost = productionCostPerUnit * (Number(quantity) || 0);
  const profit = totalAmount - totalProductionCost;
  const profitMarginPercent = totalAmount > 0 ? ((profit / totalAmount) * 100).toFixed(1) : '0';

  // Check if book author is in author directory
  const isAuthorInDirectory = authors.some(
    (a) =>
      a.id === selectedBook?.authorId ||
      a.name.toLowerCase() === selectedBook?.authorName?.toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    onSubmit({
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      authorName: selectedBook.authorName, // Connected to book's author
      channel,
      quantity: Number(quantity) || 1,
      unitPrice,
      discountPercent: Number(discountPercent) || 0,
      discountAmount,
      priceAfterDiscount,
      totalAmount,
      productionCostPerUnit,
      profit,
      customerName: customerName.trim() || undefined,
      date,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Catat Transaksi Penjualan Buku"
      subtitle="Terhubung langsung dengan Katalog Judul Buku & Direktori Penulis Bentala"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Book Selection from Catalog */}
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Pilih Judul Buku Dari Katalog *
          </label>
          <select
            value={bookId}
            onChange={(e) => {
              setBookId(e.target.value);
              const b = books.find((item) => item.id === e.target.value);
              if (b) setCustomPrice(b.price);
            }}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.authorName} ({b.legalType || 'ISBN'}: {b.legalNumber || b.isbn}) — Rp {b.price.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Book & Author Connection Card */}
        {selectedBook && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Penulis Buku:</span>
              <span className="font-bold text-neutral-900">{selectedBook.authorName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Status Direktori Penulis:</span>
              {isAuthorInDirectory ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terdaftar di Direktori</span>
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <span>⚠️ Belum Terdaftar di Direktori Penulis</span>
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Harga Jual Resmi Katalog:</span>
              <span className="font-mono font-bold text-neutral-900">
                Rp {selectedBook.price.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Sisa Stok Siap Jual:</span>
              <span className="font-mono font-bold text-emerald-800">
                {selectedBook.stock} Eksemplar
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kanal Distribusi Penjualan
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            >
              <option value="Marketplace (Shopee/Tokopedia)">Marketplace (Shopee/Tokopedia)</option>
              <option value="Gramedia & Toko Offline">Gramedia & Toko Offline</option>
              <option value="Direct Website">Direct Website</option>
              <option value="Bazar Literasi & Kampus">Bazar Literasi & Kampus</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Nama Pembeli / Pemesan / Toko
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Toko Buku Togamas Solo / Pembeli Umum"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Harga Satuan Normal (Rp)
            </label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Diskon (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-rose-700"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Eksemplar *
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        {/* Live Financial Breakdown Card */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
          <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider block">
            Rincian Kalkulasi Pembayaran & Profit
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Potongan Diskon:</span>
              <span className="font-mono text-rose-700 font-semibold">
                -{discountPercent}% ({discountAmount.toLocaleString('id-ID')} IDR / eks)
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Harga Satuan Bersih:</span>
              <span className="font-mono font-semibold text-neutral-900">
                {priceAfterDiscount.toLocaleString('id-ID')} IDR
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-neutral-500 text-[11px] block">Total Tagihan Harus Dibayar:</span>
              <span className="font-mono font-bold text-base text-neutral-900">
                {totalAmount.toLocaleString('id-ID')} IDR
              </span>
            </div>

            <div className="text-left sm:text-right bg-emerald-100/70 p-2 rounded-lg border border-emerald-300">
              <span className="text-emerald-900 text-[10px] font-semibold block uppercase">
                Estimasi Untung / Profit Bersih:
              </span>
              <span className="font-mono font-bold text-sm text-emerald-900">
                +{profit.toLocaleString('id-ID')} IDR ({profitMarginPercent}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tanggal Transaksi Penjualan
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
          <div className="flex items-end text-neutral-500 text-[11px] pb-2">
            HPP per buku: <strong className="ml-1 font-mono text-neutral-800">{productionCostPerUnit.toLocaleString('id-ID')} IDR</strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
          >
            Simpan Penjualan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 6. New Publishing Order Modal
// Terintegrasi langsung dengan Leads & Pipeline (hanya ketika closing / deal)
export const NewPublishingOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onConfirmLeadToOrder: (leadId: string, orderData: {
    packageName: string;
    totalPrice: number;
    amountPaid: number;
    paymentStatus: 'lunas' | 'dp';
    copiesCount: number;
    targetPublishDate: string;
  }) => void;
  onCreateNewOrderWithLead: (leadData: Omit<Lead, 'id' | 'createdAt'>, orderDetails: {
    amountPaid: number;
    paymentStatus: 'lunas' | 'dp';
    copiesCount: number;
    targetPublishDate: string;
  }) => void;
}> = ({ isOpen, onClose, leads, onConfirmLeadToOrder, onCreateNewOrderWithLead }) => {
  const [mode, setMode] = useState<'from_lead' | 'new_lead_order'>('from_lead');

  // Leads available to confirm
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    leads[0]?.id || ''
  );

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const [overridePackage, setOverridePackage] = useState('');
  const [overridePrice, setOverridePrice] = useState<number>(0);
  const [leadAmountPaid, setLeadAmountPaid] = useState<number>(0);
  const [leadPaymentStatus, setLeadPaymentStatus] = useState<'lunas' | 'dp'>('lunas');
  const [leadCopiesCount, setLeadCopiesCount] = useState<number>(300);
  const [leadTargetPublishDate, setLeadTargetPublishDate] = useState<string>('');

  React.useEffect(() => {
    if (selectedLead) {
      setOverridePackage(selectedLead.estimatedPackage || 'Paket Kolaborasi Mitra');
      setOverridePrice(selectedLead.estimatedValue || 8500000);
      setLeadAmountPaid(selectedLead.estimatedValue || 8500000);
      setLeadCopiesCount(300);
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 2);
      setLeadTargetPublishDate(targetDate.toISOString().slice(0, 10));
    }
  }, [selectedLeadId]);

  // Mode 2 fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [manuscriptTitle, setManuscriptTitle] = useState('');
  const [genre, setGenre] = useState('Fiksi Sastra / Novel');
  const [newPackageName, setNewPackageName] = useState('Paket Kolaborasi Mitra (300 Eks)');
  const [newTotalPrice, setNewTotalPrice] = useState<number>(8500000);
  const [newAmountPaid, setNewAmountPaid] = useState<number>(8500000);
  const [newPaymentStatus, setNewPaymentStatus] = useState<'lunas' | 'dp'>('lunas');
  const [newCopiesCount, setNewCopiesCount] = useState<number>(300);
  const [newTargetPublishDate, setNewTargetPublishDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().slice(0, 10);
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'from_lead') {
      if (!selectedLead) return;
      onConfirmLeadToOrder(selectedLead.id, {
        packageName: overridePackage || selectedLead.estimatedPackage,
        totalPrice: Number(overridePrice) || selectedLead.estimatedValue,
        amountPaid: Number(leadAmountPaid),
        paymentStatus: leadPaymentStatus,
        copiesCount: Number(leadCopiesCount) || 300,
        targetPublishDate: leadTargetPublishDate || new Date().toISOString().slice(0, 10),
      });
    } else {
      if (!name || !manuscriptTitle) return;
      onCreateNewOrderWithLead(
        {
          name,
          phone,
          email,
          city,
          manuscriptTitle,
          genre,
          status: 'closing',
          contacted: true,
          lastContactedAt: new Date().toISOString().slice(0, 10),
          estimatedPackage: newPackageName,
          estimatedValue: Number(newTotalPrice),
          source: 'Input Pesanan Langsung',
          notes: 'Dikonfirmasi langsung melalui Pesanan Paket Penerbitan.',
        },
        {
          amountPaid: Number(newAmountPaid),
          paymentStatus: newPaymentStatus,
          copiesCount: Number(newCopiesCount) || 300,
          targetPublishDate: newTargetPublishDate,
        }
      );
    }
    onClose();
  };

  return (
    <ModalWrapper
      title="Input Pesanan Paket Penerbitan"
      subtitle="Terintegrasi langsung dengan Pipeline Leads (Status Closing Terkonfirmasi)"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('from_lead')}
            className={`py-2 px-2 font-semibold rounded-md transition-colors text-center ${
              mode === 'from_lead'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pilih dari Pipeline Leads
          </button>
          <button
            type="button"
            onClick={() => setMode('new_lead_order')}
            className={`py-2 px-2 font-semibold rounded-md transition-colors text-center ${
              mode === 'new_lead_order'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Input Pesanan & Lead Baru
          </button>
        </div>

        {mode === 'from_lead' ? (
          <div className="space-y-3.5">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                Pilih Calon Penulis dari Leads & Pipeline *
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — "{l.manuscriptTitle}" ({l.status === 'closing' ? '✓ Closing' : l.status.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
            </div>

            {selectedLead && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1 text-xs">
                <div className="text-neutral-500">Status Saat Ini: <span className="font-bold text-emerald-800 uppercase">{selectedLead.status}</span></div>
                <div className="text-neutral-500">Kontak: <span className="font-medium text-neutral-800">{selectedLead.phone} · {selectedLead.city}</span></div>
                <div className="text-neutral-500">Judul Naskah: <span className="font-semibold text-neutral-900">"{selectedLead.manuscriptTitle}"</span></div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Paket Penerbitan</label>
                <input
                  type="text"
                  value={overridePackage}
                  onChange={(e) => setOverridePackage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Oplah Cetak (Eks)</label>
                <input
                  type="number"
                  value={leadCopiesCount}
                  onChange={(e) => setLeadCopiesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Total Nilai Paket (Rp)</label>
                <input
                  type="number"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Sudah Dibayar (Rp)</label>
                <input
                  type="number"
                  value={leadAmountPaid}
                  onChange={(e) => {
                    const paid = Number(e.target.value);
                    setLeadAmountPaid(paid);
                    setLeadPaymentStatus(paid >= overridePrice ? 'lunas' : 'dp');
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-xs text-emerald-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Status Pembayaran</label>
                <select
                  value={leadPaymentStatus}
                  onChange={(e) => setLeadPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold"
                >
                  <option value="lunas">Lunas (100%)</option>
                  <option value="dp">Uang Muka / DP</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Target Terbit</label>
                <input
                  type="date"
                  value={leadTargetPublishDate}
                  onChange={(e) => setLeadTargetPublishDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Nama Lengkap Penulis *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. / Penulis..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Nomor WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Kota Asal</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Yogyakarta"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Judul Naskah *</label>
              <input
                type="text"
                required
                value={manuscriptTitle}
                onChange={(e) => setManuscriptTitle(e.target.value)}
                placeholder="Judul naskah yang diterbitkan..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Paket Penerbitan</label>
                <input
                  type="text"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Oplah Cetak</label>
                <input
                  type="number"
                  value={newCopiesCount}
                  onChange={(e) => setNewCopiesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Total Nilai Paket (Rp)</label>
                <input
                  type="number"
                  value={newTotalPrice}
                  onChange={(e) => setNewTotalPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Sudah Dibayar (Rp)</label>
                <input
                  type="number"
                  value={newAmountPaid}
                  onChange={(e) => {
                    const paid = Number(e.target.value);
                    setNewAmountPaid(paid);
                    setNewPaymentStatus(paid >= newTotalPrice ? 'lunas' : 'dp');
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-emerald-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Status Pembayaran</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-semibold"
                >
                  <option value="lunas">Lunas (100%)</option>
                  <option value="dp">Uang Muka / DP</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Target Terbit</label>
                <input
                  type="date"
                  value={newTargetPublishDate}
                  onChange={(e) => setNewTargetPublishDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
              ℹ️ Data ini otomatis tercatat di <strong>Pipeline Leads</strong> dengan status <strong>Closing</strong> dan sekaligus dikonfirmasi di <strong>Pesanan Paket Penerbitan</strong>.
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
          >
            Konfirmasi Pesanan Penerbitan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
