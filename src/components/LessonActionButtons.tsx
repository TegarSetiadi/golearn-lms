"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { completeLesson } from "@/actions/progress";
import { useRouter } from "next/navigation";

interface LessonActionButtonsProps {
    courseId: string;
    lessonId: string;
    prevLessonId?: string;
    nextLessonId?: string;
}

export default function LessonActionButtons({
    courseId,
    lessonId,
    prevLessonId,
    nextLessonId,
}: LessonActionButtonsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleComplete = async () => {
        setLoading(true);
        await completeLesson(courseId, lessonId);
        if (nextLessonId) {
            router.push(`/lessons/${nextLessonId}`);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-3">
            {prevLessonId && (
                <Link href={`/lessons/${prevLessonId}`}>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                </Link>
            )}

            <Button
                size="sm"
                onClick={handleComplete}
                disabled={loading}
                className={cn(
                    "gap-2 rounded-xl min-w-[120px]",
                    nextLessonId ? "bg-primary" : "bg-green-600 hover:bg-green-700"
                )}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : nextLessonId ? (
                    <>
                        Next Lesson
                        <ChevronRight className="h-4 w-4" />
                    </>
                ) : (
                    <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Course
                    </>
                )}
            </Button>
        </div>
    );
}

import { cn } from "@/lib/utils";
