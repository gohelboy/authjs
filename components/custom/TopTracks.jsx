import Image from "next/image";
import React from "react";

const TopTracks = ({ topTracks }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {topTracks?.map((track) => (
        <div
          key={track?.id}
          className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
        >
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
