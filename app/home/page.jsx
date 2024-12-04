"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  UserCircle2,
  LogOut,
  Music,
  Disc3,
  PlayCircle,
  LineChart,
  Clock,
  Headphones,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatTimeAgo } from "@/lib/helper";

const SpotifyInsightsPage = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // State for different data sections
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [playbackHistory, setPlaybackHistory] = useState([]);
  // Fetch top tracks
  const fetchTopTracks = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=12",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setTopTracks(data.items || []);
    } catch (error) {
      toast({
        title: "Spotify Sync Error",
        description: "Unable to fetch top tracks",
        variant: "destructive",
      });
    }
  };

  // Fetch top artists
  const fetchTopArtists = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=12",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setTopArtists(data.items || []);
    } catch (error) {
      toast({
        title: "Spotify Sync Error",
        description: "Unable to fetch top artists",
        variant: "destructive",
      });
    }
  };

  // Fetch currently playing
  const fetchCurrentlyPlaying = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setCurrentlyPlaying(data.item);
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Unable to fetch currently playing track",
        variant: "destructive",
      });
    }
  };

  // Fetch recent playback history
  const fetchPlaybackHistory = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=10",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setPlaybackHistory(data.items);
    } catch (error) {
      toast({
        title: "History Error",
        description: "Unable to fetch playback history",
        variant: "destructive",
      });
    }
  };

  // Fetch data when session is available
  useEffect(() => {
    if (session) {
      fetchTopTracks();
      fetchTopArtists();
      fetchCurrentlyPlaying();
      fetchPlaybackHistory();
    }
  }, [session]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <div className="flex items-center space-x-3">
          <Disc3 className="animate-spin" size={32} />
          <span className="text-xl">Connecting to Spotify...</span>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <div className="text-center space-y-4 p-8 bg-neutral-800 rounded-xl shadow-2xl">
          <UserCircle2 size={64} className="mx-auto text-blue-500" />
          <h1 className="text-3xl font-bold">Welcome to Spotify Insights</h1>
          <p className="text-neutral-300">
            Please log in to view your profile and top tracks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="items-center space-x-4 hidden md:block">
            <h1 className="text-xl font-semibold text-white">Insights</h1>
          </div>

          <div className="flex items-center space-x-4 justify-between  w-full md:w-fit">
            <div className="flex items-center space-x-2">
              <Image
                src={session.user.image || "/default-profile.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-green-500"
              />
              <div>
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-neutral-400">{session.user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="currently-playing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-800 mb-6 min-h-12 p-2">
            <TabsTrigger
              value="currently-playing"
              className="flex items-center space-x-2 justify-center h-full"
            >
              <PlayCircle size={16} />
              <span className="hidden md:block">Now Playing</span>
            </TabsTrigger>
            <TabsTrigger
              value="top-tracks"
              className="flex items-center space-x-2 justify-center h-full"
            >
              <Music size={16} />
              <span className="hidden md:block">Top Tracks</span>
            </TabsTrigger>
            <TabsTrigger
              value="top-artists"
              className="flex items-center space-x-2 justify-center h-full"
            >
              <Headphones size={16} />
              <span className="hidden md:block">Top Artists</span>
            </TabsTrigger>
            <TabsTrigger
              value="playback-history"
              className="flex items-center space-x-2 h-full"
            >
              <Clock size={16} />
              <span className="hidden md:block">Play History</span>
            </TabsTrigger>
          </TabsList>

          {/* Currently Playing Tab */}
          <TabsContent
            value="currently-playing"
            className="bg-neutral-800 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              {currentlyPlaying ? (
                <>
                  <Image
                    src={currentlyPlaying.album.images[0].url}
                    alt={currentlyPlaying.name}
                    width={200}
                    height={200}
                    className="rounded-full slow-spin shadow-lg"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-4xl font-bold text-green-400">
                      {currentlyPlaying.name}
                    </h2>
                    <p className="text-neutral-300">
                      {currentlyPlaying.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Album: {currentlyPlaying.album.name}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-neutral-400">
                  No track currently playing
                </div>
              )}
            </div>
          </TabsContent>

          {/* Top Tracks Tab */}
          <TabsContent
            value="top-tracks"
            className="bg-neutral-800 rounded-2xl p-1 md:p-6 shadow-2xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topTracks?.map((track) => (
                <div
                  key={track?.id}
                  className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
                >
                  <Image
                    src={track?.album.images[0].url}
                    alt={track?.name}
                    width={150}
                    height={150}
                    className="rounded-lg mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-sm truncate">
                    {track?.name}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate">
                    {track?.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Top Artists Tab */}
          <TabsContent
            value="top-artists"
            className="bg-neutral-800 rounded-2xl p-1 md:p-6 shadow-2xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topArtists?.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
                >
                  <Image
                    src={artist.images[0]?.url || "/default-artist.png"}
                    alt={artist.name}
                    width={150}
                    height={150}
                    className="rounded-full size-24 md:size-[156px] mx-auto mb-2"
                  />

                  <h3 className="font-semibold text-sm truncate">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Popularity: {artist.popularity}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Playback History Tab */}
          <TabsContent
            value="playback-history"
            className="bg-neutral-800 rounded-2xl p-1 md:p-6 shadow-2xl overflow-hidden"
          >
            <div className="space-y-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-200px)] overflow-y-scroll rounded-xl scrollbar-hidden">
              {playbackHistory.map((item, index) => (
                <div
                  key={`${item.track.id}-${index}`}
                  className="bg-neutral-700 rounded-xl p-4 flex items-center space-x-4 hover:bg-neutral-600 transition"
                >
                  <Image
                    src={
                      item.track.album.images[0]?.url || "/default-album.png"
                    }
                    alt={item.track.name}
                    width={78}
                    height={78}
                    className="rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-sm text-wrap">
                      {item.track.name}
                    </h3>
                    <p className="text-xs text-neutral-400 text-wrap">
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      ({formatTimeAgo(new Date(item.played_at))})
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {item.context?.type === "playlist"
                        ? `Played from playlist`
                        : item.context?.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SpotifyInsightsPage;
