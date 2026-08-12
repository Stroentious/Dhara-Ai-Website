import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createOrganization, user } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter an organization name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrganization({ name: name.trim(), slug: slug.trim() || undefined });
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create organization.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-dhara-surfaceBorder bg-dhara-surface shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-2">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-100">Setup Organization</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Welcome, {user?.firstName}! Create your primary farm organization boundary.
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
              label="Organization Name *"
              placeholder="e.g. Green Valley Farms"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, ''),
                  );
                }
              }}
            />

            <Input
              label="Organization Slug (Optional)"
              placeholder="e.g. green-valley-farms"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <div className="p-3 rounded-xl bg-dhara-dark border border-purple-500/20 text-xs space-y-1 font-mono text-purple-300">
              <div className="flex items-center space-x-1.5 font-bold font-sans text-purple-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Controlled Onboarding Rule</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                As the organization creator, you will automatically be granted the{' '}
                <strong>ORGANIZATION_ADMIN</strong> role for this organization boundary.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs h-10 space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating Organization...' : 'Create Organization'}</span>
            </Button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/app')}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Skip for now and enter App Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
