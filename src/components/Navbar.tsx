import React from 'react';
import {
  BookOpen,
  Users,
  Target,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Lock,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onToggleUserRole: () => void;
  onOpenAdminLoginModal: () => void;
  onOpenNewLeadModal: () => void;
  onOpenNewTransactionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  onToggleUserRole,
  onOpenAdminLoginModal,
  onOpenNewLeadModal,
  onOpenNewTransactionModal,
}) => {
  const isAdmin = userRole === 'admin';

  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: BookOpen },
    { id: 'leads', label: 'Leads & Pipeline', icon: Target },
    { id: 'books', label: 'Penulis & Buku', icon: Users },
    { id: 'orders', label: 'Pesanan & Penjualan', icon: ShoppingBag },
    { id: 'growth', label: 'Grafik Performa', icon: TrendingUp },
    { id: 'finance', label: 'Laporan Keuangan', icon: Receipt },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin & Hapus Data', icon: ShieldAlert }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand wordmark with publisher identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 bg-emerald-50 flex items-center justify-center shadow-xs">
              <img
                src="/src/assets/images/bentala_logo_1793160173496.jpg"
                alt="Logo Bentala Aksara Bestari"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-neutral-900 block leading-tight whitespace-nowrap">
                Bentala Aksara Bestari
              </span>
              <span className="text-[11px] text-neutral-500 font-medium block leading-none">
                Executive Publishing & Finance
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (1-2 word single-line labels) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isDangerTab = item.id === 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDangerTab
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-emerald-800 text-white shadow-xs'
                      : isDangerTab
                      ? 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions & User Role Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Switcher Button */}
            <button
              onClick={() => {
                if (isAdmin) {
                  onToggleUserRole();
                } else {
                  onOpenAdminLoginModal();
                }
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
              }`}
              title={
                isAdmin
                  ? 'Mode Admin Aktif. Klik untuk keluar ke Mode Viewer'
                  : 'Mode Viewer. Klik untuk login ke Mode Admin dengan password'
              }
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Akses:</span>
                  <span className="font-bold text-emerald-900">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">Akses:</span>
                  <span className="font-bold text-neutral-700">Viewer (Login Admin)</span>
                </>
              )}
            </button>

            {/* Admin Add Actions */}
            {isAdmin ? (
              <>
                <button
                  onClick={onOpenNewLeadModal}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0 border border-neutral-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Lead</span>
                </button>
                <button
                  onClick={onOpenNewTransactionModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Transaksi</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-100 px-2.5 py-1.5 rounded-md border border-neutral-200">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Mode Baca (Viewer)</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-neutral-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDangerTab = item.id === 'admin';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? isDangerTab
                      ? 'bg-rose-800 text-white'
                      : 'bg-emerald-800 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
