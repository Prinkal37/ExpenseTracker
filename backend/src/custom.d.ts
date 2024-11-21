import { User } from '@prisma/client'; // If you have a User type from Prisma, import it
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property with an optional type (if the user is not logged in)
    }
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      user?: {  // Make sure user is optional in case the token is invalid
        id: number;
        email: string;
        password: string;
      };
    }
  }
}

