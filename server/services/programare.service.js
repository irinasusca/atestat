import * as programareRepo from "../db/programare.repo.js";
import * as doctorRepo from "../db/doctor.repo.js";
import * as userRepo from "../db/user.repo.js";
import * as pacientRepo from "../db/pacient.repo.js";

///Inainte sa facem programarea, este nevoie de niste validari.
///Verifica ca ora programarii sa fie DUPA ora curenta din prezent 
export async function is_programare_valid_date(
  id_doctor,
  data_programare
) {
  const dateObj = new Date(data_programare);

  const zi_saptamana = dateObj.getDay();
  const data_calendar = dateObj.toISOString().split("T")[0];
  const ora = dateObj.toTimeString().slice(0, 8);

  // enforce :00
  if (!ora.endsWith(":00:00")) return false;

  ///aducem toate sloturile disponibile ale doctorului din ziua respectiva
  const availableSlots = await doctorRepo.getDoctorSlotsByDay(
    id_doctor,
    zi_saptamana,
    data_calendar
  );

  ///daca un loc exista, si nu este programare, atunci proceed. 
  ///practic daca gaseste conflict la nivelul doctorului returneaza fals.
  console.log("Available slots for doctor", id_doctor, "on", data_calendar, ":", availableSlots);
  return availableSlots.some(slot => slot.ora_start === ora);
}

///Verificam daca data programarii nu se suprapune cu o programare deja existenta pentru acelasi doctor/pacient
///Deja facem asta pt doctor in is_programare_valid_date dar nu strica sa facem un check in plus :)
export async function does_programare_conflict(id_doctor, id_pacient, data_programare) {
  const rows_doctor = await programareRepo.findByDoctorIdAndDataProgramare(id_doctor, data_programare);
  if(!rows_doctor) return false; ///Daca nu exista programari pentru doctor in data respectiva, atunci nu e conflict.

  const rows_pacient = await programareRepo.findByPacientIdAndDataProgramare(id_pacient, data_programare);
  if(!rows_pacient) return false; ///Daca nu exista programari pentru pacient in data respectiva, atunci nu e conflict.
}


export async function create_programare(id_pacient, id_doctor, data_programare) {

    console.log("Creating programare with pacient:", id_pacient, "doctor:", id_doctor, "data:", data_programare);
    ///Exista user, exista doctor? 
    const pacient = await pacientRepo.findByPacientId(id_pacient);
    if(!pacient) throw new Error("Nu exista acest pacient!");

    const doctor = await doctorRepo.findByDoctorId(id_doctor);
    if(!doctor) throw new Error("Nu exista acest doctor!");

    ///Un pacient nu ar trebui sa aiba mai mult de 4 programari viitoare, pentru a preveni abuzul
    const upcomingCount = await programareRepo.countUpcomingProgramariByPacient(id_pacient);
    if(upcomingCount >= 4) throw new Error("Nu poti avea mai mult de 4 programari viitoare!");
    
    ///Functiile de check pentru data si conflict
    const isValidDate = await is_programare_valid_date(id_doctor, data_programare);
    if(!isValidDate) throw new Error("Doctor isn't working at that time!");

    const conflict = await does_programare_conflict(id_doctor, id_pacient, data_programare);
    if(conflict) throw new Error("Doctor/Pacient is already booked at that time!");
    
    const programare = await programareRepo.createProgramare(id_pacient, id_doctor, data_programare);
    if(!programare) throw new Error("Failed to create programare");
    return programare;
}

export async function delete_programare(id_programare) {
    return await programareRepo.deleteProgramare(id_programare);
}


export async function get_programari_by_pacient(id_pacient) {
    const programari = await programareRepo.findByPacientId(id_pacient);
    if(!programari) throw new Error("No programari found for this pacient");
    return programari;
}

export async function get_programari_by_doctor(id_doctor) {
    const programari = await programareRepo.findByDoctorId(id_doctor);
    if(!programari) throw new Error("No programari found for this doctor");
    return programari;
}

export async function get_programare_by_id(id_programare) {
    const programare = await programareRepo.findById(id_programare);
    if(!programare) throw new Error("No programare found with this id");
    return programare;
}

///Functie pentru afisarea programarilor pentru pacient
///Aduce si doctor_nume, doctor_prenume, doctor_specializare, doctor_locatie

export async function fetch_programari_by_pacient(id_pacient) {
    const programari = await programareRepo.fetchByPacientId(id_pacient);
    if(!programari) throw new Error("No programari found for this pacient");
    return programari;
}


///La fel doar ca pentru doctori, aduce doar pacient_nume si pacient_prenume

export async function fetch_programari_by_doctor(id_doctor) {
    const programari = await programareRepo.fetchByDoctorId(id_doctor);
    if(!programari) throw new Error("No programari found for this doctor");
    return programari;
}

///acum afisarea sloturilor disponibile intr-o zi pentru fiecare doctor
///bazat pe filtrele selectate de utilizatorul pacient

export async function get_available_programari(
  locatii,
  specializari,
  zi_saptamana,
  data_programare
) {
  // Single optimized DB call
  const rows = await doctorRepo.findDoctorsWithAvailableSlots(
    locatii,
    specializari,
    zi_saptamana,
    data_programare
  );

  // Fiindca fiecare slot e doar o ora si vine ca row diferit, le grupam impreuna.
  const doctorsMap = {};

  for (const row of rows) {
    if (!doctorsMap[row.id_doctor]) {
      doctorsMap[row.id_doctor] = {
        doctor_id: row.id_doctor,
        doctor_nume: row.nume,
        doctor_prenume: row.prenume,
        doctor_specializare: row.specializare,
        doctor_locatie: row.locatie,
        slots: []
      };
    }

    doctorsMap[row.id_doctor].slots.push(
      `${row.ora_start.slice(0,5)}-${row.ora_end.slice(0,5)}`
    );
  }

  return Object.values(doctorsMap);
}