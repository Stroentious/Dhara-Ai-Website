import { Router } from 'express';
import { dashboardController } from '../../controllers/dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/metrics', (req, res, next) => dashboardController.getMetrics(req, res, next));
