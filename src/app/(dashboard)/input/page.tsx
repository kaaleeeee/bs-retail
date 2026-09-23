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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [damageType, setDamageType] = useState("Kemasan Rusak");
  const [notes, setNotes] = useState("");

  // Autofill effect
  useEffect(() => {
    if (!sku || sku.length < 4) {
      setSearchResults([]);
      return;
    }
    
    // Prevent refetching if we just selected from dropdown
    if (selectedResult && (sku === selectedResult.sku || sku === selectedResult.barcode)) {
      return;
    }

    const fetchProduct = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?q=${sku}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length === 1) {
            // Exact match
            setName(data[0].name);
            setCategory(data[0].category);
            setUnit(data[0].unit);
            setSearchResults([]);
            setSelectedResult(data[0]);
          } else if (data.length > 1) {
            // Multiple matches
            setSearchResults(data);
            setSelectedResult(null);
          } else {
            // No matches
            setSearchResults([]);
            setSelectedResult(null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeout = setTimeout(fetchProduct, 600); // debounce 600ms
    return () => clearTimeout(timeout);
  }, [sku, selectedResult]);

  const handleSelectResult = (product: any) => {
    setSku(product.sku); // Change input to actual exact SKU
    setName(product.name);
    setCategory(product.category);
    setUnit(product.unit);
    setSearchResults([]);
    setSelectedResult(product);
  };

  const handleSubmit = async () => {
    if (!sku || !name || qty < 1) {
      alert("Harap isi SKU, Nama Produk, dan Jumlah (Qty) dengan benar.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { uploadPhotosAndAddReport } = await import("@/actions");
      const formData = new FormData();
      formData.append("sku", sku);
      formData.append("name", name);
      formData.append("qty", qty.toString());
      if (damageType) formData.append("damageType", damageType);
      if (notes) formData.append("notes", notes);
      
      // We need to pass the actual File objects, not base64 strings!
      // But we only have base64 strings in state.
      // We can convert base64 back to Blob/File, or we change handleFileChange to save Files.
      // Let's convert base64 to Blob
      
      // Convert base64 to Blob safely
      const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
      };

      for (let i = 0; i < photos.length; i++) {
        const blob = dataURLtoBlob(photos[i]);
        formData.append("photos", blob, `photo_${i}.jpg`);
      }

      const res = await uploadPhotosAndAddReport(formData);
      if (!res.success) {
        throw new Error(res.error);
      }
      
      setIsSubmitting(false);
      alert("Laporan berhasil dikirim!");
      router.push("/list");
    } catch (e: any) {
      console.error(e);
      alert("Terjadi kesalahan: " + (e.message || "Gagal mengirim laporan."));
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    if (photos.length + files.length > 5) {
      alert("Maksimal 5 foto yang diizinkan.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality (drastically reduces file size to ~150KB)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPhotos(prev => [...prev, dataUrl]);
        };
        img.src = event.target?.result as string;
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
            <div className="relative">
              <label className="text-xs text-slate-500 font-semibold mb-1 block">SKU Produk *</label>
              <input 
                type="text" 
                value={sku} 
                onChange={(e) => {
                  setSku(e.target.value);
                  setSelectedResult(null); // Clear selected if user types again
                }}
                placeholder="Ketik minimal 4-6 digit terakhir..." 
                className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition" 
              />
              {isSearching && (
                <span className="absolute right-3 top-8 text-xs text-slate-400">Mencari...</span>
              )}
              
              {/* Dropdown Hasil Pencarian */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-xl max-h-60 overflow-y-auto overflow-x-hidden">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-2 bg-slate-50 border-b uppercase sticky top-0">Pilih Barang ({searchResults.length} ditemukan)</div>
                  {searchResults.map((product, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectResult(product)}
                      className="px-3 py-3 border-b border-gray-100 hover:bg-pink-50 cursor-pointer transition active:bg-pink-100 flex flex-col"
                    >
                      <span className="font-bold text-sm text-slate-800">{product.name}</span>
                      <span className="text-xs text-slate-500">SKU: {product.sku} {product.barcode ? `• Barcode: ${product.barcode}` : ""}</span>
                    </div>
                  ))}
                </div>
              )}
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
                  <label key={type} className={`flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-xl text-sm cursor-pointer transition ${damageType === type ? 'border-[#E11D74] text-[#E11D74] font-semibold' : 'border-gray-200 hover:border-[#E11D74]'}`}>
                    <input type="radio" name="damage" value={type} checked={damageType === type} onChange={(e) => setDamageType(e.target.value)} className="text-[#E11D74] focus:ring-[#E11D74]" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Catatan (Maks 200 karakter)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={200} placeholder="Tambahkan penjelasan singkat..." className="w-full text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74] outline-none transition resize-none"></textarea>
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
