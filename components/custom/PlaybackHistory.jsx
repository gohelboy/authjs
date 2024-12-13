import spotifyAPI, { setAxiosToken } from "@/lib/api";
import { formatTimeAgo } from "@/lib/helper";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const PlaybackHistory = () => {
  const { data: session } = useSession();
  const [playbackHistory, setPlaybackHistory] = useState([])


  const fetchPlaybakcHistory = async() => {
    const { data } = await spotifyAPI.get('me/player/recently-played?limit=24');
    setPlaybackHistory(data?.items || [])
  }

  useEffect(()=>{
    if (session?.user?.accessToken) {
          setAxiosToken(session.user.accessToken); 
          fetchPlaybakcHistory()
        }
  },[])

  return (
    <div className="space-y-4 md:max-h-[calc(100dvh-220px)] max-h-[calc(100dvh-180px)] overflow-y-scroll rounded-xl scrollbar-hidden">
      {playbackHistory.length > 0 && playbackHistory?.map((item, index) => (
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
