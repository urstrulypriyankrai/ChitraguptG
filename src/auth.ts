// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../db";
import CheckPassword from "./lib/helpers/checkPassword";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(`[Authorize] Credentials received:`, credentials);

        if (!credentials?.username || !credentials?.password) {
          console.log(
            "[Authorize] Username or password missing, returning null."
          );
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { username: credentials.username as string },
          });
          console.log("[Authorize] User found:", user);

          if (!user) {
            console.log("[Authorize] User not found, returning null.");
            return null;
          }

          const isValid = await CheckPassword(
            credentials.password as string,
            user.password
          );

          console.log("[Authorize] Password valid:", isValid);

          if (!isValid) {
            console.log("[Authorize] Password not valid, returning null.");
            return null;
          }

          console.log(
            "[Authorize] Authentication successful, returning user object."
          );

          return {
            id: user.id,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("[Authorize] Error during authentication:", error);
          return null; // Return null if any error occurs during the process
        }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.role = user.role;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session?.user) {
  //       session.user.id = token.id as string;
  //       session.user.role = token.role as string;
  //     }
  //     return session;
  //   },
  // },
  pages: {
    signIn: "/login",
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);
