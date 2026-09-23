"use client";

import { Search, Filter, Package } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useBSReports, BSReport } from "@/hooks/useBSReports";

export default function ListPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const tabs = ["Semua", "Menunggu", "Diproses", "Selesai", "Ditolak"];
  
  const { reports } = useBSReports();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = activeTab === "Semua" ? reports : reports.filter(d => d.status === activeTab);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-6rem)] md:min-h-full">
      <div className="sticky top-0 bg-[#FFF0F5] md:bg-white z-10 -mx-4 md:-mx-6 px-4 md:px-6 pt-4 pb-2 md:rounded-t-2xl">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Daftar Bad Stock</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Cari nama produk atau SKU..." 
            className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm shadow-sm border-none focus:ring-2 focus:ring-[#E11D74] outline-none"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <button className="absolute right-3 top-3 text-slate-400">
            <Filter size={20} />
          </button>
        </div>

        {/* Horizontal Tabs */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-[#E11D74] text-white shadow-md" 
                  : "bg-white text-slate-500 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List Content */}
      <div className="flex flex-col gap-3 pb-6">
        {filteredData.map((item, idx) => (
          <Link href={`/list/${item.id}`} key={idx} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition active:scale-[0.98] hover:shadow-md cursor-pointer block">
            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <Package size={28} className="text-slate-400" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div>
                <h3 className="font-bold text-sm text-slate-800 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 mb-1">{item.sku}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{item.qty} Pcs</span>
                <div className="flex flex-col items-end gap-1">
                  {item.status === "Menunggu" && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">Menunggu</span>}
                  {item.status === "Diproses" && <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded text-[10px] font-bold">Diproses</span>}
                  {item.status === "Selesai" && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Disetujui</span>}
                  {item.status === "Ditolak" && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">Ditolak</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center">
            <Package size={48} className="mb-2 opacity-50" />
            <p>Tidak ada data untuk status ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
