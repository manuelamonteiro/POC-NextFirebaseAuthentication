import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../firebaseConfig';

export async function POST(request: NextRequest) {
    try {
        await auth.signOut();

        return NextResponse.json({ sucess: true });
    } catch (error) {
        console.error("Error during authentication: ", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
