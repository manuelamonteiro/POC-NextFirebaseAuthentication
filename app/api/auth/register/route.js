import { NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import initAuth from '../../../../initAuth';
import { initializeFirebase } from '../../../../firebaseConfig';

initAuth();
initializeFirebase();

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
