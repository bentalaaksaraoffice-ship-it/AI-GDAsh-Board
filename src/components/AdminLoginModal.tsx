import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentAdminPassword: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentAdminPassword,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === currentAdminPassword) {
      setError(null);
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError('Kata sandi salah. Silakan periksa kembali kata sandi administrator.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Verifikasi Akses Administrator
              </h3>
              <p className="text-[11px] text-neutral-500">
                Bentala Aksara Bestari Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <p className="text-neutral-600 leading-relaxed">
            Untuk mengaktifkan <strong className="text-neutral-900">Mode Admin</strong> (fitur tambah, ubah, impor, dan hapus data), silakan masukkan kata sandi keamanan redaksi.
          </p>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1.5">
              Kata Sandi Admin *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan password admin..."
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Password Hint Card */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-900 text-[11px] space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <span>Petunjuk Default Sistem:</span>
            </div>
            <div className="text-neutral-600">
              Kata sandi default adalah <code className="px-1.5 py-0.5 bg-white border border-emerald-300 rounded text-emerald-900 font-mono font-bold">bentala2025</code>. Anda dapat mengubah kata sandi ini sewaktu-waktu di tab Admin.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Buka Akses Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
