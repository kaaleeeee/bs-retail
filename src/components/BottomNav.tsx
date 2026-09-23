"use client";

import { Home, List, ScanLine, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2 relative">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/" ? "text-[#E11D74]" : "text-gray-400"
          }`}
        >
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Beranda</span>
        </Link>
        <Link
          href="/list"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/list" ? "text-[#E11D74]" : "text-gray-400"
          }`}
        >
          <List size={24} />
          <span className="text-[10px] mt-1 font-medium">Data</span>
        </Link>

        {/* Floating Action Button */}
        <div className="relative w-full h-full flex justify-center -top-6">
          <Link
            href="/scan"
            className="absolute flex items-center justify-center w-14 h-14 bg-[#E11D74] rounded-full text-white shadow-lg border-4 border-[#FFF0F5] transition-transform active:scale-95"
          >
            <ScanLine size={28} />
          </Link>
        </div>

        <Link
          href="/reports"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/reports" ? "text-[#E11D74]" : "text-gray-400"
          }`}
        >
          <FileText size={24} />
          <span className="text-[10px] mt-1 font-medium">Laporan</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/profile" ? "text-[#E11D74]" : "text-gray-400"
          }`}
        >
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">Profil</span>
        </Link>
      </div>
    </div>
  );
}
