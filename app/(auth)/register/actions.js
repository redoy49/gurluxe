"use server";

import hashedPassword from "@/app/utils/hashPassword";
import { dbConnect } from "@/lib/mongoDb";
import { registerSchema } from "@/lib/validations/auth.schema";

export async function registerUser(data) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  const { name, email, password } = result.data;

  try {

    const db = await dbConnect()
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      email,
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    const passwordHash = await hashedPassword(password);

    await usersCollection.insertOne({
      name,
      email,
      password: passwordHash,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
