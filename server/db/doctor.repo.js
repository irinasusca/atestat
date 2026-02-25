import pool from "../config/db.js";

///Aici partea de SQL (postgres) pentru doctor handling
///Unele actiuni sunt specifice doctorilor asa ca pentru modularitate nu le punem in user.repo



///User este facut doctor de catre admin
///!Inainte, stergem din pacient
export async function createDoctor(id_utilizator, specializare, cod_parafa, locatie) {
    const {rows} = await pool.query(
        "INSERT INTO doctor (id_doctor, specializare, cod_parafa, locatie) VALUES ($1, $2, $3, $4) RETURNING *",
        [id_utilizator, specializare, cod_parafa, locatie]
    );
    return rows[0];
    
}

///Find pentru display la pagina de programari cu filtrare


export async function findBySpecializare(specializare) {
    const {rows} = await pool.query("SELECT * FROM doctor WHERE specializare = $1", [specializare]);
    return rows;
}


export async function findByDoctorId(id_doctor) {
    const {rows} = await pool.query("SELECT * FROM doctor WHERE id_doctor = $1", [id_doctor]);
    return rows[0];
}

export async function findByLocatie(locatie) {
    const {rows} = await pool.query("SELECT * FROM doctor WHERE locatie = $1", [locatie]);
    return rows;
}

///Handle la doctor_program, tot aici, doctorii pot adauga interval orar de lucru

export async function addProgramDoctor(id_doctor, zi_saptamana, ora_start, ora_end) {
    await pool.query(
        "INSERT INTO doctor_program (id_doctor, zi_saptamana, ora_start, ora_end) VALUES ($1, $2, $3, $4)",
        [id_doctor, zi_saptamana, ora_start, ora_end]
    );
}

///Cand modifica o zi respectiva, sterge si adauga iar, pentru simplitate

export async function updateProgramDoctor(id_doctor, zi_saptamana) {
    await pool.query("DELETE FROM doctor_program WHERE id_doctor = $1 AND zi_saptamana = $2", [id_doctor, zi_saptamana]);
}

///Find program dupa doctor id

export async function findProgramByDoctorId(id_doctor) {
    const {rows} = await pool.query("SELECT * FROM doctor_program WHERE id_doctor = $1", [id_doctor]);
    return rows;
}

///Pentru pagina de programari, ca sa vedem disponibilitatea doctorului
///Returneaza intervale orare dintr-o zi pe care ulterior o verificam cu programarile deja existente

export async function getDoctorIntervals(id_doctor, zi_saptamana) {
  const { rows } = await pool.query(
    `SELECT ora_start, ora_end
     FROM doctor_program
     WHERE id_doctor = $1
       AND zi_saptamana = $2`,
    [id_doctor, zi_saptamana]
  );

  return rows;
}


///Sterge doctor (dar nu sterge utilizator)

export async function deleteDoctor(id_doctor) {
    await pool.query("DELETE FROM doctor WHERE id_doctor = $1", [id_doctor]);
}
