// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      // NO enum validation - allow any event type
    },
    userId: {
      type: String,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
eventSchema.index({ type: 1, createdAt: -1 });
eventSchema.index({ userId: 1, createdAt: -1 });
eventSchema.index({ userId: 1, type: 1, createdAt: -1 });

// Use a try-catch to handle model compilation
let Event;
try {
  Event = mongoose.model("Event");
} catch {
  Event = mongoose.model("Event", eventSchema);
}

export default Event;
