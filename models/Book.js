// models/Book.js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  borrowPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isbn: String,
  publishedDate: Date,
  publisher: String,
  pageCount: Number,
  language: {
    type: String,
    default: "English",
  },
  coverImage: String,
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  stock: {
    type: Number,
    default: 1,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
