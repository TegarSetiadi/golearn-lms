"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <Navbar />
            <div className="flex h-full pt-16">
                <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-40">
                    <Sidebar />
                </div>
                <main className="md:pl-64 flex-1 h-full w-full bg-slate-50/50">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
