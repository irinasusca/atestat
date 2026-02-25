import {z} from 'zod';

const registerSchema = z.object({
    username: z.string().min(3).max(20).transform(v => v.trim().toLowerCase()),
    parola: z.string().min(8),
    email: z.email().transform(v => v.trim().toLowerCase()),
    prenume: z.string().min(1).max(50).transform(v => v.trim()),
    nume: z.string().min(1).max(50).transform(v => v.trim())
});

export function validateRegister(req, res, next) {
    try {
        req.body = registerSchema.parse(req.body);
        next();
    } catch (err) {
        res.status(400).json({message: err.errors.map(e => e.message).join(", ")});
    }
}