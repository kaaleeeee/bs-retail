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
  photos?: string[];
  notes?: string;
  damageType?: string;
};

export function useBSReports() {
  const [reports, setReports] = useState<BSReport[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bs_reports");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Auto-migrate: wipe old dummy data that doesn't have the new fields
      if (parsed.length > 0 && parsed[0].id.startsWith("BS-00")) {
        localStorage.removeItem("bs_reports");
        setReports([]);
      } else {
        setReports(parsed);
      }
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
