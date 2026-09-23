# BS Retail (Sistem Manajemen Bad Stock)

Sistem Manajemen Bad Stock (BS Retail) adalah aplikasi internal untuk mendigitalkan proses pencatatan, verifikasi, dan manajemen stok barang yang rusak, cacat, atau kadaluwarsa. Sistem ini dibuat untuk menggantikan proses manual kertas dengan alur digital yang memiliki verifikasi bertingkat, bukti visual yang kuat, dan analitik performa operasional.

## Tech Stack (Berdasarkan Pilihan)
- **Framework**: Fullstack [Next.js](https://nextjs.org/) (Frontend & Backend)
- **Database**: PostgreSQL
- **UI/UX**: Mobile-friendly dengan integrasi kamera (Scanner Barcode) dan desain responsif.
- **Warna Utama (Sesuai PRD)**: Deep Magenta / Fuchsia (`#E11D74`), Background Soft Rose (`#FFF0F5`).

## Aktor & Hak Akses
1. **Staff Toko**: Input laporan BS, akses scanner SKU, lihat riwayat BS toko.
2. **Supervisor (SPV)**: Menyetujui/Menolak laporan dari Staff (Tahap 1), rekapitulasi level toko.
3. **Marcom / HO**: Verifikasi akhir untuk klaim ke Brand/Supplier, menyetujui proses retur.
4. **Admin / Auditor**: Akses penuh, manajemen master data, audit log.

## Alur Kerja (Workflow)
1. **Menunggu SPV (pending_spv)**: Input baru dari staf.
2. **Menunggu Marcom (pending_marcom)**: Disetujui SPV.
3. **Diproses (in_progress)**: Barang dalam pengiriman/pemusnahan.
4. **Disetujui (approved)**: Finalisasi penghapusan stok.
5. **Ditolak (rejected)**: Ditolak oleh SPV atau Marcom.
6. **Selesai (resolved)**: Administrasi dan fisik tuntas.

## Persiapan Development
- Pastikan Node.js (>= 20) sudah terinstal.
- Jalankan `npm install` untuk menginstal dependensi.
- Gunakan file `schema.sql` untuk migrasi tabel ke PostgreSQL.
- Jalankan server development menggunakan:
  ```bash
  npm run dev
  ```

## Kebutuhan Non-Fungsional Utama
- Respon API < 150ms.
- **Offline Capability** untuk caching draf saat jaringan tidak stabil.
- Keamanan TLS 1.3 & Row Level Security di database.
