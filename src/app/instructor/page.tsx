import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses as coursesTable, enrollments, categories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    PlusCircle,
    Users,
    BookOpen,
    DollarSign,
    BarChart3,
    Edit,
    MoreVertical
} from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default async function InstructorDashboard() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    const role = session.user.role;
    if (role !== "instructor" && role !== "admin") {
        redirect("/dashboard");
    }

    const userId = session.user.id;

    // Fetch instructor's courses
    const instructorCourses = await db
        .select({
            id: coursesTable.id,
            title: coursesTable.title,
            price: coursesTable.price,
            thumbnail: coursesTable.thumbnail,
            categoryName: categories.name,
            enrolledCount: sql<number>`count(${enrollments.id})`.mapWith(Number),
        })
        .from(coursesTable)
        .leftJoin(enrollments, eq(coursesTable.id, enrollments.courseId))
        .innerJoin(categories, eq(coursesTable.categoryId, categories.id))
        .where(eq(coursesTable.instructorId, userId))
        .groupBy(coursesTable.id);

    const totalStudents = instructorCourses.reduce((acc, curr) => acc + curr.enrolledCount, 0);
    const totalRevenue = instructorCourses.reduce((acc, curr) => acc + (curr.enrolledCount * curr.price), 0);

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Instructor Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your courses and track student performance.</p>
                    </div>
                    <Link href="/instructor/create">
                        <Button className="bg-primary hover:bg-primary/90 gap-2 rounded-xl">
                            <PlusCircle className="h-4 w-4" />
                            Create New Course
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard
                        title="Total Courses"
                        value={instructorCourses.length}
                        icon={BookOpen}
                    />
                    <DashboardCard
                        title="Total Students"
                        value={totalStudents}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <DashboardCard
                        title="Total Revenue"
                        value={`$${totalRevenue.toFixed(2)}`}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <DashboardCard
                        title="Course Rating"
                        value="4.8/5"
                        icon={BarChart3}
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-primary mb-6">Your Courses</h2>
                    {instructorCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl border-primary/10 bg-primary/5 text-center px-4">
                            <BookOpen className="h-16 w-16 text-primary/30 mb-6" />
                            <h3 className="text-xl font-bold text-primary">No courses created yet</h3>
                            <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
                                Start sharing your knowledge with the world by creating your first course today.
                            </p>
                            <Link href="/instructor/create">
                                <Button size="lg" className="rounded-2xl px-8 py-6 text-lg">Create Your First Course</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {instructorCourses.map((course) => (
                                <div key={course.id} className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md transition-all group">
                                    <div className="h-20 w-32 relative overflow-hidden rounded-xl border">
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                                {course.categoryName}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary truncate group-hover:text-primary/70 transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5" />
                                                <span>{course.enrolledCount} Students</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-primary/80 font-bold">
                                                <span>${course.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/instructor/edit/${course.id}`}>
                                            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-primary/20 text-primary">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/courses/${course.id}`} className="cursor-pointer">View Page</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive cursor-pointer">Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
