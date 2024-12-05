"use client";

import ConnectingLoading from "@/components/custom/ConnectingLoading";
import { Button } from "@/components/ui/button";
import spotifyAPI, { setAxiosToken } from "@/lib/api";
import {
  CreditCard,
  Disc3,
  LogOut,
  MapPin,
  UserCircle2,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SpotifyProfilePage = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session) return;
    try {
      const { data } = await spotifyAPI("/me");
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
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] ">
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-neutral-900 rounded-2xl p-8 shadow-2xl border border-neutral-800">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src={profileData.images?.[0]?.url || "/default-profile.png"}
              alt="Profile"
              width={170}
              height={170}
              className="rounded-full border-4 border-green-500 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-semibold tracking-tight">
              {profileData.display_name}
            </h2>
            <a
              href={profileData.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline text-sm mt-2"
            >
              View on spotify
            </a>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <UserCircle2 className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <MapPin className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Country</p>
                  <p className="font-medium">{profileData.country}</p>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <Users className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Followers</p>
                  <p className="font-medium">{profileData.followers.total}</p>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4">
                <CreditCard className="text-green-500" size={32} />
                <div>
                  <p className="text-neutral-400 text-sm">Account Type</p>
                  <p className="font-medium capitalize">
                    {profileData.product}
                  </p>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={() => signOut()}
                className=""
              >
                Logout <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyProfilePage;
