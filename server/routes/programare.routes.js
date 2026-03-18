import { Router } from "express";
import {getPacientProgramari, getDoctorProgramari, getAvailableProgramari, getProgramareById, createProgramare, deleteProgramare} from "../controllers/programare.controller.js";
import {authenticateUser} from "../middlewares/auth.middleware.js";


const programareRoutes = Router();

///Absolut toate actiunile necesita verify
programareRoutes.use(authenticateUser);

programareRoutes.post('/available', getAvailableProgramari);

programareRoutes.get('/pacient/:id', getPacientProgramari);

programareRoutes.get('/doctor/:id', getDoctorProgramari);

programareRoutes.post('/', createProgramare);

programareRoutes.get('/:id', getProgramareById);

programareRoutes.delete('/:id', deleteProgramare);

export default programareRoutes;