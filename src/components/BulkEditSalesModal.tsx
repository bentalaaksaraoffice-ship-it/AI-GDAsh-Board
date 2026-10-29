import React, { useState } from 'react';
import { BookSale } from '../types';
import { X, Check, AlertCircle, Layers } from 'lucide-react';

interface BulkEditSalesModalProps {
  isOpen: boolean;
  selectedSales: BookSale[];
  onClose: () => void;
  onSaveBulkEdit: (updatedFields: {
    channel?: BookSale['channel'];
    date?: string;
    discountPercent?: number;
    customerName?: string;
  }) => void;
}

export const BulkEditSalesModal: React.FC<BulkEditSalesModalProps> = ({
  isOpen,
  selectedSales,
  onClose,
  onSaveBulkEdit,
}) => {
  const [updateChannel, setUpdateChannel] = useState(false);
  const [channel, setChannel] = useState<BookSale['channel']>('Marketplace (Shopee/Tokopedia)');

  const [updateDate, setUpdateDate] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [updateDiscount, setUpdateDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  const [updateCustomer, setUpdateCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');

  if (!isOpen || selectedSales.length === 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateChannel && !updateDate && !updateDiscount && !updateCustomer) {
      alert('Silakan centang setidaknya satu bidang data yang ingin diperbarui secara masal.');
      return;
    }

    onSaveBulkEdit({
      channel: updateChannel ? channel : undefined,
      date: updateDate ? date : undefined,
      discountPercent: updateDiscount ? Number(discountPercent) : undefined,
      customerName: updateCustomer ? customerName.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Edit Masal Transaksi Penjualan Buku
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Memperbarui sekaligus <span className="font-bold text-emerald-700">{selectedSales.length} transaksi</span> terpilih
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 text-xs">
            <span className="font-semibold text-neutral-800 block mb-1">
              Petunjuk Edit Masal:
            </span>
            Centang opsi yang ingin Anda ubah nilainya. Bidang yang tidak dicentang akan mempertahankan data awal dari masing-masing transaksi.
          </div>

          {/* 1. Kanal Penjualan */}
          <div className={`p-3 rounded-lg border transition-all ${updateChannel ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-neutral-200'}`}>
            <label className="flex items-center gap-2 font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={updateChannel}
                onChange={(e) => setUpdateChannel(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Perbarui Kanal Penjualan</span>
            </label>
            {updateChannel && (
              <div className="mt-2.5 pl-6">
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Marketplace (Shopee/Tokopedia)">Marketplace (Shopee/Tokopedia)</option>
                  <option value="Gramedia & Toko Offline">Gramedia & Toko Offline</option>
                  <option value="Direct Website">Direct Website (bentalaaksara.com)</option>
                  <option value="Bazar Literasi & Kampus">Bazar Literasi & Kampus</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Tanggal Transaksi */}
          <div className={`p-3 rounded-lg border transition-all ${updateDate ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-neutral-200'}`}>
            <label className="flex items-center gap-2 font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={updateDate}
                onChange={(e) => setUpdateDate(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Perbarui Tanggal Transaksi</span>
            </label>
            {updateDate && (
              <div className="mt-2.5 pl-6">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>
            )}
          </div>

          {/* 3. Diskon (%) & Hitung Ulang Total/Untung */}
          <div className={`p-3 rounded-lg border transition-all ${updateDiscount ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-neutral-200'}`}>
            <label className="flex items-center gap-2 font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={updateDiscount}
                onChange={(e) => setUpdateDiscount(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Perbarui Persentase Diskon (%)</span>
            </label>
            {updateDiscount && (
              <div className="mt-2.5 pl-6 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-28 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-rose-700 focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="text-neutral-500">%</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Total harga yang harus dibayar dan laba/profit akan dihitung ulang secara otomatis berdasarkan harga normal buku masing-masing.
                </p>
              </div>
            )}
          </div>

          {/* 4. Nama Pembeli / Klien / Toko */}
          <div className={`p-3 rounded-lg border transition-all ${updateCustomer ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-neutral-200'}`}>
            <label className="flex items-center gap-2 font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={updateCustomer}
                onChange={(e) => setUpdateCustomer(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Perbarui Nama Pembeli / Klien / Toko</span>
            </label>
            {updateCustomer && (
              <div className="mt-2.5 pl-6">
                <input
                  type="text"
                  placeholder="Contoh: Mitra Toko Buku Gramedia"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Selected items summary */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Daftar Transaksi Yang Akan Diedit ({selectedSales.length})
            </span>
            <div className="max-h-32 overflow-y-auto space-y-1 pr-1 divide-y divide-neutral-100 border border-neutral-200 rounded-lg p-2 bg-neutral-50">
              {selectedSales.map((sale) => (
                <div key={sale.id} className="pt-1 first:pt-0 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-mono font-bold text-neutral-800">{sale.invoiceNumber}</span>
                    <span className="text-neutral-500 ml-1.5 font-medium truncate">
                      {sale.bookTitle} ({sale.quantity} eks)
                    </span>
                  </div>
                  <span className="font-mono text-neutral-600">
                    {sale.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg text-xs shadow-xs transition-colors"
            >
              Terapkan Perubahan Masal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
