import Image from "next/image";
import React from "react";

const TopArtists = ({ topArtists }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {topArtists?.map((artist) => (
        <div
          key={artist.id}
          className="bg-neutral-700 rounded-xl p-4 text-center transform transition hover:bg-black hover:scale-105"
        >
          <Image
            src={artist.images[0]?.url || "/default-artist.png"}
            alt={artist.name}
            width={150}
            height={150}
            className="rounded-full size-24 md:size-[156px] mx-auto mb-2"
          />

          <h3 className="font-semibold text-sm truncate">{artist.name}</h3>
          <p className="text-xs text-neutral-400">
            Popularity: {artist.popularity}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopArtists;
