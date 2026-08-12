import { prisma } from '../config/prisma';
import { Session } from '@prisma/client';

export interface CreateSessionData {
  userId: string;
  sessionTokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class SessionRepository {
  private inMemorySessions: Map<string, Session> = new Map();

  async create(data: CreateSessionData): Promise<Session> {
    try {
      return await prisma.session.create({
        data: {
          userId: data.userId,
          sessionTokenHash: data.sessionTokenHash,
          expiresAt: data.expiresAt,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch {
      const now = new Date();
      const newSession: Session = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId: data.userId,
        sessionTokenHash: data.sessionTokenHash,
        expiresAt: data.expiresAt,
        revokedAt: null,
        lastUsedAt: now,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        createdAt: now,
      };
      this.inMemorySessions.set(data.sessionTokenHash, newSession);
      return newSession;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<Session | null> {
    try {
      return await prisma.session.findUnique({
        where: { sessionTokenHash: tokenHash },
        include: { user: true },
      });
    } catch {
      return this.inMemorySessions.get(tokenHash) || null;
    }
  }

  async revoke(tokenHash: string): Promise<void> {
    const now = new Date();
    try {
      await prisma.session.update({
        where: { sessionTokenHash: tokenHash },
        data: { revokedAt: now },
      });
    } catch {
      const sess = this.inMemorySessions.get(tokenHash);
      if (sess) {
        sess.revokedAt = now;
      }
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const now = new Date();
    try {
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      });
    } catch {
      for (const sess of this.inMemorySessions.values()) {
        if (sess.userId === userId && !sess.revokedAt) {
          sess.revokedAt = now;
        }
      }
    }
  }

  async touchLastUsed(tokenHash: string): Promise<void> {
    const now = new Date();
    try {
      await prisma.session.update({
        where: { sessionTokenHash: tokenHash },
        data: { lastUsedAt: now },
      });
    } catch {
      const sess = this.inMemorySessions.get(tokenHash);
      if (sess) {
        sess.lastUsedAt = now;
      }
    }
  }
}

export const sessionRepository = new SessionRepository();
