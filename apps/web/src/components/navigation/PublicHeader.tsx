import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, ArrowRight, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: 'Technology', path: '/technology' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'AI Engine', path: '/ai' },
    { label: 'Sustainability', path: '/sustainability' },
    { label: 'About', path: '/about' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dhara-surfaceBorder/60 bg-dhara-dark/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group" onClick={closeMobileMenu}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                DHARA AI
              </span>
              <span className="block text-[9px] text-slate-400 font-mono tracking-wider">
                FARM INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link to="/#demo">
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs"
              >
                <span>View Demo</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/app">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs space-x-1.5"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>App ({user?.firstName})</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs space-x-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-dhara-surfaceBorder bg-dhara-slate px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <Link to="/#demo" onClick={closeMobileMenu}>
              <Button
                variant="outline"
                className="w-full justify-center border-emerald-500/40 text-emerald-300 text-xs"
              >
                View Demo
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/app" onClick={closeMobileMenu}>
                <Button className="w-full justify-center bg-emerald-600 text-slate-950 text-xs font-semibold">
                  App Portal ({user?.firstName})
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={closeMobileMenu}>
                <Button className="w-full justify-center bg-emerald-600 text-slate-950 text-xs font-semibold">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
