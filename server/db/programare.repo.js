import pool from "../config/db.js";

///Partea de SQL pt programari

export async function createProgramare(id_pacient_programare, id_doctor_programare, data_programare) {
    const {rows} = await pool.query(
        "INSERT INTO programare (id_pacient, id_doctor, data_programare) VALUES ($1, $2, $3) RETURNING *",
        [id_pacient_programare, id_doctor_programare, data_programare]
    );
    return rows[0];
}

export async function findById(id_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE id_programare = $1", [id_programare]);
    return rows[0];
}

export async function findByPacientId(id_pacient_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE id_pacient_programare = $1", [id_pacient_programare]);
    return rows;
}

export async function findByDoctorId(id_doctor_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE id_doctor_programre = $1", [id_doctor_programare]);
    return rows;
}

export async function findByDataProgramare(data_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE data_programare = $1", [data_programare]);
    return rows[0];
}

export async function findByDoctorIdAndDataProgramare(id_doctor_programare, data_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE data_programare = $1 AND id_doctor_programare = $2", [data_programare, id_doctor_programare]);
    return rows[0];
}

export async function findByPacientIdAndDataProgramare(id_pacient_programare, data_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE data_programare = $1 AND id_pacient_programare = $2", [data_programare, id_pacient_programare]);
    return rows[0];
}

///For when a doctor modifies their schedule and we need to delete programari that are no longer valid
export async function deleteInvalidForDay(id_doctor, zi_saptamana) {
  await pool.query(
    `
    DELETE FROM programare p
    WHERE p.id_doctor_programare = $1
    AND EXTRACT(DOW FROM p.data_programare) = $2
    AND NOT EXISTS (
      SELECT 1
      FROM doctor_program dp
      WHERE dp.id_doctor = p.id_doctor_programare
      AND dp.zi_saptamana = $2
      AND p.data_programare::time >= dp.ora_start
      AND p.data_programare::time < dp.ora_end
    );
    `,
    [id_doctor, zi_saptamana]
  );
}

///For cancel
export async function deleteProgramare(id_programare) {
    await pool.query("DELETE FROM programare WHERE id_programare = $1", [id_programare]);


}
