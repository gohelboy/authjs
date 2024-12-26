"use client"
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { AudioLines, Book, Calendar, Clock, Disc, Globe, Play, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fetchTrackDetails = async ({ queryKey }) => {
    const [, id] = queryKey;
    const response = await fetch(`/api/track/${id}`);
    if (!response.ok) throw new Error("Failed to fetch artist data");
    const data = await response.json();
    return data?.data || {};
};
const TrackPage = ({ params }) => {
    const { id } = params;
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const { data: trackDetails } = useQuery({
        queryKey: ['artist', id],
        queryFn: fetchTrackDetails,
        enabled: !!id,
    });

    return (
        <div className='flex flex-col gap-4 max-w-6xl mx-4 md:mx-auto'>
            <div className='bg-neutral-800 w-full rounded-xl p-2 sm:p-4 relative overflow-hidden'>
                <div className='relative flex flex-row sm:flex-row gap-4 sm:gap-24 z-[10]'>
                    <div className="relative group min-w-fit">
                        <Link href={trackDetails?.track_url || "#"} className="relative">
                            {/* Artist Image */}
                            <img
                                src={trackDetails?.album?.image || "/user.jpg"}
                                alt="artist"
                                className="size-36 md:size-64 object-cover relative rounded-full z-10"
                            />

                            {/* Spinning Record */}
                            <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2">
                                <Image
                                    src="/record.svg"
                                    width={128}
                                    height={128}
                                    alt="record"
                                    className="size-52 object-cover slow-spin "
                                />
                            </div>

                            {/* Play Button Overlay */}
                            <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-full"
                            >
                                <Play size={36} />
                                <span>Play</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="md:my-4 flex-1">
                        <h1 className="text-xl md:text-5xl font-semibold">{trackDetails?.name}</h1>
                        <div className="mt-2 grid md:grid-cols-2 space-y-1">
                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <UserRound className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Artist:</span> <span className="text-white">{trackDetails?.artist}</span>
                            </p>
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
                            <h1 className="text-md md:text-3xl  font-semibold">
                                {trackDetails?.album?.name}
                            </h1>
                            <div className="mt-2 space-y-1">
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <UserRound className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Artist:</span> <span className="text-white">{trackDetails?.artist}</span>
                                </p>
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <Disc className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Track:</span> <span className="text-white">{trackDetails?.total_tracks}</span>
                                </p>
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <Calendar className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Released:</span> <span className="text-white">{formatDate(trackDetails?.album?.release_date)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {trackDetails?.tracks?.length > 0 &&
                        <div className="flex-1 flex flex-col gap-2 overflow-y-scroll max-h-[calc(100vh-390px)] sm:max-h-[calc(100vh-430px)] scrollbar-hidden">
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
                                </div>
                            })}
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default TrackPage;