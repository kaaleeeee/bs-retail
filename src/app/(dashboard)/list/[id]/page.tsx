"use client";

import { ChevronLeft, Check, X, Package, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBSReports, BSReport } from "@/hooks/useBSReports";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { reports, updateReportStatus } = useBSReports();
  const user = useAuthUser();
  const [report, setReport] = useState<BSReport | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    const found = reports.find((r) => r.id === id);
    if (found) setReport(found);
  }, [id, reports]);

  if (!report) {
    return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  }

  const handleAction = (newStatus: "Diproses" | "Selesai" | "Ditolak") => {
    const reason = newStatus === "Ditolak" ? prompt("Masukkan alasan penolakan:") : null;
    if (newStatus === "Ditolak" && !reason) return; // cancelled prompt
    
    if (updateReportStatus) {
      updateReportStatus(report.id, newStatus);
      alert(`Status berhasil diubah menjadi ${newStatus}`);
      router.push("/list");
    } else {
      alert("Fungsi update belum diimplementasikan di hook.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:min-h-full bg-gray-50 md:bg-white pb-20 md:pb-6">
      <div className="bg-white md:bg-gray-50 px-4 md:px-6 py-4 flex items-center gap-4 shadow-sm md:shadow-none md:border-b sticky top-0 z-10 -mx-4 md:-mx-6 md:-mt-6 mb-4 md:rounded-t-3xl">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-200 active:bg-gray-100 transition text-slate-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Detail Laporan {id}</h1>
      </div>

      <div className="flex flex-col gap-5 md:max-w-2xl md:mx-auto w-full px-4 md:px-0">
        
        {/* Product Summary */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-4 border-b border-gray-100 pb-4">
            <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center shrink-0 border border-pink-100">
              <Package size={32} className="text-[#E11D74]" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-slate-800">{report.name}</h2>
              <p className="text-sm text-slate-500 mb-2">SKU: {report.sku}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{report.qty} Pcs</span>
                {report.status === "Menunggu" && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu SPV</span>}
                {report.status === "Diproses" && <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">Diproses Marcom</span>}
                {report.status === "Selesai" && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Selesai</span>}
                {report.status === "Ditolak" && <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>}
              </div>
            </div>
          </div>
          
          {/* Notes Section */}
          {(report.damageType || report.notes) && (
            <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 mb-4">
              {report.damageType && <p className="text-sm font-bold text-rose-700 mb-1">Jenis: {report.damageType}</p>}
              {report.notes && <p className="text-sm text-rose-600">{report.notes}</p>}
            </div>
          )}
          
          {/* Photos Button */}
          {report.photos && report.photos.length > 0 && (
            <div className="mt-2">
              <button 
                onClick={() => setShowPhotos(true)}
                className="w-full bg-slate-50 border border-gray-200 text-slate-700 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
              >
                <Package size={18} className="text-[#E11D74]" />
                Lihat Bukti Visual ({report.photos.length} Foto)
              </button>
            </div>
          )}
        </section>

        {/* Fullscreen Photo Modal */}
        {showPhotos && report.photos && (
          <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setShowPhotos(false)}
              className="absolute top-4 right-4 bg-white/10 p-3 rounded-full text-white hover:bg-rose-500 transition"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-2xl h-full flex flex-col gap-4 overflow-y-auto pt-16 pb-6 no-scrollbar">
              {report.photos.map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt={`Bukti ${i+1}`} 
                  className="w-full h-auto object-contain rounded-lg" 
                />
              ))}
            </div>
          </div>
        )}

        {/* Timeline Stepper */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-700 mb-4 text-sm border-b pb-2">Linimasa (Timeline)</h3>
          
          <div className="relative pl-6 border-l-2 border-gray-200 ml-3 space-y-6">
            
            <div className="relative">
              <div className="absolute -left-[35px] bg-[#E11D74] text-white p-1 rounded-full border-4 border-white">
                <Package size={14} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Laporan Dibuat</p>
                <p className="text-xs text-slate-500">Oleh: Budi Santoso (Staff) • {report.time}</p>
              </div>
            </div>

            <div className="relative">
              <div className={`absolute -left-[35px] p-1 rounded-full border-4 border-white ${report.status !== "Menunggu" ? "bg-[#E11D74] text-white" : "bg-gray-200 text-gray-500"}`}>
                <ShieldCheck size={14} />
              </div>
              <div>
                <p className={`font-bold text-sm ${report.status !== "Menunggu" ? "text-slate-800" : "text-slate-400"}`}>Verifikasi SPV</p>
                <p className="text-xs text-slate-500">
                  {report.status === "Menunggu" ? "Menunggu persetujuan SPV" : (report.status === "Ditolak" ? "Ditolak oleh SPV" : "Disetujui oleh SPV")}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className={`absolute -left-[35px] p-1 rounded-full border-4 border-white ${report.status === "Selesai" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                <Check size={14} />
              </div>
              <div>
                <p className={`font-bold text-sm ${report.status === "Selesai" ? "text-slate-800" : "text-slate-400"}`}>Validasi Pusat (Marcom)</p>
                <p className="text-xs text-slate-500">
                  {report.status === "Selesai" ? "Klaim selesai dan ditutup" : "Belum divalidasi"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Verificator Actions */}
        {report.status === "Menunggu" && user?.role === "spv" && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-amber-200 bg-amber-50/30">
            <h3 className="font-bold text-amber-800 mb-2 text-sm">Aksi Verifikasi SPV</h3>
            <p className="text-xs text-amber-700 mb-4">Sebagai SPV, tinjau laporan fisik sebelum menyetujui.</p>
            <div className="flex gap-3">
              <button onClick={() => handleAction("Ditolak")} className="flex-1 bg-white border border-rose-200 text-rose-600 py-3 rounded-xl font-bold text-sm hover:bg-rose-50 transition flex items-center justify-center gap-2">
                <X size={18} /> Tolak
              </button>
              <button onClick={() => handleAction("Diproses")} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                <Check size={18} /> Setujui
              </button>
            </div>
          </section>
        )}

        {report.status === "Diproses" && user?.role === "marcom" && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-cyan-200 bg-cyan-50/30">
            <h3 className="font-bold text-cyan-800 mb-2 text-sm">Validasi Marcom / HO</h3>
            <p className="text-xs text-cyan-700 mb-4">Laporan telah disetujui SPV. Lakukan validasi akhir.</p>
            <div className="flex gap-3">
              <button onClick={() => handleAction("Ditolak")} className="flex-1 bg-white border border-rose-200 text-rose-600 py-3 rounded-xl font-bold text-sm hover:bg-rose-50 transition flex items-center justify-center gap-2">
                <X size={18} /> Tolak
              </button>
              <button onClick={() => handleAction("Selesai")} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                <Check size={18} /> Validasi Selesai
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
