'use client';

import LoginForm from './_components/login-form';
import { AuthProvider } from '@/app/_contexts/AuthContext';

export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}
