// app/api/users/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import User from "@models/User";

export async function GET() {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// REPLACE YOUR EXISTING POST FUNCTION WITH THIS DEBUGGING VERSION:
export async function POST(request) {
  try {
    await connectDB();
    const user = await currentUser();

    console.log("Clerk user:", user); // Debug log

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.imageUrl,
    };

    console.log("User data to save:", userData); // Debug log

    const dbUser = await User.findOneAndUpdate({ clerkId: user.id }, userData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    console.log("Saved user:", dbUser); // Debug log

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Full error:", error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
