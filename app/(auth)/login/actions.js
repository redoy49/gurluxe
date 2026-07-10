"use server";

import { loginSchema } from "@/lib/validations/auth.schema";

export async function loginUser(data) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  console.log("LOGIN DATA:", result.data);

  return {
    success: true,
    message: "Login successful",
  };
}
