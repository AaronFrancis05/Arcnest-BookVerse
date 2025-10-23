// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Debug environment variables
console.log("=== Cloudinary Config Check ===");
console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing"
);
console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing"
);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
);

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

export async function POST(request) {
  try {
    const { image, folder } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log("=== Upload Request Details ===");
    console.log("Folder:", folder);
    console.log("Image data length:", image.length);
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    });

    // Test if base64 image is valid
    if (!image.startsWith("data:image/")) {
      console.error("Invalid image format - not a data URL");
      return NextResponse.json(
        { error: "Invalid image format. Please select a valid image file." },
        { status: 400 }
      );
    }

    console.log("Starting Cloudinary upload...");

    // Upload to Cloudinary with timeout
    const uploadPromise = cloudinary.uploader.upload(image, {
      folder: folder || "bookverse",
      resource_type: "auto",
    });

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Upload timeout")), 30000);
    });

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    console.log("Cloudinary upload successful:", result.secure_url);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("=== Cloudinary Upload Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    let errorMessage = "Upload failed";
    if (error.message.includes("cloud_name")) {
      errorMessage =
        "Cloudinary configuration error. Please check server configuration.";
    } else if (error.message.includes("File size too large")) {
      errorMessage =
        "File size too large. Please select an image smaller than 10MB.";
    } else if (error.message.includes("Invalid image")) {
      errorMessage =
        "Invalid image file. Please select a valid image (JPEG, PNG, etc.).";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Upload timed out. Please try again.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
