import React, { useState, useMemo } from 'react';
import { Author, Book, PublicationStatus, UserRole } from '../types';
import {
  formatRupiah,
  formatCompactRupiah,
  getPublicationStatusLabel,
  getPublicationProgress,
  exportToCSV,
} from '../utils/formatters';
import {
  Users,
  BookOpen,
  Search,
  Plus,
  Download,
  Trash2,
  Phone,
  Pencil,
  Eye,
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { BookDetailModal } from './BookDetailModal';

interface AuthorsAndBooksViewProps {
  authors: Author[];
  books: Book[];
  userRole: UserRole;
  onUpdateBookStatus: (bookId: string, newStatus: PublicationStatus) => void;
  onOpenNewBookModal: () => void;
  onOpenNewAuthorModal: () => void;
  onEditBook: (book: Book) => void;
  onEditAuthor: (author: Author) => void;
  onDeleteBook: (bookId: string) => void;
  onDeleteAuthor: (authorId: string) => void;
}

export const AuthorsAndBooksView: React.FC<AuthorsAndBooksViewProps> = ({
  authors,
  books,
  userRole,
  onUpdateBookStatus,
  onOpenNewBookModal,
  onOpenNewAuthorModal,
  onEditBook,
  onEditAuthor,
  onDeleteBook,
  onDeleteAuthor,
}) => {
  const isAdmin = userRole === 'admin';
  const [activeSubTab, setActiveSubTab] = useState<'books' | 'authors'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('all');
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    type: 'book' | 'author';
    id: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'book',
    id: '',
  });

  // Distinct genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.genre));
    return Array.from(set);
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.isbn && b.isbn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.legalNumber && b.legalNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        selectedStatusFilter === 'all' ? true : b.status === selectedStatusFilter;

      const matchGenre =
        selectedGenreFilter === 'all' ? true : b.genre === selectedGenreFilter;

      return matchSearch && matchStatus && matchGenre;
    });
  }, [books, searchQuery, selectedStatusFilter, selectedGenreFilter]);

  // Filtered authors
  const filteredAuthors = useMemo(() => {
    return authors.filter((a) => {
      return (
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [authors, searchQuery]);

  const handleExportBooksCSV = () => {
    const data = filteredBooks.map((b) => ({
      Judul: b.title,
      Penulis: b.authorName,
      ISBN: b.isbn,
      Genre: b.genre,
      Halaman: b.pageCount,
      HargaJual: b.price,
      BiayaProduksi: b.productionCost,
      StatusPenerbitan: getPublicationStatusLabel(b.status),
      PaketPenerbitan: b.packageType,
      JumlahCetak: b.printRun,
      Terjual: b.soldCopies,
      SisaStok: b.stock,
      TanggalTerbit: b.publishDate || '-',
    }));
    exportToCSV(`Katalog_Buku_Bentala_${new Date().toISOString().slice(0, 10)}`, data);
  };

  const handleExportAuthorsCSV = () => {
    const data = filteredAuthors.map((a) => ({
      NamaPenulis: a.name,
      Email: a.email,
      Kontak: a.phone,
      Kota: a.city,
      JumlahBukuTerbit: a.publishedCount,
      KontrakAktif: a.activeContracts,
      PersentaseRoyalti: `${a.royaltyRate}%`,
      TotalRoyaltiDiterima: a.totalRoyaltyEarned,
      Rekening: a.bankAccount,
      Bergabung: a.joinedDate,
    }));
    exportToCSV(`Direktori_Penulis_Bentala_${new Date().toISOString().slice(0, 10)}`, data);
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === 'book') {
      onDeleteBook(deleteModal.id);
    } else {
      onDeleteAuthor(deleteModal.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Manajemen Redaksi & Katalog</span>
            <span aria-hidden="true">·</span>
            <span>Bentala Aksara Bestari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Penulis & Judul Buku Diterbitkan
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Database mitra penulis, pengawasan status produksi naskah, serta fitur edit dan hapus bagi admin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'books' ? (
            <>
              <button
                onClick={handleExportBooksCSV}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Buku</span>
              </button>
              {isAdmin && (
                <button
                  onClick={onOpenNewBookModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Judul Buku</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleExportAuthorsCSV}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Penulis</span>
              </button>
              {isAdmin && (
                <button
                  onClick={onOpenNewAuthorModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Daftarkan Penulis</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveSubTab('books')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'books'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog Judul Buku ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('authors')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'authors'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Direktori Penulis ({authors.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'books'
                ? 'Cari judul buku, nama penulis, atau ISBN...'
                : 'Cari nama penulis, domisili, atau profil...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>

        {activeSubTab === 'books' && (
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-700"
            >
              <option value="all">Semua Status Produksi</option>
              <option value="terbit_distribusi">Terbit & Distribusi</option>
              <option value="percetakan">Percetakan</option>
              <option value="desain_cover">Desain Cover</option>
              <option value="proofreading">Proofreading</option>
              <option value="editing_layout">Editing & Layout</option>
              <option value="naskah_masuk">Naskah Masuk</option>
            </select>

            <select
              value={selectedGenreFilter}
              onChange={(e) => setSelectedGenreFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-700"
            >
              <option value="all">Semua Genre</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Alert Banner: Books With Unregistered Authors */}
      {activeSubTab === 'books' && books.some((b) => !authors.some((a) => a.id === b.authorId || a.name.toLowerCase() === b.authorName.toLowerCase())) && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-bold text-xs text-amber-950">
                Peringatan: Terdapat Judul Buku yang Penulisnya Belum Ada di Direktori Penulis
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {books
                  .filter((b) => !authors.some((a) => a.id === b.authorId || a.name.toLowerCase() === b.authorName.toLowerCase()))
                  .map((b) => `"${b.title}" (${b.authorName})`)
                  .join(' · ')}
              </p>
              <p className="text-[10px] text-amber-700 mt-1">
                Harap segera daftarkan nama penulis ke Direktori Penulis agar perjanjian royalti dan kontrak kepenulisan dapat dikelola secara terpusat.
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={onOpenNewAuthorModal}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs shrink-0 transition-colors shadow-2xs"
            >
              + Daftarkan Penulis
            </button>
          )}
        </div>
      )}

      {/* SubTab 1: Books Catalog Table */}
      {activeSubTab === 'books' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Judul Buku & Legalitas</th>
                  <th className="py-3 px-4">Penulis & Validasi Direktori</th>
                  <th className="py-3 px-4">Model & Data Penerbitan</th>
                  <th className="py-3 px-4">Status Produksi</th>
                  <th className="py-3 px-4">Harga Jual & HPP</th>
                  <th className="py-3 px-4">Oplah & Terjual</th>
                  <th className="py-3 px-4">Sisa Stok</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      <p className="text-sm font-medium">Tidak ada judul buku ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => {
                    const progress = getPublicationProgress(book.status);
                    const isPublished = book.status === 'terbit_distribusi';
                    const isAuthorInDirectory = authors.some(
                      (a) =>
                        a.id === book.authorId ||
                        a.name.toLowerCase() === book.authorName.toLowerCase()
                    );

                    return (
                      <tr key={book.id} className="hover:bg-neutral-50/80 transition-colors">
                        {/* Title & Legalitas (ISBN / QRCBN / Lainnya) */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-neutral-900 leading-snug">
                            {book.title}
                          </div>
                          <div className="text-[11px] mt-1 flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                book.legalType === 'QRCBN'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : book.legalType === 'ISBN'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {book.legalType || 'ISBN'}
                            </span>
                            <span className="font-mono text-neutral-700 text-[11px]">
                              {book.legalNumber || book.isbn}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-2">
                            <span>{book.pageCount} hlm</span>
                            {book.pageDetails && (
                              <span className="text-emerald-700 font-medium">· Halaman Berwarna</span>
                            )}
                            {book.publishYear && (
                              <span className="text-neutral-400">· {book.publishYear}</span>
                            )}
                          </div>
                        </td>

                        {/* Author & Directory Connection Validation */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-900">
                            {book.authorName}
                          </div>
                          {isAuthorInDirectory ? (
                            <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              <span>Terdaftar di Direktori</span>
                            </div>
                          ) : (
                            <div className="mt-1 space-y-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold">
                                ⚠️ Belum ada di direktori
                              </span>
                              {isAdmin && (
                                <div>
                                  <button
                                    onClick={onOpenNewAuthorModal}
                                    className="text-[10px] text-amber-800 underline hover:text-amber-950 font-semibold inline-block"
                                  >
                                    + Daftarkan Penulis
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                            {book.genre}
                          </div>
                          {book.editor && (
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              Ed: {book.editor}
                            </div>
                          )}
                        </td>

                        {/* Model & Data Penerbitan */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {book.publishingModel === 'mayor' ? (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 font-bold text-[10px] rounded">
                                Sistem Mayor
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] rounded">
                                Paket Berbayar
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-600 mt-1">
                            Cetak Awal: <strong className="font-mono text-neutral-900">{book.initialPrintCopies || book.printRun} eks</strong>
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            Terbit: {book.publicationDate || book.publishDate || '-'}
                          </div>
                          {book.paidPublishingFee && (
                            <div className="text-[10px] font-mono text-emerald-800 font-semibold mt-0.5">
                              Paket: {formatCompactRupiah(book.paidPublishingFee)} ({book.paidPublishingStatus || 'lunas'})
                            </div>
                          )}
                        </td>

                        {/* Status & Progress Bar */}
                        <td className="py-3.5 px-4 min-w-[150px]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span
                              className={`font-semibold ${
                                isPublished ? 'text-emerald-700' : 'text-blue-700'
                              }`}
                            >
                              {getPublicationStatusLabel(book.status)}
                            </span>
                            <span className="font-mono text-[11px] text-neutral-500">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isPublished ? 'bg-emerald-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          <div className="font-bold text-neutral-900">
                            {formatRupiah(book.price)}
                          </div>
                          <div className="text-[9px] text-emerald-800 font-semibold">
                            Harga Jual Resmi
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            HPP: {formatRupiah(book.productionCost)}
                          </div>
                        </td>

                        {/* Print Run & Sold */}
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          <div className="font-bold text-neutral-900">
                            {book.soldCopies.toLocaleString('id-ID')} Eks
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            dari total {book.printRun.toLocaleString('id-ID')} eks
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono font-bold text-xs tabular-nums px-2 py-0.5 rounded ${
                              book.stock > 50
                                ? 'bg-emerald-50 text-emerald-700'
                                : book.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-neutral-100 text-neutral-500'
                            }`}
                          >
                            {book.stock} Eks
                          </span>
                        </td>

                        {/* Actions: View Detail, Status Dropdown, Edit & Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedBookForDetail(book)}
                              className="p-1.5 text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                              title="Lihat detail lengkap buku, spesifikasi redaksi, & link penjualan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isAdmin ? (
                              <>
                                <select
                                  value={book.status}
                                  onChange={(e) =>
                                    onUpdateBookStatus(book.id, e.target.value as PublicationStatus)
                                  }
                                  className="text-[11px] font-medium bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                >
                                  <option value="naskah_masuk">Naskah Masuk</option>
                                  <option value="editing_layout">Editing & Layout</option>
                                  <option value="proofreading">Proofreading</option>
                                  <option value="desain_cover">Desain Cover</option>
                                  <option value="percetakan">Percetakan</option>
                                  <option value="terbit_distribusi">Terbit & Distribusi</option>
                                </select>

                                <button
                                  onClick={() => onEditBook(book)}
                                  className="p-1.5 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                  title="Edit data buku"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      title: 'Hapus Judul Buku dari Katalog',
                                      message: `Apakah Anda yakin ingin menghapus buku "${book.title}" karya ${book.authorName}? Data oplah dan stok akan ikut terhapus.`,
                                      itemDetails: `Legalitas: ${book.legalNumber || book.isbn} - Judul: ${book.title}`,
                                      type: 'book',
                                      id: book.id,
                                    })
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Hapus buku (Admin)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Authors Directory Grid */}
      {activeSubTab === 'authors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {author.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{author.city}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {author.royaltyRate}% Royalti
                  </span>
                </div>

                <p className="text-xs text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {author.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Buku Terbit</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {author.publishedCount} Judul
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Kontrak Berjalan</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {author.activeContracts} Naskah
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 text-[11px]">Total Royalti Dicairkan</span>
                    <span className="font-mono font-bold text-neutral-900 tabular-nums">
                      {formatRupiah(author.totalRoyaltyEarned)}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono truncate" title={author.bankAccount}>
                    {author.bankAccount}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
                <span className="text-[11px]">Bergabung {author.joinedDate}</span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/62${author.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `Halo ${author.name}, salam dari tim editorial Bentala Aksara Bestari.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Kontak</span>
                  </a>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEditAuthor(author)}
                        className="p-1 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        title="Edit data penulis"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            title: 'Hapus Profil Penulis',
                            message: `Apakah Anda yakin ingin menghapus data mitra penulis "${author.name}"? Data riwayat royalti dan profil akan dihapus.`,
                            itemDetails: `Penulis: ${author.name} (${author.city}) - Kontak: ${author.phone}`,
                            type: 'author',
                            id: author.id,
                          })
                        }
                        className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Hapus profil penulis (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
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

      {/* Book Detailed Specifications & Editorial Modal */}
      <BookDetailModal
        isOpen={!!selectedBookForDetail}
        book={selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onEdit={onEditBook}
        userRole={userRole}
      />
    </div>
  );
};
