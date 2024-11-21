import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];  // Assuming token is in the 'Authorization' header

  if (!token) {
    res.status(403).json({ message: 'Access denied. No token provided.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    // Attach only necessary fields to req.user
    req.user = { id: decoded.userId, email: decoded.email, password: decoded.password };

    // Pass control to the next middleware or route handler
    next();
  });
};

export default authenticateToken;
