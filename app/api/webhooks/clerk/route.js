// app/api/webhooks/clerk/route.js
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import User from "@models/User";

export async function POST(req) {
  // Get domain info first to determine which secret to use
  const headerPayload = await headers();
  const domainInfo = detectDomain(headerPayload);

  // Select the appropriate webhook secret based on domain
  const WEBHOOK_SECRET =
    domainInfo.type === "vercel"
      ? process.env.CLERK_WEBHOOK_SECRET_VERCEL
      : process.env.CLERK_WEBHOOK_SECRET_NETLIFY;

  if (!WEBHOOK_SECRET) {
    console.error(
      `Webhook secret not configured for domain: ${domainInfo.name}`
    );
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get Svix headers
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify with the appropriate secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error(`Error verifying webhook for ${domainInfo.name}:`, err);
    return NextResponse.json(
      { error: "Error occurred during verification" },
      { status: 400 }
    );
  }

  // Process the webhook event
  try {
    await connectDB();
    const eventType = evt.type;

    console.log(`Processing ${eventType} for domain: ${domainInfo.name}`);

    switch (eventType) {
      case "user.created":
      case "user.updated":
        await handleUserUpsert(evt.data, domainInfo);
        break;
      case "user.deleted":
        await handleUserDelete(evt.data, domainInfo);
        break;
      case "session.created":
      case "session.ended":
        await handleSessionEvent(eventType, evt.data, domainInfo);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      domain: domainInfo.name,
      domainType: domainInfo.type,
      secretUsed: domainInfo.type, // For debugging
    });
  } catch (error) {
    console.error(`Error processing webhook for ${domainInfo.name}:`, error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Enhanced domain detection
function detectDomain(headers) {
  const origin = headers.get("origin") || headers.get("referer") || "";
  const host = headers.get("host") || "";

  // Check multiple indicators
  if (
    origin.includes("arcnest-book-verse.vercel.app") ||
    host.includes("arcnest-book-verse")
  ) {
    return {
      name: "arcnest-book-verse.vercel.app",
      type: "vercel",
      baseUrl: "https://arcnest-book-verse.vercel.app",
    };
  } else if (
    origin.includes("arcnestshoppers.netlify.app") ||
    host.includes("arcnestshoppers")
  ) {
    return {
      name: "arcnestshoppers.netlify.app",
      type: "netlify",
      baseUrl: "https://arcnestshoppers.netlify.app",
    };
  } else {
    // Fallback - try to detect from environment
    const vercelUrl = process.env.VERCEL_URL;
    const netlifyUrl = process.env.NETLIFY_URL;

    if (vercelUrl) {
      return {
        name: vercelUrl,
        type: "vercel",
        baseUrl: `https://${vercelUrl}`,
      };
    } else if (netlifyUrl) {
      return {
        name: netlifyUrl,
        type: "netlify",
        baseUrl: `https://${netlifyUrl}`,
      };
    }

    return {
      name: "unknown",
      type: "unknown",
      baseUrl: "",
    };
  }
}

// ... rest of the handler functions remain the same
async function handleUserUpsert(userData, domainInfo) {
  const { id, email_addresses, first_name, last_name, image_url, username } =
    userData;

  const user = {
    clerkId: id,
    email: email_addresses[0]?.email_address,
    firstName: first_name,
    lastName: last_name,
    username: username,
    profileImage: image_url,
    domain: domainInfo.name,
    domainType: domainInfo.type,
    lastActiveAt: new Date(),
  };

  const dbUser = await User.findOneAndUpdate(
    { clerkId: id, domain: domainInfo.name },
    user,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(
    `User saved for ${domainInfo.name} using ${domainInfo.type} secret:`,
    dbUser._id
  );
  return dbUser;
}

// ... other handler functions (handleUserDelete, handleSessionEvent, etc.)
