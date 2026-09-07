"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { settingsSchema } from "@/lib/validations/settings.schema";
import { SETTINGS_DOC_ID } from "@/lib/queries/settings";

export async function updateStoreSettings(rawData) {
  try {
    const parsed = settingsSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid settings",
      };
    }

    const db = await dbConnect();

    await db.collection("settings").updateOne(
      { _id: SETTINGS_DOC_ID },
      { $set: { ...parsed.data, updatedAt: new Date() } },
      { upsert: true },
    );

    revalidatePath("/dashboard/settings");
    revalidatePath("/checkout");

    return { success: true, message: "Settings saved" };
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return { success: false, message: "Failed to save settings" };
  }
}
