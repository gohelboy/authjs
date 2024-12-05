import { Disc3 } from "lucide-react";
import React from "react";

const ConnectingLoading = ({ message = "Connecting to Spotify..." }) => {
  return (
    <div className="min-h-[calc(100vh-72px)] flex justify-center items-center">
      <div className="flex items-center space-x-3">
        <Disc3 className="animate-spin" size={32} />
        <span className="text-xl">{message}</span>
      </div>
    </div>
  );
};

export default ConnectingLoading;
