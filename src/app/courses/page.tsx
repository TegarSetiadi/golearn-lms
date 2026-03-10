import { db } from "@/db";
import { categories as categoriesTable, courses as coursesTable, users } from "@/db/schema";
import { eq, like, and } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: { title?: string; categoryId?: string };
}) {
    const title = searchParams.title || "";
    const categoryId = searchParams.categoryId || "";

    const categories = await db.select().from(categoriesTable);

    const courses = await db
        .select({
            id: coursesTable.id,
            title: coursesTable.title,
            price: coursesTable.price,
            thumbnail: coursesTable.thumbnail,
            instructorName: users.name,
            categoryName: categoriesTable.name,
        })
        .from(coursesTable)
        .innerJoin(users, eq(coursesTable.instructorId, users.id))
        .innerJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))
        .where(
            and(
                title ? like(coursesTable.title, `%${title}%`) : undefined,
                categoryId ? eq(coursesTable.categoryId, categoryId) : undefined
            )
        );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="container pt-32 pb-16 px-4 md:px-6">
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-primary">Browse Courses</h1>
                            <p className="text-muted-foreground mt-1">Explore our wide range of expert-led courses.</p>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <form action="/courses" method="GET">
                                <Input
                                    name="title"
                                    defaultValue={title}
                                    placeholder="Search courses..."
                                    className="pl-10 bg-background border-primary/10 transition-all focus:border-primary/30"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link href="/courses">
                            <Badge
                                variant={!categoryId ? "default" : "outline"}
                                className="px-4 py-1.5 cursor-pointer text-sm"
                            >
                                All Categories
                            </Badge>
                        </Link>
                        {categories.map((category) => (
                            <Link key={category.id} href={`/courses?categoryId=${category.id}${title ? `&title=${title}` : ""}`}>
                                <Badge
                                    variant={categoryId === category.id ? "default" : "outline"}
                                    className="px-4 py-1.5 cursor-pointer text-sm"
                                >
                                    {category.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>

                    {courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-primary/5 p-6 rounded-full mb-4">
                                <Search className="h-12 w-12 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">No courses found</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs">
                                Try adjusting your search or filters to find what you&apos;re looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
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
            </main>
        </div>
    );
}
