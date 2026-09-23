"use server";

import { Pool } from "pg";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// -- USERS --

export async function getUsers() {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
}

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const branch = formData.get("branch") as string;

  try {
    await pool.query(
      "INSERT INTO users (username, password, name, role, branch) VALUES ($1, $2, $3, $4, $5)",
      [username, password, name, role, branch]
    );
    return { success: true };
  } catch (err: any) {
    if (err.code === "23505") { // Unique violation
      return { success: false, error: "Username sudah terdaftar!" };
    }
    return { success: false, error: "Gagal membuat akun." };
  }
}

// -- REPORTS --

export async function getReports() {
  const { rows } = await pool.query("SELECT * FROM reports ORDER BY timestamp DESC");
  return rows;
}

export async function updateReportStatus(id: string, status: string) {
  await pool.query("UPDATE reports SET status = $1 WHERE id = $2", [status, id]);
  revalidatePath("/list");
  revalidatePath("/");
  return { success: true };
}

// -- UPLOAD --

export async function uploadPhotosAndAddReport(formData: FormData) {
  const sku = formData.get("sku") as string;
  const name = formData.get("name") as string;
  const qty = Number(formData.get("qty"));
  const damageType = (formData.get("damageType") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const files = formData.getAll("photos") as File[]; // Receive actual File objects

  const photoUrls: string[] = [];

  // 1. Upload all photos to Vercel Blob
  for (const file of files) {
    if (file.size > 0) {
      const blob = await put(`reports/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      photoUrls.push(blob.url);
    }
  }

  // 2. Insert into Postgres
  const id = `BS-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
  const status = "Menunggu";
  const time = "Baru saja";
  const timestamp = Date.now();

  await pool.query(
    `INSERT INTO reports (id, sku, name, qty, status, damage_type, notes, photos, time, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, sku, name, qty, status, damageType, notes, JSON.stringify(photoUrls), time, timestamp]
  );

  revalidatePath("/list");
  revalidatePath("/");
  return { success: true, id };
}
