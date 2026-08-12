import { Request, Response } from 'express';
import { HealthService } from '../services/health.service.js';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public getHealth = (_req: Request, res: Response): void => {
    const healthStatus = this.healthService.checkHealth();
    res.status(200).json(healthStatus);
  };
}
