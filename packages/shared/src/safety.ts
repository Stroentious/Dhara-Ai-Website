/**
 * Safety Validation & Physical Control Command Contracts
 *
 * IMPORTANT ARCHITECTURAL REQUIREMENT:
 * High-voltage actuators (Pumps, Valves, Fertigation injectors) must NEVER be directly
 * triggered by the frontend browser. Commands strictly follow:
 * Frontend -> Backend API -> Auth & Authz -> Safety Validation -> Command Service -> MQTT -> Substation
 */

export type CommandType =
  | 'START_PUMP'
  | 'STOP_PUMP'
  | 'OPEN_VALVE'
  | 'CLOSE_VALVE'
  | 'START_FERTIGATION'
  | 'STOP_FERTIGATION'
  | 'EMERGENCY_SHUTDOWN';

export type CommandPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_SAFETY';

export interface CommandTarget {
  substationId: string;
  actuatorType: 'PUMP' | 'VALVE' | 'FERTIGATION';
  actuatorId: string;
  zoneId?: string;
}

export interface CommandPayload {
  commandId: string;
  commandType: CommandType;
  target: CommandTarget;
  durationSeconds?: number;
  flowRateTarget?: number;
  fertilizerMixRatio?: number;
  requestedByUserId: string;
  requestedAt: string;
  priority: CommandPriority;
}

export interface SafetyCheckResult {
  passed: boolean;
  ruleViolations: string[];
  warnings: string[];
  evaluatedAt: string;
}

export type CommandStatus =
  | 'QUEUED'
  | 'SAFETY_APPROVED'
  | 'SAFETY_REJECTED'
  | 'DISPATCHED_TO_MQTT'
  | 'ACKNOWLEDGED_BY_SUBSTATION'
  | 'EXECUTED'
  | 'FAILED'
  | 'TIMED_OUT';

export interface CommandAuditLog {
  id: string;
  commandId: string;
  organizationId: string;
  farmId: string;
  substationId: string;
  commandType: CommandType;
  requestedByUserId: string;
  safetyCheck: SafetyCheckResult;
  status: CommandStatus;
  dispatchedAt?: string;
  completedAt?: string;
  failureReason?: string;
}
