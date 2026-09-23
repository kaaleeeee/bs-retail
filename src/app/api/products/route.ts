import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query 'q' is required (SKU or Barcode)" }, { status: 400 });
  }

  // Find exact match first (barcode or SKU)
  let found = products.find(p => p.sku === q || p.barcode === q);
  
  if (found) {
    return NextResponse.json(found);
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}
