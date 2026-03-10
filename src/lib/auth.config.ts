import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminRoute = nextUrl.pathname.startsWith("/admin");
            const isInstructorRoute = nextUrl.pathname.startsWith("/instructor");
            const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

            if (isAdminRoute || isInstructorRoute || isDashboardRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
                console.log("JWT callback - user role:", user.role);
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "instructor" | "student";
                console.log("Session callback - token role:", token.role);
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
