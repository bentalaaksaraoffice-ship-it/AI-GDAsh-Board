import React, { useState, useMemo } from 'react';
import { BookSale, PublishingOrder, Book, UserRole } from '../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatDateIndo,
  exportToCSV,
} from '../utils/formatters';
import {
  ShoppingBag,
  Package,
  Search,
  Plus,
  Download,
  Trash2,
  Store,
  Globe,
  Truck,
  Pencil,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ImportSalesModal, downloadSalesTemplate } from './ImportSalesModal';
import { BulkEditSalesModal } from './BulkEditSalesModal';

interface OrdersAndSalesViewProps {
  orders: PublishingOrder[];
  sales: BookSale[];
  books: Book[];
  userRole: UserRole;
  onOpenNewOrderModal: () => void;
  onOpenNewSaleModal: () => void;
  onEditOrder: (order: PublishingOrder) => void;
  onEditSale: (sale: BookSale) => void;
  onDeleteOrder: (orderId: string) => void;
  onDeleteSale: (saleId: string) => void;
  onImportSales: (newSales: BookSale[]) => void;
  onBulkEditSales?: (
    saleIds: string[],
    fields: {
      channel?: BookSale['channel'];
      date?: string;
      discountPercent?: number;
      customerName?: string;
    }
  ) => void;
  onDeleteMultipleSales?: (saleIds: string[]) => void;
}

