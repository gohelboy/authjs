import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

const TopTracks = ({ id, me = true }) => {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState(me ? "short_term" : "long_term");


  const fetchTopTracks = async () => {
    try {
      const response = await fetch(`/api/user/${id}/top-tracks?time_range=${timeRange}&limit=${18}&me=${me}`);
      const data = await response.json()
      setTracks(data?.data?.items || []);
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
        "absolute top-2 left-2 size-6 flex items-center justify-center rounded-full font-bold text-sm";
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
    timeRange == range
      ? "bg-white text-[#171717] hover:bg-white/70 flex-1 md:flex-initial md: transition-all"
      : "";

  return (
    <div className="relative ">
      {me && <div className="flex items-center justify-center md:justify-start gap-2 p-2 md:pt-4 md:px-6">
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
      </div>}

      <div className="p-2 md:p-6 md:pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:max-h-[calc(100dvh-220px)] max-h-[calc(100dvh-220px)] overflow-y-scroll scrollbar-hidden rounded-3xl">
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
