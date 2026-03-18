import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true
};

import authRoutes from "./routes/auth.routes.js";
import programareRoutes from "./routes/programare.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
///nu inteleg de ce, dar doctor trebuie sa fie deasupra la restul
///altfel da 404 orice request catre doctor routes

app.use("/api/doctor", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/programari", programareRoutes);
app.use("/api/admin", userRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "hello from serveer"});
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default app;
