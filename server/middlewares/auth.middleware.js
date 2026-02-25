//ok
///obligatoriu, auth
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

