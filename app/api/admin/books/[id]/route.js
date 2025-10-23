// app/api/admin/books/[id]/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import Book from "@models/Book";

// PUT - Update a book
export async function PUT(request, { params }) {
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

    const bookId = params.id;
    const body = await request.json();

    // Validate required fields
    const { title, author, description, category, price } = body;
    if (!title || !author || !description || !category || !price) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, author, description, category, price",
        },
        { status: 400 }
      );
    }

    // Check if ISBN already exists (excluding current book)
    if (body.isbn) {
      const existingBook = await Book.findOne({
        isbn: body.isbn,
        _id: { $ne: bookId },
      });
      if (existingBook) {
        return NextResponse.json(
          { error: "A book with this ISBN already exists" },
          { status: 409 }
        );
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title: body.title.trim(),
        author: body.author.trim(),
        description: body.description.trim(),
        category: body.category,
        price: parseFloat(body.price),
        pages: body.pages ? parseInt(body.pages) : undefined,
        isbn: body.isbn?.trim() || undefined,
        publishedDate: body.publishedDate
          ? new Date(body.publishedDate)
          : undefined,
        publisher: body.publisher?.trim() || "BookVerse Publications",
        language: body.language?.trim() || "English",
        format: body.format || "Paperback",
        stock: body.stock ? parseInt(body.stock) : 1,
        featured: body.featured || false,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: "Validation error", details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A book with this ISBN already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a book (your existing code)
export async function DELETE(request, { params }) {
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

    const bookId = params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
