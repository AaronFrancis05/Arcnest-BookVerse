// models/Event.js
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "user_signup",
      "user_login",
      "book_view",
      "book_purchase",
      "book_borrow",
      "cart_add",
      "cart_remove",
      "payment_success",
      "payment_failed",
      "search_query",
      "page_view",
    ],
  },
  userId: String,
  sessionId: String,
  metadata: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
