// app/api/admin/authors/route.js
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import connectDB from "@lib/mongodb";
import Author from "@models/Author";

export async function POST(request) {
  try {
    await connectDB();

    // Instead of currentUser, use:
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userRole = user.publicMetadata?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, bio } = body;
    if (!name || !bio) {
      return NextResponse.json(
        { error: "Missing required fields: name, bio" },
        { status: 400 }
      );
    }

    const newAuthor = new Author({
      name: body.name.trim(),
      bio: body.bio.trim(),
      email: body.email?.trim() || undefined,
      website: body.website?.trim() || undefined,
      photo: body.photo?.trim() || undefined,
      nationality: body.nationality?.trim() || undefined,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      awards: body.awards
        ? Array.isArray(body.awards)
          ? body.awards
          : [body.awards]
        : [],
      genres: body.genres
        ? Array.isArray(body.genres)
          ? body.genres
          : [body.genres]
        : [],
      socialMedia: body.socialMedia || {},
      createdBy: user.id,
    });

    const savedAuthor = await newAuthor.save();

    return NextResponse.json(
      {
        message: "Author added successfully",
        author: savedAuthor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding author:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: "Validation error", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
