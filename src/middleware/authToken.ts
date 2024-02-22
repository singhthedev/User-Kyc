import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environmentConfig } from '../config/envConfig';


const jwtSecret = environmentConfig.JWT_SECRET || 'thisisprivate';

export interface UserType {
  projects: any;
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

const isUserType = (decodedToken: any): decodedToken is UserType => {
  return typeof decodedToken === 'object' && decodedToken !== null && 'userId' in decodedToken;
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      if (!authHeader) {
        return res.status(401).json({
          message: 'Authorization header not found',
          success: false,
        });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          message: 'You are not authenticated!',
          success: false,
        });
      }
      
      const decodedToken = jwt.verify(token, jwtSecret)
      if (!isUserType(decodedToken)) {
        return res.status(401).json({
          message: 'Invalid token!',
          success: false,
        });
      }
      req.user = decodedToken;
      next();

    }
  } catch (error) {
    console.error('Error in verifying token', error);
    res.status(500).json({ message: 'Error in verifying token', error });
    return;
  }
}

export { verifyToken };
