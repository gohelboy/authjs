
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { refreshSpotifyToken } from "@/lib/helper";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        const { searchParams } = new URL(req.url);
        const me = searchParams.get("me") === "true" ? true : false;
        const limit = searchParams.get("limit") || 50;

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

        let accessToken = me ? session.user.accessToken : user.spotifyAccessToken;
        let refreshToken = user.spotifyRefreshToken;

        const tokenResponse = await refreshSpotifyToken(refreshToken);
        accessToken = tokenResponse;

        user.spotifyAccessToken = accessToken;
        await user.save();

        const savedTracks = await fetchSavedTracks(accessToken, limit);
        const filterData = savedTracks?.items?.map((track, i) => {
            const id = track?.track?.id
            const image = track?.track?.album?.images[0]?.url || track?.album?.images[1]?.url;;
            const name = track?.track?.name;
            const added_at = track?.added_at;
            const artist = track?.track?.artists?.[0]?.name;
            return {
                id, name, image, added_at, artist
            }
        })

        return NextResponse.json(
            { message: "Saved tracks", data: filterData },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching saved tracks:", error);
        return NextResponse.json(
            { message: "Error fetching saved tracks:", error: error.message },
            { status: 500 }
        );
    }
}

const fetchSavedTracks = async (token, limit) => {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};
