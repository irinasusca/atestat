import './style.css';
import { updateNavBar, requireAuth, API_URL } from './auth';

// Time slots (08:00-09:00, 09:00-10:00, ..., 18:00-19:00)
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Days of week (0 = Duminică, 1 = Luni, ..., 6 = Sâmbătă)
const DAYS = [
    { zi: 1, name: 'Luni' },
    { zi: 2, name: 'Marți' },
    { zi: 3, name: 'Miercuri' },
    { zi: 4, name: 'Joi' },
    { zi: 5, name: 'Vineri' },
    { zi: 6, name: 'Sâmbătă' },
    { zi: 0, name: 'Duminică' }
];

// State: { zi_saptamana: [ora_start, ora_start, ...] }
let selectedSlots: { [key: number]: string[] } = {};
let currentUser: any = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await requireAuth();
    await updateNavBar();
    
    // Check if user is a doctor
    if (currentUser?.rol !== 'doctor') {
        alert('Această pagină este disponibilă doar pentru doctori.');
        window.location.href = './index.html';
        return;
    }
    
    renderScheduleTable(); // Render empty table first
    await loadDoctorSchedule(); // Load data
    renderScheduleTable(); // Re-render with data
    setupEventListeners();
});

function setupEventListeners(): void {
    document.getElementById('confirm-btn')?.addEventListener('click', saveSchedule);
}

async function loadDoctorSchedule(): Promise<void> {
    const loadingState = document.getElementById('loading-state');
    const container = document.getElementById('schedule-container');
    
    try {
        const response = await fetch(`${API_URL}/api/doctor/orar/${currentUser.id_utilizator}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load schedule');
        }

        const program = await response.json();
        //console.log('Loaded program:', program);
        
        // Initialize selectedSlots from existing program
        selectedSlots = {};
        DAYS.forEach(day => {
            selectedSlots[day.zi] = [];
        });
        
        // Parse existing program
        program.forEach((interval: any) => {
            const zi = interval.zi_saptamana;
            // Trim seconds from time (09:00:00 -> 09:00)
            const ora = interval.ora_start.substring(0, 5);
            
            if (!selectedSlots[zi]) {
                selectedSlots[zi] = [];
            }
            selectedSlots[zi].push(ora);
        });
        
        //console.log('Selected slots:', selectedSlots);
        
    } catch (error) {
        console.error('Error loading schedule:', error);
        alert('Eroare la încărcarea orarului');
    } finally {
        loadingState?.classList.add('hidden');
        container?.classList.remove('hidden');
    }
}

function renderScheduleTable(): void {
    const tbody = document.getElementById('schedule-body');
    if (!tbody) return;
    
    tbody.innerHTML = TIME_SLOTS.map(timeSlot => {
        const endTime = calculateEndTime(timeSlot);
        const timeLabel = `${timeSlot} - ${endTime}`;
        
        return `
            <tr class="border-b border-gray-300">
                ${DAYS.map((day, index) => `
                    <td class="px-3 py-3 ${index < 6 ? 'border-r border-gray-300' : ''}">
                        <div class="flex flex-col items-center">
                            ${createSlotCell(day.zi, timeSlot, timeLabel)}
                        </div>
                    </td>
                `).join('')}
            </tr>
        `;
    }).join('');
    
    // Attach click listeners
    attachSlotListeners();
}

function createSlotCell(zi_saptamana: number, ora_start: string, timeLabel: string): string {
    const isSelected = selectedSlots[zi_saptamana]?.includes(ora_start) || false;
    
    return `
        <div class="slot-cell w-full min-h-[70px] rounded-md cursor-pointer transition-all flex items-center justify-between px-4 py-3 border-2 ${
            isSelected 
                ? 'bg-red-600 text-white border-red-700 hover:bg-red-700' 
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
        }" data-zi="${zi_saptamana}" data-ora="${ora_start}">
            <span class="text-base font-semibold">${timeLabel}</span>
            ${isSelected ? '<span class="text-3xl font-bold leading-none ml-2">×</span>' : '<span class="w-6"></span>'}
        </div>
    `;
}

function attachSlotListeners(): void {
    document.querySelectorAll('.slot-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const zi = parseInt((cell as HTMLElement).dataset.zi || '0');
            const ora = (cell as HTMLElement).dataset.ora || '';
            toggleSlot(zi, ora);
        });
    });
}

function toggleSlot(zi_saptamana: number, ora_start: string): void {
    if (!selectedSlots[zi_saptamana]) {
        selectedSlots[zi_saptamana] = [];
    }
    
    const index = selectedSlots[zi_saptamana].indexOf(ora_start);
    if (index > -1) {
        // Remove
        selectedSlots[zi_saptamana].splice(index, 1);
    } else {
        // Add
        selectedSlots[zi_saptamana].push(ora_start);
    }
    
    // Re-render table
    renderScheduleTable();
}

function calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + 1).toString().padStart(2, '0');
    return `${endHours}:${minutes.toString().padStart(2, '0')}`;
}

async function saveSchedule(): Promise<void> {
    if (!confirm('Sigur doriți să salvați modificările?')) {
        return;
    }
    
    try {
        //console.log('Saving schedule:', selectedSlots);
        
        // Send updates for each day
        const updates = DAYS.map(async (day) => {
            const ore_noi = selectedSlots[day.zi] || [];
            
            const response = await fetch(`${API_URL}/api/doctor/orar`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_doctor: currentUser.id_utilizator,
                    zi_saptamana: day.zi,
                    ore_noi: ore_noi
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update ${day.name}`);
            }
            
            return response.json();
        });
        
        await Promise.all(updates);
        
        alert('Orarul a fost salvat cu succes!');
        
        // Reload to show updated schedule
        await loadDoctorSchedule();
        renderScheduleTable();
        
    } catch (error) {
        console.error('Error saving schedule:', error);
        alert('Eroare la salvarea orarului: ' + (error as Error).message);
    }
}