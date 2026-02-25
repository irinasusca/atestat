import { Router } from "express";
import {} from "../controllers/programare.controller.js";

const programareRoutes = Router();

programareRoutes.get("/get_programari", get_programari);
programareRoutes.post("/create_programare", create_programare);

export default programareRoutes;