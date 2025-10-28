import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import Book from "@models/Book";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const book = await Book.findById(id).select("-createdBy -updatedAt").lean();

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
