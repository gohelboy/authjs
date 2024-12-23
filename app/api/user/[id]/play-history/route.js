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
        const limit = parseInt(searchParams.get("limit")) || 50;
        const me = searchParams.get("me") === "true" ? true : false;

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

        const history = await fetchPlayHistory(accessToken, limit);
        return NextResponse.json(
            { message: "Play history", data: history },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching top tracks:", error);
        return NextResponse.json(
            { message: "Error fetching top tracks:", error: error.message },
            { status: 500 }
        );
    }
}

const fetchPlayHistory = async (token, limit) => {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};