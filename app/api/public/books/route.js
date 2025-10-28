import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import Book from "@models/Book";

export async function GET() {
  try {
    await connectDB();

    // Get all books without authentication
    const books = await Book.find({})
      .select("-createdBy -updatedAt") // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
