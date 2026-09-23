import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query 'q' is required (SKU or Barcode)" }, { status: 400 });
  }

  // Find exact match first or suffix match (last 6+ digits)
  // We use endsWith to support "last X digits of barcode" search
  const results = products.filter(p => 
    p.sku === q || 
    p.barcode === q || 
    (q.length >= 4 && p.barcode.endsWith(q)) || 
    (q.length >= 4 && p.sku.endsWith(q))
  );
  
  if (results.length > 0) {
    // Limit to top 50 to avoid massive payloads if query is too generic
    return NextResponse.json(results.slice(0, 50));
  }

  return NextResponse.json([], { status: 200 }); // Return empty array if not found
}
