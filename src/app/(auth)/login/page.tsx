"use client";

import { Package, KeyRound, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("staff");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Harap isi Username dan Password!");
      return;
    }

    // Set cookie valid for 1 day
    document.cookie = `auth_role=${role}; path=/; max-age=86400`;
    document.cookie = `auth_name=${username}; path=/; max-age=86400`;
    
    // Redirect to home
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#E11D74] p-8 text-white flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border-2 border-white/30">
            <Package size={36} />
          </div>
          <h1 className="text-2xl font-bold mb-1">BS Retail</h1>
          <p className="text-sm opacity-90">Sistem Manajemen Bad Stock</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Pilih Role Akses</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "staff", label: "Staff Toko" },
                { id: "spv", label: "Supervisor" },
                { id: "marcom", label: "Marcom / HO" },
                { id: "admin", label: "Admin System" }
              ].map((r) => (
                <label 
                  key={r.id} 
                  className={`border rounded-xl p-3 text-sm text-center font-bold cursor-pointer transition ${
                    role === r.id 
                      ? "border-[#E11D74] bg-[#FFF0F5] text-[#E11D74]" 
                      : "border-gray-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value={r.id} 
                    checked={role === r.id} 
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden" 
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Username / Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#E11D74] text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-[0.98] transition mt-4"
          >
            Masuk (Login)
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-2">
            *Gunakan sembarang teks untuk simulasi login.
          </p>
        </form>
      </div>
    </div>
  );
}
