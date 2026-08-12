import { prisma } from '../config/prisma';
import { AuditLog, AuditEventType } from '@prisma/client';

export interface LogAuditData {
  userId?: string;
  organizationId?: string;
  eventType: AuditEventType;
  ipAddress?: string;
  userAgent?: string;
  detailsJson?: string;
}

export class AuditRepository {
  private inMemoryLogs: AuditLog[] = [];

  async logEvent(data: LogAuditData): Promise<AuditLog> {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: data.userId || null,
          organizationId: data.organizationId || null,
          eventType: data.eventType,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          detailsJson: data.detailsJson || null,
        },
      });
    } catch {
      const now = new Date();
      const newLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId: data.userId || null,
        organizationId: data.organizationId || null,
        eventType: data.eventType,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        detailsJson: data.detailsJson || null,
        createdAt: now,
      };
      this.inMemoryLogs.push(newLog);
      return newLog;
    }
  }
}

export const auditRepository = new AuditRepository();
