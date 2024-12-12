"use client";

import { Button } from "@/components/ui/button";
import { MapPin, UserCircle2, Users, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserProfilePage = ({ params }) => {
  const { userId } = params;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      setProfileData(data || {});
      setIsFollowed(data.isFollowed);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    setLoadingFollow(true);
    try {
      const endpoint = isFollowed
        ? `/api/users/follow/${userId}`
        : `/api/users/follow/${userId}`;
      const method = isFollowed ? "DELETE" : "POST";

      const res = await fetch(endpoint, { method });
      if (!res.ok) throw new Error("Failed to toggle follow status");

      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-white">Loading profile...</div>;
  }

  console.log("profileData", profileData);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="rounded-lg p-8 border border-neutral-800 mx-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src={profileData?.image || "/user.jpg"}
              alt="Profile"
              width={154}
              height={154}
              className="rounded-full border-4 border-green-500 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-semibold tracking-tight">
              {profileData?.name || "User"}
            </h2>
            {/* <Link
              href={profileData?.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline text-sm mt-2"
            >
              View on Spotify
            </Link> */}
            <Button
              onClick={toggleFollow}
              className={`flex items-center justify-center rounded-lg font-semibold hover:text-white bg-white text-neutral-900  mt-2`}
              disabled={loadingFollow}
            >
              {loadingFollow ? (
                <span
                  className={`loader inline-block w-4 h-4 border-2 rounded-full animate-spin ${
                    isFollowed ? "border-t-white" : "border-t-neutral-900"
                  }`}
                ></span>
              ) : isFollowed ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </Button>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Link
                href="/me/followers"
                className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4 hover:underline"
              >
                <UsersRound className="text-green-500" size={32} />

                <div>
                  <p className="text-neutral-400 text-sm">Followers</p>
                  <p className="font-medium">{profileData?.follower || "0"}</p>
                </div>
              </Link>
              <Link
                href="/me/following"
                className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4 hover:underline"
              >
                <Users className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Following</p>
                  <p className="font-medium">{profileData?.following || "0"}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
