import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'
import { dbUsers } from "@/database"
import { oAuthDbUser } from "@/database/dbUsers"

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'example@example.com' },
        password: { label: 'Password', type: 'password', placeholder: '***********' }
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password) as any
      }
    })
  ],

  // custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400 // 24h
  },

  // callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log("🚀 ~  jwt ", { token, account, user })

      if (account) {
        token.accessToken = account.access_token

        switch (account.type) {
          case 'oauth':
            token.user = await oAuthDbUser(user?.email ?? '', user?.name ?? '')
            break;
          case 'credentials':
            token.user = user
            break;

          default:
            break;
        }

      }

      return token
    },
    async session({ session, user, token }: any) {

      session.accessToken = token.accessToken
      session.user = token.user

      return session
    },

  }
}

export default NextAuth(authOptions)