import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getSessionAddress() {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    const token = await getToken({
      req: {
        cookies: Object.fromEntries(
          (await cookieStore).getAll().map(c => [c.name, c.value])
        ),
        headers: Object.fromEntries((await headersList).entries()),
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      console.log("No token found");
      return null;
    }

    const [, , address] = token.sub.split(':');
    console.log("Found address:", address);
    return address?.toLowerCase() || null;

  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}