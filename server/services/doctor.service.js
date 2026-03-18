import { parse } from "node:path";
import * as doctorRepo from "../db/doctor.repo.js";
import * as programareRepo from "../db/programare.repo.js";



export async function delete_doctor(id_doctor) {
    const doctor = await doctorRepo.deleteDoctor(id_doctor);
    if(!doctor) throw new Error("Failed to delete doctor");
    return doctor;
}

export async function get_doctor_by_specializare(specializare) {
    const doctor = await doctorRepo.findBySpecializare(specializare);
    if(!doctor) throw new Error("No doctor found for this specializare");
    return doctor;
}

export async function get_doctor_by_locatie(locatie) {
    const doctor = await doctorRepo.findByLocatie(locatie);
    if(!doctor) throw new Error("No doctor found for this locatie");
    return doctor;
}

export async function get_doctor_by_id(id_doctor) {
    const doctor = await doctorRepo.findByDoctorId(id_doctor);
    if(!doctor) throw new Error("No doctor found for this id");
    return doctor;
}

export async function get_programari_by_doctor(id_doctor) {
    const programari = await programareRepo.findByDoctorId(id_doctor);
    if(!programari) throw new Error("No programari found for this doctor");
    return programari;
}

///Partea cu intervale de lucru disponibile

export async function get_available_slots(id_doctor, zi_saptamana, data_programare) {

  ///Data calendar e de forma 2026.03.01
  ///folosim getDoctorSlotsByDay din db care se ocupa singura de filtrare
  const slots = await doctorRepo.getDoctorSlotsByDay(id_doctor, zi_saptamana, data_programare);

  return slots.map(slot => 
    `${slot.ora_start.slice(0,5)}-${slot.ora_end.slice(0,5)}`
  );

  ///Returneaza frumos doar intervale gen 09:00-10:00 
  
}

///filtrarea de doctori care se va apela in programare.

export async function find_doctors_by_filters(locatii, specializari) {
    const doctors = await doctorRepo.findByFilters(locatii, specializari);
    if(!doctors) throw new Error("No doctors found for these filters");
    return doctors;
}

///Acum modificarea orarului personal al doctorului, adica modificarea intervalelor de lucru
///Programarile care nu mai respecta intervalul sunt filtrate automat prin deleteInvalidForDay din programare.repo :)

///Cand doctorul adauga un interval nou pentru o zi, stergem din doctor_program intervalele existente din ziua respectiva
///Adaugam in locul lor pe cele noi, iar apoi stergem programarile care nu mai respecta noul interval

export async function get_doctor_program(id_doctor) {
  const program = await doctorRepo.findProgramByDoctorId(id_doctor);
  return program;
}

export async function update_doctor_program(id_doctor, zi_saptamana, ore_noi) {
    await doctorRepo.updateProgramDoctor(id_doctor, zi_saptamana); ///Sterge intervalele existente din ziua respectiva
    ///loop prin array-ul de intervale noi si adauga in doctor_program
    for(const ora_start of ore_noi) {

        // Ora fixa
        if (!/^\d{2}:00$/.test(ora_start)) {
            throw new Error("Ora trebuie sa fie fixa (ex: 08:00, 14:00)");
        }

        if (ora_start < "08:00" || ora_start > "18:00") {
        throw new Error("Ora trebuie sa fie intre 08:00 si 18:00");
        }
        ///Constraints pentru ore exista deja in baza de date, dar e bine sa avem si aici.

        ///Calcula ora_end sa fie exact o ora dupa ora_start.
        const ora_end = new Date(`1970-01-01T${ora_start}`);
        ora_end.setHours(ora_end.getHours() + 1);

        const formatted_end = ora_end.toTimeString().slice(0, 5);

        await doctorRepo.addProgramDoctor(id_doctor, zi_saptamana, ora_start, formatted_end);
    }
    
    await programareRepo.deleteInvalidForDay(id_doctor, zi_saptamana);
}
