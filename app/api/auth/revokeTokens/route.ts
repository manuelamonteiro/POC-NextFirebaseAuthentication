import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '../../../../firebaseAdminConfig';

export async function POST(request: NextRequest) {
    try {
        const { uid } = await request.json();

        await authAdmin.revokeRefreshTokens(uid);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error during authentication: ", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
