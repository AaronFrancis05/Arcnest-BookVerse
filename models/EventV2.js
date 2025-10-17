// models/EventV2.js
import mongoose from "mongoose";

const eventSchemaV2 = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      // NO enum validation
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
    collection: "events_v2", // Different collection name
  }
);

// Create indexes
eventSchemaV2.index({ type: 1, createdAt: -1 });
eventSchemaV2.index({ userId: 1, createdAt: -1 });

export default mongoose.models.EventV2 ||
  mongoose.model("EventV2", eventSchemaV2);
