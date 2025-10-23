import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import Author from "@models/Author";

// GET all authors for dropdown
export async function GET() {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
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

    const authors = await Author.find({}).sort({ name: 1 });
    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

// POST create new author
export async function POST(request) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
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
      awards: body.awards || [],
      genres: body.genres || [],
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

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An author with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
