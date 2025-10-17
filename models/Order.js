// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      bookId: String,
      title: String,
      author: String,
      type: {
        type: String,
        enum: ["purchase", "borrow"],
      },
      price: Number,
      quantity: Number,
      borrowDuration: {
        type: Number,
        default: 14, // days
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["airtel", "mtn", "credit_card", "paypal"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  transactionId: String,
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    phone: String,
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

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
