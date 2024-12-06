import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

const allScopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-library-modify",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-follow-read",
  "user-follow-modify",
  "app-remote-control",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-position",
  "streaming",
  "playlist-modify-public",
  "playlist-modify-private",
  "ugc-image-upload",
];

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: allScopes.join(" "),
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const { email, password } = credentials;
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found");
          }
          if (!user.verified) {
            throw new Error("User not verified");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }
          return user;
        } catch (error) {
          console.error(error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            name: user.name || "User",
            verified: true,
            password: user.email,
            image: user.image || "",
            provider: "google",
          });

          await newUser.save();
        }
      }

      if (account.provider === "spotify") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            spotifyId: account.providerAccountId,
            email: user.email || "",
            name: user.name || "Spotify User",
            verified: true,
            password: user.email || "",
            image: user.image || "",
            provider: "spotify",
          });
          await newUser.save();
        }
      }

      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.provider = account?.provider || user.provider;
      }

      // Spotify-specific handling
      if (account?.provider === "spotify") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.spotifyUserId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.provider = token.provider;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.spotifyUserId = token.spotifyUserId;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
