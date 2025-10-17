// app/api/events/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@lib/mongodb";
import Event from "@models/Event";

export async function POST(request) {
  try {
    await connectDB();
    const headersList = headers();

    const eventData = await request.json();
    const event = new Event({
      ...eventData,
      ipAddress: headersList.get("x-forwarded-for") || "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
    });

    await event.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
