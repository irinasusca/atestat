import * as userRepo from "../db/user.repo.js";
import * as pacientRepo from "../db/pacient.repo.js";
import * as doctorRepo from "../db/doctor.repo.js";
import * as programareRepo from "../db/programare.repo.js";




///User management

///Admin can turn a user into a doctor
export async function make_doctor(email, specializare, cod_parafa, locatie) {
    const user = await userRepo.findByEmail(email);
    if(!user) throw new Error("Invalid credentials");

    ///Stergem rolul vechi si programarile asociate
    if(user.rol === "pacient") {
        await pacientRepo.deletePacient(user.id_utilizator);
        await programareRepo.deleteByPacientId(user.id_utilizator);
    } else if(user.rol === "doctor") {
        await doctorRepo.deleteDoctor(user.id_utilizator);
        await programareRepo.deleteByDoctorId(user.id_utilizator);
    }


    ///Schimbam rolul la utilizator
    const updatedUser = await userRepo.updateUserRole(user.id_utilizator, "doctor");
    if(!updatedUser) throw new Error("Failed to update user role");

    ///Adaugam la doctor table
    const doctor = await doctorRepo.createDoctor(user.id_utilizator, specializare, cod_parafa, locatie);
    if(!doctor) throw new Error("Failed to create doctor profile");

    return updatedUser;
}

export async function make_admin(email) {
    const user = await userRepo.findByEmail(email);
    if(!user) throw new Error("Invalid credentials");

     ///Stergem rolul vechi si programarile asociate
    if(user.rol === "pacient") {
        await pacientRepo.deletePacient(user.id_utilizator);
        await programareRepo.deleteByPacientId(user.id_utilizator);
    } else if(user.rol === "doctor") {
        await doctorRepo.deleteDoctor(user.id_utilizator);
        await programareRepo.deleteByDoctorId(user.id_utilizator);
    }

    ///Aici e ok daca doar il facem admin ca rol
    const updatedUser = await userRepo.updateUserRole(user.id_utilizator, "admin");
    if(!updatedUser) throw new Error("Failed to update user role");
    return updatedUser;
}

///Admin poate sterge un user si programarile lui
///gen daca e cascade bruh de ce am facut asta

export async function delete_user(email) {
    const user = await userRepo.findByEmail(email);
    if(!user) throw new Error("User not found");

    if(user.rol === "pacient") {
        await programareRepo.deleteByPacientId(user.id_utilizator);
    } else if(user.rol === "doctor") {
        await programareRepo.deleteByDoctorId(user.id_utilizator);
    }

    await userRepo.deleteUser(user.id_utilizator);
    return {message: "User and associated programari deleted successfully"};
}