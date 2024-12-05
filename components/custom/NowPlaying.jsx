import Image from "next/image";
import React from "react";

const NowPlaying = ({ currentlyPlaying }) => {
  return (
    <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      {currentlyPlaying ? (
        <>
          <Image
            src={currentlyPlaying.album.images[0].url}
            alt={currentlyPlaying.name}
            width={200}
            height={200}
            className="rounded-full slow-spin shadow-lg"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-4xl font-bold text-green-400">
              {currentlyPlaying.name}
            </h2>
            <p className="text-neutral-300">
              {currentlyPlaying.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="text-neutral-400 text-sm">
              Album: {currentlyPlaying.album.name}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center text-neutral-400">
          No track currently playing
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
