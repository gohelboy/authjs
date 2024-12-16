import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const { searchParams } = new URL(req.url);
        const time_range = searchParams.get("time_range") || "short_term";
        const limit = parseInt(searchParams.get("limit")) || 50;

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

        const topTracks = await fetchTopArtists(session.user, time_range, limit);
        return NextResponse.json(
            { message: "Top Tracks", data: topTracks },
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

const fetchTopArtists = async (session, time_range, limit) => {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};
