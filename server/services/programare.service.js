import * as programareRepo from "../db/programare.repo.js";
import * as doctorRepo from "../db/doctor.repo.js";
import * as userRepo from "../db/user.repo.js";
import * as pacientRepo from "../db/pacient.repo.js";


///Inainte sa facem programarea, este nevoie de niste validari.

export async function is_programare_valid_date(
  id_doctor,
  data_programare
) {
    ///Verificam daca data programarii este in intervalul de lucru al doctorului

  const dateObj = new Date(data_programare);

  const zi_saptamana = dateObj.getDay(); // 0-6
  const ora = dateObj.toTimeString().slice(0, 8); // HH:MM:SS

  const intervals = await doctorRepo.getDoctorIntervals(
    id_doctor,
    zi_saptamana
  );

  if (intervals.length === 0) return false;

  ///Pt fiecare interval orar verifica daca ora programarii corespunde unui slot al doctorului respectiv
  for (const interval of intervals) {
    if (
      ora >= interval.ora_start &&
      ora < interval.ora_end
    ) {
      return true;
    }
  }

  return false;
}

///Verificam daca data programarii nu se suprapune cu o programare deja existenta pentru acelasi doctor/pacient

export async function does_programare_conflict(id_doctor, data_programare) {
  const { rows_doctor } = await programareRepo.findByDoctorIdAndDataProgramare(id_doctor, data_programare);
  const { rows_pacient } = await programareRepo.findByPacientIdAndDataProgramare(id_pacient, data_programare);

  return rows_doctor > 0 || rows_pacient > 0;
  ///In cazul in care deja exista o programare cu acelasi doctor/pacient si data, nu accepta.
}


export async function create_programare(id_pacient, id_doctor, data_programare) {
    ///Exista user, exista doctor? 
    const pacient = await pacientRepo.findByPacientId(id_pacient);
    if(!pacient) throw new Error("Nu exista acest pacient!");

    const doctor = await doctorRepo.findByDoctorId(id_doctor);
    if(!doctor) throw new Error("Nu exista acest doctor!");
    
    ///Functiile de check pentru data si conflict
    const isValidDate = await is_programare_valid_date(id_doctor, data_programare);
    if(!isValid) throw new Error("Doctor isn't working at that time!");

    const conflict = await does_programare_conflict(id_doctor, data_programare);
    if(conflict) throw new Error("Doctor/Pacient is already booked at that time!");
    
    const programare = await programareRepo.createProgramare(id_pacient, id_doctor, data_programare);
    if(!programare) throw new Error("Failed to create programare");
    return programare;
}

export async function delete_programare(id_programare) {
    const programare = await programareRepo.deleteProgramare(id_programare);
    if(!programare) throw new Error("Failed to delete programare");
    return programare;
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