import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";

const TopArtists = ({ id, me = true }) => {
  const [timeRange, setTimeRange] = useState(me ? "short_term" : "long_term");

  const { data: topArtistsList = [], isLoading, error } = useQuery({
    queryKey: ['top-artists', id, me, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/top-artists?time_range=${timeRange}&limit=50&me=${me}`);
      const data = await response.json();
      return data?.data || [];
    },
    enabled: !!id,
  });

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
    timeRange == range
      ? "bg-white text-[#171717] hover:bg-white/70 flex-1 md:flex-initial transition-all"
      : "";

  if (isLoading) {
    return <div className="p-4">
      Loading...
    </div>;
  }

  if (error) {
    return <div>Error fetching top artists</div>;
  }

  return (
    <div className="relative">
      {me && (
        <div className="flex items-center justify-center md:justify-start gap-2 p-2 md:pt-4 md:px-6">
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
      )}
      <div
        className={`p-2 md:p-6 md:pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:max-h-[calc(100dvh-220px)] 
      ${me ? "max-h-[calc(100dvh-220px)]" : "max-h-[calc(100dvh-310px)]"} overflow-y-scroll scrollbar-hidden rounded-3xl`}
      >
        {topArtistsList?.map((artist, index) => (
          <Link
            href={`/artist/${artist?.id}/albums`}
            key={artist?.id}
            className="scroll-item-animation bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105 relative group"
          >
            <div className={getRankStyle(index + 1)}>{index + 1}</div>
            <Image
              src={artist?.image || "/user.png"}
              alt={artist?.name}
              width={150}
              height={150}
              className="rounded-full size-24 md:size-[156px] mx-auto mb-2 group-hover:scale-110 transition-transform"
            />

            <h3 className="font-semibold text-sm truncate">{artist?.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
