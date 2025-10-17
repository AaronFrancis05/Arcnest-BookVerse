// app/api/events/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@lib/mongodb";
import EventV2 from "@models/EventV2"; // Use the new model

export async function POST(request) {
  try {
    await connectDB();

    const headersList = await headers();
    const eventData = await request.json();

    const event = new EventV2({
      ...eventData,
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0] || "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
    });

    await event.save();

    return NextResponse.json(
      { message: "Event logged successfully", event: event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging event:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    let query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;

    const events = await EventV2.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
