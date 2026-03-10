import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/auth");
    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isInstructorRoute = nextUrl.pathname.startsWith("/instructor");

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return undefined;
    }

    if (!isLoggedIn && (isDashboardRoute || isAdminRoute || isInstructorRoute)) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

    // Role based access control
    if (isLoggedIn) {
        const role = req.auth?.user?.role;
        if (isAdminRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        if (isInstructorRoute && role !== "instructor" && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
    }

    return undefined;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
