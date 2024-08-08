import { NextResponse } from 'next/server';
import { unsetAuthCookies } from 'next-firebase-auth';
import initAuth from '../../../../initAuth';
import { initializeFirebase } from '../../../../firebaseConfig';

initAuth();
initializeFirebase();

export async function POST(request, response) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID Token is required.' }, { status: 400 });
        }
        
        await unsetAuthCookies(request, response);

        return NextResponse.json({ sucess: true });
    } catch (error) {
        console.error("Error during authentication: ", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
