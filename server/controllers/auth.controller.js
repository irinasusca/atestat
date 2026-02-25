import { httpUrl } from "zod";
import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
    try 
    {
        const {email, parola} = req.body;
        const {token, user} = await authService.login(email, parola);
        if (!user) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        

        ///Acum trimitem pe Cookie la client!
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({token, user});

    } catch (err) {
        next(err);
    }
}

export async function register(req, res, next) {
    try 
    {
        const {username, parola, prenume, nume, email} = req.body;
        const user = await authService.register(username, parola, prenume, nume, email);
        if (!user) {
            return res.status(400).json({message: "Registration failed"});
        }


        res.status(201).json(user);
    }
    catch (err) {
    next(err); 
    }
}

export async function verify(req, res, next) {
    try {
        let token;

        ///Verificam daca exista coookie
        if(req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            return res.status(401).json({message: "Try Harder"});
        }

        const user = await authService.verify(token);
        
        if(!user) {
            return res.status(401).json({message: "Invalid token"});
        }

        res.status(200).json({user});
        
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10000), 
            httpOnly: true,
        });

        res.status(200).json({message: "Logged out successfully"});
        
    } catch (err) {
        next(err);
    }

}