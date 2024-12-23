import { formatTimeAgo } from "@/lib/helper";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

const PlaybackHistory = ({ id, me = true }) => {
  const { data: playbackHistory = [], isLoading, error } = useQuery({
    queryKey: ['playback-history', id, me],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}/play-history?limit=50&me=${me}`);
      const data = await response.json();
      return data?.data?.items || [];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-4"> Loading... </div>;
  }

  if (error) {
    return <div>Error fetching playback history</div>;
  }

  return (
    <div className={`flex flex-col p-2 gap-3 ${me ? "max-h-[calc(100dvh-170px)] md:max-h-[calc(100dvh-170px)]" : "max-h-[calc(100dvh-320px)]  md:max-h-[calc(100dvh-470px)]"} overflow-y-scroll scrollbar-hidden rounded-xl`}>
      {playbackHistory.length > 0 ? (
        playbackHistory.map((item, index) => (
          <div
            key={`${item.track.id}-${index}`}
            className="scroll-item-animation bg-neutral-700 rounded-xl p-4 flex items-center space-x-4 hover:bg-neutral-600 transition"
          >
            <Image
              src={item.track.album.images[0]?.url || "/default-album.png"}
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
                {item.track.artists.map((artist) => artist.name).join(", ")}
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
        ))
      ) : (
        <div className="text-center text-neutral-400">
          No playback history found
        </div>
      )}
    </div>
  );
};

export default PlaybackHistory;
