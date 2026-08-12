import { HealthCheckResponse } from '@dhara/shared';

export class HealthService {
  public checkHealth(): HealthCheckResponse {
    return {
      success: true,
      service: 'dhara-api',
      status: 'healthy',
    };
  }
}
