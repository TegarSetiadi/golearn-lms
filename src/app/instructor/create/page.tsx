import { auth } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { createCourse } from "@/actions/course";

export default async function CreateCoursePage() {
    const session = await auth();
    if (!session?.user) redirect("/auth/login");

    const categoriesList = await db.select().from(categories);

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-primary mb-8">Create New Course</h1>
                <Card className="border-primary/10 shadow-lg">
                    <form action={async (formData) => {
                        "use server";
                        const res = await createCourse(formData);
                        if (res.success) {
                            redirect("/instructor");
                        }
                    }}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Master Web Development" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="w-full min-h-[150px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="Tell students what they will learn..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category</Label>
                                    <Select name="categoryId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriesList.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                <Input id="thumbnail" name="thumbnail" placeholder="https://images.unsplash.com/..." />
                                <p className="text-xs text-muted-foreground">Use a high-quality image URL for better engagement.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 border-t pt-6 bg-slate-50/50 rounded-b-lg">
                            <Button variant="ghost" type="button">Cancel</Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 rounded-xl font-bold">Create Course</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
}
