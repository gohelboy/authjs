import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { refreshSpotifyToken } from "@/lib/helper";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";

const { NextResponse } = require("next/server");

export async function GET(req, { params }) {
    try {
        const { id } = params;

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
        const user = await User.findById(session?.user?.id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let token = await refreshSpotifyToken(user.spotifyRefreshToken);
        user.spotifyAccessToken = token;
        await user.save();
        const albums = await fetchArtistTopTracks(token, id);

        return NextResponse.json(
            { message: "Top Tracks", data: albums?.items },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching artist:", error);
        return NextResponse.json(
            { message: "Error fetching artist:", error: error.message },
            { status: 500 }
        );
    }
}


const fetchArtistTopTracks = async (token, id) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = await response.json();
        return data;
    } catch (error) {
        return error
    }
}