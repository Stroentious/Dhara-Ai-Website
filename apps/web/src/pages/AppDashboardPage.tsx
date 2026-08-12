import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCheck, Building2, ShieldCheck, Plus, CheckCircle2, Lock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const AppDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeOrganization, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <Section variant="grid" className="py-12 md:py-16">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                  AUTHENTICATED PORTAL
                </Badge>
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 font-mono text-[11px]"
                >
                  PHASE 2 BOUNDARY
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-50">
                Welcome to Dhara AI, {user?.firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Authenticated Operator Session ({user?.email})
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/onboarding')}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 text-xs space-x-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>New Organization</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/30 text-rose-200 text-xs space-x-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Identity Card */}
            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
              <div className="flex items-center space-x-3 text-emerald-400">
                <UserCheck className="h-6 w-6" />
                <h2 className="text-base font-bold text-slate-100 font-sans">User Identity</h2>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">ID: </span>
                  <span className="text-emerald-400">{user?.id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Name: </span>
                  {user?.firstName} {user?.lastName}
                </div>
                <div>
                  <span className="text-slate-500">Email: </span>
                  {user?.email}
                </div>
                <div>
                  <span className="text-slate-500">Status: </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 text-[10px]"
                  >
                    {user?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Active Organization Card */}
            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
              <div className="flex items-center space-x-3 text-purple-400">
                <Building2 className="h-6 w-6" />
                <h2 className="text-base font-bold text-slate-100 font-sans">
                  Active Organization
                </h2>
              </div>
              {activeOrganization ? (
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500">Name: </span>
                    <span className="text-purple-300 font-bold">{activeOrganization.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Slug: </span>
                    {activeOrganization.slug}
                  </div>
                  <div>
                    <span className="text-slate-500">Role: </span>
                    <Badge
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 text-[10px]"
                    >
                      {activeOrganization.role || user?.activeRole || 'VIEWER'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    You are not associated with any organization yet.
                  </p>
                  <Button
                    onClick={() => navigate('/onboarding')}
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-slate-950 text-xs font-bold"
                  >
                    Create Organization
                  </Button>
                </div>
              )}
            </div>

            {/* Granted Permissions Card */}
            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
              <div className="flex items-center space-x-3 text-cyan-400">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="text-base font-bold text-slate-100 font-sans">
                  Resolved RBAC Permissions
                </h2>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 text-[11px] font-mono text-slate-300 pr-1">
                {user?.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-1.5 rounded bg-dhara-dark border border-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No active permissions resolved.</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* PHASE 3 PLACEHOLDER BOUNDARY */}
      <Section variant="dark" className="py-12">
        <Container size="narrow">
          <div className="p-6 rounded-2xl border border-amber-500/20 bg-dhara-surface text-center space-y-3 font-sans">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Phase 3 Domain Management Placeholder
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Farm creation, field layout mapping, device onboarding, telemetry charts, and
              automated valve schedules are scheduled for implementation in{' '}
              <strong>Phase 3 and beyond</strong>.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
};
