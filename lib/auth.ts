import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",

            credentials: {
                username: { label: "Username", type: "username" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials) return null;

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) return null;

                const valid = await compare(
                    credentials.password,
                    user.password,
                );

                if (!valid) return null;

                return {
                    id: user.id.toString(),
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 2,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};
