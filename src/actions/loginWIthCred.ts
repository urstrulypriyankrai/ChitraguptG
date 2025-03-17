"use server";
import { signIn } from "@/auth";
import { db } from "../../db";
import { AuthError } from "next-auth";

export default async function LoginWithCred(
  formData: FormData
): Promise<boolean | { error: string }> {
  try {
    const rawFromData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    console.log(rawFromData);
    const existingUser = await db.user.findUnique({
      where: { username: rawFromData.username as string },
    });
    if (!existingUser) {
      console.log("user not present", existingUser);
      return { error: "user not present" };
    }

    const user = await signIn("credentials", rawFromData);
    console.log("got response from signIn", user);
    return user ? true : false;

    // console.log("created successfull");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    } else if (error instanceof Error) console.log(error.message);
    return false;
  }
}
