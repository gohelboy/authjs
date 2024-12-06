import bcrypt from "bcrypt";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";
import { mailTransport } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000);

    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
    });

    await newUser.save();

    const options = {
      from: '"Gohel" <dwarkeshogohel1@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4CAF50;">OTP Verification</h2>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Dear User,</p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Thank you for registering with us. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <h3 style="font-size: 36px; color: #4CAF50; font-weight: bold;">${otp}</h3>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">If you did not request this, please ignore this email.</p>
            <div style="margin-top: 20px;">
              <p style="font-size: 14px; color: #888888;">Best regards,</p>
              <p style="font-size: 14px; color: #888888;">Gohel Team</p>
            </div>
          </div>
        </div>
      `,
    };

    await mailTransport.sendMail(options);

    return new Response(
      JSON.stringify({ message: "User registered successfully. OTP sent." }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Something went wrong. Please try again." }),
      { status: 500 }
    );
  }
}
