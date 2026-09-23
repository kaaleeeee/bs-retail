"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { PackagePlus, UserPlus, Database, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const user = useAuthUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("produk");

  // Prevent non-admins from viewing
  if (user && user.role !== "admin") {
    return (
      <div className="p-8 text-center text-rose-500 font-bold">
        Akses Ditolak. Halaman ini hanya untuk Admin System.
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Berhasil! (Simulasi) SKU Baru telah ditambahkan ke database Master Barang.");
    (e.target as HTMLFormElement).reset();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Berhasil! (Simulasi) Akun pengguna baru telah dibuat.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col gap-6 md:p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">Admin Panel</h1>
          <p className="text-xs text-slate-500">Kelola Master Barang & Pengguna Toko</p>
        </div>
        <button 
          onClick={() => {
            if (confirm("Yakin ingin menghapus SEMUA data dummy di perangkat ini?")) {
              localStorage.removeItem("bs_reports");
              alert("Data berhasil dihapus. Silakan refresh halaman.");
              window.location.reload();
            }
          }}
          className="bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-200 transition"
        >
          Hapus Semua Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab("produk")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${activeTab === "produk" ? "bg-[#E11D74] text-white" : "bg-white text-slate-600 border border-gray-200"}`}
        >
          <Database size={18} /> Master SKU
        </button>
        <button 
          onClick={() => setActiveTab("user")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${activeTab === "user" ? "bg-[#E11D74] text-white" : "bg-white text-slate-600 border border-gray-200"}`}
        >
          <Users size={18} /> Pengguna
        </button>
      </div>

      {/* Form Tambah SKU */}
      {activeTab === "produk" && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="w-10 h-10 bg-pink-100 text-[#E11D74] rounded-xl flex items-center justify-center">
              <PackagePlus size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Tambah SKU Baru</h2>
              <p className="text-xs text-slate-500">Perbarui database katalog produk</p>
            </div>
          </div>
          
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">SKU / Item Code *</label>
                <input required type="text" placeholder="Contoh: 1000000099" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Barcode (Opsional)</label>
                <input type="text" placeholder="Contoh: 8999123456789" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Produk *</label>
              <input required type="text" placeholder="Contoh: YZ Bross Emas V2" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Kategori</label>
                <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900">
                  <option>Non-Food</option>
                  <option>Food</option>
                  <option>Fresh</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Satuan</label>
                <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900">
                  <option>Pcs</option>
                  <option>Box</option>
                  <option>Kg</option>
                </select>
              </div>
            </div>

            <button type="submit" className="mt-4 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm transition">
              Simpan Produk
            </button>
          </form>
        </section>
      )}

      {/* Form Tambah Pengguna */}
      {activeTab === "user" && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Buat Akun Outlet</h2>
              <p className="text-xs text-slate-500">Beri akses staf dan SPV toko baru</p>
            </div>
          </div>
          
          <form onSubmit={handleAddUser} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Lengkap *</label>
              <input required type="text" placeholder="Contoh: Rina Melati" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Username Login *</label>
                <input required type="text" placeholder="Contoh: rina_staff" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Password Default *</label>
                <input required type="text" defaultValue="12345" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Role Akses *</label>
                <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900">
                  <option value="staff">Staff Toko</option>
                  <option value="spv">Supervisor</option>
                  <option value="marcom">Marcom / HO</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Cabang / Toko *</label>
                <select className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none text-slate-900">
                  <option>JKT-01 (Jakarta Selatan)</option>
                  <option>BDG-01 (Bandung Pusat)</option>
                  <option>SBY-02 (Surabaya Timur)</option>
                  <option>HO (Head Office)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="mt-4 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm transition">
              Buat Akun
            </button>
          </form>
        </section>
      )}

    </div>
  );
}
