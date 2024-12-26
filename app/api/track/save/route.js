import { connectToDatabase } from "@/lib/db";
import { refreshSpotifyToken } from "@/lib/helper";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "tack ID is required" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const token = await refreshSpotifyToken(user.spotifyRefreshToken);
        if (!token) {
            return NextResponse.json({ message: "Failed to refresh Spotify token" }, { status: 500 });
        }

        user.spotifyAccessToken = token;
        await user.save();

        const saveResult = await saveTrackToLiked(token, id);
        if (saveResult.error) {
            return NextResponse.json(
                { message: "Failed to save track", error: saveResult.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Track saved" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { message: "Error processing request", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "tack ID is required" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const token = await refreshSpotifyToken(user.spotifyRefreshToken);
        if (!token) {
            return NextResponse.json({ message: "Failed to refresh Spotify token" }, { status: 500 });
        }

        user.spotifyAccessToken = token;
        await user.save();

        const saveResult = await removeTrackFromLiked(token, id);
        if (saveResult.error) {
            return NextResponse.json(
                { message: "Failed to save track", error: saveResult.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Track saved" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { message: "Error processing request", error: error.message },
            { status: 500 }
        );
    }
}

const saveTrackToLiked = async (token, id) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData?.error?.message || "Unknown error" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving track to liked:", error);
        return { error: error.message };
    }
};

const removeTrackFromLiked = async (token, id) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData?.error?.message || "Unknown error" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving track to liked:", error);
        return { error: error.message };
    }
};
