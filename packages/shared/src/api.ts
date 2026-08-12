/**
 * Standardized API Response Contracts
 */

export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ErrorDetail;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface HealthCheckResponse {
  success: boolean;
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version?: string;
  timestamp?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
