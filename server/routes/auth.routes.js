import { Router } from "express";
import {login, register, logout, verify} from "../controllers/auth.controller.js";
import { validateRegister } from "../middlewares/validateRegister.js";

const authRoutes = Router();

authRoutes.post("/login", login);

authRoutes.post("/register", validateRegister, register);

authRoutes.post("/logout", logout);

authRoutes.get("/verify", verify);

export default authRoutes;