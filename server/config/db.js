import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/*const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "atestat",
    password: "password",
    port: 5432,
});*/

///ne conectam la neon, care ne face host la db

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;