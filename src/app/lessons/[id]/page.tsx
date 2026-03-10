import { db } from "@/db";
import { lessons as lessonsTable, enrollments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import VideoPlayer from "@/components/VideoPlayer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import QuizComponent from "@/components/QuizComponent";
import LessonActionButtons from "@/components/LessonActionButtons";

export default async function LessonPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    const userId = session.user.id;

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessonsTable.id, params.id),
        with: {
            course: {
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.orderIndex)],
                    },
                },
            },
            quizzes: {
                with: {
                    questions: true,
                },
            },
        },
    });

    if (!lesson) {
        redirect("/dashboard");
    }

    // Check enrollment
    const enrollment = await db.query.enrollments.findFirst({
        where: and(eq(enrollments.userId, userId), eq(enrollments.courseId, lesson.courseId)),
    });

    if (!enrollment) {
        redirect(`/courses/${lesson.courseId}`);
    }

    const currentIdx = lesson.course.lessons.findIndex((l) => l.id === lesson.id);
    const nextLesson = lesson.course.lessons[currentIdx + 1];
    const prevLesson = lesson.course.lessons[currentIdx - 1];

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <Link href={`/courses/${lesson.courseId}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Course
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">Lesson {currentIdx + 1} of {lesson.course.lessons.length}</span>
                    </div>
                </div>

                <VideoPlayer url={lesson.videoUrl} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b">
                    <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
                    <div className="flex items-center gap-3">
                        <LessonActionButtons
                            courseId={lesson.courseId}
                            lessonId={lesson.id}
                            prevLessonId={prevLesson?.id}
                            nextLessonId={nextLesson?.id}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border bg-card p-6 border-primary/10">
                            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Lesson Content
                            </h2>
                            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed mb-8">
                                {lesson.content}
                            </div>

                            {lesson.quizzes.length > 0 && (
                                <div className="mt-12 space-y-6">
                                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Lesson Quiz
                                    </h2>
                                    {lesson.quizzes.map((quiz) => (
                                        <QuizComponent
                                            key={quiz.id}
                                            quizId={quiz.id}
                                            title={quiz.title}
                                            questions={quiz.questions}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl border bg-card p-6 border-primary/10 sticky top-32">
                            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Course Playlist</h2>
                            <div className="space-y-2">
                                {lesson.course.lessons.map((l, i) => (
                                    <Link
                                        key={l.id}
                                        href={`/lessons/${l.id}`}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${l.id === lesson.id ? 'bg-primary/10 text-primary border border-primary/20 font-bold' : 'hover:bg-primary/5 text-muted-foreground text-sm'}`}
                                    >
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${l.id === lesson.id ? 'bg-primary text-primary-foreground' : 'bg-slate-100'}`}>
                                            {i + 1}
                                        </div>
                                        <span className="truncate">{l.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
