import { Router } from 'express';
import { organizationController } from '../../controllers/organization.controller';
import { authenticate } from '../../middlewares/auth.middleware';

export const organizationRouter = Router();

organizationRouter.post('/', authenticate, (req, res, next) =>
  organizationController.createOrganization(req, res, next),
);
organizationRouter.get('/my-orgs', authenticate, (req, res, next) =>
  organizationController.getMyOrganizations(req, res, next),
);
