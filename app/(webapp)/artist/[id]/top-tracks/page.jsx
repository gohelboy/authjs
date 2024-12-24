"use client";

import { AudioLines, Timer } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

function formatDuration(durationMs) {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
}

const fetchArtistTopTracks = async ({ queryKey }) => {
    const [, id] = queryKey; // Extract ID from queryKey
    const response = await fetch(`/api/artist/${id}/top-tracks`);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
};

const ArtistTopTracks = () => {
    const pathname = usePathname();
    const id = pathname.split("/")[2];

    const { data, isLoading, isError } = useQuery({
        queryKey: ['artistTopTracks', id],
        queryFn: fetchArtistTopTracks,
        enabled: !!id, // Only fetch if ID exists
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching top tracks.</p>;

    const artistTopTracks = data?.data || [];

    return (
        <div className="relative w-full md:h-[calc(100dvh-470px)] max-h-[calc(100dvh-340px)] overflow-y-scroll scrollbar-hidden bg-neutral-800 rounded-2xl p-2 md:p-6 shadow-2xl">
            <div className="grid gap-2">
                {artistTopTracks.length > 0 &&
                    artistTopTracks.map((track, index) => (
                        <div
                            key={index}
                            className="scroll-item-animation bg-neutral-700 rounded-xl p-2 flex items-center space-x-4 hover:bg-neutral-600 transition"
                        >
                            <img
                                src={track?.album?.images[0]?.url || "/user.jpg"}
                                alt={track?.href}
                                className="size-20 rounded-xl min-w-fit"
                            />
                            <div className="flex flex-col gap-1">
                                <h2 className="md:text-xl font-bold text-white">{track?.name}</h2>
                                <p className="text-sm text-neutral-400 text-wrap flex items-center gap-1">
                                    <Timer className="size-3" /> {formatDuration(track?.duration_ms)}
                                </p>
                                <p className="text-sm text-neutral-400 text-wrap flex items-center gap-1">
                                    <AudioLines className="size-3" /> Popularity :<b>{track?.popularity}</b>
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ArtistTopTracks;
