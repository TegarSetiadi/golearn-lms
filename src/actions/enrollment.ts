"use server";

import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to enroll." };
    }

    const userId = session.user.id;

    try {
        // Check if already enrolled
        const existingEnrollment = await db.query.enrollments.findFirst({
            where: (enrollments, { and, eq }) =>
                and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)),
        });

        if (existingEnrollment) {
            return { error: "You are already enrolled in this course." };
        }

        await db.insert(enrollments).values({
            id: uuidv4(),
            userId,
            courseId,
            progress: 0,
        });

        revalidatePath("/dashboard");
        revalidatePath(`/courses/${courseId}`);

        return { success: true };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "Something went wrong during enrollment." };
    }
}
