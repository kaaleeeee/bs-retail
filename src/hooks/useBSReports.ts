"use client";
import { useState, useEffect } from "react";
import { getReports, updateReportStatus as updateAction } from "@/actions";

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
  damage_type?: string;
  damageType?: string; // fallback alias
};

export function useBSReports() {
  const [reports, setReports] = useState<BSReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      // map snake_case to camelCase
      const mapped = data.map(r => ({ ...r, damageType: r.damage_type, photos: r.photos || [] }));
      setReports(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const addReport = () => {
    // We handle adding report directly in the form component using Server Actions with FormData
    // so we don't need this local function anymore. We'll just refresh.
    fetchReports();
  };

  const updateReportStatus = async (id: string, status: "Diproses" | "Selesai" | "Ditolak") => {
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    // Server update
    await updateAction(id, status);
  };

  return { reports, addReport, updateReportStatus, loading, fetchReports };
}
