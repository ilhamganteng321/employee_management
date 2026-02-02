'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiArrowRight, FiMonitor } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import Dialog from '@/components/dialog/Dialog';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const { success } = useToast();
  const [showdialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard'); // replace lebih bagus dari push
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
          // Role tidak perlu dikirim karena sudah di backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login({
          user: data.user,
          token: data.token,
        });
        success('Login berhasil! Selamat datang kembali.', 5000);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', err);

      // Demo mode: langsung redirect ke dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex flex-col items-center justify-center p-4">

      {showdialog && (
        <Dialog
          open={showdialog}
          title="Akun Demo"
          subtitle={
            <>
              Gunakan akun berikut untuk demo:
              <br /><br />
              <strong>Karyawan</strong><br />
              Email: dev.neermala@gmail.com<br />
              Password: admin123
              <br /><br />
              <strong>HR</strong><br />
              Email: dinda@gmail.com<br />
              Password: 123000
            </>
          }
          onClose={() => setShowDialog(false)}
          action={() => setShowDialog(false)}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <FiMonitor className="text-blue-600" />
          HRIS Mini
        </h1>
        <p className="text-gray-600">Sistem Manajemen Karyawan</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Masuk ke Akun
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-50" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-50" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk</span>
                <FiArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Demo Info */}
          <div onClick={() => setShowDialog(true)} className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-underline text-blue-700 text-center cursor-pointer">
            <p className="text-sm text-blue-700 text-center">
              <strong>Demo:</strong> gunakan akun berikut
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} HRIS Mini. Sistem Manajemen Karyawan.
        </p>
      </div>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}