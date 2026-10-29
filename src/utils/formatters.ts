import { LeadStatus, PublicationStatus } from '../types';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactRupiah = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }
  return formatRupiah(value);
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getLeadStatusLabel = (status: LeadStatus): string => {
  switch (status) {
    case 'tidak_ada_respon':
      return 'Tidak Ada Respon';
    case 'tidak_tertarik':
      return 'Tidak Tertarik';
    case 'tidak_saat_ini':
      return 'Tidak Saat Ini';
    case 'tertarik':
      return 'Tertarik';
    case 'closing':
      return 'Closing';
    default:
      return status;
  }
};

export const getLeadStatusColorClasses = (status: LeadStatus): {
  bg: string;
  text: string;
  border: string;
  indicator: string;
} => {
  switch (status) {
    case 'closing':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        indicator: 'bg-emerald-600',
      };
    case 'tertarik':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        indicator: 'bg-blue-600',
      };
    case 'tidak_saat_ini':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        indicator: 'bg-amber-600',
      };
    case 'tidak_tertarik':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        indicator: 'bg-rose-600',
      };
    case 'tidak_ada_respon':
      return {
        bg: 'bg-neutral-100',
        text: 'text-neutral-600',
        border: 'border-neutral-200',
        indicator: 'bg-neutral-400',
      };
    default:
      return {
        bg: 'bg-neutral-100',
        text: 'text-neutral-700',
        border: 'border-neutral-200',
        indicator: 'bg-neutral-400',
      };
  }
};

export const getPublicationStatusLabel = (status: PublicationStatus): string => {
  switch (status) {
    case 'naskah_masuk':
      return 'Naskah Masuk';
    case 'editing_layout':
      return 'Editing & Layout';
    case 'proofreading':
      return 'Proofreading';
    case 'desain_cover':
      return 'Desain Cover';
    case 'percetakan':
      return 'Percetakan';
    case 'terbit_distribusi':
      return 'Terbit & Distribusi';
    default:
      return status;
  }
};

export const getPublicationProgress = (status: PublicationStatus): number => {
  switch (status) {
    case 'naskah_masuk':
      return 15;
    case 'editing_layout':
      return 35;
    case 'proofreading':
      return 55;
    case 'desain_cover':
      return 75;
    case 'percetakan':
      return 90;
    case 'terbit_distribusi':
      return 100;
    default:
      return 0;
  }
};

export const exportToCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            const val = row[k];
            let cellStr = val === null || val === undefined ? '' : String(val);
            cellStr = cellStr.replace(/"/g, '""');
            if (cellStr.search(/("|,|\n)/g) >= 0) {
              cellStr = `"${cellStr}"`;
            }
            return cellStr;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
