// app/api/admin/check-status/route.js
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const ADMIN_USERS = process.env.ADMIN_USERS
  ? process.env.ADMIN_USERS.split(",")
  : [];

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ADMIN_USERS.includes(userId);

    return NextResponse.json({
      isAdmin,
      userId,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
