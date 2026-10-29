import React from 'react';
import { Book, UserRole } from '../types';
import {
  formatRupiah,
  getPublicationStatusLabel,
  getPublicationProgress,
} from '../utils/formatters';
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  Users,
  ExternalLink,
  Pencil,
  FileCheck,
  Palette,
  Sparkles,
  Tag,
  ShoppingBag,
} from 'lucide-react';

interface BookDetailModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onEdit?: (book: Book) => void;
  userRole: UserRole;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  book,
  onClose,
  onEdit,
  userRole,
}) => {
  if (!isOpen || !book) return null;
  const isAdmin = userRole === 'admin';
  const progress = getPublicationProgress(book.status);
  const profitPerCopy = book.price - book.productionCost;
  const marginPercent = book.price > 0 ? ((profitPerCopy / book.price) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    book.legalType === 'QRCBN'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : book.legalType === 'ISBN'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {book.legalType || 'ISBN'}
                </span>
                <span className="text-xs font-mono font-medium text-neutral-600">
                  {book.legalNumber || book.isbn}
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-900 mt-0.5 leading-snug">
                {book.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Progress Banner */}
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">Tahap Penerbitan:</span>
                <span className="font-bold text-emerald-800">
                  {getPublicationStatusLabel(book.status)}
                </span>
              </div>
              <span className="font-mono font-bold text-neutral-700">{progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Section 1: Data Penulis & Klasifikasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Penulis & Naskah
              </span>
              <div className="space-y-1">
                <div className="text-neutral-500">Nama Penulis:</div>
                <div className="font-bold text-neutral-900 text-sm">{book.authorName}</div>
              </div>
              <div className="space-y-1 pt-1 border-t border-neutral-200/80">
                <div className="text-neutral-500">Genre / Kategori:</div>
                <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{book.genre}</span>
                </div>
              </div>
              <div className="space-y-1 pt-1 border-t border-neutral-200/80">
                <div className="text-neutral-500">Paket Penerbitan:</div>
                <div className="font-medium text-neutral-800">{book.packageType}</div>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Legalitas & Penerbitan
              </span>
              <div className="space-y-1">
                <div className="text-neutral-500">Tipe Identifikasi Buku:</div>
                <div className="font-semibold text-neutral-900">{book.legalType || 'ISBN'}</div>
              </div>
              <div className="space-y-1 pt-1 border-t border-neutral-200/80">
                <div className="text-neutral-500">Nomor Legalitas / Barcode:</div>
                <div className="font-mono font-bold text-neutral-900 text-xs">
                  {book.legalNumber || book.isbn}
                </div>
              </div>
              <div className="space-y-1 pt-1 border-t border-neutral-200/80">
                <div className="text-neutral-500">Tahun Terbit / Cetak:</div>
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{book.publishYear || (book.publishDate ? book.publishDate.slice(0, 4) : '2025/2026')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Spesifikasi Fisik & Halaman */}
          <div className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-neutral-900">Spesifikasi Halaman & Isi Buku</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                <div className="text-neutral-500 text-[11px]">Jumlah Halaman Total</div>
                <div className="text-base font-bold text-neutral-900 font-mono mt-0.5">
                  {book.pageCount} <span className="text-xs font-normal text-neutral-500">hlm</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                <div className="text-neutral-500 text-[11px]">Oplah Cetak</div>
                <div className="text-base font-bold text-neutral-900 font-mono mt-0.5">
                  {book.printRun} <span className="text-xs font-normal text-neutral-500">eks</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                <div className="text-neutral-500 text-[11px]">Stok Tersedia Saat Ini</div>
                <div className="text-base font-bold text-emerald-800 font-mono mt-0.5">
                  {book.stock} <span className="text-xs font-normal text-neutral-500">eks</span>
                </div>
              </div>
            </div>

            {/* Detail Halaman Khusus / Halaman Berwarna */}
            <div>
              <span className="text-neutral-600 font-semibold block mb-1">
                Keterangan & Rincian Halaman (Warna / Bahan Kertas):
              </span>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 leading-relaxed font-sans">
                {book.pageDetails ? (
                  book.pageDetails
                ) : (
                  <span className="text-neutral-400 italic">
                    Belum ada catatan pembagian halaman warna (standar bookpaper 72gsm hitam putih).
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Tim Redaksi & Produksi */}
          <div className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-neutral-900">Tim Redaksi & Artistik Produksi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-0.5">
                <div className="text-[11px] text-neutral-500 font-medium">Penyunting / Editor:</div>
                <div className="font-bold text-neutral-900">{book.editor || '-'}</div>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-0.5">
                <div className="text-[11px] text-neutral-500 font-medium">Penyelaras Aksara (Proofreader):</div>
                <div className="font-bold text-neutral-900">{book.proofreader || '-'}</div>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-0.5">
                <div className="text-[11px] text-neutral-500 font-medium">Perancang Sampul (Cover):</div>
                <div className="font-bold text-neutral-900">{book.coverDesigner || '-'}</div>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-0.5">
                <div className="text-[11px] text-neutral-500 font-medium">Penata Visual & Tata Letak (Layout):</div>
                <div className="font-bold text-neutral-900">{book.layoutArtist || '-'}</div>
              </div>
            </div>
          </div>

          {/* Section 4: Data Finansial & Link Penjualan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Finansial & Margin
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">Harga Jual Satuan:</span>
                <span className="font-bold font-mono text-neutral-900">
                  {formatRupiah(book.price)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">HPP Biaya Cetak Satuan:</span>
                <span className="font-mono text-neutral-700">
                  {formatRupiah(book.productionCost)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-200">
                <span className="font-semibold text-emerald-900">Laba Kotor per Eksemplar:</span>
                <span className="font-bold font-mono text-emerald-800">
                  +{formatRupiah(profitPerCopy)} ({marginPercent}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-lg space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Komersialisasi & Link Pembelian
                </span>
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  Tautan langsung bagi pembaca dan reseller untuk memesan buku di kanal daring:
                </p>
              </div>

              {book.salesLink ? (
                <a
                  href={book.salesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Kunjungi Link Toko Buku</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-500 text-center italic text-[11px]">
                  Belum ditautkan ke link toko daring
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div>
            {isAdmin && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(book);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-neutral-600" />
                <span>Ubah Data Buku Ini</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold text-xs text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
