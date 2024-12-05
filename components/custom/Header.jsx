"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <Link href={"/home"} className="text-xl font-semibold ">
            Insights
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href={"/me"}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <Image
                src={session?.user?.image || "/default-profile.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-green-500"
              />
              <div className="flex flex-col items-start hidden md:block">
                <p className="text-sm font-medium group-hover:underline">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-neutral-400 group-hover:underline">
                  {session?.user?.email}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
