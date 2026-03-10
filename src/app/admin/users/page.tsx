import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, User } from "lucide-react";
import { redirect } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const users = await db.select().from(usersTable);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Users</h1>
                    <p className="text-muted-foreground mt-1">View and manage all registered users on the platform.</p>
                </div>

                <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-primary/10">
                    <Table>
                        <TableHeader className="bg-primary/5">
                            <TableRow>
                                <TableHead className="py-4">User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-primary/5 transition-colors">
                                    <TableCell className="font-medium py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {user.name?.[0]}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-lg capitalize border-primary/20",
                                                user.role === 'admin' ? "bg-amber-50 text-amber-700" :
                                                    user.role === 'instructor' ? "bg-blue-50 text-blue-700" :
                                                        "bg-green-50 text-green-700"
                                            )}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                <DropdownMenuLabel>User Management</DropdownMenuLabel>
                                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                                    <Shield className="h-4 w-4" />
                                                    Modify Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                                                    <User className="h-4 w-4" />
                                                    Delete Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { cn } from "@/lib/utils";
