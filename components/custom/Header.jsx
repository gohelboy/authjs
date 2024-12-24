"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { AudioLines, Search } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center pb-2 p-4 sm:pb-4">
        {/* Brand Logo or Title */}
        <Link
          href={"/home"}
          className="text-2xl flex items-center justify-center gap-1 font-semibold text-green-400 transition"
        >
          <AudioLines /> Insights
        </Link>

        {/* Search Bar */}
        <div className="flex-grow mx-6 hidden md:block">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Input field */}
            <Input
              type="text"
              placeholder="Search..."
              className="pr-10 border-neutral-700 hover:border-neutral-400 focus:border-neutral-400" // Add padding-right to create space for the icon
            />
            {/* Search icon */}
            <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">
              <Search size="18" />
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <Link
            href={"/me"}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <Image
              src={session?.user?.image || "/user.jpg"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-green-500 group-hover:scale-105 transition-transform"
            />
            <div className="hidden md:flex flex-col items-start">
              <p className="text-sm font-medium group-hover:text-green-400 transition">
                {session?.user?.name || "Guest"}
              </p>
              {/* Uncomment for email display */}
              {/* <p className="text-xs text-neutral-400 group-hover:underline">
                {session?.user?.email}
              </p> */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
