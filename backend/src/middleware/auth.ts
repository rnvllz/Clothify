import { Request, Response, NextFunction } from 'express';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const adminToken = req.header('x-admin-token');
  
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  next();
};
