import { Router } from 'express';
import { fieldController } from '../../controllers/field.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

export const fieldRouter = Router();

fieldRouter.use(authenticate);

fieldRouter.get('/farm/:farmId', requirePermission('FARM_READ'), (req, res, next) =>
  fieldController.getFieldsForFarm(req, res, next),
);
fieldRouter.post('/farm/:farmId', requirePermission('FARM_CREATE'), (req, res, next) =>
  fieldController.createField(req, res, next),
);
fieldRouter.get('/:fieldId', requirePermission('FARM_READ'), (req, res, next) =>
  fieldController.getFieldById(req, res, next),
);
fieldRouter.patch('/:fieldId', requirePermission('FARM_UPDATE'), (req, res, next) =>
  fieldController.updateField(req, res, next),
);
fieldRouter.delete('/:fieldId', requirePermission('FARM_DELETE'), (req, res, next) =>
  fieldController.archiveField(req, res, next),
);
