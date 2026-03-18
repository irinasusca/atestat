import { Router } from "express";
import { requireRole, authenticateUser } from "../middlewares/auth.middleware.js";
import { udpateDoctorOrar, getDoctorOrar} from "../controllers/doctor.controller.js";

const doctorRoutes = Router();

///toate actiunile necesita verify
///si require role doctor
doctorRoutes.use(authenticateUser, requireRole("doctor"));

///get oorar
doctorRoutes.get('/orar/:id_doctor', getDoctorOrar);

///update orar cu put fiindca dacem update/delete
doctorRoutes.put('/orar', udpateDoctorOrar);

export default doctorRoutes;