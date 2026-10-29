import React, { useState, useRef } from 'react';
import { BookSale, Book } from '../types';
import { formatRupiah, exportToCSV } from '../utils/formatters';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface ImportSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onImportSales: (newSales: BookSale[]) => void;
}

export const downloadSalesTemplate = () => {
  const templateRows = [
    {
      Invoice: 'INV/SL/IMPORT/001',
      JudulBuku: 'Hujan di Atas Genting Batavia',
      NamaPenulis: 'Citra Kirana Anggraini',
      KanalPenjualan: 'Marketplace (Shopee/Tokopedia)',
      JumlahEksemplar: 25,
      HargaNormalSatuan: 94000,
      PersentaseDiskon: 10,
      HPPCetakSatuan: 32000,
      NamaPembeli: 'Reseller Shopee Jakarta',
      TanggalPenjualan: new Date().toISOString().slice(0, 10),
    },
    {
      Invoice: 'INV/SL/IMPORT/002',
      JudulBuku: 'Termodinamika Lanjutan & Konversi Energi',
      NamaPenulis: 'Prof. Dr. Ir. Wahyudi, M.T.',
      KanalPenjualan: 'Bazar Literasi & Kampus',
      JumlahEksemplar: 15,
      HargaNormalSatuan: 135000,
      PersentaseDiskon: 5,
      HPPCetakSatuan: 46000,
      NamaPembeli: 'Fakultas Teknik UGM',
      TanggalPenjualan: new Date().toISOString().slice(0, 10),
    },
    {
      Invoice: 'INV/SL/IMPORT/003',
      JudulBuku: 'Tari Lilin di Ujung Senja (Kumpulan Cerpen)',
      NamaPenulis: 'Anindita Sekar Wardani',
      KanalPenjualan: 'Direct Website',
      JumlahEksemplar: 10,
      HargaNormalSatuan: 78000,
      PersentaseDiskon: 0,
      HPPCetakSatuan: 26000,
      NamaPembeli: 'Pelanggan Toko Web',
      TanggalPenjualan: new Date().toISOString().slice(0, 10),
    },
  ];

  exportToCSV('Template_Import_Penjualan_Bentala', templateRows);
};

