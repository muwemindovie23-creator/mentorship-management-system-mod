import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export interface AuditEntry {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Record an admin action for the audit log.
 * Never throws — a logging failure must not break the action itself.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        metadata: entry.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error(`[audit] Failed to log "${entry.action}"`, error);
  }
}
