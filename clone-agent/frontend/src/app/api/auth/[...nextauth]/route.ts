import NextAuth from 'next-auth';
import credentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import {
  type SIWESession,
  getChainIdFromMessage,
  getAddressFromMessage
} from '@reown/appkit-siwe';
import { createPublicClient, http } from 'viem';
import { AuthOptions } from 'next-auth';

const prisma = new PrismaClient();

declare module 'next-auth' {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    sessionToken?: string;
  }
  interface JWT {
    sub?: string;
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
}

export const authOptions: AuthOptions = {
  secret: nextAuthSecret,
  providers: [
    credentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error('SiweMessage is undefined');
          }
          const { message, signature } = credentials;
          const address = getAddressFromMessage(message);
          const chainId = getChainIdFromMessage(message);

          const publicClient = createPublicClient({
            transport: http(
              `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
            )
          });
          
          const isValid = await publicClient.verifyMessage({
            message,
            address: address as `0x${string}`,
            signature: signature as `0x${string}`
          });

          if (isValid) {
            return {
              id: `${chainId}:${address}`,
            };
          }

          return null;
        } catch (e) {
          console.error('Authorization error:', e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (!token.sub) {
          return session;
        }

        const [, chainId, address] = token.sub.split(':');
        if (chainId && address) {
          session.address = address;
          session.chainId = parseInt(chainId, 10);
          session.sessionToken = token.sub;

          const wallet = await prisma.wallet.findFirst({
            where: { userAddress: address }
          });

          if (wallet) {
            await prisma.userSession.upsert({
              where: { sessionToken: token.sub },
              update: {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              },
              create: {
                sessionToken: token.sub,
                userAddress: address,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            });
          }
        }

        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/', 
    error: '/', 
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };