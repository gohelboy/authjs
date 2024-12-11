import Image from "next/image";
import React from "react";

const TopTracks = ({ topTracks }) => {
  const getRankStyle = (rank) => {
    const baseStyle =
      "absolute top-2 left-2 size-6 md:size-8 flex items-center justify-center rounded-full font-bold text-sm";

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {topTracks?.map((track, index) => (
        <div
          key={track?.id}
          className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
        >
          <div className={getRankStyle(index + 1)}>{index + 1}</div>

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
