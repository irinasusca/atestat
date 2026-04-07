import * as doctorService from '../services/doctor.service.js';


///Partea de orar.
//get /api/doctor/orar/:id

export async function getDoctorOrar(req, res, next) {
    try {
        const { id_doctor } = req.params;
        const userId = req.user.id_utilizator;
        
        // Admin are voie sa vada orar oricui, doctorii doar pe ale lor
        if (parseInt(id_doctor) !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const orar = await doctorService.get_doctor_program(id_doctor);
        res.status(200).json(orar);
    } catch (err) {
        next(err);
    }
}

//put /api/doctor/orar/ (idempotent, adica faci de doua ori se intampla acelasi lucru)

export async function udpateDoctorOrar(req, res, next) {
    try {
        const { id_doctor, zi_saptamana, ore_noi } = req.body;
        const userId = req.user.id_utilizator;
        
        if(!id_doctor || !zi_saptamana===undefined || !Array.isArray(ore_noi)) {
            return res.status(400).json({ message: "Missing required fields: id_doctor, zi_saptamana, ore_noi" });
        }

        // Admin are voie sa vada programarile oricui, doctorii doar pe ale lor
        if (parseInt(id_doctor) !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        if (zi_saptamana < 0 || zi_saptamana > 6) {
            return res.status(400).json({ 
                message: "zi_saptamana must be between 0 and 6" 
            });
        }
        
        await doctorService.update_doctor_program(id_doctor, zi_saptamana, ore_noi);
        res.status(200).json({ message: "Doctor program updated successfully",
            zi_saptamana,
            ore_noi
        });
    } catch (err) {
        next(err);
    }
}

