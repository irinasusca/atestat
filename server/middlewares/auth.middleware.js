//ok
///obligatoriu, auth
import * as authService from '../services/auth.service.js';

export function requireAuth(req, res, next) {
    if(!req.user) {
        return res.status(401).json({message: "Unauthorized"});
    }
    next();
}

///verifica rolul utilizatorului pentru a permite accessul la resurse specifice
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.rol !== role) {
            return res.status(403).json({message: "Forbidden"});
        }
        next();
    };
}

///Un verify care verifica tokenul, daca e valid, pune userul in req.user

export async function authenticateUser(req, res, next) {
    try {
        let token;
        
        // Check for token in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        } 
        // Check Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // No token found
        else {
            return res.status(401).json({ message: "Authentication required" });
        }
        
        // Verify token
        const user = await authService.verify(token);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        // Attach user to request object
        req.user = user;
        
        // Continue to next middleware/controller
        next();
    } catch (err) {
        next(err);
    }
}