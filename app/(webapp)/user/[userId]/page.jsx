"use client";

import NowPlaying from "@/components/custom/NowPlaying";
import PlaybackHistory from "@/components/custom/PlaybackHistory";
import TopArtists from "@/components/custom/TopArtists";
import TopTracks from "@/components/custom/TopTracks";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Clock, Headphones, Music, PlayCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserProfilePage = ({ params }) => {
  const { userId } = params;
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const tabs = [
    {
      value: "currently-playing",
      icon: PlayCircle,
      label: "Now Playing",
    },
    { value: "top-tracks", icon: Music, label: "Top Tracks" },
    { value: "top-artists", icon: Headphones, label: "Top Artists" },
    { value: "playback-history", icon: Clock, label: "Play History" },

  ];

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

  return (
    <div className="max-w-6xl md:mx-auto mx-4">
      <div className="rounded-lg md:p-8 border border-neutral-800 my-4 p-3">
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Profile Image */}
          <div className="flex flex-col gap-3 items-center">
            <Image
              src={profileData?.image || "/user.jpg"}
              alt="Profile"
              width={154}
              height={154}
              className="rounded-full size-[70px] md:size-36 border-4 border-green-500 shadow-lg"
            />
            <div>
              <h2 className="text-center text-sm">{profileData?.name || "User"}</h2>
            </div>
          </div>
          {/* Profile Details */}
          <div className="grid col-span-2 grid-cols-2 gap-3 h-fit w-full ">
            <Link
              href={`/user/${userId}/followers`}
              className="bg-neutral-800 rounded-xl p-1 justify-center flex items-center hover:underline"
            >
              <div>
                <p className="text-neutral-400 text-sm">Followers</p>
                <p className="font-medium">{profileData?.follower || "0"}</p>
              </div>
            </Link>
            <Link
              href={`/user/${userId}/followings`}
              className="bg-neutral-800 rounded-xl p-1 justify-center flex items-center hover:underline"
            >
              <div>
                <p className="text-neutral-400 text-sm">Following</p>
                <p className="font-medium">{profileData?.following || "0"}</p>
              </div>
            </Link>
            {session.user.email !== profileData?.email && (
              <Button
                size="sm"
                onClick={toggleFollow}
                className={`flex items-center justify-center col-span-2 rounded-lg font-semibold hover:text-white bg-white text-neutral-900`}
                disabled={loadingFollow}
              >
                {loadingFollow ? (
                  <span
                    className={`loader inline-block w-4 h-4 border-2 rounded-full animate-spin ${isFollowed ? "border-t-white" : "border-t-neutral-900"
                      }`}
                  ></span>
                ) : isFollowed ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>



      <div>
        <Tabs defaultValue="currently-playing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-800 min-h-12 p-2 mb-3">
            {tabs.map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center space-x-2 justify-center h-full"
              >
                <Icon size={16} />
                <span className="hidden md:block">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="currently-playing"
            className="bg-neutral-800 rounded-2xl shadow-2xl"
          >
            <NowPlaying id={userId} me={false} />
          </TabsContent>
          <TabsContent
            value="top-tracks"
            className="bg-neutral-800 rounded-2xl shadow-2xl"
          >
            <TopTracks id={userId} me={false} />
          </TabsContent>
          <TabsContent
            value="top-artists"
            className="bg-neutral-800 rounded-2xl shadow-2xl"
          >
            <TopArtists id={userId} me={false} />
          </TabsContent>
          <TabsContent
            value="playback-history"
            className="bg-neutral-800 rounded-2xl shadow-2xl"
          >
            <PlaybackHistory id={userId} me={false} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
