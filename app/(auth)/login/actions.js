"use server";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongoDb";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth.schema";

export async function loginUser(data) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  const { email, password } = result.data;

  try {
    const db = await dbConnect();
    const user = await db.collection("users").findOne({ email });

    // Same generic message for "no user", "wrong password", and "this
    // account only has a Google login" so login can't be used to enumerate
    // which emails have an account (or how they signed up).
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const role = user.role || "user";

    await createSession({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
      avatar: user.avatar || null,
      provider: user.provider || "credentials",
    });

    return {
      success: true,
      message: "Login successful",
      role,
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
