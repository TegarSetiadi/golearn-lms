"use server";

import { db } from "@/db";
import { quizzes, questions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createQuiz(lessonId: string, title: string, questionsData: { question: string, optionA: string, optionB: string, optionC: string, optionD: string, correctAnswer: string }[]) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const quizId = uuidv4();
        await db.insert(quizzes).values({
            id: quizId,
            lessonId,
            title,
        });

        for (const q of questionsData) {
            await db.insert(questions).values({
                id: uuidv4(),
                quizId,
                question: q.question,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctAnswer: q.correctAnswer,
            });
        }

        revalidatePath(`/lessons/${lessonId}`);
        return { success: true, id: quizId };
    } catch (err) {
        console.error("Create quiz error:", err);
        return { error: "Something went wrong" };
    }
}

export async function submitQuizResults(quizId: string, score: number) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const resultId = uuidv4();
        await db.insert(quizResults).values({
            id: resultId,
            userId: session.user.id,
            quizId,
            score,
        });
        return { success: true };
    } catch (err) {
        console.error("Submit quiz error:", err);
        return { error: "Something went wrong" };
    }
}

import { quizResults } from "@/db/schema";
