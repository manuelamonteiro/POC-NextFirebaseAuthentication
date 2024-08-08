import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container p-20 mx-auto text-center">
      <header>
        <h1 className="font-extrabold text-slate-600 dark:text-transparent text-7xl dark:bg-gradient-to-r dark:from-slate-50 dark:via-slate-400 dark:to-slate-200 bg-clip-text">
          Next Firebase Auth
        </h1>
        <hr className="w-1/4 mx-auto mt-5 mb-16" />
      </header>

      <section className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/auth/login" className={cn(buttonVariants())}>
          Login
        </Link>
        <Link href="/auth/register" className={cn(buttonVariants())}>
          Registro
        </Link>
      </section>
    </main>
  );
}
