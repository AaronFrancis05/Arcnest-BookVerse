// app/api/admin/books/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import Book from "@models/Book";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, we'll skip the admin check in API routes
    // You can implement a different admin verification method
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

    // Check if book with same ISBN already exists
    if (body.isbn) {
      const existingBook = await Book.findOne({ isbn: body.isbn });
      if (existingBook) {
        return NextResponse.json(
          { error: "A book with this ISBN already exists" },
          { status: 409 }
        );
      }
    }

    const newBook = new Book({
      title: body.title.trim(),
      author: body.author.trim(),
      description: body.description.trim(),
      category: body.category,
      price: parseFloat(body.price),
      rating: parseFloat(body.rating) || 4.5,
      pages: body.pages ? parseInt(body.pages) : undefined,
      isbn: body.isbn?.trim() || undefined,
      publishedDate: body.publishedDate
        ? new Date(body.publishedDate)
        : new Date(),
      coverImage: body.coverImage?.trim() || "",
      publisher: body.publisher?.trim() || "BookVerse Publications",
      language: body.language?.trim() || "English",
      format: body.format || "Paperback",
      stock: body.stock ? parseInt(body.stock) : 1,
      featured: body.featured || false,
      createdBy: userId,
    });

    const savedBook = await newBook.save();

    return NextResponse.json(
      {
        message: "Book added successfully",
        book: savedBook,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding book:", error);

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
