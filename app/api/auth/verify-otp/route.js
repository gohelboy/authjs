import User from "@/lib/models/User";

export async function POST(req, res) {
  try {
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    if (user.otp === otp) {
      user.verified = true;
      user.otp = "";
      await user.save();
      return new Response(
        JSON.stringify({ message: "OTP verified successfully!" }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid OTP. Please try again." }),
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Something went wrong. Please try again." }),
      {
        status: 500,
      }
    );
  }
}
