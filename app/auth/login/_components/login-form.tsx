'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SiGmail } from '@icons-pack/react-simple-icons';
import { auth } from '@/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loadingCredentials, setLoadingCredentials] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const router = useRouter();

    const handleLoginWithCredentials = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingCredentials(true);
        setError(null);

        const form = event.target as HTMLFormElement;
        const email = form.email.value;
        const password = form.password.value;

        try {
            if (!email || !password) {
                throw new Error('Email and password are required.');
            }

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro durante o login com credenciais');
            }

            Cookies.set("token", data.token, {sameSite: 'None', secure: true});
            Cookies.set("uid", data.userInfo.uid, {sameSite: 'None', secure: true});
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message || 'Ocorreu um erro durante o login com credenciais');
        } finally {
            setLoadingCredentials(false);
        }
    };

    const handleLoginWithGoogle = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingGoogle(true);
        setError(null);

        try {
            const provider = new GoogleAuthProvider();

            const providerSignIn = await signInWithPopup(auth, provider);
            const token = await providerSignIn.user.getIdToken();

            const response = await fetch('/api/auth/verifyToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro durante o login com Google');
            }

            Cookies.set("token", token, {sameSite: 'None', secure: true});
            Cookies.set("uid", data.decodedToken.uid, {sameSite: 'None', secure: true});
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message || 'Ocorreu um erro durante o login com Google');
        } finally {
            setLoadingGoogle(false);
        }
    };

    return (
        <Card className="mx-auto max-w-96">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Entre com email e senha</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLoginWithCredentials} className="text-left">
                    <div className="space-y-6">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                name="password"
                                type="password"
                                id="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <Button size={'lg'} type="submit" className="w-full mt-10" disabled={loadingCredentials}>
                        {loadingCredentials ? 'Logando...' : 'Login'}
                    </Button>
                </form>
                <form onSubmit={handleLoginWithGoogle} className="text-left">
                    <Button size={'lg'} type="submit" className="w-full mt-10 flex gap-3" disabled={loadingGoogle}>
                        <SiGmail />
                        {loadingGoogle ? 'Logando...' : 'Login com Gmail'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <Link
                    className={cn(
                        buttonVariants({ variant: 'link', size: 'sm' }),
                        'mt-2 mx-auto'
                    )}
                    href="/auth/register"
                >
                    Não possui conta?
                </Link>
            </CardFooter>
        </Card>
    );
}
