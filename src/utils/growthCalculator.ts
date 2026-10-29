import {
  Book,
  BookSale,
  FinancialTransaction,
  Lead,
  MonthlyGrowthData,
} from '../types';

export const computeDynamicMonthlyGrowth = (
  leads: Lead[],
  books: Book[],
  sales: BookSale[],
  transactions: FinancialTransaction[]
): MonthlyGrowthData[] => {
  // Base historical template (Mei - Sep 2026)
  const baseMonths: { month: string; monthLabel: string }[] = [
    { month: '2026-05', monthLabel: 'Mei 2026' },
    { month: '2026-06', monthLabel: 'Jun 2026' },
    { month: '2026-07', monthLabel: 'Jul 2026' },
    { month: '2026-08', monthLabel: 'Ags 2026' },
    { month: '2026-09', monthLabel: 'Sep 2026' },
    { month: '2026-10', monthLabel: 'Okt 2026 (Berjalan)' },
  ];

  return baseMonths.map((m) => {
    const isCurrentMonth = m.month === '2026-10';

    // Transactions in this month
    const monthTrx = transactions.filter((t) => t.date.startsWith(m.month));
    const revenue = monthTrx
      .filter((t) => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTrx
      .filter((t) => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = revenue - expenses;

    // Leads in this month
    const monthLeads = leads.filter((l) => l.createdAt.startsWith(m.month));
    // For October / current month, reflect live state
    const leadsTotal = isCurrentMonth ? (monthLeads.length || leads.length) : (monthLeads.length || 55);
    const leadsContacted = isCurrentMonth
      ? leads.filter((l) => l.contacted).length
      : Math.round(leadsTotal * 0.9);
    const leadsInterested = isCurrentMonth
      ? leads.filter((l) => l.status === 'tertarik').length
      : Math.round(leadsTotal * 0.4);
    const leadsClosing = isCurrentMonth
      ? leads.filter((l) => l.status === 'closing').length
      : Math.round(leadsTotal * 0.18);

    // Books sold in this month
    const monthSales = sales.filter((s) => s.date.startsWith(m.month));
    const booksSoldCopies = monthSales.reduce((sum, s) => sum + s.quantity, 0);

    // Published titles
    const publishedTitles = isCurrentMonth
      ? books.filter((b) => b.status === 'terbit_distribusi').length
      : 8;

    return {
      month: m.month,
      monthLabel: m.monthLabel,
      leadsTotal: isCurrentMonth ? leads.length : leadsTotal,
      leadsContacted: isCurrentMonth ? leads.filter((l) => l.contacted).length : leadsContacted,
      leadsInterested: isCurrentMonth ? leads.filter((l) => l.status === 'tertarik').length : leadsInterested,
      leadsClosing: isCurrentMonth ? leads.filter((l) => l.status === 'closing').length : leadsClosing,
      publishedTitles,
      booksSoldCopies: isCurrentMonth ? (booksSoldCopies || books.reduce((acc, b) => acc + b.soldCopies, 0)) : booksSoldCopies,
      revenue,
      expenses,
      netProfit,
    };
  });
};
