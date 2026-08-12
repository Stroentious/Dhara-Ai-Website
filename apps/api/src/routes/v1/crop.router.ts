import { Router } from 'express';
import { cropController } from '../../controllers/crop.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

export const cropRouter = Router();

cropRouter.use(authenticate);

cropRouter.get('/', requirePermission('FARM_READ'), (req, res, next) =>
  cropController.getAllCrops(req, res, next),
);
cropRouter.get('/field/:fieldId/cycles', requirePermission('FARM_READ'), (req, res, next) =>
  cropController.getCropCyclesForField(req, res, next),
);
cropRouter.post('/field/:fieldId/cycles', requirePermission('FARM_CREATE'), (req, res, next) =>
  cropController.createCropCycle(req, res, next),
);
