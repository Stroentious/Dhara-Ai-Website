import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { AppShellLayout } from '@/components/layout/AppShellLayout';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { TechnologyPage } from '@/pages/TechnologyPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { SolutionsPage } from '@/pages/SolutionsPage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { HardwarePage } from '@/pages/HardwarePage';
import { AIPage } from '@/pages/AIPage';
import { SustainabilityPage } from '@/pages/SustainabilityPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Auth Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { OnboardingPage } from '@/pages/OnboardingPage';

// Protected Phase 3 App Pages
import { DashboardPage } from '@/pages/app/DashboardPage';
import { FarmsListPage } from '@/pages/app/FarmsListPage';
import { FarmDetailPage } from '@/pages/app/FarmDetailPage';
import { FieldsListPage } from '@/pages/app/FieldsListPage';
import { FieldDetailPage } from '@/pages/app/FieldDetailPage';
import { ZonesListPage } from '@/pages/app/ZonesListPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Guard: Unauthenticated users visiting protected routes redirect to /login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-400 font-mono">
        Verifying Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Guard: Authenticated users visiting auth routes redirect to /app/dashboard
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-400 font-mono">
        Verifying Session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Website Routes (Wrapped in PageLayout) */}
            <Route
              path="/*"
              element={
                <PageLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/technology" element={<TechnologyPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/solutions" element={<SolutionsPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/hardware" element={<HardwarePage />} />
                    <Route path="/ai" element={<AIPage />} />
                    <Route path="/sustainability" element={<SustainabilityPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Auth Pages */}
                    <Route
                      path="/login"
                      element={
                        <AuthRoute>
                          <LoginPage />
                        </AuthRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <AuthRoute>
                          <RegisterPage />
                        </AuthRoute>
                      }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </PageLayout>
              }
            />

            {/* Protected Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <OnboardingPage />
                  </PageLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Private Application Routes (Wrapped in AppShellLayout) */}
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppShellLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/farms" element={<FarmsListPage />} />
                      <Route path="/farms/:farmId" element={<FarmDetailPage />} />
                      <Route path="/fields" element={<FieldsListPage />} />
                      <Route path="/fields/:fieldId" element={<FieldDetailPage />} />
                      <Route path="/zones" element={<ZonesListPage />} />
                      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                    </Routes>
                  </AppShellLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
