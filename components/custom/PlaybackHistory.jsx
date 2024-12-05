import { formatTimeAgo } from "@/lib/helper";
import Image from "next/image";
import React from "react";

const PlaybackHistory = ({ playbackHistory }) => {
  return (
    <div className="space-y-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-200px)] overflow-y-scroll rounded-xl scrollbar-hidden">
      {playbackHistory?.map((item, index) => (
        <div
          key={`${item.track.id}-${index}`}
          className="bg-neutral-700 rounded-xl p-4 flex items-center space-x-4 hover:bg-neutral-600 transition"
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
