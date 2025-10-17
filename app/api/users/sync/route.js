// app/api/users/sync/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import User from "@models/User"; // You'll need to create this model

export async function POST(request) {
  try {
    await connectDB();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update or create user in database
    const userData = {
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      lastActiveAt: new Date(),
    };

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      userData,
      { upsert: true, new: true }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}

