import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
    config: string | null;
    setConfig: (config: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [config, setConfig] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem("token");
                setConfig(token);

                if (token) {
                    try {
                        const response = await fetch('/api/auth/verifyToken', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ token }),
                        });

                        if (!response.ok) {
                            throw new Error('Token verification failed');
                        }

                        const data = await response.json();
                        setEmail(data.decodedToken.email);
                    } catch (error) {
                        console.error("Token verification failed:", error);
                        setConfig(null);
                        setEmail(null);
                    }
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);


    return (
        <AuthContext.Provider value={{ config, setConfig, email, setEmail, loading }}>
            {children}
        </AuthContext.Provider>
    )
}