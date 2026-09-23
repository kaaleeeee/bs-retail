"use client";

import { Download, FileText, Calendar, PieChart } from "lucide-react";
import { useBSReports } from "@/hooks/useBSReports";

export default function ReportsPage() {
  const { reports } = useBSReports();

  const countMenunggu = reports.filter((r) => r.status === "Menunggu").length;
  const countDiproses = reports.filter((r) => r.status === "Diproses").length;
  const countSelesai = reports.filter((r) => r.status === "Selesai").length;
  const countDitolak = reports.filter((r) => r.status === "Ditolak").length;
  const total = reports.length || 1; // avoid division by zero

  const pMenunggu = (countMenunggu / total) * 100;
  const pDiproses = (countDiproses / total) * 100;
  const pSelesai = (countSelesai / total) * 100;
  const pDitolak = (countDitolak / total) * 100;

  // Fake conic-gradient for a simple donut chart
  const donutGradient = `conic-gradient(
    #f59e0b 0% ${pMenunggu}%, 
    #06b6d4 ${pMenunggu}% ${pMenunggu + pDiproses}%, 
    #10b981 ${pMenunggu + pDiproses}% ${pMenunggu + pDiproses + pSelesai}%, 
    #e11d48 ${pMenunggu + pDiproses + pSelesai}% 100%
  )`;

  return (
    <div className="flex flex-col gap-6 md:p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">Laporan & Analitik</h1>
          <p className="text-xs text-slate-500">Ringkasan data Bad Stock</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
          <Calendar size={16} /> Bulan Ini
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="font-bold text-slate-700 mb-6 w-full flex items-center gap-2">
            <PieChart size={18} /> Distribusi Status
          </h2>
          
          <div className="relative w-48 h-48 rounded-full mb-6 flex items-center justify-center" style={{ background: donutGradient }}>
            {/* Inner circle for donut hole */}
            <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-bold text-slate-800">{reports.length}</span>
              <span className="text-xs text-slate-500">Total Item</span>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Menunggu
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span> Diproses
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Selesai
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span> Ditolak
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
            <h2 className="font-bold text-slate-700 mb-4 text-sm border-b pb-2">Ekspor Data (Unduh)</h2>
            <p className="text-sm text-slate-500 mb-6">
              Unduh laporan rekapitulasi ke perangkat Anda untuk keperluan audit atau pelaporan internal.
            </p>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => alert("Mengunduh Laporan Excel...")} className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                <Download size={18} /> Unduh Format Excel (.XLSX)
              </button>
              
              <button onClick={() => alert("Mengunduh Laporan PDF...")} className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                <FileText size={18} /> Unduh Format Dokumen (.PDF)
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
