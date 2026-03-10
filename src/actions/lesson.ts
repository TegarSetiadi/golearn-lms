"use server";

import { db } from "@/db";
import { lessons } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createLesson(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const content = formData.get("content") as string;
    const orderIndex = parseInt(formData.get("orderIndex") as string || "0");

    if (!courseId || !title) {
        return { error: "Missing required fields" };
    }

    try {
        await db.insert(lessons).values({
            id: uuidv4(),
            courseId,
            title,
            videoUrl: videoUrl || null,
            content: content || null,
            orderIndex,
        });

        revalidatePath(`/instructor/edit/${courseId}`);
        revalidatePath(`/courses/${courseId}`);

        return { success: true };
    } catch (err) {
        console.error("Create lesson error:", err);
        return { error: "Something went wrong" };
    }
}
