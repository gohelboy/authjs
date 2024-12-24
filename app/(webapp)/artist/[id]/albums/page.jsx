"use client";

import { Calendar, Disc } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const fetchArtistAlbums = async ({ queryKey }) => {
    const [, id] = queryKey; // Extract ID from queryKey
    const response = await fetch(`/api/artist/${id}/albums`);
    if (!response.ok) throw new Error("Failed to fetch artist albums");
    const data = await response.json();
    return data?.data || [];
};

const Albums = () => {
    const pathname = usePathname();
    const id = pathname.split("/")[2];

    const { data: artistAlbums = [], isLoading, isError } = useQuery({
        queryKey: ['artistAlbums', id],
        queryFn: fetchArtistAlbums,
        enabled: !!id, // Only fetch if ID exists
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching artist albums.</p>;

    return (
        <div className="relative w-full md:h-[calc(100dvh-470px)] max-h-[calc(100dvh-340px)] overflow-y-scroll scrollbar-hidden bg-neutral-800 rounded-2xl p-2 md:p-6 shadow-2xl">
            <div className="grid gap-2">
                {artistAlbums.length > 0 &&
                    artistAlbums.map((album, index) => (
                        <div
                            href={`/album/${album?.id}`}
                            key={index}
                            className="scroll-item-animation bg-neutral-700 rounded-xl p-2 flex items-center space-x-4 hover:bg-neutral-600 transition"
                        >
                            <img
                                src={album?.images[0]?.url || "/user.jpg"}
                                alt={album.href}
                                className=" size-20 rounded-xl min-w-fit"
                            />
                            <div className="flex flex-col gap-1">
                                <h2 className="md:text-xl font-bold text-white">{album.name}</h2>
                                <p className="text-sm text-neutral-400 text-wrap flex items-center gap-1">
                                    <Disc className="size-3" /> <b>{album.total_tracks}</b>
                                </p>
                                <p className="text-sm text-neutral-400 text-wrap flex items-center gap-1">
                                    <Calendar className="size-3" /> {album.release_date}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Albums;
