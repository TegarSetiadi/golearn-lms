import { auth } from "@/lib/auth";
import { db } from "@/db";
import { enrollments, courses, categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import CourseCard from "@/components/CourseCard";
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function StudentDashboard() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    const userId = session.user.id;

    // Fetch enrolled courses
    const enrolledCourses = await db
        .select({
            id: courses.id,
            title: courses.title,
            price: courses.price,
            thumbnail: courses.thumbnail,
            instructorName: users.name,
            categoryName: categories.name,
            progress: enrollments.progress,
        })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .innerJoin(users, eq(courses.instructorId, users.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .where(eq(enrollments.userId, userId));

    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
    const averageProgress = totalCourses > 0
        ? Math.round(enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses)
        : 0;

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome back, {session.user.name}!</h1>
                    <p className="text-muted-foreground mt-1">Here&apos;s an overview of your learning progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard
                        title="Enrolled Courses"
                        value={totalCourses}
                        icon={BookOpen}
                        description="Total courses in your library"
                    />
                    <DashboardCard
                        title="Average Progress"
                        value={`${averageProgress}%`}
                        icon={Clock}
                        description="Across all your courses"
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <DashboardCard
                        title="Completed"
                        value={completedCourses}
                        icon={CheckCircle}
                        description="Courses finished successfully"
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <DashboardCard
                        title="Achievements"
                        value="3"
                        icon={Trophy}
                        description="Points earned this month"
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-primary mb-6">Continue Learning</h2>
                    {enrolledCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl border-primary/10 bg-primary/5 text-center">
                            <BookOpen className="h-12 w-12 text-primary/40 mb-4" />
                            <h3 className="text-lg font-bold text-primary">No courses enrolled yet</h3>
                            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
                                Browse our marketplace and find the perfect course to start your journey.
                            </p>
                            <Link href="/courses">
                                <Button>Browse Courses</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {enrolledCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    instructorName={course.instructorName}
                                    price={course.price}
                                    thumbnail={course.thumbnail}
                                    categoryName={course.categoryName}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

