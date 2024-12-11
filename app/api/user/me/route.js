import { connectToDatabase } from "@/lib/db";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
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

    const follower = await Follow.countDocuments({ following: user?._id });
    const following = await Follow.countDocuments({ follower: user?._id });
    const payload = {
      following: following || 0,
      follower: follower || 0,
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

async function fetchSpotifyUserData(accessToken, userId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: `Spotify API error: ${response.status} - ${response.statusText}`,
        },
        { status: 401 }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    return NextResponse.json(
      { message: "Error fetching data from Spotify API:" },
      { status: 500 }
    );
  }
}
