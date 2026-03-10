"use server";

import { db } from "@/db";
import { enrollments, lessons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeLesson(courseId: string, lessonId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const userId = session.user.id;

    try {
        // This is a simplified progress tracking for the demo
        // In a real app, you'd have a 'user_lessons' table to track specific completed lessons
        // For this boilerplate, we'll increment the progress percentage based on lessons count

        const courseLessons = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.courseId, courseId));
        const totalLessons = courseLessons.length;

        const currentEnrollment = await db.query.enrollments.findFirst({
            where: and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)),
        });

        if (!currentEnrollment) return { error: "Enrollment not found" };

        // Calculate new progress (simple increment for now)
        const increment = Math.round(100 / totalLessons);
        const newProgress = Math.min(100, (currentEnrollment.progress || 0) + increment);

        await db.update(enrollments)
            .set({ progress: newProgress })
            .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

        revalidatePath("/dashboard");
        revalidatePath(`/lessons/${lessonId}`);

        return { success: true };
    } catch (err) {
        console.error("Progress update error:", err);
        return { error: "Something went wrong" };
    }
}
