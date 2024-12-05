import React, { useState, useEffect } from "react";
import Image from "next/image";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch users");
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

  const toggleFollow = async (userId, isFollowed) => {
    setLoadingUserId(userId);
    try {
      const endpoint = `/api/user/follow/${userId}`;
      const method = isFollowed ? "DELETE" : "POST";

      const res = await fetch(endpoint, { method });
      if (!res.ok)
        throw new Error(`Failed to ${isFollowed ? "unfollow" : "follow"} user`);

      // Optimistically update the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isFollowed: !isFollowed } : user
        )
      );
    } catch (error) {
      console.error(
        `Error during ${isFollowed ? "unfollow" : "follow"} action:`,
        error
      );
    } finally {
      setLoadingUserId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:max-h-[calc(100dvh-240px)] max-h-[calc(100dvh-200px)] overflow-y-scroll rounded-xl scrollbar-hidden">
      {users?.map((user) => (
        <div
          key={user._id}
          className="bg-neutral-700 rounded-xl p-4 flex items-center space-x-4 hover:bg-neutral-600 transition"
        >
          <Image
            src={"/user.jpg"}
            alt={user.name}
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-sm text-wrap">{user.name}</h3>
          </div>
          <button
            onClick={() => toggleFollow(user._id, user.isFollowed)}
            className={`py-1 px-4 rounded-lg font-medium ${
              user.isFollowed
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-900"
            } flex items-center justify-center`}
            disabled={loadingUserId === user._id}
          >
            {loadingUserId === user._id ? (
              <span
                className={`loader inline-block w-4 h-4 border-2 rounded-full animate-spin ${
                  user.isFollowed ? "border-t-white" : "border-t-neutral-900"
                }`}
              ></span>
            ) : user.isFollowed ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
