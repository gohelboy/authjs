"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConnectingLoading from "@/components/custom/ConnectingLoading";

const FollowingListPage = () => {
  const { data: session } = useSession();
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowers = async () => {
    if (!session) return;

    try {
      const res = await fetch("/api/users/follow?type=following");

      if (!res.ok) {
        throw new Error("Failed to fetch followings");
      }

      const data = await res.json();
      setFollowings(data || []);
    } catch (error) {
      setError("Failed to load followings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [session]);

  if (loading) {
    return <ConnectingLoading message="Loading followings..." />;
  }

  // Show error message if fetching fails
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-8 border border-neutral-800 bg-neutral-900 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Followings</h2>

      {/* Render followed artists list */}
      <div className="space-y-4">
        {followings.map((artist, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-b border-neutral-800"
          >
            <img
              src={artist.image || "/user.jpg"}
              alt={artist.name}
              className="w-12 h-12 rounded-full border-2 border-green-500"
            />
            <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingListPage;
