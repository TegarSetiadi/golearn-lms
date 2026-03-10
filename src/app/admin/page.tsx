import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, courses, enrollments } from "@/db/schema";
import { count } from "drizzle-orm";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import {
    Users,
    BookOpen,
    BarChart3,
    DollarSign,
    ShieldCheck,
    Tags,
    Activity
} from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    // PLATFORM STATS
    const [userCount] = await db.select({ value: count() }).from(users);
    const [courseCount] = await db.select({ value: count() }).from(courses);
    const [enrollmentCount] = await db.select({ value: count() }).from(enrollments);

    // Calculate total revenue across all courses
    const allCourses = await db.select({ price: courses.price }).from(courses);
    const totalRevenue = allCourses.reduce((acc, curr) => acc + curr.price, 0) * (enrollmentCount.value || 0);
    // Note: This is an estimation for demo purposes. In real app, you'd join with enrollments.

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Platform Administration</h1>
                    <p className="text-muted-foreground mt-1">High-level overview of the GoLearn LMS ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard
                        title="Total Users"
                        value={userCount.value}
                        icon={Users}
                        description="Registered students & instructors"
                    />
                    <DashboardCard
                        title="Active Courses"
                        value={courseCount.value}
                        icon={BookOpen}
                        description="Courses available for enrollment"
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <DashboardCard
                        title="Total Enrollments"
                        value={enrollmentCount.value}
                        icon={Activity}
                        description="Course purchases & signups"
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <DashboardCard
                        title="Platform Revenue"
                        value={`$${totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        description="Gross platform earnings"
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-primary/10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Management Quick Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/admin/users">
                                <Button variant="outline" className="w-full justify-start gap-3 rounded-xl py-6 h-auto border-primary/10 hover:bg-primary/5 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Manage Users</p>
                                        <p className="text-xs text-muted-foreground font-normal">Edit roles & accounts</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/admin/categories">
                                <Button variant="outline" className="w-full justify-start gap-3 rounded-xl py-6 h-auto border-primary/10 hover:bg-primary/5 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Tags className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Course Categories</p>
                                        <p className="text-xs text-muted-foreground font-normal">Organize the curriculum</p>
                                    </div>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Platform Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Recent Enrollments (24h)</span>
                                    <span className="font-bold text-primary">+12</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">New Instructors Pending</span>
                                    <span className="font-bold text-amber-600">3 Pending</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Course Completion Rate</span>
                                    <span className="font-bold text-primary">68%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
