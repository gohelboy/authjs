import React, { useState, useEffect } from "react";
import Image from "next/image";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleFollow = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isFollowed: !user.isFollowed } : user
    );
    setUsers(updatedUsers);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while users are being fetched
  }

  return (
    <div className="space-y-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-200px)] overflow-y-scroll rounded-xl scrollbar-hidden">
      {users?.map((user, index) => (
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
            className={`py-1 px-4 rounded-lg text-sm ${
              user.isFollowed ? "bg-blue-500" : "bg-gray-500"
            } text-white`}
          >
            {user.isFollowed ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
