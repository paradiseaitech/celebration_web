import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = await createClient();
    let query = supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("is_active", true);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    const { data, error } = await query.order("created_at");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Menu items API error:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}
