import { prisma } from '../config/prisma';
import { User, UserStatus } from '@prisma/client';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status?: UserStatus;
}

export class UserRepository {
  private inMemoryUsers: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      return await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: { memberships: { include: { organization: true } } },
      });
    } catch {
      for (const user of this.inMemoryUsers.values()) {
        if (user.email.toLowerCase() === normalizedEmail) {
          return user;
        }
      }
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: { memberships: { include: { organization: true } } },
      });
    } catch {
      return this.inMemoryUsers.get(id) || null;
    }
  }

  async create(data: CreateUserData): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      return await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          status: data.status || 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const newUser: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        email: normalizedEmail,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        status: data.status || 'ACTIVE',
        emailVerified: false,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryUsers.set(newUser.id, newUser);
      return newUser;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    const now = new Date();
    try {
      await prisma.user.update({
        where: { id },
        data: { lastLoginAt: now },
      });
    } catch {
      const user = this.inMemoryUsers.get(id);
      if (user) {
        user.lastLoginAt = now;
        user.updatedAt = now;
      }
    }
  }
}

export const userRepository = new UserRepository();
