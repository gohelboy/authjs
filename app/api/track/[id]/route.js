import { connectToDatabase } from "@/lib/db";
import { refreshSpotifyToken } from "@/lib/helper";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
        const track = await fetchTrack(token, id);

        const albumData = await fetchAlbumTracks(token, track.album.id) || null;



        // Filtering and structuring the data
        const filterData = {
            id: track.id,
            artist: track.artists.map((artist) => artist.name).join(", "),
            popularity: track.popularity,
            track_url: track?.external_urls?.spotify,
            release_date: track.album.release_date,
            duration: track.duration_ms,
            explicit: track.explicit,
            image: track.album.images[0].url,
            name: track.name,
            total_tracks: track.album.total_tracks,
            countries: track.available_markets?.length,
            album: {
                id: track.album.id,
                name: track.album.name,
                image: track.album.images[0].url,
                tracks: track.album.total_tracks,
                release_date: track.album.release_date,
                url: track.album.external_urls.spotify,
            },
            tracks: albumData?.tracks?.items?.map((t) => {
                return {
                    id: t.id,
                    name: t.name,
                    duration: t.duration_ms,
                    explicit: t.explicit,
                    popularity: t.popularity,
                    track_url: t.external_urls.spotify,
                }
            }) || []
        };

        return NextResponse.json(
            { message: "track", data: filterData },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching track:", error);
        return NextResponse.json(
            { message: "Error fetching track:", error: error.message },
            { status: 500 }
        );
    }
}

const fetchTrack = async (token, id) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching track data:", error);
        return error;
    }
}

const fetchAlbumTracks = async (token, id) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching track data:", error);
        return error;
    }
}
