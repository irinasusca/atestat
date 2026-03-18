import { Router } from "express";
import { requireRole, authenticateUser } from "../middlewares/auth.middleware.js";
import {promoteToDoctor, promoteToAdmin, deleteUser} from "../controllers/user.controller.js";

const userRoutes = Router();

///toate actiunile necesita verify
userRoutes.use(authenticateUser, requireRole("admin"));

///admin routes aici

///promote to doctor
userRoutes.post("/promote/doctor", promoteToDoctor);

///promote to admin
userRoutes.post("/promote/admin", promoteToAdmin);

///delete user
userRoutes.delete("/user", deleteUser);


export default userRoutes;