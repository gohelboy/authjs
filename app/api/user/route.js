import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Follow from "@/lib/models/Follow";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email;
    const currentUser = await User.findOne({ email: currentUserEmail });

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const following = await Follow.find({ follower: currentUser._id }).select(
      "following"
    );
    const followingIds = following.map((f) => f.following.toString());

    const users = await User.find({ _id: { $ne: currentUser._id } });

    const usersWithFollowStatus = users.map((user) => ({
      ...user._doc,
      isFollowed: followingIds.includes(user._id.toString()),
    }));

    return NextResponse.json(usersWithFollowStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
