import { Router } from 'express';
import { zoneController } from '../../controllers/zone.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

export const zoneRouter = Router();

zoneRouter.use(authenticate);

zoneRouter.get('/field/:fieldId', requirePermission('FARM_READ'), (req, res, next) =>
  zoneController.getZonesForField(req, res, next),
);
zoneRouter.post('/field/:fieldId', requirePermission('FARM_CREATE'), (req, res, next) =>
  zoneController.createZone(req, res, next),
);
zoneRouter.get('/:zoneId', requirePermission('FARM_READ'), (req, res, next) =>
  zoneController.getZoneById(req, res, next),
);
zoneRouter.patch('/:zoneId', requirePermission('FARM_UPDATE'), (req, res, next) =>
  zoneController.updateZone(req, res, next),
);
zoneRouter.delete('/:zoneId', requirePermission('FARM_DELETE'), (req, res, next) =>
  zoneController.archiveZone(req, res, next),
);
