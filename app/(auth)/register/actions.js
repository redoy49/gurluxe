"use server";

import { registerSchema } from "@/lib/validations/auth.schema";

export async function registerUser(data) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  console.log("VALID DATA:", result.data);

  return {
    success: true,
    data: result.data,
  };
}
