import * as programareService from '../services/programare.service.js';

//get /api/programari/pacient/:id

export async function getPacientProgramari(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id_utilizator;
        
        // Admin are voie sa vada programarile oricui, pacientii doar pe ale lor
        if (parseInt(id) !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const programari = await programareService.fetch_programari_by_pacient(id);
        res.status(200).json(programari);
    } catch (err) {
        next(err);
    }
}

//get /api/programari/doctor/:id

export async function getDoctorProgramari(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id_utilizator;
        
        // Admin are voie sa vada programarile oricui, doctorii doar pe ale lor
        if (parseInt(id) !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const programari = await programareService.fetch_programari_by_doctor(id);
        res.status(200).json(programari);
    } catch (err) {
        next(err);
    }
}

//get /api/programari/:id

export async function getProgramareById(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id_utilizator;
        
        const programare = await programareService.get_programare_by_id(id);
        
        if (!programare) {
            return res.status(404).json({ message: "Programare not found" });
        }
        
        // Admin poate vedea orice programare, doctorii si pacientii doar pe cele in care sunt implicati
        if (programare.id_pacient_programare !== userId && 
            programare.id_doctor_programare !== userId && 
            req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        res.status(200).json(programare);
    } catch (err) {
        next(err);
    }
}


//post / to create programare
// Body: { id_doctor, data_programare }

export async function createProgramare(req, res, next) {
    try {
        const userId = req.user.id_utilizator;
        const { id_doctor, data_programare } = req.body;
        
        if (!id_doctor || !data_programare) {
            return res.status(400).json({ 
                message: "Missing required fields: id_doctor and data_programare" 
            });
        }
        
        const programare = await programareService.create_programare(
            userId,
            id_doctor, 
            data_programare
        );
        
        res.status(201).json(programare);
    } catch (err) {
        console.log("fufu");
        // Handle specific errors from your service
        if (err.message.includes("Nu exista")) {
            return res.status(404).json({ message: err.message });
        }
        if (err.message.includes("isn't working") || 
            err.message.includes("already booked") ||
            err.message.includes("limita de 4")) {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
}

//delete programare

export async function deleteProgramare(req, res, next) {
    try {
        console.log("Attempting to delete programare with id:", req.params.id);
        const { id } = req.params;
        const userId = req.user.id_utilizator;
        
        ///Existenta
        const programare = await programareService.get_programare_by_id(id);
        
        if (!programare) {
            return res.status(404).json({ message: "Programare not found" });
        }
        
        // Programarea trebuie sa fie a user-ului care incearca sa o stearga
        if (programare.id_pacient_programare !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Nu ai voie sa stergi aceasta programare." });
        }

        // Sa nu stearga programarile care au trecut deja
        const dataProgramare = new Date(programare.data_programare);
        const now = new Date();
        
        if (dataProgramare < now) {
            return res.status(400).json({ 
                message: "Nu poți anula o programare care a trecut deja" 
            });
        }
        
        await programareService.delete_programare(id);
        
        res.status(200).json({ message: "Programare deleted successfully" });
    } catch (err) {
        next(err);
    }
}

//post / to create programare
// Body: { id_doctor, data_programare }

export async function getAvailableProgramari(req, res, next) {
    try {
        const { locatii, specializari, zi_saptamana, data_programare } = req.body;

        if( locatii === undefined || specializari === undefined || zi_saptamana === undefined || data_programare === undefined) {
            return res.status(400).json({ 
                message: "Missing required fields: locatii, specializari, zi_saptamana, data_programare" 
            });
        }
        
        const available = await programareService.get_available_programari(
            locatii, specializari, zi_saptamana, data_programare
        );
        
        res.status(200).json(available);
    } catch (err) {
        next(err);
    }
}