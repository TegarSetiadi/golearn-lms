"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    BarChart,
    PlusCircle,
    FolderOpen
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role || "student";

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-primary",
        },
        {
            label: "My Courses",
            icon: BookOpen,
            href: role === "instructor" ? "/instructor" : "/dashboard/courses",
            color: "text-primary",
        },
    ];

    if (role === "admin") {
        routes.push(
            {
                label: "Manage Users",
                icon: Users,
                href: "/admin/users",
                color: "text-primary",
            },
            {
                label: "Manage Categories",
                icon: FolderOpen,
                href: "/admin/categories",
                color: "text-primary",
            },
            {
                label: "Global Stats",
                icon: BarChart,
                href: "/admin",
                color: "text-primary",
            }
        );
    }

    if (role === "instructor") {
        routes.push(
            {
                label: "Create Course",
                icon: PlusCircle,
                href: "/instructor/create",
                color: "text-primary",
            },
            {
                label: "Analytics",
                icon: BarChart,
                href: "/instructor/analytics",
                color: "text-primary",
            }
        );
    }

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
            <div className="px-3 py-2 flex-1">
                <div className="space-y-1 mt-16">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/5 rounded-lg transition-all",
                                pathname === route.href ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
