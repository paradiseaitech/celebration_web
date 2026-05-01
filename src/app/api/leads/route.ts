import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          event_type: body.eventType,
          guest_count: parseInt(body.guestCount) || null,
          message: body.message || null,
          plate_data: body.plateData || null,
          estimated_total: body.estimatedTotal || null,
          status: "new",
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
