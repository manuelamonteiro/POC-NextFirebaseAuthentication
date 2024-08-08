'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../../components/ui/card';
import { Button, buttonVariants } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { UserIcon } from './user-icon';
import Link from 'next/link';
import { cn } from '../../../../lib/utils';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro durante o registro');
            }

            router.push('/auth/login');
        } catch (error: any) {
            setError(error.message || 'Ocorreu um erro durante o registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="mx-auto max-w-96">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        Cadastre-se
                    </CardTitle>
                    <CardDescription>Crie uma conta gratuitamente</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="text-left ">
                        <div className="space-y-6">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Fulano de Tal"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="email@exemplo.com"
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
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                        <Button size={'lg'} type="submit" className="w-full mt-10 " disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Link
                        className={cn(
                            buttonVariants({ variant: 'link', size: 'sm' }),
                            'mt-2 mx-auto'
                        )}
                        href="/auth/login"
                    >
                        Já possui conta?
                    </Link>
                </CardFooter>
            </Card>
        </>
    );
}
