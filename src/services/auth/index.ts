import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from '@/services/database'

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  pages: {
    signIn: '/auth',
    newUser: '/app',
  },
  adapter: PrismaAdapter(prisma),
})
