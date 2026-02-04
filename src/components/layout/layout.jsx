"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/useAuthStore";
import Dialog from "../dialog/Dialog";
import { useToast } from "@/hooks/useToast";
import { Users2 } from "lucide-react";

export default function HRISLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { success } = useToast();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "Karyawan",
      href: "/karyawan",
      icon: UsersIcon,
      roles: ["admin", "hr"],
    },
    {
      name: "Departemen",
      href: "/departemen",
      icon: BuildingOfficeIcon,
      roles: ["admin"],
    },
    {
      name: "Pengguna",
      href: "/users",
      icon: Users2,
      roles: ["admin"],
    },
    {
      name: "Absensi",
      href: "/absensi",
      icon: CalendarDaysIcon,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "Penggajian",
      href: "/salaries",
      icon: BanknotesIcon,
      roles: ["admin", "hr"],
    },
  ];

  const canAccess = (item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    success("Logout berhasil.", 3000);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Dialog */}
      {showLogout && (
        <Dialog
          title="Konfirmasi Keluar"
          subtitle="Apakah Anda yakin ingin keluar dari aplikasi?"
          open={showLogout}
          onClose={() => setShowLogout(false)}
          action={handleLogout}
          type="danger"
        />
      )}

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">HRIS Mini(Ham)</h1>
            <p className="text-xs text-slate-400">HR Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const allowed = canAccess(item);

            return (
              <button
                key={item.name}
                disabled={!allowed}
                onClick={() => {
                  if (!allowed) return;
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
          transition-colors
          ${
            !allowed
              ? "text-slate-500 cursor-not-allowed opacity-50"
              : active
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }
        `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        {user ? (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Keluar
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          </div>
        )}

        {/* Close button mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="font-bold">HRIS Mini</span>
            <div className="w-6" />
          </div>
        </div>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
