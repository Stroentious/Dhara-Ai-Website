import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthenticatedUserContext,
  RegisterRequest,
  LoginRequest,
  CreateOrganizationRequest,
  OrganizationDTO,
} from '@dhara/shared';
import { apiClient } from '../lib/api-client';

interface AuthContextType {
  user: AuthenticatedUserContext | null;
  activeOrganization: OrganizationDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  createOrganization: (data: CreateOrganizationRequest) => Promise<OrganizationDTO>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUserContext | null>(null);
  const [activeOrganization, setActiveOrganization] = useState<OrganizationDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      if (userData.memberships && userData.memberships.length > 0) {
        const firstMem = userData.memberships[0];
        setActiveOrganization({
          id: firstMem.organizationId,
          name: firstMem.organizationName || 'Organization',
          slug: firstMem.organizationSlug || 'organization',
          status: 'ACTIVE',
          role: firstMem.role,
          createdAt: firstMem.createdAt,
          updatedAt: firstMem.createdAt,
        });
      }
    } catch {
      setUser(null);
      setActiveOrganization(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await apiClient.login(data);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await apiClient.register(data);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setActiveOrganization(null);
      setIsLoading(false);
    }
  };

  const createOrganization = async (data: CreateOrganizationRequest): Promise<OrganizationDTO> => {
    const newOrg = await apiClient.createOrganization(data);
    await refreshUser();
    setActiveOrganization(newOrg);
    return newOrg;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeOrganization,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        createOrganization,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
