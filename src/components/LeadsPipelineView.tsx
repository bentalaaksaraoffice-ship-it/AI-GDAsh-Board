import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, UserRole } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  getLeadStatusLabel,
  getLeadStatusColorClasses,
  exportToCSV,
} from '../utils/formatters';
import {
  Search,
  Download,
  Plus,
  Send,
  CheckCircle,
  Clock,
  Trash2,
  Pencil,
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface LeadsPipelineViewProps {
  leads: Lead[];
  userRole: UserRole;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onToggleContacted: (leadId: string) => void;
  onOpenNewLeadModal: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onDeleteMultipleLeads: (leadIds: string[]) => void;
}

export const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({
  leads,
  userRole,
  onUpdateLeadStatus,
  onToggleContacted,
  onOpenNewLeadModal,
  onEditLead,
  onDeleteLead,
  onDeleteMultipleLeads,
}) => {
  const isAdmin = userRole === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedContactedFilter, setSelectedContactedFilter] = useState<string>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    targetId?: string;
    isBatch?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Counts per status
  const counts = useMemo(() => {
    return {
      all: leads.length,
      closing: leads.filter((l) => l.status === 'closing').length,
      tertarik: leads.filter((l) => l.status === 'tertarik').length,
      tidak_saat_ini: leads.filter((l) => l.status === 'tidak_saat_ini').length,
      tidak_tertarik: leads.filter((l) => l.status === 'tidak_tertarik').length,
      tidak_ada_respon: leads.filter((l) => l.status === 'tidak_ada_respon').length,
      contacted: leads.filter((l) => l.contacted).length,
      uncontacted: leads.filter((l) => !l.contacted).length,
    };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.manuscriptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchStatus =
        selectedStatus === 'all' ? true : lead.status === selectedStatus;

      const matchContacted =
        selectedContactedFilter === 'all'
          ? true
          : selectedContactedFilter === 'contacted'
          ? lead.contacted
          : !lead.contacted;

      return matchSearch && matchStatus && matchContacted;
    });
  }, [leads, searchQuery, selectedStatus, selectedContactedFilter]);

  // Bulk selection toggles
  const handleToggleSelectAll = () => {
    if (!isAdmin) return;
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (!isAdmin) return;
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const dataToExport = filteredLeads.map((l) => ({
      Nama: l.name,
      Kontak: l.phone,
      Email: l.email,
      Kota: l.city,
      JudulNaskah: l.manuscriptTitle,
      Genre: l.genre,
      StatusLeads: getLeadStatusLabel(l.status),
      Dihubungi: l.contacted ? 'Sudah' : 'Belum',
      EstimasiNilai: l.estimatedValue,
      EstimasiPaket: l.estimatedPackage,
      SumberLeads: l.source,
      TanggalMasuk: l.createdAt,
      Catatan: l.notes,
    }));
    exportToCSV(`Leads_Bentala_Aksara_${new Date().toISOString().slice(0, 10)}`, dataToExport);
  };

  const handleConfirmDelete = () => {
    if (deleteModal.isBatch) {
      onDeleteMultipleLeads(selectedLeadIds);
      setSelectedLeadIds([]);
    } else if (deleteModal.targetId) {
      onDeleteLead(deleteModal.targetId);
      setSelectedLeadIds((prev) => prev.filter((id) => id !== deleteModal.targetId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>CRM & Akuisisi Naskah</span>
            <span aria-hidden="true">·</span>
            <span>Bentala Aksara Bestari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Pipeline Leads & Calon Penulis
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
            Kelola data calon penulis, pantau tahapan ketertarikan, dan edit data naskah secara dinamis.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {isAdmin && selectedLeadIds.length > 0 && (
            <button
              onClick={() =>
                setDeleteModal({
                  isOpen: true,
                  title: `Hapus ${selectedLeadIds.length} Lead Terpilih`,
                  message: `Anda akan menghapus ${selectedLeadIds.length} data calon penulis dari database. Tindakan ini permanen.`,
                  itemDetails: `${selectedLeadIds.length} rekaman data terpilih akan dihapus.`,
                  isBatch: true,
                })
              }
              className="px-3 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedLeadIds.length})</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenNewLeadModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Lead Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Semua */}
        <button
          onClick={() => setSelectedStatus('all')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'all'
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <span className={`text-[11px] block font-medium ${selectedStatus === 'all' ? 'text-neutral-300' : 'text-neutral-500'}`}>
            Total Leads
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xl font-bold tabular-nums">
              {counts.all}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'all' ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}`}>
              {counts.contacted} Dihubungi
            </span>
          </div>
        </button>

        {/* Closing */}
        <button
          onClick={() => setSelectedStatus('closing')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'closing'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className={`text-[11px] font-medium ${selectedStatus === 'closing' ? 'text-emerald-100' : 'text-neutral-600'}`}>
              Closing
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`font-mono text-xl font-bold tabular-nums ${selectedStatus === 'closing' ? 'text-white' : 'text-emerald-700'}`}>
              {counts.closing}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'closing' ? 'text-emerald-200' : 'text-neutral-400'}`}>
              Deal SPK
            </span>
          </div>
        </button>

        {/* Tertarik */}
        <button
          onClick={() => setSelectedStatus('tertarik')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'tertarik'
              ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className={`text-[11px] font-medium ${selectedStatus === 'tertarik' ? 'text-blue-100' : 'text-neutral-600'}`}>
              Tertarik
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`font-mono text-xl font-bold tabular-nums ${selectedStatus === 'tertarik' ? 'text-white' : 'text-blue-700'}`}>
              {counts.tertarik}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'tertarik' ? 'text-blue-200' : 'text-neutral-400'}`}>
              Evaluasi Naskah
            </span>
          </div>
        </button>

        {/* Tidak Saat Ini */}
        <button
          onClick={() => setSelectedStatus('tidak_saat_ini')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'tidak_saat_ini'
              ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className={`text-[11px] font-medium ${selectedStatus === 'tidak_saat_ini' ? 'text-amber-100' : 'text-neutral-600'}`}>
              Tidak Saat Ini
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`font-mono text-xl font-bold tabular-nums ${selectedStatus === 'tidak_saat_ini' ? 'text-white' : 'text-amber-700'}`}>
              {counts.tidak_saat_ini}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'tidak_saat_ini' ? 'text-amber-200' : 'text-neutral-400'}`}>
              Tunda Jadwal
            </span>
          </div>
        </button>

        {/* Tidak Tertarik */}
        <button
          onClick={() => setSelectedStatus('tidak_tertarik')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'tidak_tertarik'
              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className={`text-[11px] font-medium ${selectedStatus === 'tidak_tertarik' ? 'text-rose-100' : 'text-neutral-600'}`}>
              Tidak Tertarik
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`font-mono text-xl font-bold tabular-nums ${selectedStatus === 'tidak_tertarik' ? 'text-white' : 'text-rose-700'}`}>
              {counts.tidak_tertarik}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'tidak_tertarik' ? 'text-rose-200' : 'text-neutral-400'}`}>
              Pilihan Mandiri
            </span>
          </div>
        </button>

        {/* Tidak Ada Respon */}
        <button
          onClick={() => setSelectedStatus('tidak_ada_respon')}
          className={`p-3 text-left rounded-xl border transition-all ${
            selectedStatus === 'tidak_ada_respon'
              ? 'bg-neutral-700 text-white border-neutral-700 shadow-xs'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <span className={`text-[11px] font-medium ${selectedStatus === 'tidak_ada_respon' ? 'text-neutral-200' : 'text-neutral-600'}`}>
              Tidak Respon
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`font-mono text-xl font-bold tabular-nums ${selectedStatus === 'tidak_ada_respon' ? 'text-white' : 'text-neutral-700'}`}>
              {counts.tidak_ada_respon}
            </span>
            <span className={`text-[10px] ${selectedStatus === 'tidak_ada_respon' ? 'text-neutral-300' : 'text-neutral-400'}`}>
              Belum Dibalas
            </span>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama penulis, judul naskah, genre, atau kota..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-neutral-500 whitespace-nowrap">Filter Kontak:</span>
          <select
            value={selectedContactedFilter}
            onChange={(e) => setSelectedContactedFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-700"
          >
            <option value="all">Semua Status Kontak</option>
            <option value="contacted">Sudah Dihubungi ({counts.contacted})</option>
            <option value="uncontacted">Belum Dihubungi ({counts.uncontacted})</option>
          </select>

          <span className="text-xs text-neutral-400 font-mono tabular-nums px-2">
            {filteredLeads.length} data
          </span>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                {isAdmin && (
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredLeads.length > 0 &&
                        selectedLeadIds.length === filteredLeads.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-neutral-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer"
                      title="Pilih semua baris"
                    />
                  </th>
                )}
                <th className="py-3 px-4">Calon Penulis & Kota</th>
                <th className="py-3 px-4">Naskah & Genre</th>
                <th className="py-3 px-4">Status Leads</th>
                <th className="py-3 px-4">Dihubungi</th>
                <th className="py-3 px-4">Estimasi Paket & Nilai</th>
                <th className="py-3 px-4">Sumber / Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="py-12 text-center text-neutral-500">
                    <p className="text-sm font-medium">Tidak ada data leads yang cocok.</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau reset filter status di atas.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const style = getLeadStatusColorClasses(lead.status);
                  const isChecked = selectedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-neutral-50/80 transition-colors group ${
                        isChecked ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox (Admin Only) */}
                      {isAdmin && (
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectRow(lead.id)}
                            className="rounded border-neutral-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer"
                          />
                        </td>
                      )}

                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span>{lead.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{lead.phone}</span>
                        </div>
                      </td>

                      {/* Manuscript & Genre */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-neutral-900 truncate" title={lead.manuscriptTitle}>
                          "{lead.manuscriptTitle}"
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {lead.genre}
                        </div>
                      </td>

                      {/* Status Dropdown (interactive for Admin, text badge for Viewer) */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {isAdmin ? (
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)
                              }
                              className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-600 ${style.bg} ${style.text} ${style.border}`}
                            >
                              <option value="closing">Closing (Deal Terkonfirmasi)</option>
                              <option value="tertarik">Tertarik (Prospek Aktif)</option>
                              <option value="tidak_saat_ini">Tidak Saat Ini</option>
                              <option value="tidak_tertarik">Tidak Tertarik</option>
                              <option value="tidak_ada_respon">Tidak Ada Respon</option>
                            </select>
                          ) : (
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-md border inline-block ${style.bg} ${style.text} ${style.border}`}
                            >
                              {getLeadStatusLabel(lead.status)}
                            </span>
                          )}

                          {lead.status === 'closing' && (
                            <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                              <span>✓ Order Terkonfirmasi</span>
                              {lead.orderId && <span className="font-mono text-[9px] text-emerald-600">({lead.orderId})</span>}
                            </div>
                          )}
                          {lead.status === 'tertarik' && (
                            <div className="text-[9px] text-blue-700 font-medium">
                              Tahap Pipeline (Belum Order)
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Contacted Toggle */}
                      <td className="py-3 px-4">
                        {isAdmin ? (
                          <button
                            onClick={() => onToggleContacted(lead.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                              lead.contacted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                            }`}
                            title="Klik untuk mengubah status sudah/belum dihubungi"
                          >
                            {lead.contacted ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Sudah</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-neutral-400" />
                                <span>Belum</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-600 font-medium">
                            {lead.contacted ? 'Sudah' : 'Belum'}
                          </span>
                        )}
                      </td>

                      {/* Value & Package */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-neutral-900 tabular-nums">
                          {formatRupiah(lead.estimatedValue)}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[180px]" title={lead.estimatedPackage}>
                          {lead.estimatedPackage}
                        </div>
                      </td>

                      {/* Source & Date */}
                      <td className="py-3 px-4 text-neutral-500">
                        <div className="text-[11px] font-medium text-neutral-700">
                          {lead.source}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {formatDateIndo(lead.createdAt)}
                        </div>
                      </td>

                      {/* Action CTA & Admin Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/62${lead.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                              `Halo Bapak/Ibu ${lead.name}, salam literasi dari Redaksi Bentala Aksara Bestari. Kami ingin mendiskusikan penerbitan naskah "${lead.manuscriptTitle}".`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md inline-flex items-center gap-1 transition-colors"
                            title="Hubungi langsung via WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onEditLead(lead)}
                                className="p-1 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                                title="Edit data lead"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    title: 'Hapus Data Calon Penulis',
                                    message: `Apakah Anda yakin ingin menghapus data calon penulis "${lead.name}" beserta catatan naskah "${lead.manuscriptTitle}"?`,
                                    itemDetails: `Lead: ${lead.name} (${lead.city}) - Naskah: ${lead.manuscriptTitle}`,
                                    targetId: lead.id,
                                  })
                                }
                                className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Hapus data lead (Admin)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        itemDetails={deleteModal.itemDetails}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
