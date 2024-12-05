import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // TODO: Fetch user data from Spotify (if necessary)
    // You can use the Spotify API (OAuth tokens) to fetch data like user's playlists or profile details

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // Catch any unexpected errors and log them for debugging
    console.error("Error fetching user profile:", error);

    // Return a 500 error if something went wrong
    return NextResponse.json(
      { message: "Error getting user", error: error.message },
      { status: 500 }
    );
  }
}
