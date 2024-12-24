import { formatTimeAgo } from "@/lib/helper";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

// Memoized recent play song list item component
const ListItemRecentPlaySong = memo(({ item }) => {
  const { track, played_at, context } = item;
  const { id, name, album, artists } = track;

  return (
    <div
      key={id}
      className="scroll-item-animation bg-neutral-700 rounded-xl p-2 flex items-center space-x-4 hover:bg-neutral-600 transition"
    >
      <Image
        src={album.images[0]?.url || "/default-album.png"}
        alt={name}
        width={78}
        height={78}
        className="rounded-lg object-cover"
      />
      <div className="flex-grow">
        <h3 className="font-semibold text-sm text-wrap">{name}</h3>
        <p className="text-xs text-neutral-400 text-wrap">
          {artists.map((artist) => artist.name).join(", ")}
        </p>
        <p className="text-xs text-neutral-400 truncate">
          ({formatTimeAgo(new Date(played_at))})
        </p>
        <p className="text-xs text-neutral-400 truncate">
          {context?.type === "playlist" ? `Played from playlist` : context?.type}
        </p>
      </div>
    </div>
  );
});
ListItemRecentPlaySong.displayName = "ListItemRecentPlaySong";

// PlaybackHistory Component
const PlaybackHistory = ({ id, me = true }) => {
  const { data: playbackHistory = [], isLoading, error } = useQuery({
    queryKey: ["playback-history", id, me],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/play-history?limit=50&me=${me}`);
      const data = await response.json();
      return data?.data?.items || [];
    },
    enabled: !!id,
  });

  // Loading and error states
  if (isLoading) {
    return <div className="p-4">Loading playback history...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching playback history. Please try again later.</div>;
  }

  return (
    <div
      className={`flex flex-col p-2 gap-3 ${me
        ? "max-h-[calc(100dvh-150px)] md:max-h-[calc(100dvh-170px)]"
        : "max-h-[calc(100dvh-300px)] md:max-h-[calc(100dvh-420px)]"
        } overflow-y-scroll scrollbar-hidden rounded-xl`}
    >
      {playbackHistory.length > 0 ? (
        playbackHistory.map((item, index) => (
          <ListItemRecentPlaySong key={item.track.id} item={item} />
        ))
      ) : (
        <div className="text-center text-neutral-400">No playback history found</div>
      )}
    </div>
  );
};

export default PlaybackHistory;
