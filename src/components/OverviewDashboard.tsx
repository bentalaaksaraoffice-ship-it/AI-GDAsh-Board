import React from 'react';
import {
  Author,
  Book,
  FinancialTransaction,
  Lead,
  PublishingOrder,
  MonthlyGrowthData,
} from '../types';
import {
  formatRupiah,
  formatCompactRupiah,
  getLeadStatusLabel,
  getLeadStatusColorClasses,
} from '../utils/formatters';
import {
  Users,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  Layers,
  ChevronRight,
  Send,
} from 'lucide-react';

interface OverviewDashboardProps {
  leads: Lead[];
  authors: Author[];
  books: Book[];
  orders: PublishingOrder[];
  transactions: FinancialTransaction[];
  growthData: MonthlyGrowthData[];
  onNavigateTab: (tab: string) => void;
  onOpenNewLeadModal: () => void;
  onOpenNewTransactionModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  leads,
  authors,
  books,
  orders,
  transactions,
  growthData,
  onNavigateTab,
  onOpenNewLeadModal,
  onOpenNewTransactionModal,
}) => {
  // Leads Metrics
  const totalLeads = leads.length;
  const contactedLeads = leads.filter((l) => l.contacted).length;
  const contactedRate = totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(1) : '0';

  const statusCounts = {
    tidak_ada_respon: leads.filter((l) => l.status === 'tidak_ada_respon').length,
    tidak_tertarik: leads.filter((l) => l.status === 'tidak_tertarik').length,
    tidak_saat_ini: leads.filter((l) => l.status === 'tidak_saat_ini').length,
    tertarik: leads.filter((l) => l.status === 'tertarik').length,
    closing: leads.filter((l) => l.status === 'closing').length,
  };

  // Books & Authors Metrics
  const totalAuthors = authors.length;
  const totalBooks = books.length;
  const publishedBooks = books.filter((b) => b.status === 'terbit_distribusi').length;
  const inProductionBooks = totalBooks - publishedBooks;
  const totalSoldCopies = books.reduce((acc, curr) => acc + curr.soldCopies, 0);

  // Orders Metrics
  const totalOrdersValue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'proses').length;

  // Financial Metrics (Current Month - October 2026 or all verified)
  const totalRevenue = transactions
    .filter((t) => t.type === 'pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Latest monthly trend
  const latestMonth = growthData[growthData.length - 1];
  const prevMonth = growthData[growthData.length - 2];
  const revenueGrowthPct = prevMonth
    ? (((latestMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
    : '12.4';

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Key Summary Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 md:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Bentala Aksara Bestari</span>
              <span aria-hidden="true">·</span>
              <span>Penerbitan Buku & Manajemen Keuangan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
              Ringkasan Aktivitas Penerbitan & Finansial
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Pantauan menyeluruh terhadap perolehan leads, status naskah penulis, pesanan penerbitan, eksemplar terjual, dan arus kas perusahaan.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('growth')}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lihat Grafik Performa</span>
            </button>
            <button
              onClick={() => onNavigateTab('finance')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Laporan Keuangan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Grid - 6 Primary Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Leads Didapatkan & Dihubungi */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Leads</span>
            <PhoneCall className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              {totalLeads}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {contactedRate}% Dihubungi
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>{contactedLeads} sudah dihubungi</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 2. Leads Tertarik & Closing */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Tertarik & Closing</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
              {statusCounts.closing}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              / {statusCounts.tertarik} Tertarik
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>
              Konversi Closing {totalLeads > 0 ? ((statusCounts.closing / totalLeads) * 100).toFixed(0) : 0}%
            </span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 3. Jumlah Penulis Aktif */}
        <div
          onClick={() => onNavigateTab('books')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Mitra Penulis</span>
            <Users className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              {totalAuthors}
            </span>
            <span className="text-xs text-neutral-500">Penulis Aktif</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Dosen, Sastrawan, Pegiat</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 4. Jumlah Judul Buku */}
        <div
          onClick={() => onNavigateTab('books')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Katalog Judul Buku</span>
            <BookOpen className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              {totalBooks}
            </span>
            <span className="text-xs text-neutral-500">Judul</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>{publishedBooks} Terbit · {inProductionBooks} Proses</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 5. Penjualan Buku (Eksemplar) */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Buku Terjual</span>
            <ShoppingBag className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              {totalSoldCopies.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-neutral-500">Eksemplar</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Online & Toko Buku</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 6. Laba Bersih Perusahaan */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="bg-white border border-neutral-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Laba Bersih Realtime</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
              {formatCompactRupiah(netProfit)}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Margin {profitMargin}%</span>
            <span className="text-emerald-600 font-medium">+{revenueGrowthPct}%</span>
          </div>
        </div>
      </div>

      {/* Second Row: Detailed Breakdown Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Status Data Leads Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Status Pipeline Data Leads Masuk
              </h2>
              <p className="text-xs text-neutral-500">
                Kualifikasi calon penulis dan status kesepakatan penerbitan naskah
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <span>Kelola di CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Progress Funnel Bar */}
          <div className="space-y-3 pt-2">
            <div className="w-full h-3 rounded-full overflow-hidden bg-neutral-100 flex">
              <div
                style={{ width: `${(statusCounts.closing / totalLeads) * 100}%` }}
                className="bg-emerald-600 h-full transition-all"
                title={`Closing: ${statusCounts.closing}`}
              />
              <div
                style={{ width: `${(statusCounts.tertarik / totalLeads) * 100}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Tertarik: ${statusCounts.tertarik}`}
              />
              <div
                style={{ width: `${(statusCounts.tidak_saat_ini / totalLeads) * 100}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`Tidak Saat Ini: ${statusCounts.tidak_saat_ini}`}
              />
              <div
                style={{ width: `${(statusCounts.tidak_tertarik / totalLeads) * 100}%` }}
                className="bg-rose-400 h-full transition-all"
                title={`Tidak Tertarik: ${statusCounts.tidak_tertarik}`}
              />
              <div
                style={{ width: `${(statusCounts.tidak_ada_respon / totalLeads) * 100}%` }}
                className="bg-neutral-300 h-full transition-all"
                title={`Tidak Ada Respon: ${statusCounts.tidak_ada_respon}`}
              />
            </div>

            {/* Status Item Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {/* Closing */}
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Closing</span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-emerald-900">
                  {statusCounts.closing}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  Deal Kontrak & SPK
                </div>
              </div>

              {/* Tertarik */}
              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Tertarik</span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-blue-900">
                  {statusCounts.tertarik}
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5">
                  Tahap Proposal & Naskah
                </div>
              </div>

              {/* Tidak Saat Ini */}
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Tidak Saat Ini</span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-amber-900">
                  {statusCounts.tidak_saat_ini}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  Revisi Naskah / Tunda
                </div>
              </div>

              {/* Tidak Tertarik */}
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>Tidak Tertarik</span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-rose-900">
                  {statusCounts.tidak_tertarik}
                </div>
                <div className="text-[10px] text-rose-700 mt-0.5">
                  Batal / Opsi Lain
                </div>
              </div>

              {/* Tidak Ada Respon */}
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span>Tidak Respon</span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-neutral-800">
                  {statusCounts.tidak_ada_respon}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Antrean Follow-up
                </div>
              </div>
            </div>
          </div>

          {/* Quick Lead Action Table */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                Calon Penulis Perlu Tindak Lanjut Segera
              </span>
              <button
                onClick={onOpenNewLeadModal}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                + Tambah Lead
              </button>
            </div>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
              {leads
                .filter((l) => l.status === 'tertarik' || l.status === 'closing')
                .slice(0, 3)
                .map((lead) => {
                  const style = getLeadStatusColorClasses(lead.status);
                  return (
                    <div
                      key={lead.id}
                      className="p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-900 truncate">
                            {lead.name}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}
                          >
                            {getLeadStatusLabel(lead.status)}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 truncate mt-0.5">
                          "{lead.manuscriptTitle}" · <span className="text-neutral-400">{lead.genre}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs font-semibold tabular-nums text-neutral-800 hidden sm:inline">
                          {formatRupiah(lead.estimatedValue)}
                        </span>
                        <a
                          href={`https://wa.me/62${lead.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                            `Halo Bapak/Ibu ${lead.name}, salam literasi dari Penerbit Bentala Aksara Bestari. Mengenai kelanjutan naskah "${lead.manuscriptTitle}", kami siap mendiskusikan paket penerbitannya.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Hubungi</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Keuangan & Arus Transaksi Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Laporan Keuangan Otomatis
                </h2>
                <p className="text-xs text-neutral-500">
                  Rekapitulasi pemasukan & pengeluaran operasional
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('finance')}
                className="text-xs font-medium text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
              >
                <span>Buku Kas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Income vs Expense Balance Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-600">Total Pemasukan</span>
                <span className="font-mono text-sm font-bold tabular-nums text-emerald-700">
                  {formatRupiah(totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-600">Total Pengeluaran</span>
                <span className="font-mono text-sm font-bold tabular-nums text-rose-600">
                  {formatRupiah(totalExpense)}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Laba Bersih Operasional
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Net Profit Margin: {profitMargin}%
                  </span>
                </div>
                <span className="font-mono text-base font-extrabold tabular-nums text-emerald-800">
                  {formatRupiah(netProfit)}
                </span>
              </div>
            </div>

            {/* Key Expense Categories Breakdown */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                Alokasi Pengeluaran Terbesar
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Percetakan & Kertas</span>
                  <span className="font-mono font-medium tabular-nums text-neutral-800">
                    Rp 20.000.000
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Royalti Penulis</span>
                  <span className="font-mono font-medium tabular-nums text-neutral-800">
                    Rp 9.700.000
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Fee Editor, Layout & Ilustrasi</span>
                  <span className="font-mono font-medium tabular-nums text-neutral-800">
                    Rp 7.400.000
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-neutral-600">Pemasaran, Kantor & Logistik</span>
                  <span className="font-mono font-medium tabular-nums text-neutral-800">
                    Rp 8.750.000
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
            <button
              onClick={onOpenNewTransactionModal}
              className="flex-1 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-center"
            >
              + Catat Pengeluaran
            </button>
            <button
              onClick={() => onNavigateTab('finance')}
              className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors text-center shadow-xs"
            >
              Unduh Rekap P&L
            </button>
          </div>
        </div>
      </div>

      {/* Third Row: Tahapan Produksi Naskah Buku & Pemesanan Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Naskah dalam Pipeline Produksi */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Alur Tahapan Produksi Buku Berjalan
              </h2>
              <p className="text-xs text-neutral-500">
                Monitoring naskah dari masuk redaksi hingga terbit dan distribusi
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('books')}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <span>Katalog Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {books
              .filter((b) => b.status !== 'terbit_distribusi')
              .map((book) => {
                const stages = [
                  { id: 'naskah_masuk', label: 'Naskah' },
                  { id: 'editing_layout', label: 'Editing' },
                  { id: 'proofreading', label: 'Proofreading' },
                  { id: 'desain_cover', label: 'Cover' },
                  { id: 'percetakan', label: 'Cetak' },
                ];
                const stageIndex = stages.findIndex((s) => s.id === book.status);

                return (
                  <div
                    key={book.id}
                    className="p-3 border border-neutral-200 rounded-lg bg-neutral-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs font-bold text-neutral-900">
                          {book.title}
                        </span>
                        <div className="text-[11px] text-neutral-500">
                          Penulis: <span className="font-medium text-neutral-700">{book.authorName}</span> · {book.genre}
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                        Target Terbit: {book.publishDate || 'Segera'}
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {stages.map((stage, idx) => {
                        const isDone = idx <= stageIndex;
                        const isCurrent = idx === stageIndex;
                        return (
                          <div key={stage.id} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full ${
                                isDone
                                  ? isCurrent
                                    ? 'bg-emerald-600 ring-2 ring-emerald-200'
                                    : 'bg-emerald-500'
                                  : 'bg-neutral-200'
                              }`}
                            />
                            <span
                              className={`block text-[10px] text-center font-medium truncate ${
                                isCurrent
                                  ? 'text-emerald-800 font-bold'
                                  : isDone
                                  ? 'text-neutral-700'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Pemesanan Paket Penerbitan Terbaru */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Pesanan Penerbitan
              </h2>
              <p className="text-xs text-neutral-500">
                {activeOrdersCount} paket sedang dikerjakan
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <span>Semua Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-500 text-[11px]">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      order.paymentStatus === 'lunas'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.paymentStatus === 'lunas' ? 'LUNAS' : 'DP 50%'}
                  </span>
                </div>
                <div className="text-xs font-bold text-neutral-900">
                  {order.authorName}
                </div>
                <div className="text-[11px] text-neutral-500 truncate">
                  {order.packageName}
                </div>
                <div className="pt-1 flex items-center justify-between text-xs border-t border-neutral-100">
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {order.copiesCount} Eks
                  </span>
                  <span className="font-mono font-bold tabular-nums text-neutral-900">
                    {formatRupiah(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Total Akumulasi Order</span>
              <span className="text-[11px] text-emerald-700">Tahun 2026</span>
            </div>
            <span className="font-mono font-bold text-base tabular-nums">
              {formatCompactRupiah(totalOrdersValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
