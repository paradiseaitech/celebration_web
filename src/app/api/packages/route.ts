import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*, package_items(menu_items(*))")
      .eq("is_active", true);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Packages API error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
