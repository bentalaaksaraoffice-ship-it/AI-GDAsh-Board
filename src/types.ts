export type UserRole = 'admin' | 'viewer';

export type LeadStatus =
  | 'tidak_ada_respon'
  | 'tidak_tertarik'
  | 'tidak_saat_ini'
  | 'tertarik'
  | 'closing';

export type PublicationStatus =
  | 'naskah_masuk'
  | 'editing_layout'
  | 'proofreading'
  | 'desain_cover'
  | 'percetakan'
  | 'terbit_distribusi';

export type TransactionType = 'pemasukan' | 'pengeluaran';

export type RevenueCategory =
  | 'Pemesanan Paket Penerbitan'
  | 'Penjualan Buku Fisik'
  | 'Penjualan E-Book'
  | 'Jasa Layanan (ISBN/Layout/Cover)'
  | 'Distribusi & Konsinyasi';

export type ExpenseCategory =
  | 'Percetakan & Kertas'
  | 'Fee Editor & Layout'
  | 'Desain Cover & Ilustrasi'
  | 'Royalti Penulis'
  | 'Pemasaran & Iklan'
  | 'Operasional & Kantor'
  | 'Pengiriman & Ekspedisi';

export type PublishingModel = 'berbayar' | 'mayor';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  manuscriptTitle: string;
  genre: string;
  source: string; // e.g., 'Instagram Ads', 'Website Bentala', 'Rekomendasi Penulis', 'Event Kampus'
  status: LeadStatus;
  contacted: boolean;
  createdAt: string;
  lastContactedAt: string;
  estimatedPackage: string;
  estimatedValue: number;
  notes: string;
  orderId?: string; // ID pesanan penerbitan yang terkonfirmasi ketika closing/deals
}

export interface Author {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  joinedDate: string;
  publishedCount: number;
  activeContracts: number;
  royaltyRate: number; // e.g., 12%
  totalRoyaltyEarned: number;
  bankAccount: string;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  legalType: 'ISBN' | 'QRCBN' | 'Nomor Legalitas Lainnya';
  legalNumber: string;
  isbn: string; // Kept for backwards compatibility
  genre: string;
  pageCount: number;
  pageDetails?: string; // e.g. Halaman warna di halaman mana saja, kertas, keterangan
  publishYear?: string; // Tahun terbit / tahun cetak
  editor?: string; // Nama Penyunting / Editor
  proofreader?: string; // Penyelaras Aksara
  coverDesigner?: string; // Perancang Sampul
  layoutArtist?: string; // Penata Visual dan Tata Letak
  salesLink?: string; // Link Penjualan Buku (Shopee/Tokopedia/Web)
  price: number; // Harga jual buku yang digunakan untuk penjualan buku
  productionCost: number; // HPP per eksemplar
  status: PublicationStatus;
  packageType: string;
  publishDate?: string;
  publicationDate?: string; // Tanggal / data penerbitan
  initialPrintCopies?: number; // Jumlah awal penerbitan (oplah cetak perdana)
  publishingModel?: PublishingModel; // 'berbayar' (Paket Berbayar) vs 'mayor' (Sistem Mayor)
  paidPublishingFee?: number; // Biaya transaksi paket penerbitan berbayar
  paidPublishingTrxNumber?: string; // No transaksi penerbitan berbayar
  paidPublishingStatus?: 'lunas' | 'dp' | 'belum_bayar'; // Status bayar penerbitan
  stock: number;
  soldCopies: number;
  printRun: number;
  coverImage?: string;
  synopsis?: string;
}

export interface PublishingOrder {
  id: string;
  orderNumber: string;
  leadId?: string;
  authorName: string;
  manuscriptTitle: string;
  bookTitle?: string; // Alias untuk judul naskah / buku
  packageName: string;
  totalPrice: number;
  amountPaid: number;
  paymentStatus: 'lunas' | 'dp' | 'menunggu_pembayaran';
  orderDate: string;
  targetPublishDate: string;
  copiesCount: number;
  status: 'proses' | 'selesai' | 'tertunda';
}

export interface BookSale {
  id: string;
  invoiceNumber: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  channel: 'Marketplace (Shopee/Tokopedia)' | 'Gramedia & Toko Offline' | 'Direct Website' | 'Bazar Literasi & Kampus';
  quantity: number;
  unitPrice: number; // Harga normal satuan
  discountPercent: number; // Diskon (%)
  discountAmount: number; // Nilai potongan per unit
  priceAfterDiscount: number; // Harga satuan setelah diskon
  totalAmount: number; // Total harga yang harus dibayar
  productionCostPerUnit: number; // HPP per eksemplar
  profit: number; // Keuntungan / untung bersih
  customerName?: string; // Pembeli / Toko / Pembeli langsung
  date: string;
}

export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  category: RevenueCategory | ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: 'BCA Bisnis' | 'Mandiri Giro' | 'QRIS' | 'Kas Tunai';
  referenceId?: string; // e.g. order number or book sale
  verified: boolean;
}

export interface MonthlyGrowthData {
  month: string;
  monthLabel: string;
  leadsTotal: number;
  leadsContacted: number;
  leadsInterested: number;
  leadsClosing: number;
  publishedTitles: number;
  booksSoldCopies: number;
  revenue: number;
  expenses: number;
  netProfit: number;
}
