"use client";

import ConnectingLoading from "@/components/custom/ConnectingLoading";
import { Button } from "@/components/ui/button";
import { setAxiosToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Disc3, LocateFixed, LogOut, UserCircle2, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SpotifyProfilePage = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const [location, setLocation] = useState(null);

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

  const makeMeVisible = () => {
    setIsVisible(!isVisible);

    if (!isVisible) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            console.log("Location fetched successfully:", {
              latitude,
              longitude,
            });

            // API call to update location in the database
            try {
              const response = await fetch("/api/user/me/location", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),
              });

              if (!response.ok) {
                throw new Error("Failed to update location");
              }

              const data = await response.json();
              console.log("Location updated:", data);
            } catch (error) {
              console.error("Error updating location:", error);
            }
          },
          (error) => {
            console.error("Error fetching location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } else {
      setLocation(null);
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
      <div className="rounded-lg p-8 border border-neutral-800 mx-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src={profileData.images?.[0]?.url || "/default-profile.png"}
              alt="Profile"
              width={154}
              height={154}
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
              <Link
                href="/me/followers"
                className="bg-neutral-800 rounded-xl p-4 flex items-center space-x-4 hover:underline"
              >
                <Users className="text-green-500" size={32} />
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
              <button
                onClick={makeMeVisible}
                className={cn(
                  `rounded-xl p-4 flex items-center space-x-4`,
                  isVisible ? "bg-green-500" : "bg-neutral-800"
                )}
              >
                <LocateFixed
                  className={cn(
                    "text-green-500",
                    isVisible ? "text-white" : "text-green-500"
                  )}
                  size={32}
                />
                <p
                  className={cn(isVisible ? "text-white" : "text-neutral-400")}
                >
                  Visible
                </p>
              </button>
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
