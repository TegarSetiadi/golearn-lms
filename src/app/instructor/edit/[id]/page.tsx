import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses as coursesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, PlayCircle, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createLesson } from "@/actions/lesson";

export default async function EditCoursePage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    if (!session?.user) redirect("/auth/login");

    const userId = session.user.id;
    const course = await db.query.courses.findFirst({
        where: and(eq(coursesTable.id, params.id), eq(coursesTable.instructorId, userId)),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.orderIndex)],
            },
        },
    });

    if (!course) redirect("/instructor");

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/instructor" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-primary truncate max-w-md">{course.title}</h1>
                        <Badge className="bg-primary/10 text-primary">Editing Mode</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Lessons List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-primary/10 shadow-sm overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between bg-white border-b py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <PlayCircle className="h-5 w-5 text-primary" />
                                    Course Curriculum
                                </CardTitle>
                                <div className="text-xs text-muted-foreground">
                                    {course.lessons.length} Lessons total
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {course.lessons.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
                                        <PlayCircle className="h-10 w-10 opacity-20 mb-3" />
                                        <p>No lessons added yet. Use the form to get started.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {course.lessons.map((lesson, idx) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-background hover:bg-primary/5 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-primary text-sm">{lesson.title}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                                            {lesson.videoUrl ? 'Video Lesson' : 'Content Only'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Add Lesson Form */}
                    <div className="lg:col-span-1">
                        <Card className="border-primary/10 shadow-lg sticky top-32">
                            <CardHeader className="bg-primary/5 border-b py-4">
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add New Lesson
                                </CardTitle>
                            </CardHeader>
                            <form action={async (formData) => {
                                "use server";
                                formData.append("courseId", params.id);
                                formData.append("orderIndex", (course.lessons.length + 1).toString());
                                const res = await createLesson(formData);
                                if (!res.success) {
                                    // Error handling in a real app would be better here
                                }
                            }}>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-xs uppercase font-bold tracking-wider opacity-60">Lesson Title</Label>
                                        <Input id="title" name="title" placeholder="e.g. Setting up the environment" required className="rounded-xl border-primary/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl" className="text-xs uppercase font-bold tracking-wider opacity-60">Video URL (YouTube/Vimeo)</Label>
                                        <Input id="videoUrl" name="videoUrl" placeholder="https://youtube.com/..." className="rounded-xl border-primary/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-xs uppercase font-bold tracking-wider opacity-60">Lesson Content</Label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            className="w-full min-h-[120px] p-3 rounded-xl border border-primary/10 bg-transparent text-sm shadow-sm transition-colors focus:ring-1 focus:ring-primary outline-none"
                                            placeholder="Enter the lesson text or markdown..."
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 pb-6 border-t bg-slate-50/50 rounded-b-xl">
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl h-11">
                                        Publish Lesson
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { Badge } from "@/components/ui/badge";
