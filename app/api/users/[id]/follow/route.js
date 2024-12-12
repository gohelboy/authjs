import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchUsers(userIds) {
  return await User.find({ _id: { $in: userIds } })
    .select("_id email name image")
    .lean();
}

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ID
    if (!id) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

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

    // Validate type parameter
    if (type !== "following" && type !== "follower") {
      return NextResponse.json(
        { message: "Invalid type parameter" },
        { status: 400 }
      );
    }

    let userIds = [];
    if (type === "following") {
      const followingRecords = await Follow.find({ follower: id });
      userIds = followingRecords.map((record) => record.following.toString());
    } else {
      const followRecords = await Follow.find({ following: id });
      userIds = followRecords.map((record) => record.follower.toString());
    }

    const users = await fetchUsers(userIds);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${type || "users"}:`, error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
