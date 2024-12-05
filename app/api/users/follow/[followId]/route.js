import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Follow from "@/lib/models/Follow";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req, { params }) {
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

    const { followId } = params;

    if (!followId) {
      return NextResponse.json(
        { message: "Follow ID is required" },
        { status: 400 }
      );
    }

    const userToFollow = await User.findById(followId);

    if (!userToFollow) {
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      follower: currentUser._id,
      following: followId,
    });

    if (existingFollow) {
      return NextResponse.json(
        { message: "Already following this user" },
        { status: 400 }
      );
    }

    // Create a new follow relationship
    const follow = new Follow({
      follower: currentUser._id,
      following: followId,
    });

    await follow.save();

    return NextResponse.json({
      message: "Successfully followed user",
      status: 200,
    });
  } catch (error) {
    console.error("Error in follow user operation:", error);
    return NextResponse.json({ message: "Error following user", status: 500 });
  }
}

export async function DELETE(req, { params }) {
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

    const { followId } = params;

    if (!followId) {
      return NextResponse.json(
        { message: "Follow ID is required" },
        { status: 400 }
      );
    }

    const userToUnfollow = await User.findById(followId);

    if (!userToUnfollow) {
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    // Find and delete the follow relationship
    const deletedFollow = await Follow.findOneAndDelete({
      follower: currentUser._id,
      following: followId,
    });

    if (!deletedFollow) {
      return NextResponse.json(
        { message: "Follow relationship does not exist" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully unfollowed user",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in unfollow user operation:", error);
    return NextResponse.json({
      message: "Error unfollowing user",
      status: 500,
    });
  }
}
