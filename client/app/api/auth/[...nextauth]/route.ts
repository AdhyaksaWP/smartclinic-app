import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma.";
import bcrypt from "bcryptjs"; // For password hashing

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string};

                // Fetch user from database
                const user = await prisma.user.findFirst({
                    where: { email: email }
                });

                if (!user) {
                    throw new Error("No user found with the email");
                }

                // Check the password
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                // console.log("User in db: ", user);
                // Return user object if authentication is successful
                return { id: user.id, email: user.email, name: user.fullName};
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };