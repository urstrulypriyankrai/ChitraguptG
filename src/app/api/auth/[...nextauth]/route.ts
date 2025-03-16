// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Adjust the path to your auth.ts file

export default NextAuth(authOptions);
