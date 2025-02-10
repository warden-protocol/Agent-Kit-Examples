import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Current session:", session); // Debug log

    if (!session?.address) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body); 

    const { userAddress, publicKey, privateKey, seedPhrase } = body;

    if (!userAddress || !publicKey || !privateKey || !seedPhrase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (session.address.toLowerCase() !== userAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized wallet access' },
        { status: 403 }
      );
    }

    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userAddress: userAddress.toLowerCase()
      }
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: 'Wallet already exists for this address' },
        { status: 409 }
      );
    }

    const wallet = await prisma.wallet.create({
      data: {
        userAddress: userAddress.toLowerCase(),
        publicKey,
        privateKey,
        seedPhrase,
      },
    });

    return NextResponse.json(
      { 
        message: 'Wallet created successfully',
        id: wallet.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Wallet creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}