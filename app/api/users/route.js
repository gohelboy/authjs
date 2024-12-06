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

    const followingIds = await Follow.find({
      follower: currentUser._id,
    })
      .lean()
      .distinct("following");

    const followingIdsAsStrings = followingIds.map((id) => id.toString());

    const users = await User.find({ _id: { $ne: currentUser._id } })
      .lean()
      .select("_id email name image")
      .exec();

    const usersWithFollowStatus = users.map((user) => ({
      ...user,
      isFollowed: followingIdsAsStrings.includes(user._id.toString()),
    }));

    return NextResponse.json(usersWithFollowStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
