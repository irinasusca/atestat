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

const app = express();


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "hello from serveer"});
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default app;
