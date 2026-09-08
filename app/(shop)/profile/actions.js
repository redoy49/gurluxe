"use server";

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { createSession } from "@/lib/auth/session";
import { requireUserAction } from "@/lib/auth/authorize";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations/auth.schema";
import hashedPassword from "@/app/utils/hashPassword";

export async function updateProfile(data) {
  const { authorized, user } = await requireUserAction();
  if (!authorized) {
    return { success: false, message: "Please log in to update your profile." };
  }

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const { name, phone } = parsed.data;
    const db = await dbConnect();

    await db.collection("users").updateOne(
      { _id: new ObjectId(user.id) },
      { $set: { name, phone: phone || "", updatedAt: new Date() } },
    );

    // Re-issue the session so the Navbar reflects the new name right away
    // instead of showing the stale value until the next login.
    await createSession({
      id: user.id,
      name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      provider: user.provider,
    });

    revalidatePath("/profile");

    return { success: true, message: "Profile updated" };
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return { success: false, message: "Failed to update profile" };
  }
}

export async function changePassword(data) {
  const { authorized, user } = await requireUserAction();
  if (!authorized) {
    return { success: false, message: "Please log in first." };
  }

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const db = await dbConnect();
    const dbUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user.id) });

    if (!dbUser?.password) {
      return {
        success: false,
        message:
          "This account signs in with Google and has no password to change.",
      };
    }

    const { currentPassword, newPassword } = parsed.data;
    const isValid = await bcrypt.compare(currentPassword, dbUser.password);

    if (!isValid) {
      return { success: false, message: "Current password is incorrect." };
    }

    const passwordHash = await hashedPassword(newPassword);

    await db.collection("users").updateOne(
      { _id: new ObjectId(user.id) },
      { $set: { password: passwordHash, updatedAt: new Date() } },
    );

    return { success: true, message: "Password updated" };
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return { success: false, message: "Failed to change password" };
  }
}
