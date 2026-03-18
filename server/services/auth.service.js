import * as userRepo from "../db/user.repo.js";
import * as pacientRepo from "../db/pacient.repo.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(email, parola) {
    const user = await userRepo.findByEmail(email);
    if(!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(parola, user.parola);
    if(!ok) throw new Error("Invalid credentials");

    const token = jwt.sign({id_utilizator: user.id_utilizator, rol: user.rol}, process.env.JWT_SECRET, {expiresIn: "3h"});
    return {token, user};
}

export async function register(username, parola, prenume, nume, email) {
    const existingUser = await userRepo.findByEmail(email);
    if(existingUser) throw new Error("Email already in use");

    const existingUsername = await userRepo.findByUsername(username);
    if(existingUsername) throw new Error("Username already in use");

    const DEFAULT_ROLE = "pacient";

    const hashedPassword = await bcrypt.hash(parola, 10);
    const user = await userRepo.createUser(username, hashedPassword, DEFAULT_ROLE, prenume, nume, email);
    if(!user) throw new Error("Registration failed");
    const pacient = await pacientRepo.createPacient(user.id_utilizator);
    if(!pacient) throw new Error("Failed to create pacient profile");
    return user;
}

export async function verify(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepo.findById(decoded.id_utilizator);
        return user;
        ///nu mai aruncam eroarea aici ci doar returnam null
    } catch (err) {
        return null;
    }
}