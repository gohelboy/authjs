import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";

export const dynamic = "force-dynamic";

async function fetchUsers(userIds) {
  return await User.find({ _id: { $in: userIds } })
    .select("_id email name image")
    .lean();
}

export async function GET(req) {
  try {
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get current user based on email from session
    const currentUserEmail = session.user.email;
    const currentUser = await User.findOne({ email: currentUserEmail });
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    let userIds = [];
    if (type === "following") {
      const followingRecords = await Follow.find({ follower: currentUser._id });
      userIds = followingRecords.map((record) => record.following.toString());
    } else {
      const followRecords = await Follow.find({ following: currentUser._id });
      userIds = followRecords.map((record) => record.follower.toString());
    }

    const users = await fetchUsers(userIds);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching followers/following:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
