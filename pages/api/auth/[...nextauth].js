import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

function getAllowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      tenantId: process.env.TENANT_ID,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const email = (profile?.email || profile?.preferred_username || "").toLowerCase();
      return getAllowedEmails().includes(email);
    },
  },
};

export default NextAuth(authOptions);
