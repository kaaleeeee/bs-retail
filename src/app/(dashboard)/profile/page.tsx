export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center mt-8 relative">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#E11D74] to-pink-300 rounded-full flex items-center justify-center text-white text-3xl font-bold absolute -top-12 border-4 border-[#FFF0F5]">
          B
        </div>
        <div className="mt-12 text-center">
          <h1 className="text-xl font-bold text-slate-800">Budi Santoso</h1>
          <p className="text-sm text-slate-500">Staff Toko • JKT-01</p>
        </div>
        
        <div className="w-full mt-6 flex flex-col gap-2">
          <button className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl text-sm font-semibold text-left text-slate-700 transition">
            Pengaturan Akun
          </button>
          <button className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl text-sm font-semibold text-left text-slate-700 transition">
            Ganti Password
          </button>
          <button className="w-full bg-rose-50 hover:bg-rose-100 p-3 rounded-xl text-sm font-semibold text-left text-rose-600 transition mt-4">
            Keluar (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}
