"use client";

import { Home, List, FilePlus, FileText, User, Package, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthUser();

  const links = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Data Laporan", href: "/list", icon: List },
    { name: "Input Manual", href: "/input", icon: FilePlus },
    { name: "Laporan & Ekspor", href: "/reports", icon: FileText },
    { name: "Profil Akun", href: "/profile", icon: User },
  ];

  if (user?.role === "admin") {
    links.push({ name: "Admin Panel", href: "/admin", icon: Shield });
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-[#E11D74] rounded-xl flex items-center justify-center text-white">
          <Package size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-lg leading-tight">BS Retail</h1>
          <p className="text-xs text-slate-500">Sistem Manajemen</p>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider px-3">Menu Utama</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive
                  ? "bg-[#FFF0F5] text-[#E11D74]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[#E11D74]" : "text-slate-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E11D74] rounded-full flex items-center justify-center text-white font-bold uppercase">
            {user?.name.charAt(0) || "B"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">{user?.name || "Budi Santoso"}</h4>
            <p className="text-xs text-slate-500 uppercase">{user?.role || "staff"}</p>
          </div>
        </div>
        <button onClick={() => { document.cookie = "auth_role=; max-age=0; path=/"; window.location.href = "/login"; }} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition">
          Logout
        </button>
      </div>
    </div>
  );
}
