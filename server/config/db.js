import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "atestat",
    password: "password",
    port: 5432,
});

export default pool;