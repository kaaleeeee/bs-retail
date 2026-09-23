"use client";

import { ScanBarcode, FilePlus, FileBarChart, Clock, CheckCircle2, XCircle, Package, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBSReports } from "@/hooks/useBSReports";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Home() {
  const [greeting, setGreeting] = useState("Selamat Pagi");
  const { reports } = useBSReports();
  const user = useAuthUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  if (!mounted) return null;

  const countMenunggu = reports.filter(r => r.status === "Menunggu").length;
  const countSelesai = reports.filter(r => r.status === "Selesai").length;
  const countDitolak = reports.filter(r => r.status === "Ditolak").length;
  const recentActivities = reports.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#E11D74] -m-4 md:-m-6 p-6 md:p-8 pb-8 md:pb-10 rounded-b-[2rem] md:rounded-t-2xl text-white shadow-md">
        <div>
          <h1 className="text-xl font-bold">{greeting}, {user?.name || "Budi"}!</h1>
          <p className="text-sm opacity-90 mt-1">Role: {user?.role.toUpperCase() || "STAFF"} • JKT-01</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="font-bold text-lg">JKT</span>
        </div>
      </header>

      {/* Metrics Cards */}
      <section className="-mt-10 md:-mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10 mx-2 md:mx-0">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Package size={18} className="text-[#E11D74]" />
            <span className="text-xs font-semibold">Total BS Bulan Ini</span>
          </div>
          <span className="text-2xl font-bold">{reports.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <Clock size={18} />
            <span className="text-xs font-semibold">Menunggu</span>
          </div>
          <span className="text-2xl font-bold">{countMenunggu}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-emerald-500">
            <CheckCircle2 size={18} />
            <span className="text-xs font-semibold">Disetujui</span>
          </div>
          <span className="text-2xl font-bold">{countSelesai}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-rose-500">
            <XCircle size={18} />
            <span className="text-xs font-semibold">Ditolak</span>
          </div>
          <span className="text-2xl font-bold">{countDitolak}</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-slate-700">Akses Cepat</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/scan" className="flex flex-col items-center gap-2 p-3 bg-[#FFF0F5] rounded-xl text-[#E11D74] transition hover:scale-105 active:scale-95">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <ScanBarcode size={24} />
            </div>
            <span className="text-xs font-semibold text-center">Scan<br/>Barcode</span>
          </Link>
          <Link href="/input" className="flex flex-col items-center gap-2 p-3 bg-[#FFF0F5] rounded-xl text-[#E11D74] transition hover:scale-105 active:scale-95">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <FilePlus size={24} />
            </div>
            <span className="text-xs font-semibold text-center">Input<br/>Manual</span>
          </Link>
          {user?.role === "admin" ? (
            <Link href="/admin" className="flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl text-white transition hover:scale-105 active:scale-95 shadow-md">
              <div className="bg-white/20 p-3 rounded-full shadow-sm backdrop-blur-sm">
                <Shield size={24} />
              </div>
              <span className="text-xs font-semibold text-center">Admin<br/>Panel</span>
            </Link>
          ) : (
            <Link href="/reports" className="flex flex-col items-center gap-2 p-3 bg-[#FFF0F5] rounded-xl text-[#E11D74] transition hover:scale-105 active:scale-95">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <FileBarChart size={24} />
              </div>
              <span className="text-xs font-semibold text-center">Laporan<br/>& Ekspor</span>
            </Link>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-slate-700">Aktivitas Terbaru</h2>
          <Link href="/list" className="text-sm font-semibold text-[#E11D74]">Lihat Semua</Link>
        </div>
        <div className="flex flex-col gap-3">
          {recentActivities.map((item, idx) => (
            <Link href={`/list/${item.id}`} key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <Package size={20} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-slate-800 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.id} • {item.qty} Pcs</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                {item.status === "Menunggu" && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold">Menunggu</span>}
                {item.status === "Diproses" && <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-[10px] font-bold">Diproses</span>}
                {item.status === "Selesai" && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">Disetujui</span>}
                {item.status === "Ditolak" && <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold">Ditolak</span>}
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
            </Link>
          ))}
          {recentActivities.length === 0 && (
             <p className="text-sm text-slate-400 text-center py-4">Belum ada aktivitas.</p>
          )}
        </div>
      </section>
    </div>
  );
}