export const OrdersAndSalesView: React.FC<OrdersAndSalesViewProps> = ({
  orders,
  sales,
  books,
  userRole,
  onOpenNewOrderModal,
  onOpenNewSaleModal,
  onEditOrder,
  onEditSale,
  onDeleteOrder,
  onDeleteSale,
  onImportSales,
  onBulkEditSales,
  onDeleteMultipleSales,
}) => {
  const isAdmin = userRole === 'admin';
  const [activeTab, setActiveTab] = useState<'orders' | 'sales'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [selectedSaleIds, setSelectedSaleIds] = useState<string[]>([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    type: 'order' | 'sale';
    id: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'order',
    id: '',
  });

  // Summary Metrics
  const totalOrdersAmount = useMemo(
    () => orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
    [orders]
  );
  const totalPaidOrders = useMemo(
    () => orders.reduce((acc, curr) => acc + curr.amountPaid, 0),
    [orders]
  );
  const totalSalesRevenue = useMemo(
    () => sales.reduce((acc, curr) => acc + curr.totalAmount, 0),
    [sales]
  );
  const totalSalesGross = useMemo(
    () => sales.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0),
    [sales]
  );
  const totalSalesDiscount = useMemo(
    () => Math.max(0, totalSalesGross - totalSalesRevenue),
    [totalSalesGross, totalSalesRevenue]
  );
  const totalSalesProfit = useMemo(
    () =>
      sales.reduce((acc, curr) => {
        if (typeof curr.profit === 'number') return acc + curr.profit;
        const hpp = curr.productionCostPerUnit || Math.round(curr.unitPrice * 0.35);
        return acc + (curr.totalAmount - hpp * curr.quantity);
      }, 0),
    [sales]
  );
  const totalCopiesSold = useMemo(
    () => sales.reduce((acc, curr) => acc + curr.quantity, 0),
    [sales]
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      return (
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.manuscriptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.packageName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [orders, searchQuery]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      return (
        s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.customerName && s.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [sales, searchQuery]);

  const handleExportOrdersCSV = () => {
    const data = filteredOrders.map((o) => ({
      NomorOrder: o.orderNumber,
      Penulis: o.authorName,
      JudulNaskah: o.manuscriptTitle,
      PaketPenerbitan: o.packageName,
      JumlahCetak: `${o.copiesCount} Eks`,
      TotalNilai: o.totalPrice,
      SudahDibayar: o.amountPaid,
      StatusPembayaran: o.paymentStatus.toUpperCase(),
      TanggalOrder: o.orderDate,
      TargetTerbit: o.targetPublishDate,
      StatusPengerjaan: o.status,
    }));
    exportToCSV(`Pesanan_Penerbitan_${new Date().toISOString().slice(0, 10)}`, data);
  };

  const handleExportSalesCSV = () => {
    const data = filteredSales.map((s) => ({
      Invoice: s.invoiceNumber,
      JudulBuku: s.bookTitle,
      Penulis: s.authorName,
      Pembeli: s.customerName || '-',
      KanalPenjualan: s.channel,
      JumlahEksemplar: s.quantity,
      HargaSatuanNormal: s.unitPrice,
      DiskonPersen: `${s.discountPercent || 0}%`,
      HargaSatuanBersih: s.priceAfterDiscount || s.unitPrice,
      TotalDibayar: s.totalAmount,
      HPPCetakSatuan: s.productionCostPerUnit || Math.round(s.unitPrice * 0.35),
      UntungProfit: s.profit || 0,
      Tanggal: s.date,
    }));
    exportToCSV(`Penjualan_Buku_Bentala_${new Date().toISOString().slice(0, 10)}`, data);
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === 'order') {
      onDeleteOrder(deleteModal.id);
    } else {
      onDeleteSale(deleteModal.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Komersial & Distribusi</span>
            <span aria-hidden="true">·</span>
            <span>Bentala Aksara Bestari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Pemesanan Penerbitan & Penjualan Buku
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Kelola pesanan paket penerbitan buku dari penulis dan pantau distribusi buku fisik dengan fitur edit data langsung.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'orders' ? (
            <>
              <button
                onClick={handleExportOrdersCSV}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Pesanan</span>
              </button>
              {isAdmin && (
                <button
                  onClick={onOpenNewOrderModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buat Pesanan Baru</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                type="button"
                onClick={downloadSalesTemplate}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                title="Unduh format template CSV untuk pengisian data penjualan buku"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh Template CSV</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                  title="Unggah berkas CSV penjualan buku dari Excel/Spreadsheet"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Impor CSV Penjualan</span>
                </button>
              )}

              <button
                onClick={handleExportSalesCSV}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Penjualan</span>
              </button>

              {isAdmin && (
                <button
                  onClick={onOpenNewSaleModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Penjualan Buku</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Nilai Pesanan Penerbitan
            </span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-neutral-900">
              {formatRupiah(totalOrdersAmount)}
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block">
              {orders.length} Kontrak SPK aktif
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Pembayaran Diterima (Inflow)
            </span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-emerald-700">
              {formatRupiah(totalPaidOrders)}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Tersisa piutang {formatRupiah(totalOrdersAmount - totalPaidOrders)}
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Sisa Piutang Penulis
            </span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-amber-700">
              {formatRupiah(Math.max(0, totalOrdersAmount - totalPaidOrders))}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Pelunasan sebelum naskah naik cetak
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Total Oplah Dipesan
            </span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-neutral-900">
              {orders.reduce((sum, o) => sum + o.copiesCount, 0).toLocaleString('id-ID')} Eks
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Rata-rata {Math.round(orders.reduce((sum, o) => sum + o.copiesCount, 0) / (orders.length || 1))} eks / naskah
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Omset Kotor (Bruto)
            </span>
            <div className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-900">
              {formatRupiah(totalSalesGross)}
            </div>
            <span className="text-[10px] text-neutral-400 mt-0.5 block">
              Harga normal sebelum diskon
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-medium text-rose-700 block">
              Total Diskon Diberikan
            </span>
            <div className="mt-1 font-mono text-lg font-bold tabular-nums text-rose-700">
              -{formatRupiah(totalSalesDiscount)}
            </div>
            <span className="text-[10px] text-neutral-400 mt-0.5 block">
              Promosi & potongan reseller
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-medium text-emerald-800 block">
              Total Tagihan Diterima (Net)
            </span>
            <div className="mt-1 font-mono text-lg font-bold tabular-nums text-emerald-800">
              {formatRupiah(totalSalesRevenue)}
            </div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block font-medium">
              Kas masuk dari pembeli
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Untung / Profit Bersih</span>
            </span>
            <div className="mt-1 font-mono text-lg font-extrabold tabular-nums text-emerald-900">
              +{formatRupiah(totalSalesProfit)}
            </div>
            <span className="text-[10px] text-emerald-800 mt-0.5 block font-medium">
              Margin {totalSalesRevenue > 0 ? ((totalSalesProfit / totalSalesRevenue) * 100).toFixed(1) : 0}% omset
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Volume Terjual
            </span>
            <div className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-900">
              {totalCopiesSold.toLocaleString('id-ID')} Eks
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              Dari {sales.length} transaksi penjualan
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pesanan Paket Penerbitan ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'sales'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Transaksi Penjualan Buku ({sales.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'orders'
                ? 'Cari no. order, penulis, judul naskah...'
                : 'Cari no. invoice, judul buku, kanal...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono tabular-nums">
          {activeTab === 'orders' ? filteredOrders.length : filteredSales.length} baris
        </span>
      </div>

      {/* Table Section: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">No. Order & Tanggal</th>
                  <th className="py-3 px-4">Penulis & Judul Naskah</th>
                  <th className="py-3 px-4">Paket & Oplah</th>
                  <th className="py-3 px-4">Total Nilai</th>
                  <th className="py-3 px-4">Status Bayar</th>
                  <th className="py-3 px-4">Target Terbit</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      Tidak ada pesanan penerbitan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-neutral-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {formatDateIndo(order.orderDate)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-neutral-900">
                          {order.authorName}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate" title={order.manuscriptTitle}>
                          "{order.manuscriptTitle}"
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-800">
                          {order.packageName}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {order.copiesCount} Eksemplar
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <div className="font-bold text-neutral-900">
                          {formatRupiah(order.totalPrice)}
                        </div>
                        <div className="text-[10px] text-emerald-700">
                          Terbayar: {formatRupiah(order.amountPaid)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            order.paymentStatus === 'lunas'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.paymentStatus === 'dp'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {order.paymentStatus === 'lunas' ? 'LUNAS' : 'DP MASUK'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600">
                        {formatDateIndo(order.targetPublishDate)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={`text-xs font-semibold mr-1 ${
                              order.status === 'selesai' ? 'text-emerald-700' : 'text-blue-700'
                            }`}
                          >
                            {order.status === 'selesai' ? 'Selesai' : 'Proses'}
                          </span>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onEditOrder(order)}
                                className="p-1 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                title="Edit pesanan"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    title: 'Hapus Pesanan Penerbitan',
                                    message: `Apakah Anda yakin ingin menghapus pesanan ${order.orderNumber} untuk penulis "${order.authorName}"?`,
                                    itemDetails: `Order: ${order.orderNumber} - Paket: ${order.packageName}`,
                                    type: 'order',
                                    id: order.id,
                                  })
                                }
                                className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Hapus pesanan (Admin)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table Section: Book Sales */}
      {activeTab === 'sales' && (
        <div className="space-y-3">
          {/* Bulk Action Bar (visible when items selected) */}
          {isAdmin && selectedSaleIds.length > 0 && (
            <div className="bg-emerald-950 text-white p-3 px-4 rounded-xl shadow-md flex items-center justify-between flex-wrap gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {selectedSaleIds.length}
                </span>
                <span className="text-xs font-medium text-emerald-100">
                  transaksi penjualan buku dipilih
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Edit Masal ({selectedSaleIds.length})</span>
                </button>
                {onDeleteMultipleSales && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        title: 'Hapus Masal Riwayat Penjualan Buku',
                        message: `Apakah Anda yakin ingin menghapus sekaligus ${selectedSaleIds.length} catatan transaksi penjualan buku terpilih? Data stok dan laporan keuangan terkait akan disesuaikan.`,
                        itemDetails: `${selectedSaleIds.length} invoice penjualan akan dihapus permanen.`,
                        type: 'sale',
                        id: '__bulk__',
                      });
                    }}
                    className="px-3 py-1.5 bg-rose-700/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSaleIds([])}
                  className="px-2.5 py-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    {isAdmin && (
                      <th className="py-3 px-3 text-center w-8">
                        <input
                          type="checkbox"
                          checked={
                            filteredSales.length > 0 &&
                            filteredSales.every((s) => selectedSaleIds.includes(s.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSaleIds(filteredSales.map((s) => s.id));
                            } else {
                              setSelectedSaleIds([]);
                            }
                          }}
                          className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                          title="Pilih Semua Transaksi Penjualan"
                        />
                      </th>
                    )}
                    <th className="py-3 px-4">No. Invoice & Tanggal</th>
                    <th className="py-3 px-4">Buku, Penulis & Pembeli</th>
                    <th className="py-3 px-4">Kanal Penjualan</th>
                    <th className="py-3 px-4 text-center">Oplah</th>
                    <th className="py-3 px-4 text-right">Harga Normal</th>
                    <th className="py-3 px-4 text-center">Diskon</th>
                    <th className="py-3 px-4 text-right">Total Dibayar</th>
                    <th className="py-3 px-4 text-right">Untung / Profit</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 10 : 8} className="py-12 text-center text-neutral-500">
                        Tidak ada riwayat penjualan buku ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => {
                      const isSelected = selectedSaleIds.includes(sale.id);
                      const discountPercent = sale.discountPercent || 0;
                      const discountAmount = sale.discountAmount || Math.round((sale.unitPrice * discountPercent) / 100);
                      const priceAfterDiscount = sale.priceAfterDiscount || (sale.unitPrice - discountAmount);
                      const hpp = sale.productionCostPerUnit || Math.round(sale.unitPrice * 0.35);
                      const profit = typeof sale.profit === 'number' ? sale.profit : (sale.totalAmount - hpp * sale.quantity);
                      const margin = sale.totalAmount > 0 ? ((profit / sale.totalAmount) * 100).toFixed(1) : '0';

                      return (
                        <tr
                          key={sale.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-emerald-50/60' : 'hover:bg-neutral-50/80'
                          }`}
                        >
                          {isAdmin && (
                            <td className="py-3.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedSaleIds((prev) =>
                                    prev.includes(sale.id)
                                      ? prev.filter((id) => id !== sale.id)
                                      : [...prev, sale.id]
                                  );
                                }}
                                className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                              />
                            </td>
                          )}

                          {/* Invoice & Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-neutral-900">
                              {sale.invoiceNumber}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {formatDateIndo(sale.date)}
                            </div>
                          </td>

                          {/* Title & Author & Customer */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-neutral-900 truncate">
                              {sale.bookTitle}
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              {sale.authorName}
                            </div>
                            {sale.customerName && (
                              <div className="text-[10px] text-emerald-800 font-medium mt-0.5 truncate">
                                Klien: {sale.customerName}
                              </div>
                            )}
                          </td>

                          {/* Channel */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-800 text-[11px]">
                              {sale.channel.includes('Marketplace') && <Store className="w-3.5 h-3.5 text-emerald-600" />}
                              {sale.channel.includes('Website') && <Globe className="w-3.5 h-3.5 text-blue-600" />}
                              {sale.channel.includes('Gramedia') && <Store className="w-3.5 h-3.5 text-amber-600" />}
                              {sale.channel.includes('Bazar') && <Truck className="w-3.5 h-3.5 text-purple-600" />}
                              <span>{sale.channel}</span>
                            </span>
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-900 tabular-nums">
                            {sale.quantity} Eks
                          </td>

                          {/* Normal Unit Price */}
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-600">
                            {formatRupiah(sale.unitPrice)}
                          </td>

                          {/* Discount */}
                          <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                            {discountPercent > 0 ? (
                              <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px] rounded">
                                -{discountPercent}%
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Total Paid (Tagihan) */}
                          <td className="py-3.5 px-4 text-right font-mono font-extrabold text-neutral-900 tabular-nums">
                            <div>{formatRupiah(sale.totalAmount)}</div>
                            {discountPercent > 0 && (
                              <div className="text-[9px] font-normal text-neutral-400">
                                @{formatRupiah(priceAfterDiscount)}
                              </div>
                            )}
                          </td>

                          {/* Profit / Untung */}
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                            <div className="font-extrabold text-emerald-800">
                              +{formatRupiah(profit)}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-medium">
                              {margin}% margin
                            </div>
                          </td>

                          {/* Actions: Edit & Delete */}
                          {isAdmin && (
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onEditSale(sale)}
                                  className="p-1.5 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                  title="Edit catatan penjualan"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      title: 'Hapus Riwayat Penjualan Buku',
                                      message: `Apakah Anda yakin ingin menghapus catatan penjualan invoice ${sale.invoiceNumber} untuk "${sale.bookTitle}"?`,
                                      itemDetails: `Invoice: ${sale.invoiceNumber} - Total Dibayar: ${formatRupiah(sale.totalAmount)}`,
                                      type: 'sale',
                                      id: sale.id,
                                    })
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Hapus transaksi penjualan (Admin)"
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
        onConfirm={() => {
          if (deleteModal.id === '__bulk__') {
            if (onDeleteMultipleSales && selectedSaleIds.length > 0) {
              onDeleteMultipleSales(selectedSaleIds);
              setSelectedSaleIds([]);
            }
          } else {
            handleConfirmDelete();
          }
        }}
      />

      {/* Bulk Edit Sales Modal */}
      <BulkEditSalesModal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        selectedSaleIds={selectedSaleIds}
        sales={sales}
        onConfirm={(ids, fields) => {
          if (onBulkEditSales) {
            onBulkEditSales(ids, fields);
          }
          setSelectedSaleIds([]);
          setIsBulkEditModalOpen(false);
        }}
      />

      {/* Import Sales CSV/Excel Modal */}
      <ImportSalesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        books={books}
        onImportSales={onImportSales}
      />
    </div>
  );
};
