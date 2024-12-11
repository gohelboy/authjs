import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email;
    const currentUser = await User.findOne({ email: currentUserEmail });

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const users = await User.find({ email: { $ne: currentUserEmail } });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users location:", error);
    return NextResponse.json(
      { message: "Error fetching users location", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { location } = await req.json();

    console.log("location", location);

    const [latitude, longitude] = location.coordinates;
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { message: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    const currentUserEmail = session.user.email;
    await User.findOneAndUpdate(
      { email: currentUserEmail },
      { $set: { "location.coordinates": [longitude, latitude] } }
    );

    return NextResponse.json({
      data: { message: "Location Updated" },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    return NextResponse.json({
      data: { message: "Error updating user location" },
      error: error.message,
      status: 500,
    });
  }
}
