'use client';

import { AuthProvider } from '@/app/_contexts/AuthContext';
import Dashboard from './_components/dashboard-page';

export default function DashboardPage() {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}
