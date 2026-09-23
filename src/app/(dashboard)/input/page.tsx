"use client";

import { Camera, ChevronLeft, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useBSReports } from "@/hooks/useBSReports";

function InputForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addReport } = useBSReports();
  const skuParams = searchParams.get("sku") || "";

  const [sku, setSku] = useState(skuParams);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Non-Food");
  const [unit, setUnit] = useState("Pcs");
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  // Autofill effect
  useEffect(() => {
    if (!sku || sku.length < 5) return;
    
    const fetchProduct = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?q=${sku}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setCategory(data.category);
          setUnit(data.unit);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeout = setTimeout(fetchProduct, 500); // debounce 500ms
    return () => clearTimeout(timeout);
  }, [sku]);

  const handleSubmit = () => {
    if (!sku || !name || qty < 1) {
      alert("Harap isi SKU, Nama Produk, dan Jumlah (Qty) dengan benar.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      addReport({ sku, name, qty: Number(qty) });
      setIsSubmitting(false);
      alert("Laporan berhasil dikirim!");
      router.push("/list");
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Check max 5 photos
    if (photos.length + files.length > 5) {
      alert("Maksimal 5 foto yang diizinkan.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen md:min-h-full bg-gray-50 md:bg-white pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white md:bg-gray-50 px-4 md:px-6 py-4 flex items-center gap-4 shadow-sm md:shadow-none md:border-b sticky top-0 z-10 -mx-4 md:-mx-6 md:-mt-6 mb-4 md:rounded-t-3xl">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-200 active:bg-gray-100 transition text-slate-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Form Input Bad Stock</h1>
      </div>

      <div className="flex flex-col gap-5 md:max-w-2xl md:mx-auto w-full px-4 md:px-0">
        {/* Product Details */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-slate-700 mb-4 text-sm border-b pb-2">Informasi Produk</h2>
          
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">SKU Produk *</label>
              <input 
                type="text" 
                value={sku} 
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: 899912345" 
                className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Nama Produk *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Indomie Goreng" 
                className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition">
                  <option>Food</option>
                  <option>Non-Food</option>
                  <option>Fresh</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Satuan</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition">
                  <option>Pcs</option>
                  <option>Box</option>
                  <option>Kg</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Damage Details */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-slate-700 mb-4 text-sm border-b pb-2">Detail Temuan</h2>
          
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Jumlah (Qty) *</label>
                <input 
                  type="number" 
                  min="1" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Tanggal Temuan</label>
                <input type="date" className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Jenis Kerusakan</label>
              <div className="flex flex-wrap gap-2">
                {['Kemasan Rusak', 'Expired', 'Bocor', 'Cacat Pabrik'].map((type) => (
                  <label key={type} className="flex items-center gap-2 bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm cursor-pointer hover:border-[#E11D74] transition">
                    <input type="radio" name="damage" className="text-[#E11D74] focus:ring-[#E11D74]" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Catatan (Maks 200 karakter)</label>
              <textarea rows={3} maxLength={200} placeholder="Tambahkan penjelasan singkat..." className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Photo Evidence */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="font-bold text-slate-700 text-sm">Bukti Visual</h2>
            <span className="text-xs text-slate-400">{photos.length}/5 Foto</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {photos.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={src} alt="Bukti" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-rose-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <>
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-gray-300 rounded-xl aspect-square text-slate-400 hover:text-[#E11D74] hover:border-[#E11D74] hover:bg-[#FFF0F5] transition">
                  <Camera size={24} />
                  <span className="text-[10px] font-semibold text-center">Kamera</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                </label>
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-gray-300 rounded-xl aspect-square text-slate-400 hover:text-[#E11D74] hover:border-[#E11D74] hover:bg-[#FFF0F5] transition">
                  <UploadCloud size={24} />
                  <span className="text-[10px] font-semibold text-center">Galeri</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </label>
              </>
            )}
          </div>
        </section>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#E11D74] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-pink-200 active:scale-[0.98] transition mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </div>
    </div>
  );
}

export default function InputPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <InputForm />
    </Suspense>
  );
}
