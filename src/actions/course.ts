"use server";

import { db } from "@/db";
import { courses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const role = session.user.role;
    if (role !== "instructor" && role !== "admin") return { error: "Not an instructor" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const price = parseFloat(formData.get("price") as string || "0");
    const thumbnail = formData.get("thumbnail") as string;

    if (!title || !description || !categoryId) {
        return { error: "Missing required fields" };
    }

    try {
        const courseId = uuidv4();
        await db.insert(courses).values({
            id: courseId,
            title,
            description,
            categoryId,
            instructorId: session.user.id,
            price,
            thumbnail: thumbnail || null,
        });

        revalidatePath("/instructor");
        revalidatePath("/courses");

        return { success: true, id: courseId };
    } catch (err) {
        console.error("Create course error:", err);
        return { error: "Something went wrong" };
    }
}
