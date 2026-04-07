import './style.css';
import { updateNavBar, requireAuth, API_URL } from './auth';

// State
let selectedSpecialitati: string[] = [];
let selectedLocatii: string[] = [];
let selectedDate: Date = new Date();
let availableDoctors: any[] = [];
let selectedSlot: any = null;

// Romanian month names
const MONTHS_RO = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 
                   'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
const DAYS_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await requireAuth();
    await updateNavBar();
    
    // Load filters from sessionStorage
    const specialitatiStr = sessionStorage.getItem('selectedSpecialitati');
    const locatiiStr = sessionStorage.getItem('selectedLocatii');
    
    if (specialitatiStr) selectedSpecialitati = JSON.parse(specialitatiStr);
    if (locatiiStr) selectedLocatii = JSON.parse(locatiiStr);
    
    updateDateDisplay();
    setupEventListeners();
    await loadAvailableSlots();
});

function setupEventListeners(): void {
    document.getElementById('date-picker-btn')?.addEventListener('click', openDatePicker);
    document.getElementById('close-date-picker')?.addEventListener('click', closeDatePicker);
    document.getElementById('date-input')?.addEventListener('change', handleDateChange);
    document.getElementById('confirm-booking-btn')?.addEventListener('click', confirmBooking);
    document.getElementById('close-popup-btn')?.addEventListener('click', closeConfirmationPopup);  // ❌ MISSING
    
    // Close popups when clicking outside
    document.getElementById('date-picker-popup')?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).id === 'date-picker-popup') {
            closeDatePicker();
        }
    });
}

function openDatePicker(): void {
    const popup = document.getElementById('date-picker-popup');
    const input = document.getElementById('date-input') as HTMLInputElement;
    
    // Set min date to today
    const today = new Date();
    const minYear = today.getFullYear();
    const minMonth = String(today.getMonth() + 1).padStart(2, '0');
    const minDay = String(today.getDate()).padStart(2, '0');
    input.min = `${minYear}-${minMonth}-${minDay}`;
    
    // Set input to current selected date
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    input.value = `${year}-${month}-${day}`;
    
    popup?.classList.remove('hidden');
}

function closeDatePicker(): void {
    document.getElementById('date-picker-popup')?.classList.add('hidden');
}

function handleDateChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    selectedDate = new Date(input.value + 'T00:00:00');
    updateDateDisplay();
    closeDatePicker();
    loadAvailableSlots();
}

function updateDateDisplay(): void {
    const dayName = DAYS_RO[selectedDate.getDay()];
    const day = selectedDate.getDate();
    const month = MONTHS_RO[selectedDate.getMonth()];
    
    const textElement = document.getElementById('selected-date-text');
    if (textElement) {
        textElement.textContent = `${dayName}, ${day} ${month}`;
    }
}

async function loadAvailableSlots(): Promise<void> {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const container = document.getElementById('slots-container');
    
    try {
        loadingState?.classList.remove('hidden');
        container?.classList.add('hidden');
        emptyState?.classList.add('hidden');
        
        const zi_saptamana = selectedDate.getDay();
        // Fix: Use local date string instead of ISO to avoid timezone shift
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const data_programare = `${year}-${month}-${day}`;
        
        /*console.log('Fetching available slots with:', {
            locatii: selectedLocatii.length > 0 ? selectedLocatii : null,
            specializari: selectedSpecialitati.length > 0 ? selectedSpecialitati : null,
            zi_saptamana,
            data_programare,
            selectedDate: selectedDate.toString()
        });*/
        
        const response = await fetch(`${API_URL}/api/programari/available`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locatii: selectedLocatii.length > 0 ? selectedLocatii : null,
                specializari: selectedSpecialitati.length > 0 ? selectedSpecialitati : null,
                zi_saptamana,
                data_programare
            })
        });
        
        //console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || 'Failed to load available slots');
        }
        
        availableDoctors = await response.json();
        //console.log('Available doctors:', availableDoctors);
        
        if (availableDoctors.length === 0) {
            emptyState?.classList.remove('hidden');
        } else {
            renderDoctorCards();
            container?.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error loading available slots:', error);
        alert('Eroare la încărcarea intervalelor disponibile: ' + (error as Error).message);
        emptyState?.classList.remove('hidden');
    } finally {
        loadingState?.classList.add('hidden');
    }
}

