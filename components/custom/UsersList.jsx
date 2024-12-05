import React, { useState } from "react";
import Image from "next/image";

// Sample User Data
let usersList = [
  {
    id: 1,
    name: "John Doe",
    image: "/user-avatar.jpg",
    isFollowed: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "/user-avatar-2.jpg",
    isFollowed: false,
  },
  // Add more user objects as needed
];

const UsersList = () => {
  const [users, setUsers] = useState(usersList);

  const toggleFollow = (userId) => {
    const changed = users.map((user) =>
      user.id === userId ? { ...user, isFollowed: !user.isFollowed } : user
    );
    setUsers([...changed]);
  };

  return (
    <div className="space-y-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-200px)] overflow-y-scroll rounded-xl scrollbar-hidden">
      {users.map((user, index) => (
        <div
          key={`${user.id}-${index}`}
          className="bg-neutral-700 rounded-xl p-4 flex items-center space-x-4 hover:bg-neutral-600 transition"
        >
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            width={78}
            height={78}
            className="rounded-lg"
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-sm text-wrap">{user.name}</h3>
          </div>
          <button
            onClick={() => toggleFollow(user.id)}
            className={`py-1 px-4 rounded-lg text-sm bg-blue-500 text-white`}
          >
            {user.isFollowed ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
