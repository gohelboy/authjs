import spotifyAPI from "@/lib/api";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const TopArtists = () => {
  const [topArtistsList, setTopArtistsList] = useState([]);

  const [timeRange, setTimeRange] = useState("short_term");

  const fetchTopArtists = async (range) => {
    try {
      const { data } = await spotifyAPI.get(
        `me/top/artists?time_range=${range}&limit=18`
      );
      setTopArtistsList(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopArtists(timeRange);
  }, [timeRange]);

  const getRankStyle = (rank) => {
    const baseStyle =
      "absolute top-2 left-2 size-6 flex items-center justify-center rounded-full font-bold text-sm";

    switch (rank) {
      case 1:
        return `${baseStyle} bg-yellow-400 text-black shadow-lg`;
      case 2:
        return `${baseStyle} bg-gray-400 text-white shadow-md`;
      case 3:
        return `${baseStyle} bg-amber-600 text-white shadow-md`;
      default:
        return `${baseStyle} bg-neutral-500 text-white`;
    }
  };

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
            size="sm"
            key={range}
            onClick={() => changeTimeRange(range)}
            className={isActiveButton(range)}
          >
            <CalendarDays className="h-5 w-5" />
            {["Month", "6 Months", "Year"][idx]}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-220px)] overflow-y-scroll scrollbar-hidden rounded-xl">
        {topArtistsList?.map((artist, index) => (
          <div
            key={artist?.id}
            className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105 relative group"
          >
            <div className={getRankStyle(index + 1)}>{index + 1}</div>
            <Image
              src={artist?.images[0]?.url || "/user.png"}
              alt={artist?.name}
              width={150}
              height={150}
              className="rounded-full size-24 md:size-[156px] mx-auto mb-2 group-hover:scale-110 transition-transform"
            />

            <h3 className="font-semibold text-sm truncate">{artist?.name}</h3>
            <p className="text-xs text-neutral-400">
              Popularity: {artist?.popularity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
