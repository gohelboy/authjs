"use client";

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ArrowDown, AudioLines, Music, Play, PlayCircle, UserRound } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';

const formatFollowers = (count) => {
    if (count >= 1_000_000) {
        return (count / 1_000_000).toFixed(1) + 'M';
    } else if (count >= 1_000) {
        return (count / 1_000).toFixed(1) + 'K';
    }
    return count?.toString();
};

const gradients = [
    "bg-gradient-to-br from-purple-950 via-black to-black",     // Deep Purple
    "bg-gradient-to-br from-teal-950 via-black to-black",       // Teal
    "bg-gradient-to-br from-blue-950 via-black to-black",       // Deep Blue
    "bg-gradient-to-br from-pink-950 via-black to-black",       // Dark Pink
    "bg-gradient-to-br from-red-950 via-black to-black",        // Dark Red
    "bg-gradient-to-br from-green-950 via-black to-black",      // Dark Green
    "bg-gradient-to-br from-yellow-950 via-black to-black",     // Dark Yellow
    "bg-gradient-to-br from-indigo-950 via-black to-black",     // Indigo
    "bg-gradient-to-br from-emerald-950 via-black to-black",    // Emerald
    "bg-gradient-to-br from-lime-950 via-black to-black",       // Lime
    "bg-gradient-to-br from-rose-950 via-black to-black",       // Rose
    "bg-gradient-to-br from-cyan-950 via-black to-black",       // Cyan
    "bg-gradient-to-br from-amber-950 via-black to-black",      // Amber
    "bg-gradient-to-br from-olive-950 via-black to-black",      // Olive
    "bg-gradient-to-br from-wine-950 via-black to-black",       // Wine
];

const genreGradients = [
    "bg-gradient-to-b from-transparent to-gray-700 text-white",
    "bg-gradient-to-b from-transparent to-yellow-950 text-white",
    "bg-gradient-to-b from-transparent to-green-950 text-white",
    "bg-gradient-to-b from-transparent to-blue-950 text-white",
    "bg-gradient-to-b from-transparent to-purple-950 text-white",
    "bg-gradient-to-b from-transparent to-pink-950 text-white",
    "bg-gradient-to-b from-transparent to-orange-950 text-white",
    "bg-gradient-to-b from-transparent to-red-950 text-white",
];

const tabs = [
    { value: "albums", icon: Music, label: "Albums" },
    { value: "top-tracks", icon: PlayCircle, label: "Top Tracks" },
];

const fetchArtist = async ({ queryKey }) => {
    const [, id] = queryKey;
    const response = await fetch(`/api/artist/${id}`);
    if (!response.ok) throw new Error("Failed to fetch artist data");
    const data = await response.json();
    return data?.data || {};
};

const ArtistCard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const [backgroundGradient] = useState(randomGradient);
    const [expandCard, setExpandCard] = useState(false);

    const id = pathname.split("/")[2];
    const { data: artist, isLoading, isError } = useQuery({
        queryKey: ['artist', id],
        queryFn: fetchArtist,
        enabled: !!id, // Prevent fetching if ID is unavailable
    });

    const [activeTab, setActiveTab] = useState(() => {
        const pathTab = pathname.split("/").pop()
        return tabs.some(tab => tab.value === pathTab) ? pathTab : tabs[0].value;
    });

    const handleTabChange = (value) => {
        setActiveTab(value);
        router.push(value);
    };

    return (
        <section className="max-w-6xl mt-4 mx-4 md:mx-auto">
            <div className={`flex flex-col gap-2 md:gap-7 p-2 md:p-4 rounded-2xl overflow-hidden relative ${backgroundGradient} shadow-lg`}>
                {/* Artist Info */}
                {isLoading && <p>Loading artist details...</p>}
                {isError && <p>Error loading artist details.</p>}
                {!isLoading && artist && (
                    <>
                        <div className="relative flex gap-4 md:gap-24">
                            {/* Image with Play Button */}
                            <div className="relative group min-w-fit">
                                <Link href={artist?.external_urls?.spotify || "#"} className="relative">
                                    {/* Artist Image */}
                                    <Image
                                        src={artist?.images?.[0]?.url || "/user.jpg"}
                                        width={248}
                                        height={248}
                                        alt="artist"
                                        className="size-36 md:size-64 object-cover relative rounded-2xl z-10"
                                    />

                                    {/* Spinning Record */}
                                    <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2">
                                        <Image
                                            src="/record.svg"
                                            width={128}
                                            height={128}
                                            alt="record"
                                            className="size-52 object-cover slow-spin"
                                        />
                                    </div>

                                    {/* Play Button Overlay */}
                                    <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-2xl"
                                    >
                                        <Play size={36} />
                                        <span>Play</span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Artist Details */}
                            <div className="md:my-4">
                                <h1 className="text-2xl md:text-5xl font-semibold">{artist?.name}</h1>
                                <div className="flex md:flex-row flex-col md:items-center gap-1 md:gap-4 mt-3">
                                    <p className="text-neutral-400 text-xs md:text-base flex gap-1 items-center">
                                        <UserRound className="size-3 md:size-5" /> Followers:{" "}
                                        <b>{formatFollowers(artist?.followers?.total)}</b>
                                    </p>
                                    <p className="hidden md:block">|</p>
                                    <p className="text-neutral-400 text-xs md:text-base flex gap-1 items-center">
                                        <AudioLines className="size-3 md:size-5" /> Popularity: <b>{artist?.popularity}</b>
                                    </p>
                                </div>

                                {/* Genres */}
                                <div className="hidden sm:flex flex-wrap gap-2 mt-3">
                                    {artist?.genres?.map((genre, index) => (
                                        <p
                                            key={index}
                                            className={`px-2 py-1 rounded-lg transition-all hover:opacity-90 cursor-pointer text-sm ${genreGradients[index % genreGradients.length]}`}
                                        >
                                            {genre}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Expand Button for Mobile */}
                            <Button
                                className="sm:hidden absolute bottom-0 right-0"
                                size="icon"
                                onClick={() => setExpandCard(!expandCard)}
                            >
                                <ArrowDown className={cn("transition-all", expandCard && "rotate-180")} />
                            </Button>
                        </div>

                        {/* Mobile Genres */}
                        {expandCard && (
                            <div className="flex sm:hidden flex-wrap gap-2 mt-3">
                                {artist?.genres?.map((genre, index) => (
                                    <p
                                        key={index}
                                        className={`px-2 py-1 rounded-lg transition-all hover:opacity-90 cursor-pointer text-xs ${genreGradients[index % genreGradients.length]}`}
                                    >
                                        {genre}
                                    </p>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-2">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    defaultValue="top-tracks"
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 bg-neutral-800 min-h-12 p-2 mb-3">
                        {tabs.map(({ value, icon: Icon, label }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="flex items-center space-x-2 justify-center h-full"
                            >
                                {/* <Icon size={16} /> */}
                                <span className="text-xs font-semibold">{label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </section>
    );
};

export default ArtistCard;