export const ImportSalesModal: React.FC<ImportSalesModalProps> = ({
  isOpen,
  onClose,
  books,
  onImportSales,
}) => {
  const [parsedData, setParsedData] = useState<BookSale[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File CSV kosong.');

        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('File harus memiliki baris judul kolom dan minimal satu baris data.');
        }

        // Detect separator (, or ;)
        const firstLine = lines[0];
        const separator = firstLine.includes(';') ? ';' : ',';

        // Parse line into tokens respecting quotes
        const parseLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === separator && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result.map((col) => col.replace(/^["']|["']$/g, '').trim());
        };

        const headers = parseLine(lines[0]).map((h) =>
          h.toLowerCase().replace(/[^a-z0-9]/g, '')
        );

        // Find header index
        const getColIdx = (aliases: string[]) => {
          return headers.findIndex((h) => aliases.some((a) => h.includes(a)));
        };

        const invoiceIdx = getColIdx(['invoice', 'nomor', 'inv']);
        const titleIdx = getColIdx(['judul', 'buku', 'title']);
        const authorIdx = getColIdx(['penulis', 'author', 'nama']);
        const channelIdx = getColIdx(['kanal', 'channel', 'saluran', 'metode']);
        const qtyIdx = getColIdx(['jumlah', 'eksemplar', 'qty', 'oplah', 'kuantitas']);
        const priceIdx = getColIdx(['harganormal', 'harga', 'hargasatuan', 'price', 'unitprice']);
        const discountIdx = getColIdx(['diskon', 'discount', 'persentase', 'potongan']);
        const hppIdx = getColIdx(['hpp', 'biayacetak', 'cost', 'modal']);
        const customerIdx = getColIdx(['pembeli', 'customer', 'toko', 'klien']);
        const dateIdx = getColIdx(['tanggal', 'date', 'tgl']);

        const parsedSales: BookSale[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = parseLine(lines[i]);
          if (cols.length < 3 || cols.every((c) => !c)) continue;

          const rawTitle = titleIdx >= 0 ? cols[titleIdx] : cols[1] || 'Buku Bentala';
          // Match existing book if possible
          const matchedBook = books.find(
            (b) => b.title.toLowerCase().includes(rawTitle.toLowerCase()) || rawTitle.toLowerCase().includes(b.title.toLowerCase())
          );

          const bookTitle = matchedBook ? matchedBook.title : rawTitle;
          const authorName =
            authorIdx >= 0 && cols[authorIdx]
              ? cols[authorIdx]
              : matchedBook
              ? matchedBook.authorName
              : 'Penulis Bentala';

          const bookId = matchedBook ? matchedBook.id : `bk-custom-${Date.now()}-${i}`;
          const rawQty = qtyIdx >= 0 ? Number(cols[qtyIdx]?.replace(/[^0-9]/g, '')) : 1;
          const quantity = rawQty > 0 ? rawQty : 1;

          const rawPrice =
            priceIdx >= 0
              ? Number(cols[priceIdx]?.replace(/[^0-9]/g, ''))
              : matchedBook
              ? matchedBook.price
              : 85000;
          const unitPrice = rawPrice > 0 ? rawPrice : 85000;

          const rawDiscount =
            discountIdx >= 0 ? Number(cols[discountIdx]?.replace(/[^0-9.]/g, '')) : 0;
          const discountPercent = isNaN(rawDiscount) ? 0 : Math.min(100, Math.max(0, rawDiscount));

          const discountAmount = Math.round((unitPrice * discountPercent) / 100);
          const priceAfterDiscount = unitPrice - discountAmount;
          const totalAmount = priceAfterDiscount * quantity;

          const rawHPP =
            hppIdx >= 0
              ? Number(cols[hppIdx]?.replace(/[^0-9]/g, ''))
              : matchedBook
              ? matchedBook.productionCost
              : Math.round(unitPrice * 0.35);
          const productionCostPerUnit = rawHPP > 0 ? rawHPP : Math.round(unitPrice * 0.35);
          const profit = totalAmount - productionCostPerUnit * quantity;

          const rawChannel = channelIdx >= 0 ? cols[channelIdx] : '';
          let channel: BookSale['channel'] = 'Marketplace (Shopee/Tokopedia)';
          if (rawChannel.toLowerCase().includes('gramedia') || rawChannel.toLowerCase().includes('offline')) {
            channel = 'Gramedia & Toko Offline';
          } else if (rawChannel.toLowerCase().includes('web') || rawChannel.toLowerCase().includes('direct')) {
            channel = 'Direct Website';
          } else if (rawChannel.toLowerCase().includes('bazar') || rawChannel.toLowerCase().includes('kampus')) {
            channel = 'Bazar Literasi & Kampus';
          }

          const invoiceNumber =
            invoiceIdx >= 0 && cols[invoiceIdx]
              ? cols[invoiceIdx]
              : `INV/SL/IMP/${Date.now().toString().slice(-4)}${i}`;

          const customerName =
            customerIdx >= 0 && cols[customerIdx] ? cols[customerIdx] : 'Pembeli Kolektif';

          const date =
            dateIdx >= 0 && cols[dateIdx] && cols[dateIdx].includes('-')
              ? cols[dateIdx]
              : new Date().toISOString().slice(0, 10);

          parsedSales.push({
            id: `sl-imp-${Date.now()}-${i}`,
            invoiceNumber,
            bookId,
            bookTitle,
            authorName,
            channel,
            quantity,
            unitPrice,
            discountPercent,
            discountAmount,
            priceAfterDiscount,
            totalAmount,
            productionCostPerUnit,
            profit,
            customerName,
            date,
          });
        }

        if (parsedSales.length === 0) {
          throw new Error('Tidak ada baris data penjualan yang dapat dibaca dengan benar.');
        }

        setParsedData(parsedSales);
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal memproses file CSV.');
        setParsedData([]);
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    onImportSales(parsedData);
    onClose();
  };

  const totalCopies = parsedData.reduce((acc, s) => acc + s.quantity, 0);
  const totalGross = parsedData.reduce((acc, s) => acc + s.unitPrice * s.quantity, 0);
  const totalNet = parsedData.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = parsedData.reduce((acc, s) => acc + s.profit, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Impor Data Penjualan Buku (CSV / Excel)
              </h3>
              <p className="text-[11px] text-neutral-500">
                Unggah catatan transaksi penjualan buku secara massal
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Step 1: Template Download Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Format Template CSV Penjualan</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Pastikan susunan kolom file sesuai standar agar diskon, tagihan, dan laba bersih dihitung secara otomatis.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadSalesTemplate}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Step 2: Upload Dropzone */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1.5">
              Pilih Berkas CSV Penjualan:
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-emerald-600 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-emerald-50/40"
            >
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <div className="font-semibold text-neutral-800 text-xs">
                {fileName ? `File terpilih: ${fileName}` : 'Klik untuk memilih file CSV'}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Mendukung berkas CSV hasil ekspor Microsoft Excel atau Google Spreadsheet
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preview Parsed Data */}
          {parsedData.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pratinjau Data Terbaca ({parsedData.length} Baris Transaksi)</span>
                </span>
                <span className="text-[11px] text-neutral-500">
                  Total Eksemplar: <strong>{totalCopies}</strong>
                </span>
              </div>

              {/* KPI Summary of the Import */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-[10px] text-neutral-500 font-medium">Total Eksemplar</div>
                  <div className="text-sm font-bold text-neutral-900 font-mono mt-0.5">
                    {totalCopies} <span className="text-[10px] font-normal text-neutral-500">eks</span>
                  </div>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-[10px] text-neutral-500 font-medium">Omset Normal</div>
                  <div className="text-sm font-bold text-neutral-900 font-mono mt-0.5">
                    {formatRupiah(totalGross)}
                  </div>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-[10px] text-neutral-500 font-medium">Total Dibayar (Net)</div>
                  <div className="text-sm font-bold text-emerald-900 font-mono mt-0.5">
                    {formatRupiah(totalNet)}
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-700" />
                    <span>Total Laba Bersih</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-800 font-mono mt-0.5">
                    +{formatRupiah(totalProfit)}
                  </div>
                </div>
              </div>

              {/* Table Preview */}
              <div className="max-h-56 overflow-y-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-neutral-100 text-neutral-700 sticky top-0 font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="p-2">Invoice & Tgl</th>
                      <th className="p-2">Judul Buku</th>
                      <th className="p-2 text-center">Oplah</th>
                      <th className="p-2 text-right">Harga Normal</th>
                      <th className="p-2 text-center">Diskon</th>
                      <th className="p-2 text-right">Total Dibayar</th>
                      <th className="p-2 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {parsedData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-2 font-mono whitespace-nowrap">
                          <div className="font-semibold text-neutral-900">{row.invoiceNumber}</div>
                          <div className="text-[10px] text-neutral-500">{row.date}</div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-neutral-900 truncate max-w-[180px]">
                            {row.bookTitle}
                          </div>
                          <div className="text-[10px] text-neutral-500 truncate max-w-[180px]">
                            {row.channel}
                          </div>
                        </td>
                        <td className="p-2 text-center font-mono font-medium">{row.quantity}</td>
                        <td className="p-2 text-right font-mono">{formatRupiah(row.unitPrice)}</td>
                        <td className="p-2 text-center font-mono text-neutral-600">
                          {row.discountPercent > 0 ? `${row.discountPercent}%` : '-'}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-neutral-900">
                          {formatRupiah(row.totalAmount)}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-800">
                          +{formatRupiah(row.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <div className="text-center text-[10px] text-neutral-500 italic">
                  ... dan {parsedData.length - 10} baris lainnya akan ikut diimpor.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg text-xs transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0}
            onClick={handleConfirmImport}
            className={`px-5 py-2 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
              parsedData.length > 0
                ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Konfirmasi Impor ({parsedData.length} Penjualan)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
