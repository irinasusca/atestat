import pool from "../config/db.js";

///Aici partea de SQL (postgres) pentru pacient handling

///Creeaza pacient cu id_utilizator ca 

export async function createPacient(id_utilizator) {
    const {rows} = await pool.query(
        "INSERT INTO pacient (id_pacient) VALUES ($1) RETURNING *",
        [id_utilizator]
    );
    return rows[0];
}

export async function findByPacientId(id_pacient) {
    const {rows} = await pool.query("SELECT * FROM pacient WHERE id_pacient = $1", [id_pacient]);
    return rows[0];
}

//Sterge pacient (dar nu sterge utilizator)

export async function deletePacient(id_pacient) {
    await pool.query("DELETE FROM pacient WHERE id_pacient = $1", [id_pacient]);
}
