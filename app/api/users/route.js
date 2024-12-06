import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Follow from "@/lib/models/Follow";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(req) {
  try {
    // Ensure database connection is established
    await connectToDatabase();

    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch current user
    const currentUserEmail = session.user.email;
    const currentUser = await User.findOne({ email: currentUserEmail });

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the list of users followed by the current user
    const followingIds = await Follow.find({
      follower: currentUser._id,
    })
      .lean()
      .distinct("following");

    const followingIdsAsStrings = followingIds.map((id) => id.toString());

    const users = await User.find({ _id: { $ne: currentUser._id } })
      .lean() // Use lean() to get plain JavaScript objects (faster and less memory-intensive)
      .select("_id email name image") // Select only necessary fields
      .exec();

    // Attach follow status directly in the result
    const usersWithFollowStatus = users.map((user) => ({
      ...user,
      isFollowed: followingIdsAsStrings.includes(user._id.toString()), // Compare as strings
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
