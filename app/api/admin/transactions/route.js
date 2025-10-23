import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@lib/mongodb";
import Order from "@models/Order";

export async function GET() {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userRole = user.publicMetadata?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const transactions = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Format transactions for the frontend
    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction._id,
      transactionId: transaction.orderId || transaction._id.toString(),
      bookTitle: transaction.items?.[0]?.title || "Unknown Book",
      customerName: transaction.shippingAddress?.fullName || "Unknown Customer",
      amount: transaction.totalAmount || 0,
      type: transaction.items?.[0]?.type || "purchase",
      status: transaction.status || "completed",
      phoneNumber: transaction.shippingAddress?.phone || null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
