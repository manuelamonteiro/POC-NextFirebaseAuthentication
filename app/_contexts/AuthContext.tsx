import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
    config: string | null;
    setConfig: (config: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [config, setConfig] = useState(localStorage.getItem("token"));

    return (
        <AuthContext.Provider value={{ config, setConfig }}>
            {children}
        </AuthContext.Provider>
    )
}