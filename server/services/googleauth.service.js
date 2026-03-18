import * as userRepo from "../db/user.repo.js";
import * as pacientRepo from "../db/pacient.repo.js";

import jwt from 'jsonwebtoken';

///Foarte similar cu auth.service dar pentru Googe
///Puteam sa le pun in acelasi fisier dar e mai clean asa

import { OAuth2Client } from "google-auth-library"
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        ///verfiy email?
        return {
            email: payload.email,
            prenume: payload.given_name || '',
            nume: payload.family_name || '',
            email_verified: payload.email_verified || false
        };

    } catch (error) {
        console.error("Google token verification failed:", error);
        throw new Error("Invalid Google token");
    }
}

export async function googleAuth(googleToken) {
    try {
        const googleUser = await verifyGoogleToken(googleToken);
    
    if (!googleUser.email_verified) {
        throw new Error("Google email not verified");
    }

    let user = await userRepo.findByEmail(googleUser.email);

    ///Daca nu exista user cu acest email, cream cu provider google si parola null.
    if (!user) {
        const DEFAULT_ROLE = "pacient";
        user = await userRepo.createGoogleUser(
            googleUser.email.split('@')[0] + '_' + Date.now(), //genereaza un username unic
            'pacient', ///Rol 
            googleUser.prenume, 
            googleUser.nume,
            googleUser.email
        );

        if(!user) throw new Error("Failed to create user from Google data");

        const pacient = await pacientRepo.createPacient(user.id_utilizator);
        if(!pacient) throw new Error("Failed to create pacient profile for Google user");
    }

    ///Poate exista creat deja local
    else if (user.provider == 'local') {
        throw new Error("User already exists with local provider");
    }


    ///OK, finally putem genera un token de acces ca sa logam user
    const token = jwt.sign({id_utilizator: user.id_utilizator, rol: user.rol}, process.env.JWT_SECRET, {expiresIn: "3h"});
    return {token, user};

    }
    catch (err) {
        console.error("Google authentication failed:", err);
        throw new Error("Google authentication failed");   
    }

}

