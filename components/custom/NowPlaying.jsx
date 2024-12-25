import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Computer,
  Music2,
  Pause,
  Play,
  Radio,
  RefreshCcwDot,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const NowPlaying = ({ id, me = true }) => {
  const [localProgressMs, setLocalProgressMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: currentlyPlaying, isLoading, error, refetch } = useQuery({
    queryKey: ["me-current-playing", id, me],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/current-playing?me=${me}`);
      const data = await response.json();
      return data?.data || {};
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (currentlyPlaying) {
      setLocalProgressMs(currentlyPlaying?.progress_ms || 0);
      setIsPlaying(currentlyPlaying?.is_playing || false);
    }
  }, [currentlyPlaying]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setLocalProgressMs((prev) => prev + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (isLoading) {
    return <div className="p-2">Loading...</div>;
  }

  if (error) {
    return <div>Error fetching current playing data</div>;
  }

  const track = currentlyPlaying?.item;
  const device = currentlyPlaying?.device;
  const spotifyLink = track?.external_urls?.spotify;
  const albumImageUrl =
    track?.album?.images?.[0]?.url ||
    track?.album?.images?.[1]?.url ||
    track?.album?.images?.[2]?.url ||
    "/user.jpg";
  const progressPercentage =
    (localProgressMs / track?.duration_ms) * 100;

  return (
    <div
      className={`relative ${me ? "h-[calc(100dvh-160px)] sm:h-auto" : "h-auto"
        } w-full mx-auto overflow-hidden rounded-xl p-10`}
    >
      {/* Background Image with Blur */}
      <div>
        {albumImageUrl && (
          <img
            src={albumImageUrl || "/user.jpg"}
            alt={track?.name}
            className="object-cover w-full h-full inset-0 absolute scale-110 opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {Object.keys(currentlyPlaying).length > 0 ? (
        <div className="h-full relative flex flex-col items-center justify-between sm:justify-start md:flex-row gap-6 ">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full opacity-75 blur-lg bg-black/50 group-hover:opacity-100 transition duration-1000" />
            <img
              src={albumImageUrl}
              alt={track?.name}
              className={`relative size-48 rounded-full ${isPlaying && "slow-spin"
                } object-cover shadow-lg transition-transform duration-300 group-hover:scale-105`}
            />
            <Link href={spotifyLink || "#"} passHref>
              <div
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center justify-center"
                target="_blank"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white" />
                )}
              </div>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-auto space-y-4 w-screen sm:w-auto px-10 sm:px-0 z-10 md:px-0">
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-1 truncate">
                {track?.name}
              </h2>
              <p className="text-neutral-100 text-lg flex items-center gap-2">
                <Music2 className="w-4 h-4" />
                {track?.artists?.map((artist) => artist?.name).join(", ")}
              </p>
              <p className="text-neutral-300 text-sm flex items-center gap-2 mt-1">
                <Radio className="w-4 h-4" />
                {track?.album?.name}
              </p>
              <p className="text-neutral-300 text-sm flex items-center gap-2 mt-2">
                <BarChart3 className="w-4 h-4" />
                Popularity: {track?.popularity}%
              </p>
            </div>
            <div className="space-y-2">
              <div className="relative h-2 group">
                {/* Main progress bar container */}
                <div className="absolute inset-0 bg-neutral-800 rounded-full overflow-hidden">
                  {/* Progress gradient */}
                  <div
                    className="h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full animate-gradient-x transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-neutral-300">
                <span>{formatTime(localProgressMs)}</span>
                <span>{formatTime(track?.duration_ms)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                size="sm"
                className="flex items-center justify-center gap-1 w-fit bg-white/5 text-green-400 px-2 py-1 rounded text-xs backdrop-blur-sm border border-white/10"
              >
                {device?.type === "Smartphone" ? (
                  <Smartphone className="w-4 h-4" />
                ) : (
                  <Computer className="w-4 h-4" />
                )}{" "}
                {device?.name}
              </Button>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="flex items-center justify-center gap-1 w-fit bg-white/5 text-green-400 px-2 py-1 rounded text-xs backdrop-blur-sm border border-white/10"
              >
                <RefreshCcwDot className="w-4 h-4" /> Reload
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-green-400">Not Playing...</h1>
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
