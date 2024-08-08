import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '../../../../firebaseAdminConfig';

export async function POST(request:NextRequest) {
  try {
    const { token } = await request.json();
    const decodedToken = await authAdmin.verifyIdToken(token);

    return NextResponse.json({ decodedToken });
  } catch (error) {
    console.error("Error during authentication: ", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
