import React, { useState } from 'react';
import { MonthlyGrowthData } from '../types';
import {
  formatRupiah,
  formatCompactRupiah,
} from '../utils/formatters';
import {
  TrendingUp,
  Target,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  BarChart2,
  Calendar,
} from 'lucide-react';

interface GrowthAnalyticsViewProps {
  growthData: MonthlyGrowthData[];
}

export const GrowthAnalyticsView: React.FC<GrowthAnalyticsViewProps> = ({
  growthData,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'financial' | 'leads' | 'publishing'>('financial');

  // Find max values for proper SVG scaling
  const maxRevenue = Math.max(...growthData.map((d) => d.revenue));
  const maxLeads = Math.max(...growthData.map((d) => d.leadsTotal));
  const maxCopies = Math.max(...growthData.map((d) => d.booksSoldCopies));

  // Current month vs starting month comparison
  const first = growthData[0];
  const latest = growthData[growthData.length - 1];

  const leadsGrowth = ((latest.leadsTotal - first.leadsTotal) / first.leadsTotal) * 100;
  const revenueGrowth = ((latest.revenue - first.revenue) / first.revenue) * 100;
  const closingGrowth = ((latest.leadsClosing - first.leadsClosing) / first.leadsClosing) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Analisis & Pertumbuhan</span>
            <span aria-hidden="true">·</span>
            <span>Bentala Aksara Bestari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Grafik Pertumbuhan Performa Bulanan
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Tren historis akuisisi naskah, tingkat konversi closing, oplah buku terjual, dan arus pendapatan penerbit.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveMetricTab('financial')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeMetricTab === 'financial'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pertumbuhan Finansial
          </button>
          <button
            onClick={() => setActiveMetricTab('leads')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeMetricTab === 'leads'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Leads & Konversi Closing
          </button>
          <button
            onClick={() => setActiveMetricTab('publishing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeMetricTab === 'publishing'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Penerbitan & Buku Terjual
          </button>
        </div>
      </div>

      {/* 3 Executive Growth Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Kenaikan Omset (6 Bulan)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              +{revenueGrowth.toFixed(1)}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold inline-flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Stabil
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Dari {formatCompactRupiah(first.revenue)} (Mei) naik menjadi {formatCompactRupiah(latest.revenue)} (Okt).
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Pertumbuhan Leads Masuk</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              +{leadsGrowth.toFixed(0)}%
            </span>
            <span className="text-xs text-blue-700 font-semibold inline-flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Ekspansi
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Dari {first.leadsTotal} leads per bulan kini mencapai {latest.leadsTotal} calon penulis baru.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Kenaikan Closing Deal SPK</span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              +{closingGrowth.toFixed(0)}%
            </span>
            <span className="text-xs text-violet-700 font-semibold inline-flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              13 Deal/Bln
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Efektivitas follow-up calon penulis meningkat menjadi rata-rata 19.1% closing rate.
          </p>
        </div>
      </div>

      {/* Main Interactive Chart Box */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs space-y-6">
        {/* Chart 1: Financial Trend (Revenue vs Expenses vs Profit) */}
        {activeMetricTab === 'financial' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Grafik Pertumbuhan Finansial Bulanan (IDR)
                </h2>
                <p className="text-xs text-neutral-500">
                  Perbandingan Pemasukan (Omset), Pengeluaran Operasional/Cetak, dan Laba Bersih
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-700" />
                  <span className="text-neutral-700">Pemasukan (Revenue)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" />
                  <span className="text-neutral-700">Pengeluaran (Expenses)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-600" />
                  <span className="text-neutral-700">Laba Bersih</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Bars */}
            <div className="pt-6">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-72 border-b border-neutral-200 pb-3">
                {growthData.map((d) => {
                  const revHeight = (d.revenue / maxRevenue) * 100;
                  const expHeight = (d.expenses / maxRevenue) * 100;
                  const netHeight = (d.netProfit / maxRevenue) * 100;

                  return (
                    <div
                      key={d.month}
                      className="flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] p-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap font-mono text-center">
                        <div className="font-bold">{d.monthLabel}</div>
                        <div className="text-emerald-400">Pemasukan: {formatCompactRupiah(d.revenue)}</div>
                        <div className="text-rose-400">Pengeluaran: {formatCompactRupiah(d.expenses)}</div>
                        <div className="text-blue-300">Laba: {formatCompactRupiah(d.netProfit)}</div>
                      </div>

                      {/* Grouped Bars */}
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        <div
                          style={{ height: `${revHeight}%` }}
                          className="w-1/3 bg-emerald-700 rounded-t-sm transition-all group-hover:bg-emerald-600"
                        />
                        <div
                          style={{ height: `${expHeight}%` }}
                          className="w-1/3 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400"
                        />
                        <div
                          style={{ height: `${netHeight}%` }}
                          className="w-1/3 bg-blue-600 rounded-t-sm transition-all group-hover:bg-blue-500"
                        />
                      </div>

                      <span className="text-[11px] font-medium text-neutral-600 mt-2 block text-center truncate w-full">
                        {d.monthLabel.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3 text-right">Pemasukan</th>
                    <th className="py-2.5 px-3 text-right">Pengeluaran</th>
                    <th className="py-2.5 px-3 text-right">Laba Bersih</th>
                    <th className="py-2.5 px-3 text-right">Net Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono tabular-nums">
                  {growthData.map((d) => (
                    <tr key={d.month} className="hover:bg-neutral-50">
                      <td className="py-2 px-3 font-sans font-medium text-neutral-800">
                        {d.monthLabel}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800 font-semibold">
                        {formatRupiah(d.revenue)}
                      </td>
                      <td className="py-2 px-3 text-right text-rose-600">
                        {formatRupiah(d.expenses)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-neutral-900">
                        {formatRupiah(d.netProfit)}
                      </td>
                      <td className="py-2 px-3 text-right font-sans text-neutral-600">
                        {((d.netProfit / d.revenue) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chart 2: Leads & Conversion Trend */}
        {activeMetricTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Grafik Pertumbuhan Leads & Closing Naskah
                </h2>
                <p className="text-xs text-neutral-500">
                  Tren volume calon penulis masuk vs penulis yang berhasil closing kontrak
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-neutral-300" />
                  <span className="text-neutral-700">Total Leads Masuk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-500" />
                  <span className="text-neutral-700">Tertarik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600" />
                  <span className="text-neutral-700">Closing Deal</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-72 border-b border-neutral-200 pb-3">
                {growthData.map((d) => {
                  const leadHeight = (d.leadsTotal / maxLeads) * 100;
                  const intHeight = (d.leadsInterested / maxLeads) * 100;
                  const closHeight = (d.leadsClosing / maxLeads) * 100;

                  return (
                    <div
                      key={d.month}
                      className="flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] p-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap font-mono text-center">
                        <div className="font-bold">{d.monthLabel}</div>
                        <div>Total Leads: {d.leadsTotal}</div>
                        <div className="text-blue-300">Tertarik: {d.leadsInterested}</div>
                        <div className="text-emerald-400 font-bold">Closing: {d.leadsClosing}</div>
                      </div>

                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        <div
                          style={{ height: `${leadHeight}%` }}
                          className="w-1/3 bg-neutral-300 rounded-t-sm transition-all"
                        />
                        <div
                          style={{ height: `${intHeight}%` }}
                          className="w-1/3 bg-blue-500 rounded-t-sm transition-all"
                        />
                        <div
                          style={{ height: `${closHeight}%` }}
                          className="w-1/3 bg-emerald-600 rounded-t-sm transition-all"
                        />
                      </div>

                      <span className="text-[11px] font-medium text-neutral-600 mt-2 block text-center truncate w-full">
                        {d.monthLabel.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Conversion Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3 text-center">Leads Masuk</th>
                    <th className="py-2.5 px-3 text-center">Dihubungi</th>
                    <th className="py-2.5 px-3 text-center">Data Tertarik</th>
                    <th className="py-2.5 px-3 text-center">Deal Closing</th>
                    <th className="py-2.5 px-3 text-right">Rasio Closing %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono tabular-nums">
                  {growthData.map((d) => (
                    <tr key={d.month} className="hover:bg-neutral-50">
                      <td className="py-2 px-3 font-sans font-medium text-neutral-800">
                        {d.monthLabel}
                      </td>
                      <td className="py-2 px-3 text-center">{d.leadsTotal}</td>
                      <td className="py-2 px-3 text-center text-neutral-700">{d.leadsContacted}</td>
                      <td className="py-2 px-3 text-center text-blue-700 font-semibold">{d.leadsInterested}</td>
                      <td className="py-2 px-3 text-center text-emerald-800 font-bold">{d.leadsClosing}</td>
                      <td className="py-2 px-3 text-right font-sans font-bold text-neutral-900">
                        {((d.leadsClosing / d.leadsTotal) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chart 3: Publishing & Book Sales Trend */}
        {activeMetricTab === 'publishing' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Grafik Penjualan Buku & Judul Diterbitkan
                </h2>
                <p className="text-xs text-neutral-500">
                  Perkembangan eksemplar buku terjual dan judul buku baru yang rilis ke pasar
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-500" />
                  <span className="text-neutral-700">Buku Terjual (Eksemplar)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-700" />
                  <span className="text-neutral-700">Judul Rilis</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-72 border-b border-neutral-200 pb-3">
                {growthData.map((d) => {
                  const copyHeight = (d.booksSoldCopies / maxCopies) * 100;

                  return (
                    <div
                      key={d.month}
                      className="flex flex-col items-center h-full justify-end group relative"
                    >
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] p-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap font-mono text-center">
                        <div className="font-bold">{d.monthLabel}</div>
                        <div className="text-amber-400">{d.booksSoldCopies} Eksemplar</div>
                        <div className="text-emerald-400">{d.publishedTitles} Judul Terbit</div>
                      </div>

                      <div className="w-full flex items-end justify-center h-full">
                        <div
                          style={{ height: `${copyHeight}%` }}
                          className="w-1/2 bg-amber-500 rounded-t-sm transition-all group-hover:bg-amber-600"
                        />
                      </div>

                      <span className="text-[11px] font-medium text-neutral-600 mt-2 block text-center truncate w-full">
                        {d.monthLabel.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3 text-center">Judul Buku Diterbitkan</th>
                    <th className="py-2.5 px-3 text-right">Eksemplar Buku Terjual</th>
                    <th className="py-2.5 px-3 text-right">Pertumbuhan Oplah %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono tabular-nums">
                  {growthData.map((d, i) => {
                    const prev = i > 0 ? growthData[i - 1].booksSoldCopies : d.booksSoldCopies;
                    const diff = i > 0 ? (((d.booksSoldCopies - prev) / prev) * 100).toFixed(1) : '-';
                    return (
                      <tr key={d.month} className="hover:bg-neutral-50">
                        <td className="py-2 px-3 font-sans font-medium text-neutral-800">
                          {d.monthLabel}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-800">
                          {d.publishedTitles} Judul
                        </td>
                        <td className="py-2 px-3 text-right text-neutral-900 font-bold">
                          {d.booksSoldCopies.toLocaleString('id-ID')} Eks
                        </td>
                        <td className="py-2 px-3 text-right font-sans text-emerald-700">
                          {diff !== '-' ? `+${diff}%` : 'Basis'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
