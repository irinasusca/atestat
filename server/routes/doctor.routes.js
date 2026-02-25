import { Router } from "express";
import {login, register, logout, verify} from "../controllers/doctor.controller.js";
import { validateRegister } from "../middlewares/validateRegister.js";

///

const doctorRoutes = Router();

doctorRoutes.post("/login", login);

doctorRoutes.post("/register", validateRegister, register);



export default doctorRoutes;