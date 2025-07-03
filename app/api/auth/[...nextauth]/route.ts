// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        username: {
          label: "Username/Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // ส่ง username/email และ password ไปยัง NestJS backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NESTJS_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials?.username, // ใช้ identifier เพื่อรองรับทั้ง username และ email
              password: credentials?.password,
            }),
            credentials: "include",
          },
        );

        const data = await res.json();

        console.log("Response from NestJS:", data);

        if (res.ok && data) {
          return {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            accessToken: data.access_token,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    jwt: async ({ token, user }) => {
      // ถ้า user มีข้อมูล ให้เพิ่มข้อมูลลงใน token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.accessToken = user.accessToken; // เก็บ accessToken ใน token
      }
      return token;
    },
    session: async ({ session, token }) => {
      // เพิ่มข้อมูลจาก token ลงใน session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.accessToken = token.accessToken; // เก็บ accessToken ใน session
      }
      return session;
    },
  },
};

const handler = NextAuth({
  ...authOptions,
  // session: {
  //   strategy: "jwt",
  // },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
