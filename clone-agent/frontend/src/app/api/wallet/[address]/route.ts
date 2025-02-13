import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Current session:", session); 

    if (!session?.address) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    if (session.address.toLowerCase() !== params.address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized wallet access' },
        { status: 403 }
      );
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userAddress: params.address.toLowerCase()
      }
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      seedPhrase: wallet.seedPhrase,
      createdAt: wallet.createdAt
    });

  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}