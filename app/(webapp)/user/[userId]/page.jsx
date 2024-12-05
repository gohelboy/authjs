"use client";

import { Button } from "@/components/ui/button";
import { MapPin, UserCircle2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const UserProfilePage = ({ params }) => {
  const { userId } = use(params);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/user/${userId}`);

      setProfileData(res || {});
      setIsFollowed(true);
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
        ? `/api/user/unfollow/${userId}`
        : `/api/user/follow/${userId}`;
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="rounded-lg p-8 border border-neutral-800 mx-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src={profileData.image || "/default-profile.png"}
              alt="Profile"
              width={154}
              height={154}
              className="rounded-full border-4 border-green-500 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-semibold tracking-tight">
              {profileData.name}
            </h2>
            <Link
              href={profileData.profileLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline text-sm mt-2"
            >
              View on Spotify
            </Link>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <UserCircle2 className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Email</p>
                  <p className="font-medium">{profileData.email || "N/A"}</p>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <MapPin className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Country</p>
                  <p className="font-medium">{profileData.country || "N/A"}</p>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <Users className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Followers</p>
                  <p className="font-medium">{profileData.followers || 0}</p>
                </div>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            <Button
              onClick={toggleFollow}
              disabled={loadingFollow}
              variant={isFollowed ? "secondary" : "default"}
              className="mt-6"
            >
              {loadingFollow
                ? "Processing..."
                : isFollowed
                ? "Unfollow"
                : "Follow"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