function renderDoctorCards(): void {
    const container = document.getElementById('slots-container');
    if (!container) return;
    
    container.innerHTML = availableDoctors.map(doctor => createDoctorCard(doctor)).join('');
    
    // Attach click listeners to time slots
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const element = e.target as HTMLElement;
            const doctorId = element.dataset.doctorId;
            const slot = element.dataset.slot;
            const doctorName = element.dataset.doctorName;
            const doctorPrenume = element.dataset.doctorPrenume;
            const doctorNume = element.dataset.doctorNume;
            const doctorSpec = element.dataset.doctorSpec;
            const doctorLocation = element.dataset.doctorLocation;
            
            openConfirmationPopup({
                doctorId,
                slot,
                doctorName,
                doctorPrenume,
                doctorNume,
                doctorSpec,
                doctorLocation
            });
        });
    });
}

function createDoctorCard(doctor: any): string {

    ///fetchuim poza
    const imageName = `${doctor.doctor_prenume}_${doctor.doctor_nume}.jpg`.toLowerCase();
    return `
        <div class="bg-gray-50 rounded-2xl p-6">
            <div class="flex items-center gap-4 mb-6">
                <img src="./doctors/${imageName}" 
                     alt="Dr. ${doctor.doctor_nume} ${doctor.doctor_prenume}" 
                     class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-16 h-16 rounded-full bg-red-300 flex-shrink-0" style="display: none;"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Dr. ${doctor.doctor_nume} ${doctor.doctor_prenume}</h3>
                    <p class="text-gray-600">${doctor.doctor_specializare}</p>
                </div>
            </div>
            
            <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-1">Locatia</p>
                <p class="font-bold text-gray-900">${doctor.doctor_locatie}</p>
                <p class="text-sm text-gray-700">Clinicum Center</p>
            </div>
            
            <div>
                <p class="text-sm font-medium text-gray-700 mb-3">Intervale disponibile</p>
                <div class="flex flex-wrap gap-2">
                    ${doctor.slots.map((slot: string) => `
                        <button class="time-slot-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                data-doctor-id="${doctor.doctor_id}"
                                data-slot="${slot}"
                                data-doctor-name="${doctor.doctor_nume} ${doctor.doctor_prenume}"
                                data-doctor-prenume="${doctor.doctor_prenume}"
                                data-doctor-nume="${doctor.doctor_nume}"
                                data-doctor-spec="${doctor.doctor_specializare}"
                                data-doctor-location="${doctor.doctor_locatie}">
                            ${slot.split('-')[0]}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function openConfirmationPopup(slotInfo: any): void {
    selectedSlot = slotInfo;
    
    //console.log('Opening popup with slotInfo:', slotInfo);
    
    // Update popup content
    document.getElementById('confirm-doctor-name')!.textContent = `Dr. ${slotInfo.doctorName}`;
    document.getElementById('confirm-doctor-spec')!.textContent = slotInfo.doctorSpec;
    document.getElementById('confirm-location')!.textContent = `${slotInfo.doctorLocation}, Clinicum Center`;
    
    // Set doctor image
    const imageName = `${slotInfo.doctorPrenume}_${slotInfo.doctorNume}.jpg`.toLowerCase();
    const imageEl = document.getElementById('confirm-doctor-image') as HTMLImageElement;
    if (imageEl) {
        imageEl.src = `./doctors/${imageName}`;
       /// console.log('Setting image to:', `./doctors/${imageName}`);
    }
    
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    document.getElementById('confirm-date')!.textContent = `${day}.${month}.${year}`;
    
    const time = slotInfo.slot.split('-')[0];
    document.getElementById('confirm-time')!.textContent = time;
    
    document.getElementById('confirmation-popup')?.classList.remove('hidden');
}
 
export function closeConfirmationPopup(): void {
    //console.log('Closing confirmation popup');
    document.getElementById('confirmation-popup')?.classList.add('hidden');
    selectedSlot = null;
}

async function confirmBooking(): Promise<void> {
    if (!selectedSlot) return;
    
    try {
        const time = selectedSlot.slot.split('-')[0]; // "14:00"
        // Fix: Use local date instead of ISO to avoid timezone shift
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const data_programare = `${year}-${month}-${day}T${time}:00`;
        
        /*('Creating programare:', {
            id_doctor: selectedSlot.doctorId,
            data_programare,
            selectedDate: selectedDate.toString()
        });*/
        
        const response = await fetch(`${API_URL}/api/programari`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_doctor: parseInt(selectedSlot.doctorId),
                data_programare
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create programare');
        }
        
        alert('Programarea a fost creată cu succes!');
        window.location.href = './programari.html';
        window.location.href = './programari.html';
        
        
    } catch (error) {
        console.error('Error creating programare:', error);
        alert('Eroare: ' + (error as Error).message);
    }
}