// models/Author.js
import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide author name"],
    trim: true,
    maxlength: [100, "Author name cannot be more than 100 characters"],
  },
  bio: {
    type: String,
    required: [true, "Please provide author biography"],
    maxlength: [2000, "Bio cannot be more than 2000 characters"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  website: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    default: "",
  },
  nationality: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: Date,
  },
  awards: [
    {
      type: String,
      trim: true,
    },
  ],
  genres: [
    {
      type: String,
      trim: true,
    },
  ],
  socialMedia: {
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
  },
  createdBy: {
    type: String, // Clerk user ID
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

AuthorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search and performance
AuthorSchema.index({ name: "text", bio: "text" });
AuthorSchema.index({ nationality: 1 });
AuthorSchema.index({ createdAt: -1 });

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
