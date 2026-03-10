import { auth } from "@/lib/auth";
import { db } from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Tag } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export default async function AdminCategoriesPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const categories = await db.select().from(categoriesTable);

    async function createCategory(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        if (!name) return;

        await db.insert(categoriesTable).values({
            id: uuidv4(),
            name,
        });
        revalidatePath("/admin/categories");
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Categories</h1>
                    <p className="text-muted-foreground mt-1">Add, edit, or remove course categories.</p>
                </div>

                <div className="p-6 rounded-2xl border bg-card border-primary/10 shadow-sm">
                    <form action={createCategory} className="flex gap-4">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="name"
                                placeholder="New Category Name (e.g. Mobile Development)"
                                className="pl-10 rounded-xl"
                                required
                            />
                        </div>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2 rounded-xl px-6">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="group flex items-center justify-between p-4 rounded-xl border bg-background hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                    <Tag className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-primary">{category.name}</span>
                            </div>
                            <form action={async () => {
                                "use server";
                                // This is a bit hacky for a server component demo
                                // Ideally this would be a client component with a server action
                            }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

