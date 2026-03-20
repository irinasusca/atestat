import * as googleAuthService from "../services/googleauth.service.js";


///Primim POST /api/auth/google cu Body:{token}.

export async function googleLogin(req, res, next) {
    try {
        const {token} = req.body;

        if(!token) {
            return res.status(400).json({message: "Token is required"});
        }

        const result  = await googleAuthService.googleAuth(token);
        
        ///set JWT in cookie ca la auth
        ///Acum trimitem pe Cookie la client!
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000*3 // 1 hour *3
        });

        res.status(200).json({
            message: "Google authentication successful",
            user: result.user
        });       

    } catch (err) {
        next(err);
    }
}
