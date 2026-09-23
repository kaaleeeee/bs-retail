"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default users if not exist
  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

        
    import("@/actions").then(async ({ getUsers }) => {
      try {
        const users = await getUsers();
        const user = users.find((u: any) => 
          u.username.trim().toLowerCase() === username.trim().toLowerCase() && 
          u.password === password
        );

        if (user) {
          document.cookie = `auth_role=${user.role}; path=/; max-age=86400`;
          document.cookie = `auth_name=${user.name}; path=/; max-age=86400`;
          router.push("/");
        } else {
          setError("Username atau password salah!");
          setIsSubmitting(false);
        }
      } catch (e) {
        setError("Gagal menghubungi server database.");
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF0F5] items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-pink-300 to-[#E11D74] rounded-full opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-pink-300 to-[#E11D74] rounded-full opacity-20 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#E11D74] to-pink-400 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 shadow-pink-200">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">BS Retail</h1>
          <p className="text-sm text-slate-500 font-medium mt-1 text-center">Sistem Manajemen Bad Stock</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-100 text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#E11D74] transition"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#E11D74] transition"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-gradient-to-r from-[#E11D74] to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-200 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? "Memeriksa..." : "Masuk ke Sistem"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8 relative z-10">
          Untuk menambah akun baru, hubungi<br />Admin System Pusat (HO).
        </p>
      </div>
    </div>
  );
}
