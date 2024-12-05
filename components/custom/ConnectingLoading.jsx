import { Disc3 } from "lucide-react";
import React from "react";

const ConnectingLoading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="flex items-center space-x-3">
        <Disc3 className="animate-spin" size={32} />
        <span className="text-xl">Connecting to Spotify...</span>
      </div>
    </div>
  );
};

export default ConnectingLoading;
