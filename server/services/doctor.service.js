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
    const doctor = await doctorRepo.findByIdDoctor(id_doctor);
    if(!doctor) throw new Error("No doctor found for this id");
    return doctor;
}

export async function get_programari_by_doctor(id_doctor) {
    const programari = await programareRepo.findByDoctorId(id_doctor);
    if(!programari) throw new Error("No programari found for this doctor");
    return programari;
}

///Partea cu intervale de lucru disponibile

//Dintr-un ora_start si ora_end genereaza array intervale de cate o ora
///Ulterior le comparam cu programarile deja existente si afisam doar cele disponibile

export async function get_available_slots(id_doctor, zi_saptamana) {
  const intervals = await doctorRepo.getDoctorIntervals(
    id_doctor,
    zi_saptamana
  );

  const slots = [];

  for (const interval of intervals) {
    let start = new Date(`1970-01-01T${interval.ora_start}`);
    const end = new Date(`1970-01-01T${interval.ora_end}`);

    while (start < end) {
      const next = new Date(start);
      next.setHours(start.getHours() + 1);

      if (next <= end) {
        slots.push(
          `${start.toTimeString().slice(0,5)}-${next
            .toTimeString()
            .slice(0,5)}`
        );
      }

      start = next;
    }
  }

  return slots;
}

///Acum modificarea orarului personal al doctorului, adica modificarea intervalelor de lucru
///Programarile care nu mai respecta intervalul sunt filtrate automat prin deleteInvalidForDay din programare.repo :)

///Cand doctorul adauga un interval nou pentru o zi, stergem din doctor_program intervalele existente din ziua respectiva
///Adaugam in locul lor pe cele noi, iar apoi stergem programarile care nu mai respecta noul interval

export async function update_doctor_program(id_doctor, zi_saptamana, ora_start, ora_end) {
    await doctorRepo.updateProgramDoctor(id_doctor, zi_saptamana);
    await doctorRepo.addProgramDoctor(id_doctor, zi_saptamana, ora_start, ora_end);
    await programareRepo.deleteInvalidForDay(id_doctor, zi_saptamana);
}
