"use client";

import ConnectingLoading from "@/components/custom/ConnectingLoading";

import NowPlaying from "@/components/custom/NowPlaying";
import PlaybackHistory from "@/components/custom/PlaybackHistory";
import TopArtists from "@/components/custom/TopArtists";
import TopTracks from "@/components/custom/TopTracks";
import UsersList from "@/components/custom/UsersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Compass,
  Headphones,
  Music,
  PlayCircle,
  UserCircle2,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
const DiscoverMap = dynamic(() => import("@/components/custom/DiscoverMap"), {
  ssr: false,
});

const SpotifyInsightsPage = () => {
  const tabs = [
    {
      value: "currently-playing",
      icon: PlayCircle,
      label: "Now Playing",
    },
    { value: "top-tracks", icon: Music, label: "Top Tracks" },
    { value: "top-artists", icon: Headphones, label: "Top Artists" },
    { value: "playback-history", icon: Clock, label: "Play History" },
    { value: "users", icon: Users, label: "Users" },
    { value: "discover", icon: Compass, label: "Discover" },
  ];

  const { data: session, status } = useSession();

  const isLoading = useMemo(() => status === "loading", [status]);

  if (isLoading) {
    return <ConnectingLoading />;
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-72px)] ">
        <div className="text-center space-y-4 p-8 bg-neutral-800 rounded-xl shadow-2xl">
          <UserCircle2 size={64} className="mx-auto text-blue-500" />
          <h1 className="text-3xl font-bold">Welcome to Spotinsights</h1>
          <p className="text-neutral-300">
            Please log in to view your profile and top tracks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Tabs defaultValue="currently-playing" className="w-full ">
        <TabsList className="grid w-full grid-cols-6 bg-neutral-800 min-h-12 p-2 mb-3">
          {tabs.map(({ value, icon: Icon, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center space-x-2 justify-center h-full"
            >
              <Icon size={16} />
              <span className="hidden md:block">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value="currently-playing"
          className="bg-neutral-800 rounded-2xl p-6 shadow-2xl"
        >
          <NowPlaying  />
        </TabsContent>
        <TabsContent
          value="top-tracks"
          className="bg-neutral-800 rounded-2xl shadow-2xl"
        >
          <TopTracks />
        </TabsContent>
        <TabsContent
          value="top-artists"
          className="bg-neutral-800 rounded-2xl shadow-2xl"
        >
          <TopArtists />
        </TabsContent>
        <TabsContent
          value="playback-history"
          className="bg-neutral-800 rounded-2xl p-2 md:p-6 shadow-2xl"
        >
          <PlaybackHistory />
        </TabsContent>
        <TabsContent
          value="users"
          className="bg-neutral-800 rounded-2xl p-2 md:p-6 shadow-2xl"
        >
          <UsersList />
        </TabsContent>
        <TabsContent
          value="discover"
          className="bg-neutral-800 rounded-2xl p-2 md:p-6 shadow-2xl"
        >
          <DiscoverMap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpotifyInsightsPage;
