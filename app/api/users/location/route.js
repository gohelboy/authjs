import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
export const dynamic = "force-dynamic";


// Fetch currently playing track
async function fetchCurrentlyPlaying(accessToken) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Handle unauthorized errors explicitly
    if (response.status === 401) {
      console.error("Access token is invalid or expired");
      return { error: "Access token invalid or expired" };
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Contains information about the currently playing track
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
    return null;
  }
}

// Fetch recently played tracks
async function fetchRecentlyPlayed(accessToken) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Handle unauthorized errors explicitly
    if (response.status === 401) {
      console.error("Access token is invalid or expired");
      return { error: "Access token invalid or expired" };
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items; // Array of recently played tracks
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return null;
  }
}

// Refresh Spotify access token
async function refreshSpotifyToken(refreshToken, clientId, clientSecret) {
  const url = "https://accounts.spotify.com/api/token";
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const headers = {
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error refreshing token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token; // Return new access token
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
    return null;
  }
}

// Main GET handler
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

    // Fetch all users
    const users = await User.find({ email: { $ne: currentUserEmail } });

    // Enrich users with Spotify data
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.spotifyAccessToken) {
          let accessToken = user.spotifyAccessToken;

          // Refresh token if access token is invalid
          const checkToken = await fetchRecentlyPlayed(accessToken);
          if (checkToken?.error) {
            console.log("Refreshing access token for user:", user.email);

            accessToken = await refreshSpotifyToken(
              user.spotifyRefreshToken,
              process.env.SPOTIFY_CLIENT_ID,
              process.env.SPOTIFY_CLIENT_SECRET
            );

            if (accessToken) {
              user.spotifyAccessToken = accessToken;
              await user.save(); // Save the updated token
            } else {
              console.error(`Failed to refresh token for user: ${user.email}`);
            }
          }

          const currentlyPlaying = await fetchCurrentlyPlaying(accessToken);
          const recentlyPlayed = await fetchRecentlyPlayed(accessToken);

          return {
            ...user.toObject(),
            spotify: {
              currentlyPlaying,
              recentlyPlayed,
            },
          };
        }

        return { ...user.toObject(), spotify: null };
      })
    );

    return NextResponse.json(enrichedUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching users and Spotify data:", error);
    return NextResponse.json(
      { message: "Error fetching users and Spotify data", error: error.message },
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
