import withAuth from "next-auth/middleware";

export const proxy = withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/members/:path*",
        "/loans/:path*",
        "/loan-requests/:path*",
        "/contributions/:path*",
        "/emi-calculator/:path*",
    ],
};
