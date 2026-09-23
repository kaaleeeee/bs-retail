"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          (decodedText) => {
            // Success! Stop scanner and redirect
            html5QrCode.stop().then(() => {
              router.push(`/input?sku=${decodedText}`);
            });
          },
          (errorMessage) => {
            // parse errors are normal (no barcode found yet)
          }
        );
        setHasPermission(true);
      } catch (err) {
        console.error(err);
        setHasPermission(false);
        setError("Kamera tidak diizinkan atau tidak ditemukan.");
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen md:min-h-full bg-black md:bg-gray-50 pb-20 md:pb-6 relative">
      <div className="bg-transparent md:bg-white px-4 md:px-6 py-4 flex items-center gap-4 z-20 sticky top-0 md:border-b md:rounded-t-3xl md:-mt-6 mb-4 md:-mx-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-white/20 active:bg-white/10 transition text-white md:text-slate-700 bg-black/30 md:bg-transparent backdrop-blur-md">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-white md:text-slate-800 drop-shadow-md md:drop-shadow-none">Scan Barcode SKU</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20 md:mt-0 relative w-full h-full">
        {hasPermission === false ? (
          <div className="text-center p-8 text-white md:text-slate-800 z-10">
            <Camera size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="font-bold mb-2">Akses Kamera Ditolak</h2>
            <p className="text-sm opacity-80">{error}</p>
            <p className="text-xs opacity-60 mt-4">Silakan izinkan akses kamera di pengaturan browser Anda, lalu refresh halaman.</p>
          </div>
        ) : (
          <div className="w-full h-full md:w-full md:max-w-md md:aspect-[3/4] md:rounded-3xl overflow-hidden bg-black relative flex items-center justify-center">
            {/* The div where html5-qrcode injects the video stream */}
            <div id="reader" className="w-full h-full flex items-center justify-center [&>video]:object-cover [&>video]:h-full [&>video]:w-full"></div>
            
            {/* Target overlay overlay */}
            <div className="absolute inset-0 pointer-events-none border-[50px] border-black/40 z-10">
               <div className="w-full h-full border-2 border-[#E11D74] shadow-[0_0_0_999px_rgba(0,0,0,0.5)]"></div>
            </div>
            
            <p className="absolute bottom-24 md:bottom-10 left-0 right-0 text-center text-white text-sm font-semibold drop-shadow-md z-20 px-8">
              Arahkan garis merah tepat ke barcode produk
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
