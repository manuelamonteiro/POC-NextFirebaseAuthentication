"use client";

import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = Cookies.get('token');
  //     const uid = Cookies.get('uid');
  
  //     if (!token || !uid) {
  //       router.push("/auth/login");
  //       return;
  //     }
  
  //     if (token) {
  //       const response = await fetch('/api/auth/verifyToken', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ token })
  //       });
  
  //       if (!response.ok) {
  //         router.push("/auth/login");
  //       }
  //     }
  //   };
  
  //   checkToken();
  // }, [router]);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get('token');
      const uid = Cookies.get('uid');

      if (uid) {
        const response = await fetch('/api/auth/revokeTokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Ocorreu um erro durante a anulação dos tokens');
        }

        if (data.success) {
          const response = await fetch('/api/auth/verifyToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });

          if (response.ok) {
            const response = await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!response.ok) {
              throw new Error(data.error || 'Ocorreu um erro durante a anulação dos tokens');
            }
            
            Cookies.remove("token");
            Cookies.remove("uid");
            router.push('/');
          }
        }
      }

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
