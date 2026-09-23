"use client";

import { X, Flashlight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);

  // Mocking scan process
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
      }, 3000); // Mock finding a barcode after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white bg-gradient-to-b from-black/70 to-transparent">
        <Link href="/" className="p-2 bg-white/20 rounded-full backdrop-blur-md active:scale-95 transition">
          <X size={24} />
        </Link>
        <h1 className="font-bold">Scan Barcode</h1>
        <button className="p-2 bg-white/20 rounded-full backdrop-blur-md active:scale-95 transition">
          <Flashlight size={24} />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Mock Camera View */}
        <div className="absolute inset-0 bg-slate-800 object-cover" />
        
        {/* Scanner Overlay Frame */}
        <div className="relative z-10 w-64 h-64 border-2 border-white/50 rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#E11D74] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#E11D74] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#E11D74] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#E11D74] rounded-br-xl"></div>
          
          {scanning ? (
            <div className="w-full h-0.5 bg-[#E11D74] absolute top-1/2 -translate-y-1/2 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_10px_2px_#E11D74]" />
          ) : (
            <div className="text-white text-center bg-black/60 p-4 rounded-xl backdrop-blur-sm">
              <p className="font-bold mb-2">Barcode Ditemukan!</p>
              <p className="text-sm">SKU: 899999912345</p>
              <Link href="/input?sku=899999912345" className="mt-4 block bg-[#E11D74] text-white px-4 py-2 rounded-full text-sm font-bold">Lanjut Input</Link>
            </div>
          )}
        </div>
        
        <p className="absolute bottom-10 text-white/70 text-sm">
          Arahkan barcode produk ke dalam bingkai
        </p>
      </div>

      {/* Footer Actions */}
      <div className="bg-black/80 p-6 flex justify-center pb-safe">
        <Link href="/input" className="flex flex-col items-center gap-2 text-white/80 active:scale-95 transition">
          <div className="p-4 bg-white/10 rounded-full">
            <ImageIcon size={24} />
          </div>
          <span className="text-xs">Input Manual</span>
        </Link>
      </div>
    </div>
  );
}
