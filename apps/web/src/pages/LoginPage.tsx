import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogIn, Lock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-dhara-surfaceBorder bg-dhara-surface shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
            <Sprout className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-100">Dhara AI Sign In</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Sign in to access your farm intelligence portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Email Address *"
              type="email"
              placeholder="operator@dhara-ai.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password *"
              type="password"
              placeholder="••••••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Secure HttpOnly Session</span>
              <button
                type="button"
                disabled
                className="text-slate-500 hover:text-slate-400 cursor-not-allowed text-[11px]"
                title="Password reset workflow is currently PLANNED"
              >
                Forgot password? [PLANNED]
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-10 space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </Button>
          </form>

          <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800 text-xs space-y-1.5 font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 font-bold font-sans text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Phase 2 Database-Backed Session</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Authenticated requests utilize SHA-256 session token hashes validated server-side for
              immediate revocation upon logout.
            </p>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
