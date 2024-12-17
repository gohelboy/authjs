import { connectToDatabase } from "@/lib/db";
import { refreshSpotifyToken } from "@/lib/helper";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

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


    let accessToken = user.spotifyAccessToken;
    let refreshToken = user.spotifyRefreshToken;
    const newAccessToken = await refreshSpotifyToken(refreshToken);
    accessToken = newAccessToken;

    user.spotifyAccessToken = accessToken;
    await user.save();


    const followingIds = await Follow.find({ follower: user?._id });
    const followergIds = await Follow.find({ following: user?._id });
    const followId = await Follow.findOne({ following: id });
    const spotifyUserId = user.spotifyId || "#";


    //spotify users data
    const spotifyUserData = await fetchSpotifyUserData(accessToken, spotifyUserId);


    const payload = {
      isFollowed: followId ? true : false,
      following: followingIds.length || 0,
      follower: followergIds.length || 0,
      ...user?.toObject(),
      // ...spotifyUserData,
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    throw new Error("Failed to fetch Spotify user data");
  }
}
