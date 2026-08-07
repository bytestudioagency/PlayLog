import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    jwt({ token, account }) {
      // Without a database adapter, Auth.js mints a fresh random id as
      // `user.id` on every sign-in instead of using the provider's stable
      // account id. Pin token.sub to the real Google account id (available
      // on `account` only during the sign-in request) so it matches the
      // `users.id` written by the signIn event below and stays stable
      // across sign-outs/sign-ins.
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    // Mirror the Google profile into public.users on every sign-in.
    // Failures are logged but never block the sign-in itself.
    async signIn({ user, account }) {
      const id = account?.providerAccountId ?? user.id;
      if (!id) return;
      try {
        const { error } = await supabaseAdmin().from("users").upsert({
          id,
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          last_sign_in_at: new Date().toISOString(),
        });
        if (error) console.error("users upsert failed:", error.message);
      } catch (e) {
        console.error("users upsert failed:", e);
      }
    },
  },
});
