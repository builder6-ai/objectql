import { useState } from 'react';
import { Card, Input, Button, Spinner, Label } from '@objectql/ui';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { signIn, signUp } = useAuth();
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignIn) {
                await signIn(email, password);
            } else {
                await signUp(email, password, name);
            }
            // App component handles redirection via auth state change
        } catch (err: any) {
            console.error(err);
            setError(err.message || err.error?.message || 'Authentication failed');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col justify-center items-center p-4 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#FAFAFC]"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl opacity-60"></div>
            
            <div className="z-10 w-full max-w-[400px] animate-[fadeIn_0.6s_ease-out]">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-4 shadow-lg shadow-black/20 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        {isSignIn ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-gray-500 text-[15px] mt-2">
                       {isSignIn ? 'Enter your details to access your workspace' : 'Start your journey with ObjectQL'}
                    </p>
                </div>

                <Card className="backdrop-blur-xl bg-white/70 shadow-2xl border-white/50 ring-1 ring-black/5 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isSignIn && (
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Email address</Label>
                            <Input 
                                type="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="name@example.com"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input 
                                type="password" 
                                value={password} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-[13px] text-red-600 bg-red-50/50 border border-red-100 rounded-lg flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full text-base py-3 shadow-blue-500/25" disabled={loading}>
                            {loading ? <span className="flex items-center gap-2"><Spinner className="w-4 h-4" /> Processing</span> : (isSignIn ? 'Sign in' : 'Create account')}
                        </Button>
                    </form>
                </Card>

                <div className="mt-8 text-center text-sm">
                    <span className="text-gray-500">{isSignIn ? "New to ObjectQL? " : "Already have an account? "}</span>
                    <button 
                        type="button"
                        onClick={() => { setIsSignIn(!isSignIn); setError(''); }}
                        className="font-medium text-[#0071e3] hover:text-[#0077ED] transition-colors"
                    >
                        {isSignIn ? "Sign up now" : "Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
