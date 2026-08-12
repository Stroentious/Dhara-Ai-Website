import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { organizationRepository } from '../repositories/organization.repository';
import { auditRepository } from '../repositories/audit.repository';
import { permissionService } from './permission.service';
import { AppError } from '../middlewares/error.middleware';
import {
  RegisterRequest,
  LoginRequest,
  AuthenticatedUserContext,
  UserDTO,
  MembershipDTO,
  Role,
  MembershipStatus,
  UserStatus,
} from '@dhara/shared';
import { User } from '@prisma/client';

const SESSION_COOKIE_NAME = 'dhara_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  generateRawSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashSessionToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  setSessionCookie(res: Response, rawToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS,
      path: '/',
    });
  }

  clearSessionCookie(res: Response): void {
    res.cookie(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
  }

  async register(data: RegisterRequest, res: Response, ipAddress?: string, userAgent?: string) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new AppError('First name, last name, email, and password are required', 400, 'VAL_001');
    }

    if (data.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400, 'VAL_002');
    }

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('An account with this email already exists', 400, 'AUTH_001');
    }

    const passwordHash = await this.hashPassword(data.password);
    const newUser = await userRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      status: 'ACTIVE',
    });

    const rawToken = this.generateRawSessionToken();
    const tokenHash = this.hashSessionToken(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await sessionRepository.create({
      userId: newUser.id,
      sessionTokenHash: tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await auditRepository.logEvent({
      userId: newUser.id,
      eventType: 'USER_REGISTERED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ email: newUser.email }),
    });

    this.setSessionCookie(res, rawToken);

    return {
      user: this.toUserDTO(newUser),
      rawToken,
    };
  }

  async login(data: LoginRequest, res: Response, ipAddress?: string, userAgent?: string) {
    if (!data.email || !data.password) {
      throw new AppError('Email and password are required', 400, 'VAL_001');
    }

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      await auditRepository.logEvent({
        eventType: 'LOGIN_FAILED',
        ipAddress,
        userAgent,
        detailsJson: JSON.stringify({ email: data.email }),
      });
      throw new AppError('Unable to authenticate with the provided credentials', 401, 'AUTH_002');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError(
        `Account is ${user.status.toLowerCase()}. Please contact support.`,
        403,
        'AUTH_003',
      );
    }

    const isValidPassword = await this.comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      await auditRepository.logEvent({
        userId: user.id,
        eventType: 'LOGIN_FAILED',
        ipAddress,
        userAgent,
      });
      throw new AppError('Unable to authenticate with the provided credentials', 401, 'AUTH_002');
    }

    await userRepository.updateLastLogin(user.id);

    const rawToken = this.generateRawSessionToken();
    const tokenHash = this.hashSessionToken(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await sessionRepository.create({
      userId: user.id,
      sessionTokenHash: tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await auditRepository.logEvent({
      userId: user.id,
      eventType: 'LOGIN',
      ipAddress,
      userAgent,
    });

    this.setSessionCookie(res, rawToken);

    return {
      user: this.toUserDTO(user),
      rawToken,
    };
  }

  async logout(
    rawToken: string,
    res: Response,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (rawToken) {
      const tokenHash = this.hashSessionToken(rawToken);
      await sessionRepository.revoke(tokenHash);
    }

    if (userId) {
      await auditRepository.logEvent({
        userId,
        eventType: 'LOGOUT',
        ipAddress,
        userAgent,
      });
    }

    this.clearSessionCookie(res);
  }

  async validateSessionToken(rawToken: string): Promise<AuthenticatedUserContext | null> {
    if (!rawToken) return null;

    const tokenHash = this.hashSessionToken(rawToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session || session.revokedAt || new Date() > new Date(session.expiresAt)) {
      return null;
    }

    await sessionRepository.touchLastUsed(tokenHash);

    const user = await userRepository.findById(session.userId);
    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    const membershipsRaw = await organizationRepository.getUserMemberships(user.id);
    const memberships: MembershipDTO[] = membershipsRaw.map((m) => ({
      id: m.id,
      userId: m.userId,
      organizationId: m.organizationId,
      organizationName: m.organization?.name,
      organizationSlug: m.organization?.slug,
      role: m.role as Role,
      status: m.status as MembershipStatus,
      createdAt: m.createdAt.toISOString(),
    }));

    const activeRole: Role = memberships.length > 0 ? memberships[0].role : 'VIEWER';
    const permissions = permissionService.getPermissionsForRole(activeRole);

    return {
      ...this.toUserDTO(user),
      memberships,
      activeOrganizationId: memberships.length > 0 ? memberships[0].organizationId : undefined,
      activeRole,
      permissions,
    };
  }

  private toUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null,
      status: user.status as UserStatus,
      emailVerified: user.emailVerified || false,
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : new Date(user.createdAt).toISOString(),
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt.toISOString()
          : new Date(user.updatedAt).toISOString(),
    };
  }
}

export const authService = new AuthService();
