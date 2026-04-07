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

///Pentru filterele de pe pagina de programari
///Daca nu e selectat nimic, returnam toti doctorii
///Pentru restul, selecita e optionala asa ca construim un query dinamic

///ne trebuie sa afisam detalii despre doctor si orele disponibile acestuia
export async function findByFilters(locatii = [], specializari = []) {
    let query = "SELECT * FROM doctor WHERE 1=1";
    const values = [];
    let index = 1;

    if (locatii.length > 0) {
        query += ` AND locatie = ANY($${index})`;
        values.push(locatii);
        index++;
    }

    if (specializari.length > 0) {
        query += ` AND specializare = ANY($${index})`;
        values.push(specializari);
        index++;
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

//acum amestec dintre findByFilters si getDoctorSlotsByDay ca sa facem mai putine queries
///trebuie sa aducem si uitilzator.nume si prenume
///functie lunga dar optimizeaza de fapt fiindca inseamna mai putine queries separate

export async function findDoctorsWithAvailableSlots(
  locatii = [],
  specializari = [],
  zi_saptamana,
  data_calendar
) {
  let values = [];
  let index = 1;

  let filters = "";

  if (locatii && locatii.length > 0) {
    filters += ` AND d.locatie = ANY($${index})`;
    values.push(locatii);
    index++;
  }

  if (specializari && specializari.length > 0) {
    filters += ` AND d.specializare = ANY($${index})`;
    values.push(specializari);
    index++;
  }

  values.push(zi_saptamana);
  values.push(data_calendar);

  //console.log("Executing query with values:", values);
  //console.log("date data:", data_calendar, zi_saptamana);

  const { rows } = await pool.query(
    `
    SELECT 
        d.id_doctor,
        d.specializare,
        d.locatie,
        u.nume,
        u.prenume,
        dp.ora_start,
        dp.ora_end
    FROM doctor d
    JOIN utilizator u ON u.id_utilizator = d.id_doctor
    JOIN doctor_program dp 
        ON dp.id_doctor = d.id_doctor
    WHERE dp.zi_saptamana = $${index}
      ${filters}
      AND ($${index + 1}::date + dp.ora_start) > (NOW() AT TIME ZONE 'Europe/Bucharest')
      AND NOT EXISTS (
        SELECT 1
        FROM programare p
        WHERE p.id_doctor_programare = d.id_doctor
          AND p.data_programare::date = $${index + 1}::date
          AND p.data_programare::time = dp.ora_start
      )
    ORDER BY d.id_doctor, dp.ora_start
    `,
    values
  );

  //console.log(rows);
  return rows;
}

/* aduce de forma asta:
{
    id_doctor: 7,
    specializare: "Cardiolog",
    locatie: "Marasti",
    nume: "Popescu",
    prenume: "Ion",
    ora_start: "08:00:00",
    ora_end: "09:00:00"
  },
  */


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

///Gasim available slots pentru un doctor intr-o zi anume. Adica interactionam si cu programare table.
/// IMPORTANT - NU LASA PROGRAMARI CARE SUNT INAINTE DE CURRENT

/// a trebuit sa schimbam in (NOW() AT TIME ZONE 'Europe/Bucharest') pt DB prod
export async function getDoctorSlotsByDay(
  id_doctor,
  zi_saptamana,
  data_calendar
) {
  const { rows } = await pool.query(
    `
    SELECT dp.ora_start, dp.ora_end
    FROM doctor_program dp
    WHERE dp.id_doctor = $1
      AND dp.zi_saptamana = $2
      AND($3::date + dp.ora_start) > (NOW() AT TIME ZONE 'Europe/Bucharest')
      AND NOT EXISTS (
        SELECT 1
        FROM programare p
        WHERE p.id_doctor_programare = dp.id_doctor
          AND p.data_programare::date = $3::date
          AND p.data_programare::time = dp.ora_start::time
      )
    ORDER BY dp.ora_start
    `,
    [id_doctor, zi_saptamana, data_calendar]
  );

  return rows;
}

///Sterge doctor (dar nu sterge utilizator)

export async function deleteDoctor(id_doctor) {
    await pool.query("DELETE FROM doctor WHERE id_doctor = $1", [id_doctor]);
}
