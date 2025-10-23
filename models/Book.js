import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a book title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  author: {
    type: String,
    required: [true, "Please provide an author name"],
    trim: true,
    maxlength: [100, "Author name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a book description"],
    maxlength: [2000, "Description cannot be more than 2000 characters"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: [
      "fiction",
      "non-fiction",
      "science",
      "technology",
      "biography",
      "history",
      "fantasy",
      "mystery",
      "romance",
      "thriller",
      "children",
      "young-adult",
    ],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
  },
  pages: {
    type: Number,
    min: [1, "Page count must be at least 1"],
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  coverImage: {
    type: String,
    default: "",
  },
  backCoverImage: {
    type: String,
    default: "",
  },
  publisher: {
    type: String,
    default: "BookVerse Publications",
    trim: true,
  },
  language: {
    type: String,
    default: "English",
  },
  format: {
    type: String,
    enum: ["Paperback", "Hardcover", "E-book", "Audiobook"], // Accept "E-book"
    default: "Paperback",
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, "Stock cannot be negative"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
BookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for better search performance
BookSchema.index({ title: "text", author: "text", description: "text" });
BookSchema.index({ category: 1 });
BookSchema.index({ rating: -1 });
BookSchema.index({ createdAt: -1 });

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
