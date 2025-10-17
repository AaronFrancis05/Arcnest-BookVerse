// app/api/books/route.js
import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import Book from "@models/Book";

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find({}).sort({ createdAt: -1 });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const book = new Book(body);
    await book.save();

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
