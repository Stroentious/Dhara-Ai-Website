import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  Grid,
  Layers,
  Cpu,
  Activity,
  Droplets,
  TestTube2,
  Bot,
  BarChart3,
  BellRing,
  FileText,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  Plus,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export const AppShellLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeOrganization, logout } = useAuth();

  const activeNavItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Farms', path: '/app/farms', icon: Tractor },
    { label: 'Fields', path: '/app/fields', icon: Grid },
    { label: 'Zones', path: '/app/zones', icon: Layers },
  ];

  const comingSoonItems = [
    { label: 'Devices', icon: Cpu },
    { label: 'Soil Intelligence', icon: Activity },
    { label: 'Irrigation', icon: Droplets },
    { label: 'Fertigation', icon: TestTube2 },
    { label: 'AI Assistant', icon: Bot },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Alerts', icon: BellRing },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dhara-dark text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-dhara-surfaceBorder bg-dhara-slate shrink-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-dhara-surfaceBorder flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Sprout className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-100">DHARA AI</span>
            <span className="block text-[9px] text-slate-400 font-mono tracking-wider">
              PRIVATE PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold mb-1">
              MANAGEMENT
            </div>
            {activeNavItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold mb-1">
              FUTURE MODULES
            </div>
            {comingSoonItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-900/40 cursor-not-allowed"
                  title="Scheduled for future phase implementation"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-slate-600" />
                    <span>{item.label}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-800 text-[9px] text-slate-600 font-mono"
                  >
                    SOON
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-dhara-surfaceBorder bg-dhara-dark/60 space-y-2">
          <div className="flex items-center justify-between text-xs px-2">
            <div className="truncate">
              <div className="font-bold text-slate-200 truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</div>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-dhara-surfaceBorder bg-dhara-dark/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Organization Selector Badge */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  {activeOrganization?.name || 'Organization'}
                </span>
                <span className="text-[10px] text-purple-300 font-mono block">
                  Role: {activeOrganization?.role || user?.activeRole || 'VIEWER'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/onboarding')}
              variant="outline"
              size="sm"
              className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs hidden sm:flex space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Org</span>
            </Button>

            <div className="h-8 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
              <UserCheck className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{user?.firstName}</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dhara-slate border-b border-dhara-surfaceBorder p-4 space-y-3">
            <div className="space-y-1">
              {activeNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800"
                  >
                    <Icon className="h-4 w-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
