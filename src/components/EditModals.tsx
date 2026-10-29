import React, { useState, useEffect } from 'react';
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

// 1. Edit Lead Modal
export const EditLeadModal: React.FC<{
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSubmit: (updatedLead: Lead) => void;
}> = ({ isOpen, lead, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Lead | null>(lead);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Data Calon Penulis & Naskah"
      subtitle={`ID: ${formData.id} · Terdaftar ${formData.createdAt}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Nama Calon Penulis *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kota Asal
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Naskah *
          </label>
          <input
            type="text"
            required
            value={formData.manuscriptTitle}
            onChange={(e) =>
              setFormData({ ...formData, manuscriptTitle: e.target.value })
            }
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Genre</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Status Respon Leads *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as LeadStatus })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-semibold text-emerald-800"
            >
              <option value="closing">Closing (Deal SPK)</option>
              <option value="tertarik">Tertarik (Evaluasi)</option>
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
              value={formData.estimatedPackage}
              onChange={(e) =>
                setFormData({ ...formData, estimatedPackage: e.target.value })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Estimasi Nilai Kontrak (Rp)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedValue: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Catatan Follow-up
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 2. Edit Book Modal
export const EditBookModal: React.FC<{
  isOpen: boolean;
  book: Book | null;
  authors?: Author[];
  genres?: string[];
  onAddGenre?: (newGenre: string) => void;
  onClose: () => void;
  onSubmit: (updatedBook: Book) => void;
}> = ({ isOpen, book, authors = [], genres = [], onAddGenre, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Book | null>(book);
  const [isAddingNewGenre, setIsAddingNewGenre] = useState(false);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [isCustomAuthor, setIsCustomAuthor] = useState(false);

  useEffect(() => {
    setFormData(book);
    if (book) {
      const inDirectory = authors.some(
        (a) => a.name.toLowerCase() === book.authorName.toLowerCase()
      );
      setIsCustomAuthor(!inDirectory);
    }
  }, [book, authors]);

  if (!isOpen || !formData) return null;

  const inDirectory = authors.some(
    (a) => a.name.toLowerCase() === formData.authorName.toLowerCase()
  );

  const handleCreateNewGenre = () => {
    const trimmed = newGenreInput.trim();
    if (!trimmed) return;
    if (onAddGenre) {
      onAddGenre(trimmed);
    }
    setFormData({ ...formData, genre: trimmed });
    setNewGenreInput('');
    setIsAddingNewGenre(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      isbn: formData.legalNumber || formData.isbn,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Data Judul Buku & Redaksi"
      subtitle={`${formData.legalType || 'ISBN'}: ${formData.legalNumber || formData.isbn}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Buku *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-medium"
          />
        </div>

        {/* Author Selection from Directory */}
        <div className="p-3 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2">
          <label className="font-semibold text-neutral-800 block">
            Nama Penulis (Terhubung ke Direktori Penulis) *
          </label>
          <select
            value={isCustomAuthor ? '__custom__' : formData.authorName}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setIsCustomAuthor(true);
              } else {
                setIsCustomAuthor(false);
                const matched = authors.find((a) => a.name === e.target.value);
                setFormData({
                  ...formData,
                  authorName: e.target.value,
                  authorId: matched ? matched.id : formData.authorId,
                });
              }
            }}
            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <optgroup label="Pilih dari Data Direktori Penulis">
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} — {a.city}
                </option>
              ))}
            </optgroup>
            <option value="__custom__" className="font-bold text-amber-700">
              ➕ Masukkan Nama Penulis Khusus / Belum Ada di Direktori...
            </option>
          </select>

          {isCustomAuthor && (
            <div className="mt-2">
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                placeholder="Ketik nama penulis..."
                className="w-full px-3 py-2 bg-white border border-amber-400 rounded-lg"
              />
            </div>
          )}

          {/* Directory Verification Alert */}
          <div className="pt-1">
            {inDirectory ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terverifikasi di Direktori Penulis Bentala</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-medium">
                <span>⚠️ Penulis ini belum ada di data Direktori Penulis. Judul buku ini akan menampilkan peringatan di katalog.</span>
              </span>
            )}
          </div>
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
                setFormData({
                  ...formData,
                  publishingModel: 'berbayar',
                  packageType: formData.packageType === 'Sistem Penerbitan Mayor' ? 'Paket Kolaborasi Mitra' : formData.packageType,
                });
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                formData.publishingModel !== 'mayor'
                  ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Paket Penerbitan Berbayar</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                Ada transaksi paket penerbitan dari penulis/mitra.
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  publishingModel: 'mayor',
                  packageType: 'Sistem Penerbitan Mayor',
                });
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                formData.publishingModel === 'mayor'
                  ? 'bg-purple-50/80 border-purple-600 text-purple-950 ring-1 ring-purple-600'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Sistem Mayor (Seleksi Redaksi)</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                Dibiayai 100% oleh Penerbit Bentala, royalti penjualan.
              </div>
            </button>
          </div>

          {/* Transaksi Penerbitan Berbayar Fields */}
          {formData.publishingModel !== 'mayor' && (
            <div className="p-2.5 bg-white border border-emerald-200 rounded-lg space-y-2 mt-2">
              <span className="font-semibold text-emerald-900 block text-xs">
                Detail Transaksi Paket Penerbitan:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">Biaya Paket (Rp)</label>
                  <input
                    type="number"
                    value={formData.paidPublishingFee || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, paidPublishingFee: Number(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">No. Transaksi</label>
                  <input
                    type="text"
                    value={formData.paidPublishingTrxNumber || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, paidPublishingTrxNumber: e.target.value })
                    }
                    placeholder="TRX/IN/..."
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-600 block mb-0.5">Status Bayar</label>
                  <select
                    value={formData.paidPublishingStatus || 'lunas'}
                    onChange={(e) =>
                      setFormData({ ...formData, paidPublishingStatus: e.target.value as any })
                    }
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-emerald-800"
                  >
                    <option value="lunas">Lunas</option>
                    <option value="dp">DP Masuk</option>
                    <option value="belum_bayar">Belum Bayar</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Penerbitan & Cetak Awal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tanggal / Data Penerbitan
            </label>
            <input
              type="date"
              value={formData.publicationDate || formData.publishDate || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicationDate: e.target.value,
                  publishDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Awal Penerbitan (Cetak Perdana)
            </label>
            <input
              type="number"
              value={formData.initialPrintCopies || formData.printRun || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initialPrintCopies: Number(e.target.value) || 0,
                  printRun: Number(e.target.value) || formData.printRun,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Genre Buku (Dropdown) *
            </label>
            {!isAddingNewGenre ? (
              <select
                value={formData.genre}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setIsAddingNewGenre(true);
                  } else {
                    setFormData({ ...formData, genre: e.target.value });
                  }
                }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                {!genres.includes(formData.genre) && (
                  <option value={formData.genre}>{formData.genre}</option>
                )}
                <option value="__add_new__" className="font-bold text-emerald-800">
                  ➕ Tambah Genre Baru...
                </option>
              </select>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  placeholder="Genre baru..."
                  value={newGenreInput}
                  onChange={(e) => setNewGenreInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-500 rounded-md text-xs"
                />
                <button
                  type="button"
                  onClick={handleCreateNewGenre}
                  className="px-2.5 py-1.5 bg-emerald-800 text-white rounded-md text-[11px] font-semibold"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewGenre(false)}
                  className="px-2 py-1.5 bg-neutral-200 text-neutral-700 rounded-md text-[11px]"
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
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as PublicationStatus,
                })
              }
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
                onClick={() =>
                  setFormData({
                    ...formData,
                    legalType: type,
                  })
                }
                className={`py-1.5 px-2 rounded-md font-semibold text-[11px] transition-colors border ${
                  (formData.legalType || 'ISBN') === type
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
              value={formData.legalNumber || formData.isbn || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  legalNumber: e.target.value,
                  isbn: e.target.value,
                })
              }
              placeholder="Nomor identifikasi legalitas..."
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono text-xs"
            />
          </div>
        </div>

        {/* Halaman & Detail Halaman */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Halaman Total *
            </label>
            <input
              type="number"
              value={formData.pageCount}
              onChange={(e) =>
                setFormData({ ...formData, pageCount: Number(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Tahun Terbit / Tahun Cetak
            </label>
            <input
              type="text"
              value={formData.publishYear || ''}
              onChange={(e) =>
                setFormData({ ...formData, publishYear: e.target.value })
              }
              placeholder="Contoh: 2026 (Cetakan ke-1)"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Detail Halaman (Warna / Jenis Kertas)
          </label>
          <textarea
            rows={2}
            value={formData.pageDetails || ''}
            onChange={(e) =>
              setFormData({ ...formData, pageDetails: e.target.value })
            }
            placeholder="Catatan halaman warna, art paper, dsb..."
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        {/* Tim Redaksi & Produksi */}
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
                value={formData.editor || ''}
                onChange={(e) =>
                  setFormData({ ...formData, editor: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Penyelaras Aksara (Proofreader)
              </label>
              <input
                type="text"
                value={formData.proofreader || ''}
                onChange={(e) =>
                  setFormData({ ...formData, proofreader: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Perancang Sampul (Cover)
              </label>
              <input
                type="text"
                value={formData.coverDesigner || ''}
                onChange={(e) =>
                  setFormData({ ...formData, coverDesigner: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 block mb-0.5">
                Penata Visual & Tata Letak
              </label>
              <input
                type="text"
                value={formData.layoutArtist || ''}
                onChange={(e) =>
                  setFormData({ ...formData, layoutArtist: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs"
              />
            </div>
          </div>
        </div>

        {/* Harga Jual Resmi & HPP Cetak */}
        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-emerald-950 block mb-0.5">
                Harga Jual Buku (Rp) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg font-mono font-bold text-sm text-neutral-900"
              />
              <span className="text-[10px] text-emerald-800 mt-1 block">
                ⭐ Harga acuan resmi untuk transaksi penjualan buku.
              </span>
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-0.5">
                HPP Biaya Cetak per Unit (Rp)
              </label>
              <input
                type="number"
                value={formData.productionCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productionCost: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Terjual (Eks)
            </label>
            <input
              type="number"
              value={formData.soldCopies}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  soldCopies: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Sisa Stok Gudang
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Link Penjualan Buku (Shopee / Tokopedia / Website)
          </label>
          <input
            type="url"
            value={formData.salesLink || ''}
            onChange={(e) =>
              setFormData({ ...formData, salesLink: e.target.value })
            }
            placeholder="https://..."
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 3. Edit Author Modal
export const EditAuthorModal: React.FC<{
  isOpen: boolean;
  author: Author | null;
  onClose: () => void;
  onSubmit: (updatedAuthor: Author) => void;
}> = ({ isOpen, author, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Author | null>(author);

  useEffect(() => {
    setFormData(author);
  }, [author]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Profil Mitra Penulis"
      subtitle={`Bergabung sejak ${formData.joinedDate}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Nama Lengkap Penulis & Gelar *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Nomor WhatsApp *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Kota Asal</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Bagi Hasil Royalti (%)
            </label>
            <input
              type="number"
              value={formData.royaltyRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  royaltyRate: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Rekening Bank Pencairan Royalti
          </label>
          <input
            type="text"
            value={formData.bankAccount}
            onChange={(e) =>
              setFormData({ ...formData, bankAccount: e.target.value })
            }
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
          />
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">Biografi</label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 4. Edit Order Modal
export const EditOrderModal: React.FC<{
  isOpen: boolean;
  order: PublishingOrder | null;
  onClose: () => void;
  onSubmit: (updatedOrder: PublishingOrder) => void;
}> = ({ isOpen, order, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PublishingOrder | null>(order);

  useEffect(() => {
    setFormData(order);
  }, [order]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Pesanan Paket Penerbitan"
      subtitle={`No. Order: ${formData.orderNumber}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Nama Penulis *
          </label>
          <input
            type="text"
            required
            value={formData.authorName}
            onChange={(e) =>
              setFormData({ ...formData, authorName: e.target.value })
            }
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Naskah *
          </label>
          <input
            type="text"
            required
            value={formData.manuscriptTitle}
            onChange={(e) =>
              setFormData({ ...formData, manuscriptTitle: e.target.value })
            }
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Paket Penerbitan
            </label>
            <input
              type="text"
              value={formData.packageName}
              onChange={(e) =>
                setFormData({ ...formData, packageName: e.target.value })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Cetak (Oplah)
            </label>
            <input
              type="number"
              value={formData.copiesCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  copiesCount: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Total Nilai Kontrak (Rp)
            </label>
            <input
              type="number"
              value={formData.totalPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalPrice: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Terbayar (Rp)
            </label>
            <input
              type="number"
              value={formData.amountPaid}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amountPaid: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-emerald-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Status Pembayaran
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentStatus: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            >
              <option value="lunas">LUNAS</option>
              <option value="dp">DP MASUK</option>
              <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Status Pengerjaan
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            >
              <option value="proses">Sedang Dikerjakan</option>
              <option value="selesai">Selesai</option>
              <option value="tertunda">Tertunda</option>
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
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 5. Edit Transaction Modal
export const EditTransactionModal: React.FC<{
  isOpen: boolean;
  transaction: FinancialTransaction | null;
  onClose: () => void;
  onSubmit: (updatedTrx: FinancialTransaction) => void;
}> = ({ isOpen, transaction, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FinancialTransaction | null>(transaction);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Catatan Transaksi Keuangan"
      subtitle={`No: ${formData.transactionNumber}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'pemasukan' })}
            className={`py-2 font-semibold rounded-md transition-colors ${
              formData.type === 'pemasukan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600'
            }`}
          >
            Pemasukan (Inflow)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'pengeluaran' })}
            className={`py-2 font-semibold rounded-md transition-colors ${
              formData.type === 'pengeluaran'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-neutral-600'
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kategori Transaksi
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Deskripsi Transaksi *
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Nominal (IDR) *
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Metode Pembayaran
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value as any })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
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
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 6. Edit Sale Modal
export const EditSaleModal: React.FC<{
  isOpen: boolean;
  sale: BookSale | null;
  books: Book[];
  onClose: () => void;
  onSubmit: (updatedSale: BookSale) => void;
}> = ({ isOpen, sale, books, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BookSale | null>(sale);

  useEffect(() => {
    setFormData(sale);
  }, [sale]);

  if (!isOpen || !formData) return null;

  const unitPrice = formData.unitPrice || 0;
  const quantity = formData.quantity || 1;
  const discountPercent = formData.discountPercent || 0;
  const discountAmount = Math.round((unitPrice * discountPercent) / 100);
  const priceAfterDiscount = Math.max(0, unitPrice - discountAmount);
  const totalAmount = priceAfterDiscount * quantity;
  const productionCostPerUnit = formData.productionCostPerUnit || Math.round(unitPrice * 0.35);
  const profit = totalAmount - productionCostPerUnit * quantity;
  const profitMarginPercent = totalAmount > 0 ? ((profit / totalAmount) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      discountAmount,
      priceAfterDiscount,
      totalAmount,
      productionCostPerUnit,
      profit,
    });
    onClose();
  };

  return (
    <ModalWrapper
      title="Edit Data Penjualan Buku"
      subtitle={`No. Invoice: ${formData.invoiceNumber} · ${formData.bookTitle}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-neutral-700 block mb-1">
            Judul Buku & Penulis
          </label>
          <input
            type="text"
            disabled
            value={`${formData.bookTitle} (${formData.authorName})`}
            className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-600 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Kanal Distribusi Penjualan
            </label>
            <select
              value={formData.channel}
              onChange={(e) =>
                setFormData({ ...formData, channel: e.target.value as any })
              }
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
              Pembeli / Pemesan / Toko
            </label>
            <input
              type="text"
              value={formData.customerName || ''}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Nama pembeli..."
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
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: Number(e.target.value) || 0 })
              }
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
              value={formData.discountPercent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountPercent: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold text-rose-700"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Jumlah Eksemplar
            </label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) || 1 })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        {/* Live Calculation Card */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
          <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider block">
            Kalkulasi Pembayaran & Profit Otomatis
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
                Untung / Laba Bersih Penjualan:
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
              Tanggal Penjualan
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              HPP Modal Cetak per Eks (Rp)
            </label>
            <input
              type="number"
              value={formData.productionCostPerUnit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productionCostPerUnit: Number(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
            />
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
            className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
          >
            Simpan Perubahan Penjualan
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
