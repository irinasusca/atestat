import pool from "../config/db.js";

///Aici partea de SQL (postgres) pentru user handling

export async function findByEmail(email) {
    const {rows} = await pool.query("SELECT * FROM utilizator WHERE email = $1", [email]);
    return rows[0];
}

///Creaaza utilizator si returneaza row-ul sau
///default utilizator -> pacient, se poate schimba doar de admin

export async function createUser(username, parola, rol, prenume, nume, email) {
    const {rows} = await pool.query(
        "INSERT INTO utilizator (username, parola, rol, prenume, nume, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, parola, rol, prenume, nume, email]
    );
    return rows[0];
}

///Pentru Google user nu avem parola, si specificam provider google ca sa ne lase cu parola NULL.

export async function createGoogleUser(username, rol, prenume, nume, email) {
    const {rows} = await pool.query(
        "INSERT INTO utilizator (username, rol, prenume, nume, email, provider, parola) VALUES ($1, $2, $3, $4, $5, 'google', NULL) RETURNING *",
        [username, rol, prenume, nume, email]
    );
    return rows[0];
}

///Find dupa niste chestii

export async function findById(id_utilizator) {
    const {rows} = await pool.query("SELECT * FROM utilizator WHERE id_utilizator = $1", [id_utilizator]);
    return rows[0];
}

export async function findByUsername(username) {
    const {rows} = await pool.query("SELECT * FROM utilizator WHERE username = $1", [username]);
    return rows[0];
}


///Sterge user

export async function deleteUser(id_utilizator) {
    await pool.query("DELETE FROM utilizator WHERE id_utilizator = $1", [id_utilizator]);
}

///Mofidica rolul unui user (de catre admin)

export async function updateUserRole(id_utilizator, rol) {
    const {rows} = await pool.query(
        "UPDATE utilizator SET rol = $2 WHERE id_utilizator = $1 RETURNING *",
        [id_utilizator, rol]
    );
    return rows[0];
}