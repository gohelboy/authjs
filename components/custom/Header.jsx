import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold hidden md:block">Insights</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2">
            <Image
              src={session.user.image || "/default-profile.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-green-500"
            />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-neutral-400">{session.user.email}</p>
            </div>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="text-red-500 hover:bg-red-500/10"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
