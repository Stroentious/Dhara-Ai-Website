import { Router } from 'express';
import { farmController } from '../../controllers/farm.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

export const farmRouter = Router();

farmRouter.use(authenticate);

farmRouter.get('/', requirePermission('FARM_READ'), (req, res, next) =>
  farmController.getFarms(req, res, next),
);
farmRouter.post('/', requirePermission('FARM_CREATE'), (req, res, next) =>
  farmController.createFarm(req, res, next),
);
farmRouter.get('/:farmId', requirePermission('FARM_READ'), (req, res, next) =>
  farmController.getFarmById(req, res, next),
);
farmRouter.patch('/:farmId', requirePermission('FARM_UPDATE'), (req, res, next) =>
  farmController.updateFarm(req, res, next),
);
farmRouter.delete('/:farmId', requirePermission('FARM_DELETE'), (req, res, next) =>
  farmController.archiveFarm(req, res, next),
);
