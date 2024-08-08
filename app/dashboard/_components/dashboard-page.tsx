"use client";

import { useContext, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/_contexts/AuthContext';


export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
      throw new Error('useContext(AuthContext) must be used within a AuthProvider');
  }

  const { setConfig } = authContext;

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro durante o logout');
      }

      localStorage.removeItem('token');
      setConfig(null);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro durante o registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container p-20 mx-auto text-center">
      <div>
        <h1 className="font-extrabold text-slate-600 dark:text-transparent text-7xl dark:bg-gradient-to-r dark:from-slate-50 dark:via-slate-400 dark:to-slate-200 bg-clip-text">
          Dashboard
        </h1>
        <h3 className="mt-4 font-bold text-muted-foreground">
          Bem-vindo!
        </h3>
        <hr className="w-1/4 mx-auto mt-5 mb-16" />
        <section className='flex flex-wrap items-center justify-center gap-3'>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogout}>
            <Button disabled={loading}>
              {loading ? 'Deslogando...' : 'Deslogar'}
            </Button>
          </form>
          <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>Home</Link>
        </section>
      </div>
    </main>
  );
}
