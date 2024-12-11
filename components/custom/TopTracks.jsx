import spotifyAPI from "@/lib/api";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");

  const fetchTopTracks = async (range) => {
    try {
      const { data } = await spotifyAPI.get(
        `me/top/tracks?time_range=${timeRange}&limit=18`
      );
      setTracks(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopTracks(timeRange);
  }, [timeRange]);

  const getRankStyle = useMemo(
    () => (rank) => {
      const baseStyle =
        "absolute top-2 left-2 size-6 md:size-8 flex items-center justify-center rounded-full font-bold text-sm";
      const styles = [
        `${baseStyle} bg-yellow-400 text-black shadow-lg`,
        `${baseStyle} bg-gray-400 text-white shadow-md`,
        `${baseStyle} bg-amber-600 text-white shadow-md`,
      ];
      return rank <= 3
        ? styles[rank - 1]
        : `${baseStyle} bg-neutral-500 text-white`;
    },
    []
  );

  const changeTimeRange = (range) => {
    setTimeRange(range);
  };

  const isActiveButton = (range) =>
    timeRange == range ? "bg-white text-[#171717] hover:bg-white/70" : "";

  return (
    <div className="relative">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
        {["short_term", "medium_term", "long_term"].map((range, idx) => (
          <Button
            key={range}
            onClick={() => changeTimeRange(range)}
            className={isActiveButton(range)}
          >
            <CalendarDays className="h-5 w-5" />
            {["Last Month", "6 Months", "Year"][idx]}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[calc(100dvh-240px)] overflow-y-auto scrollbar-hidden rounded-xl">
        {tracks?.map((track, index) => (
          <div
            key={track?.id}
            className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
          >
            <div className={getRankStyle(index + 1)}>{index + 1}</div>
            <Image
              src={track?.album?.images[0].url || "/user.jpg"}
              alt={track?.name}
              width={150}
              height={150}
              className="rounded-lg mx-auto mb-2"
            />
            <h3 className="font-semibold text-sm truncate">{track?.name}</h3>
            <p className="text-xs text-neutral-400 truncate">
              {track?.artists?.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTracks;
