import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../lib/auth';

interface User {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authClient.getSession().then(session => {
            if (session && session.user) {
                setUser(session.user);
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const signIn = async (email: string, password: string) => {
        const res = await authClient.signIn(email, password);
        setUser(res.user);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const res = await authClient.signUp(email, password, name);
        setUser(res.user);
    };

    const signOut = async () => {
        await authClient.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
