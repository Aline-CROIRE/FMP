// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRole } from '../entity/User';

export interface AuthRequest extends Request {
    user?: { id: string; name: string; role: UserRole; };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
    
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { user: any };
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === UserRole.ADMIN) {
        next();
    } else {
        res.status(403).json({ message: 'User is not authorized as an admin.' });
    }
};



// --- NEW: Middleware to authorize Program Managers ---
export const authorizeProgramManager = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Allows access if the user is either a Program Manager OR an Admin (since Admins can do anything)
    if (req.user && (req.user.role === UserRole.PROGRAM_MANAGER || req.user.role === UserRole.ADMIN)) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a Program Manager.' });
    }
};