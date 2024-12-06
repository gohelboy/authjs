import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Follow from "@/lib/models/Follow";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const spotifyAccessToken = session.user.accessToken;
    if (!spotifyAccessToken) {
      return NextResponse.json(
        { message: "Spotify access token not found in session" },
        { status: 403 }
      );
    }

    const spotifyUserId = user.spotifyId || "#";

    const spotifyUserData = await fetchSpotifyUserData(
      spotifyAccessToken,
      spotifyUserId
    );

    const followId = await Follow.findOne({ following: id });

    const payload = {
      isFollowed: followId ? true : false,
      ...user?.toObject(),
      ...spotifyUserData,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Error fetching user profile", error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to fetch Spotify user data
async function fetchSpotifyUserData(accessToken, userId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API error: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    throw new Error("Failed to fetch Spotify user data");
  }
}
