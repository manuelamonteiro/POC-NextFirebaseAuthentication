import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const uid = request.cookies.get('uid')?.value;
        const pathname = request.nextUrl.pathname;

        if (pathname.startsWith('/dashboard') && (!token || !uid)) {
            return handleAuthError(request);
        }

        if (((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && (!token || !uid))) {
            const response = NextResponse.next();
            response.cookies.set('token', '', { maxAge: 0 });
            response.cookies.set('uid', '', { maxAge: 0 });
            return response;
        }

        if (token && uid) {
            const apiUrl = new URL('/api/auth/verifyToken', request.url);

            const response = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                return handleAuthError(request);
            }

            const data = await response.json();

            if (uid !== data.decodedToken.uid) {
                return handleAuthError(request);
            }

            if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
                if (uid == data.decodedToken.uid) {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Erro durante a autenticação: ", error);
        return handleAuthError(request);
    }
}

function handleAuthError(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.set('token', '', { maxAge: 0 });
    response.cookies.set('uid', '', { maxAge: 0 });
    return response;
}
