import Image from "next/image";
import React from "react";

const MedalBadge = ({ rank }) => {
  const medalColors = {
    1: "bg-yellow-500 text-black", // Gold
    2: "bg-gray-400 text-black", // Silver
    3: "bg-amber-700 text-white", // Bronze
  };

  const medalEmojis = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return rank <= 3 ? (
    <div
      className={`absolute top-2 left-2 ${medalColors[rank]} rounded-full px-2 py-1 text-xs`}
    >
      {medalEmojis[rank]} {rank}
    </div>
  ) : null;
};

const TopTracks = ({ topTracks }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {topTracks?.map((track, index) => (
        <div
          key={track?.id}
          className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
        >
          <MedalBadge rank={index + 1} />
          <Image
            src={track?.album.images[0].url}
            alt={track?.name}
            width={150}
            height={150}
            className="rounded-lg mx-auto mb-2"
          />
          <h3 className="font-semibold text-sm truncate">{track?.name}</h3>
          <p className="text-xs text-neutral-400 truncate">
            {track?.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopTracks;
