"use client";
import { useState, useEffect } from "react";

export type BSReport = {
  id: string;
  sku: string;
  name: string;
  qty: number;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  time: string;
  timestamp: number;
};

const DUMMY_DATA: BSReport[] = [
  { id: "BS-001", sku: "899999912345", name: "Indomie Goreng", qty: 5, status: "Menunggu", time: "10 menit yang lalu", timestamp: Date.now() - 600000 },
  { id: "BS-002", sku: "899999912346", name: "Susu UHT Full Cream", qty: 2, status: "Diproses", time: "2 jam yang lalu", timestamp: Date.now() - 7200000 },
  { id: "BS-003", sku: "899999912347", name: "Roti Tawar", qty: 10, status: "Selesai", time: "1 hari yang lalu", timestamp: Date.now() - 86400000 },
];

export function useBSReports() {
  const [reports, setReports] = useState<BSReport[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bs_reports");
    if (stored) {
      setReports(JSON.parse(stored));
    } else {
      localStorage.setItem("bs_reports", JSON.stringify(DUMMY_DATA));
      setReports(DUMMY_DATA);
    }
  }, []);

  const addReport = (report: Omit<BSReport, "id" | "time" | "timestamp" | "status">) => {
    const newReport: BSReport = {
      ...report,
      id: `BS-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      status: "Menunggu",
      time: "Baru saja",
      timestamp: Date.now(),
    };
    
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("bs_reports", JSON.stringify(updated));
  };

  const updateReportStatus = (id: string, status: "Diproses" | "Selesai" | "Ditolak") => {
    const updated = reports.map(r => r.id === id ? { ...r, status } : r);
    setReports(updated);
    localStorage.setItem("bs_reports", JSON.stringify(updated));
  };

  return { reports, addReport, updateReportStatus };
}
