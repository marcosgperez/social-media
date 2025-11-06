import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, createUser } from "@/lib/supabase/queries";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          let dbUser = await getUserByEmail(user.email);
          if (!dbUser) {
            const username = user.email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
            dbUser = await createUser({
              email: user.email,
              username: username,
              name: user.name || null,
              image_url: user.image || null,
              provider: 'google',
              provider_id: account.providerAccountId,
            });
          }
          (user as any).supabaseId = dbUser.id;
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.supabaseId || token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.supabaseId = (user as any).supabaseId;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
