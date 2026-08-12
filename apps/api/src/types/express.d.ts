import { AuthenticatedUserContext } from '@dhara/shared';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserContext;
      rawSessionToken?: string;
    }
  }
}
