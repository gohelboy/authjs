"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const FollowersListPage = () => {
  const { data: session } = useSession();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching the followed artists list from the Spotify API
  const fetchFollowers = async () => {
    if (!session) return;

    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/following?type=artist",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch followers");
      }

      const data = await res.json();
      setFollowers(data.artists.items); // Using 'items' from the 'artists' field
    } catch (error) {
      setError("Failed to load followers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [session]);

  // Show loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="text-xl">Loading followers...</div>
      </div>
    );
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
    <div className="rounded-lg p-8 border border-neutral-800 mx-4 bg-neutral-900">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Followed Artists
      </h2>

      {/* Render followed artists list */}
      <div className="space-y-4">
        {followers.map((artist, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-b border-neutral-800"
          >
            <img
              src={artist.images?.[0]?.url || "/user.jpg"}
              alt={artist.name}
              className="w-12 h-12 rounded-full border-2 border-green-500"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {artist.name}
              </h3>
              <p className="text-sm text-neutral-400">
                Followers: {artist.followers.total}
              </p>
              <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-400 hover:underline"
              >
                View on Spotify
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersListPage;
