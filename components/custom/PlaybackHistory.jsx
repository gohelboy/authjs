import { formatTimeAgo } from "@/lib/helper";
import Image from "next/image";
import { useEffect, useState } from "react";

const PlaybackHistory = ({ id, me = true }) => {
  const [playbackHistory, setPlaybackHistory] = useState([])

  const fetchPlaybakcHistory = async () => {
    const response = await fetch(`/api/user/${id}/play-history?limit=${50}&me=${me}`);
    const data = await response.json()
    setPlaybackHistory(data?.data?.items || [])
  }

  useEffect(() => {
    fetchPlaybakcHistory()
  }, [])

  return (
    <div className={`flex flex-col gap-2 md:max-h-[calc(100dvh-220px)] ${me ? "max-h-[calc(100dvh-180px)]" : "max-h-[calc(100dvh-310px)]"} overflow-y-scroll scrollbar-hidden rounded-xl`}>
      {playbackHistory.length > 0 && playbackHistory?.map((item, index) => (
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
      ))}
    </div>
  );
};

export default PlaybackHistory;
