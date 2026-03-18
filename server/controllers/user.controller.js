import * as userService from '../services/user.service.js';

/**
 * Promote user to doctor role
 * POST /api/admin/promote/doctor
 * Body: { email, specializare, cod_parafa, locatie }
 */

export async function promoteToDoctor(req, res, next) {
    try {
        const { email, specializare, cod_parafa, locatie } = req.body;
        
        if (!email || !specializare || !cod_parafa || !locatie) {
            return res.status(400).json({ 
                message: 'All fields required: email, specializare, cod_parafa, locatie' 
            });
        }
        
        const user = await userService.make_doctor(email, specializare, cod_parafa, locatie);
        
        res.status(200).json({
            message: 'User promoted to doctor successfully',
            user
        });
    } catch (err) {
        if (err.message.includes('Invalid credentials') || err.message.includes('not found')) {
            return res.status(404).json({ message: err.message });
        }
        if (err.message.includes('Failed')) {
            return res.status(500).json({ message: err.message });
        }
        next(err);
    }
}

/**
 * Promote user to admin role
 * POST /api/admin/promote/admin
 * Body: { email }
 */
export async function promoteToAdmin(req, res, next) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email required' });
        }
        
        const user = await userService.make_admin(email);
        
        res.status(200).json({
            message: 'User promoted to admin successfully',
            user
        });
    } catch (err) {
        if (err.message.includes('Invalid credentials') || err.message.includes('not found')) {
            return res.status(404).json({ message: err.message });
        }
        if (err.message.includes('Failed')) {
            return res.status(500).json({ message: err.message });
        }
        next(err);
    }
}

/**
 * Delete user and all associated data
 * DELETE /api/admin/user
 * Body: { email }
 */


export async function deleteUser(req, res, next) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email required' });
        }
        
        const result = await userService.delete_user(email);
        
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes('not found')) {
            return res.status(404).json({ message: err.message });
        }
        next(err);
    }
}