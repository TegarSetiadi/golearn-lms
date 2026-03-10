import { db } from "@/db";
import { courses as coursesTable, enrollments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Users, Star, PlayCircle, CheckCircle } from "lucide-react";
import { enrollInCourse } from "@/actions/enrollment";
import { redirect } from "next/navigation";

export default async function CourseDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    const userId = session?.user?.id;

    const course = await db.query.courses.findFirst({
        where: eq(coursesTable.id, params.id),
        with: {
            instructor: true,
            category: true,
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.orderIndex)],
            },
        },
    });

    if (!course) {
        redirect("/courses");
    }

    const isEnrolled = userId
        ? await db.query.enrollments.findFirst({
            where: and(eq(enrollments.userId, userId), eq(enrollments.courseId, course.id)),
        })
        : false;

    const lessonCount = course.lessons.length;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="container pt-32 pb-16 px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Course Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {course.category.name}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                                {course.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                                    <span className="font-bold text-primary">4.9</span>
                                    <span>(1.2k reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" />
                                    <span>1,500 students enrolled</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>Last updated Oct 2024</span>
                                </div>
                            </div>
                        </div>

                        <div className="aspect-video relative overflow-hidden rounded-3xl border shadow-xl">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <PlayCircle className="h-20 w-20 text-primary/40" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-primary">Description</h2>
                            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                                {course.description}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-primary">Course Content</h2>
                            <div className="border rounded-2xl overflow-hidden bg-background">
                                {course.lessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className={`flex items-center justify-between p-4 ${index !== course.lessons.length - 1 ? 'border-b' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/5 p-2 rounded-lg">
                                                <PlayCircle className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">{lesson.title}</span>
                                        </div>
                                        {isEnrolled ? (
                                            <Link href={`/lessons/${lesson.id}`}>
                                                <Button size="sm" variant="ghost" className="text-primary">Watch</Button>
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-muted-foreground capitalize">Lesson {index + 1}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <div className="rounded-3xl border bg-card p-6 shadow-xl border-primary/10">
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-primary">
                                            {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                                        </span>
                                        {course.price > 0 && (
                                            <span className="text-lg text-muted-foreground line-through">$89.99</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-green-600 font-bold mt-1">Limited time offer: 45% Off</p>
                                </div>

                                {isEnrolled ? (
                                    <Link href="/dashboard" className="w-full">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-2xl">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <form action={async () => {
                                        "use server";
                                        if (!userId) {
                                            redirect("/auth/login");
                                        }
                                        await enrollInCourse(course.id);
                                    }}>
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-2xl">
                                            Enroll Now
                                        </Button>
                                    </form>
                                )}

                                <div className="mt-8 space-y-4">
                                    <p className="text-sm font-bold text-primary uppercase tracking-wider">This course includes:</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            {lessonCount} specialized lessons
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            Full lifetime access
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Star className="h-4 w-4 text-primary" />
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-card p-6 border-primary/10">
                                <h3 className="font-bold text-primary mb-4 text-center">Meet your instructor</h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {course.instructor.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">{course.instructor.name}</p>
                                        <p className="text-xs text-muted-foreground">Senior Technical Educator</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
