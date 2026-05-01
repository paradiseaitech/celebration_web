import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: body.email, is_active: true }])
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
