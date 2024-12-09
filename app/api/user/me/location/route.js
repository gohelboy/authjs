import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { latitude, longitude } = await req.json();
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { message: "Latitude and longitude must be numbers" },
        { status: 400 }
      );
    }
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { message: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }
    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { message: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    user.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    await user.save();

    return NextResponse.json(
      { message: "Location updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { message: "Error updating location", error: error.message },
      { status: 500 }
    );
  }
}
