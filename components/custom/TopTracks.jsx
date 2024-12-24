import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Heart } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import { Button } from "../ui/button";

// Rank style utility function
const getRankStyle = (rank) => {
  const baseStyle =
    "absolute top-1 left-1 size-5 flex items-center justify-center rounded-full font-bold text-sm";
  const styles = [
    `${baseStyle} bg-yellow-400 text-black shadow-lg`,
    `${baseStyle} bg-gray-400 text-white shadow-md`,
    `${baseStyle} bg-amber-600 text-white shadow-md`,
  ];
  return rank <= 3
    ? styles[rank - 1]
    : `${baseStyle} bg-neutral-500 text-white`;
};

// Time duration tabs component
const TimeDurationTabs = memo(({ range, changeTimeRange, showSaved, handleShowSave }) => {
  const timeRanges = [
    { key: "short_term", label: "Month" },
    { key: "medium_term", label: "6 Months" },
    { key: "long_term", label: "Year" },
  ];

  return (
    <div className={`p-2 md:pt-4 md:px-6 flex ${showSaved ? "justify-end" : "justify-between"} items-center gap-2`}>
      {!showSaved && (
        <div className="flex items-center gap-2">
          {timeRanges.map(({ key, label }) => (
            <Button
              key={key}
              size="sm"
              onClick={() => changeTimeRange(key)}
              className={range === key ? "bg-white text-[#171717] rounded-lg hover:bg-white/70 flex-1 md:flex-initial transition-all" : ""}
            >
              <CalendarDays className="h-5 w-5" />
              {label}
            </Button>
          ))}
        </div>
      )}
      <Button
        onClick={handleShowSave}
        className="bg-white hover:bg-white rounded-lg text-black"
        size="sm"
      >
        <Heart fill="black" />
        <span className="hidden sm:block">Saved</span>
      </Button>
    </div>
  );
});
TimeDurationTabs.displayName = "TimeDurationTabs";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

// Track card component
const ListItemTrackCard = memo(({ track, index }) => {
  const { id, image, name, artist, added_at = "" } = track;

  return (
    <div
      key={id}
      className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105 scroll-item-animation"
    >
      {!added_at && <div className={getRankStyle(index + 1)}>{index + 1}</div>}
      <img
        src={image || "/user.jpg"}
        alt={name}
        className="size-28 sm:size-40 rounded-lg mx-auto mb-2 object-cover"
      />
      <h3 className="font-semibold text-sm truncate">{name}</h3>
      <p className="text-xs text-neutral-400 truncate">{artist}</p>
      {added_at && <p className="text-xs text-neutral-400 truncate">{formatTimestamp(added_at)}</p>}
    </div>
  );
});
ListItemTrackCard.displayName = "ListItemTrackCard";

// Main TopTracks component
const TopTracks = ({ id, me = true }) => {
  const [timeRange, setTimeRange] = useState(me ? "short_term" : "long_term");
  const [showSaved, setShowSaved] = useState(false);

  const { data: tracks = [], isLoading, error } = useQuery({
    queryKey: ["top-tracks", id, me, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/top-tracks?time_range=${timeRange}&limit=50&me=${me}`);
      const data = await response.json();
      return data?.data || [];
    },
    enabled: !!id,
  });

  const { data: savedTracks = [], isLoading: saveLoading, error: saveError } = useQuery({
    queryKey: ["saved-tracks", id, me],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/saved-tracks?limit=50&me=${me}`);
      const data = await response.json();
      return data?.data || [];
    },
    enabled: !!id,
  });

  const loading = isLoading || saveLoading;
  const hasError = error || saveError;

  // Dynamic grid classes
  const gridClass = `p-2 md:p-6 md:pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4  
    ${me ? "max-h-[calc(100dvh-200px)] md:max-h-[calc(100dvh-210px)]" : "max-h-[calc(100dvh-300px)] md:max-h-[calc(100dvh-420px)]"} 
    overflow-y-scroll scrollbar-hidden rounded-3xl`;

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (hasError) {
    return <div className="text-red-500 p-4">Error fetching tracks. Please try again later.</div>;
  }

  return (
    <div className="relative">
      {me && (
        <TimeDurationTabs
          range={timeRange}
          changeTimeRange={setTimeRange}
          handleShowSave={() => setShowSaved(!showSaved)}
          showSaved={showSaved}
        />
      )}
      <div className={gridClass}>
        {(Array.isArray(showSaved ? savedTracks : tracks) ? showSaved ? savedTracks : tracks : []).map((track, index) => (
          <ListItemTrackCard track={track} index={index} key={track.id} />
        ))}
      </div>

    </div>
  );
};

export default TopTracks;
