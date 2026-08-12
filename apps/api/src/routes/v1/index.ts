import { Router } from 'express';
import { healthRouter } from './health.router';
import { authRouter } from './auth.router';
import { organizationRouter } from './organization.router';
import { farmRouter } from './farm.router';
import { fieldRouter } from './field.router';
import { zoneRouter } from './zone.router';
import { cropRouter } from './crop.router';
import { dashboardRouter } from './dashboard.router';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/orgs', organizationRouter);
v1Router.use('/farms', farmRouter);
v1Router.use('/fields', fieldRouter);
v1Router.use('/zones', zoneRouter);
v1Router.use('/crops', cropRouter);
v1Router.use('/dashboard', dashboardRouter);
