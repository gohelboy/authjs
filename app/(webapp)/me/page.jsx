"use client";

import ConnectingLoading from "@/components/custom/ConnectingLoading";
import { Button } from "@/components/ui/button";
import { setAxiosToken } from "@/lib/api";
import {
  Disc3,
  LogOut,
  Users,
  UsersRound
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SpotifyProfilePage = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/user/me");

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      setProfileData(data);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
      toast({
        title: "Spotify Sync Error",
        description: `Unable to fetch Profile`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      setAxiosToken(session?.user?.accessToken);

      fetchProfile();
    }
  }, [session]);

  if (loading) {
    return <ConnectingLoading message="Fetching profile..." />;
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-90px)]">
        <div className="text-center">
          <Disc3 size={64} className="mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-extralight tracking-tight text-white mb-4">
            Spotify Insights
          </h1>
          <p className="text-lg text-neutral-400 mb-6">
            Please log in to explore your music world
          </p>
          <Button variant="destructive" onClick={() => signOut()} className="">
            Logout <LogOut size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-7">
      <div className="rounded-lg p-8 border border-neutral-800 mx-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={profileData?.image || "/user.jpg"}
              alt="Profile"
              className="rounded-full border-4 border-green-500 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-semibold tracking-tight">
              {profileData?.name}
            </h2>
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
                  <p className="font-medium">{profileData.follower}</p>
                </div>
              </Link>
              <Link
                href="/me/following"
                className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4 hover:underline"
              >
                <Users className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Following</p>
                  <p className="font-medium">{profileData.following}</p>
                </div>
              </Link>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => signOut()}
            >
              Logout <LogOut size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyProfilePage;
