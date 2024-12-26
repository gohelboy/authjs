"use client";
import ConnectingLoading from "@/components/custom/ConnectingLoading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AudioLines, Book, Calendar, Clock, Disc, Globe, Heart, Play, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fetchTrackDetails = async ({ queryKey }) => {
    const [, id] = queryKey;
    const response = await fetch(`/api/track/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch track details: ${response.statusText}`);
    const data = await response.json();
    return data?.data || {};
};

const saveTrack = async (trackId) => {
    const response = await fetch(`/api/track/save`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trackId }),
    });
    if (!response.ok) throw new Error(`Failed to save track: ${response.statusText}`);
    return await response.json();
};

const removeFromSaveTrack = async (trackId) => {
    const response = await fetch(`/api/track/save`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: trackId }),
    });

    if (!response.ok) {
        throw new Error("Failed to remove track");
    }

    return await response.json();
};

const TrackPage = ({ params }) => {
    const { id } = params;
    const queryClient = useQueryClient();

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const { data: trackDetails, isLoading, isError } = useQuery({
        queryKey: ["track", id],
        queryFn: fetchTrackDetails,
        enabled: !!id,
    });

    const updateTrackCache = (trackId, isLiked) => {
        queryClient.setQueryData(["track", id], (oldData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                liked: isLiked,
                tracks: oldData.tracks?.map((track) => {
                    return track.id === trackId ? { ...track, liked: isLiked } : track
                }
                ),
            };
        });
    };

    const saveMutation = useMutation({
        mutationFn: saveTrack,
        onMutate: (trackId) => updateTrackCache(trackId, true),
        onError: (error, trackId) => {
            updateTrackCache(trackId, false);
            console.error("Error saving track:", error);
        },
        onSuccess: (data, trackId) => {
            console.log("Track saved successfully:", data);
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromSaveTrack,
        onMutate: (trackId) => updateTrackCache(trackId, false),
        onError: (error, trackId) => {
            updateTrackCache(trackId, true);
            console.error("Error removing track:", error);
        },
        onSuccess: (data, trackId) => {
            console.log("Track removed successfully:", data);
        },
    });

    const handleTrackSave = (track) => {
        if (!track || !track.id) return;
        track.liked ? removeMutation.mutate(track.id) : saveMutation.mutate(track.id);
    };

    if (isLoading) return <ConnectingLoading message="Track is on the way..." />
    if (isError) return <p className="flex flex-col gap-4 max-w-6xl mx-4 md:mx-auto">Error loading track details.</p>;

    return (
        <div className='flex flex-col gap-4 max-w-6xl mx-4 md:mx-auto'>
            <div className='bg-neutral-800 w-full rounded-xl p-4 sm:p-6 relative overflow-hidden'>
                <div className='relative flex flex-row items-center sm:flex-row gap-4 sm:gap-7 z-[10]'>
                    <div className="relative group min-w-fit">
                        <Link href={trackDetails?.track_url || "#"}>
                            <div className='relative slow-spin'>
                                {/* Artist Image */}
                                <img
                                    src={trackDetails?.album?.image || "/user.jpg"}
                                    alt="track"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover size-20 sm:size-36 rounded-full z-10"
                                />

                                {/* Spinning Record */}
                                <Image
                                    src="/record.svg"
                                    width={128}
                                    height={128}
                                    alt="record"
                                    className="size-28 sm:size-52 object-cover"
                                />
                                {/* Play Button Overlay */}
                                <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-full"
                                >
                                    <Play size={36} />
                                    <span>Play</span>
                                </Button>
                            </div>
                        </Link>
                    </div>
                    <div className="md:my-4 flex-1">
                        <h1 className="text-xl md:text-5xl font-semibold">{trackDetails?.name}</h1>
                        <div className="mt-2 grid gap-2 md:grid-cols-2 space-y-1">
                            <div className="flex items-center gap-2 text-neutral-400 text-xs md:text-sm ">
                                <UserRound className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Artist:</span>
                                {trackDetails?.artists?.map((artist) =>
                                    <Link href={`/artist/${artist?.id}/albums`} className="flex hover:underline flex-wrap" key={artist?.id}>
                                        <span className="text-white">{artist?.name}</span>
                                    </Link>
                                )}
                            </div>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <Book className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Album:</span> <span className="text-white">{trackDetails?.album.name}</span>
                            </p>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <AudioLines className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Popularity:</span> <span className="text-white">{trackDetails?.popularity}</span>
                            </p>

                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <Clock className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Duration:</span> <span className="text-white">{formatDuration(trackDetails?.duration)}</span>
                            </p>
                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <Calendar className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Released:</span> <span className="text-white">{formatDate(trackDetails?.album?.release_date)}</span>
                            </p>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <Globe className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Available in</span> <span className="text-white">{trackDetails?.countries}</span> countries
                            </p>

                        </div>
                    </div>

                    <Button
                        onClick={() => handleTrackSave(trackDetails)}
                        size="icon"
                        variant="link"
                        className={cn("absolute bottom-0 right-0 hover:scale-110 text-white hover:text-green-400", trackDetails?.liked ? "text-green-400" : "text-white")}>
                        <Heart fill={trackDetails?.liked ? "currentColor" : "none"} />
                    </Button>
                </div>

                <div>
                    <img
                        src={trackDetails?.album?.image}
                        alt={trackDetails?.album?.image}
                        className="object-cover w-full h-full inset-0 absolute opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-l from-transparent to-black" />
                </div>
            </div>
            <div className='bg-neutral-800 w-full rounded-xl p-2 sm:p-4 relative overflow-hidden'>
                <div className='relative flex flex-col sm:flex-row gap-4 z-[10]'>
                    <div className="relative  flex items-center sm:items-start sm:flex-col gap-4">
                        <Link href={trackDetails?.album?.url || "#"} className="relative min-w-fit group">
                            {/* Artist Image */}
                            <img
                                src={trackDetails?.album?.image || "/user.jpg"}
                                alt="artist"
                                className="size-24 sm:size-52 object-cover relative rounded-2xl z-10"
                            />

                            {/* Play Button Overlay */}
                            <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-2xl">
                                <Play size={36} />
                                <span>Album</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-md md:text-2xl text-wrap text-wrap max-w-52 font-semibold">
                                {trackDetails?.album?.name}
                            </h1>
                            <div className="mt-2 space-y-1">
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <UserRound className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Artist:</span>
                                    <Link href={`/artist/${trackDetails?.artist?.id}/albums`} className="flex hover:underline flex-wrap">
                                        <span className="text-white">{trackDetails?.artist?.name}</span>
                                    </Link>
                                </p>
                                <div className="flex sm:flex-col gap-2 sm:gap-1">
                                    <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                        <Disc className="size-3 md:size-4" />
                                        <span className='hidden sm:block'>Track:</span> <span className="text-white">{trackDetails?.total_tracks}</span>
                                    </p>
                                    <p className="block sm:hidden">|</p>
                                    <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                        <Calendar className="size-3 md:size-4" />
                                        <span className='hidden sm:block'>Released:</span> <span className="text-white">{formatDate(trackDetails?.album?.release_date)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {trackDetails?.tracks?.length > 0 &&
                        <div className="flex-1 flex flex-col gap-2 overflow-y-scroll max-h-[calc(100vh-370px)] sm:max-h-[calc(100vh-400px)] scrollbar-hidden">
                            {trackDetails?.tracks?.map((track) => {
                                return <div key={track?.id}
                                    className="scroll-item-animation bg-neutral-700 rounded-xl p-2 flex items-center space-x-4 hover:bg-neutral-600 transition"
                                >
                                    <Link href={track?.track_url || "#"} className="flex items-center gap-4">
                                        <img
                                            src={trackDetails?.image || "/user.jpg"}
                                            alt={track?.name}
                                            className="size-14 sm:size-20 min-w-fit rounded-lg object-cover rounded-full"
                                        />
                                    </Link>
                                    <div className="flex-grow flex flex-col gap-1">
                                        <h3 className="font-semibold text-xs sm:text-sm text-wrap">{track?.name}</h3>
                                        <p className="text-neutral-400 text-xs flex items-center gap-1">
                                            <Clock className="size-3 md:size-4" />
                                            <span>{formatDuration(track?.duration)}</span>
                                        </p>

                                    </div>
                                    <Button
                                        onClick={() => handleTrackSave(track)}
                                        size="icon"
                                        variant="link"
                                        className={cn("hover:scale-110 hover:text-green-400", track?.liked ? "text-green-400" : "text-white")}
                                    >
                                        <Heart fill={track.liked ? "currentColor" : "none"} />
                                    </Button>
                                </div>
                            })}
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default TrackPage;
