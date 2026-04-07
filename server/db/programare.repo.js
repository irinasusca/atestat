import pool from "../config/db.js";

///Partea de SQL pt programari

export async function createProgramare(id_pacient_programare, id_doctor_programare, data_programare) {
    const {rows} = await pool.query(
        "INSERT INTO programare (id_pacient_programare, id_doctor_programare, data_programare) VALUES ($1, $2, $3) RETURNING *",
        [id_pacient_programare, id_doctor_programare, data_programare]
    );
    return rows[0];
}

///Fetch data practic pentru pagina de programari cu detalii necesare
///Nume doctor, specializare, locatie, data_programare

export async function fetchByPacientId(id_pacient) {
  const { rows } = await pool.query(
    `
    SELECT 
        p.id_programare,
        p.data_programare,

        u.nume AS doctor_nume,
        u.prenume AS doctor_prenume,
        d.specializare AS doctor_specializare,
        d.locatie AS doctor_locatie

    FROM programare p
    JOIN doctor d 
        ON p.id_doctor_programare = d.id_doctor
    JOIN utilizator u 
        ON d.id_doctor = u.id_utilizator

    WHERE p.id_pacient_programare = $1
    ORDER BY p.data_programare ASC
    `,
    [id_pacient]
  );

  return rows;
}

///Pentru doctor, afisam programarile cu numele pacientului

export async function fetchByDoctorId(id_doctor) {
  const { rows } = await pool.query(
    `
    SELECT 
        p.id_programare,
        p.data_programare,
        u.nume AS pacient_nume,
        u.prenume AS pacient_prenume

    FROM programare p
    JOIN pacient d 
        ON p.id_pacient_programare = d.id_pacient
    JOIN utilizator u 
        ON d.id_pacient = u.id_utilizator

    WHERE p.id_doctor_programare = $1
    ORDER BY p.data_programare ASC
    `,
    [id_doctor]
  );

  return rows;
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

///Programarea unui doctor intr-o data specifica, an-zi-ora
/// 2026.03.01 15:00
export async function findByDoctorIdAndDataProgramare(id_doctor_programare, data_programare) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE data_programare = $1 AND id_doctor_programare = $2", [data_programare, id_doctor_programare]);
    return rows[0];
}

///Programarile dintr-o zi anume pentru un doctor
///adica de exemplu 2026.03.01 
export async function findByDoctorIdAndDataCalendar(id_doctor_programare, data_calendar) {
    const {rows} = await pool.query("SELECT * FROM programare WHERE id_doctor_programare = $1 AND data_programare >= $2::date AND (data_programare < $2::date + INTERVAL '1 day')", [id_doctor_programare, data_calendar]);
    return rows;
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
      AND p.data_programare::time = dp.ora_start
    );
    `,
    [id_doctor, zi_saptamana]
  );
}

///A patient shouldn't be able to book more than 4 upcoming appointments, ca la regina maria
///NOW() in bucharest, pt DB server neon
export async function countUpcomingProgramariByPacient(id_pacient) {
    const {rows} = await pool.query(
        "SELECT COUNT(*) FROM programare WHERE id_pacient_programare = $1 AND data_programare > (NOW() AT TIME ZONE 'Europe/Bucharest')",
        [id_pacient]
    );
    return parseInt(rows[0].count);
}

///For cancel
export async function deleteProgramare(id_programare) {
    const {rows} = await pool.query("DELETE FROM programare WHERE id_programare = $1 RETURNING *", [id_programare]);
    return rows[0] || null;
}

//Daca admin sterge un user, sterge si programarile implicite

export async function deleteByPacientId(id_pacient_programare) {
    const {rows} = await pool.query("DELETE FROM programare WHERE id_pacient_programare = $1", [id_pacient_programare]);
}

export async function deleteByDoctorId(id_doctor_programare) {
    const {rows} = await pool.query("DELETE FROM programare WHERE id_doctor_programare = $1", [id_doctor_programare]);
}