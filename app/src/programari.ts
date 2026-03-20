import './style.css';
import { updateNavBar, requireAuth, API_URL } from './auth';

// State
let currentView: 'current' | 'past' = 'current';
let toateProgramarile: any[] = [];
let currentUser: any = null;

// Check authentication and update navbar when page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('1. Starting DOMContentLoaded'); // DEBUG
    currentUser = await requireAuth(); // Redirect to login if not authenticated
    console.log('2. Current user set:', currentUser); // DEBUG
    
    await updateNavBar();
    console.log('3. Navbar updated'); // DEBUG
    
    await loadProgramari();
    console.log('4. Programari loaded'); // DEBUG
    
    setupEventListeners();
    console.log('5. Event listeners setup'); // DEBUG
  } catch (error) {
    console.error('ERROR in DOMContentLoaded:', error);
  }
});

// Setup event listeners
function setupEventListeners(): void {
    const toggleCurrent = document.getElementById('toggle-current');
    const togglePast = document.getElementById('toggle-past');
    const addBtn = document.getElementById('add-appointment-btn');

    toggleCurrent?.addEventListener('click', () => {
        currentView = 'current';
        updateToggleUI();
        renderProgramari();
    });

    togglePast?.addEventListener('click', () => {
        currentView = 'past';
        updateToggleUI();
        renderProgramari();
    });

    // Redirect based on user role
    addBtn?.addEventListener('click', () => {
        if (currentUser?.rol === 'doctor') {
            // Redirect to schedule management page
            window.location.href = './modifica-orar.html';
        } else {
            // Redirect to add appointment page
            window.location.href = './add-programare.html';
        }
    });
}

// Update toggle button UI
function updateToggleUI(): void {
    const toggleCurrent = document.getElementById('toggle-current');
    const togglePast = document.getElementById('toggle-past');

    if (currentView === 'current') {
        toggleCurrent?.classList.add('bg-gray-700', 'text-white');
        toggleCurrent?.classList.remove('text-gray-700');
        togglePast?.classList.remove('bg-gray-700', 'text-white');
        togglePast?.classList.add('text-gray-700');
    } else {
        togglePast?.classList.add('bg-gray-700', 'text-white');
        togglePast?.classList.remove('text-gray-700');
        toggleCurrent?.classList.remove('bg-gray-700', 'text-white');
        toggleCurrent?.classList.add('text-gray-700');
    }
}

// Update button text based on user role
function updateButtonText(): void {
    const addBtn = document.getElementById('add-appointment-btn');
    if (addBtn && currentUser) {
        if (currentUser.rol === 'doctor') {
            addBtn.textContent = 'Modifică Orar';
        } else {
            addBtn.textContent = 'Adaugă Programare';
        }
    }
}

// Load programari from API
async function loadProgramari(): Promise<void> {
    const loadingState = document.getElementById('loading-state');
    const container = document.getElementById('appointments-container');
    
    try {
        console.log('Loading programari for user:', currentUser); // DEBUG
        
        loadingState?.classList.remove('hidden');
        container?.classList.add('hidden');

        // Use different endpoint based on user role
        const endpoint = currentUser?.rol === 'doctor' 
            ? `${API_URL}/api/programari/doctor/${currentUser.id_utilizator}`
            : `${API_URL}/api/programari/pacient/${currentUser.id_utilizator}`;

        console.log('Fetching from endpoint:', endpoint); // DEBUG

        const response = await fetch(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status); // DEBUG

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = './login.html';
                return;
            }
            throw new Error('Failed to load programari');
        }

        toateProgramarile = await response.json();
        console.log('Loaded programari:', JSON.stringify(toateProgramarile, null, 2)); // DEBUG
        
        updateButtonText(); // Update button based on role
        renderProgramari();
    } catch (error) {
        console.error('Error loading programari:', error); // This shows the actual error
        alert('Eroare la încărcarea programărilor');
    } finally {
        loadingState?.classList.add('hidden');
        container?.classList.remove('hidden');
    }
}

// Render programari based on current view
function renderProgramari(): void {
    const container = document.getElementById('appointments-container');
    const emptyState = document.getElementById('empty-state');
    
    if (!container || !emptyState) return;

    const now = new Date();
    const programariFiltrate = toateProgramarile.filter(programare => {
        const dataProgramare = new Date(programare.data_programare);
        if (currentView === 'current') {
            return dataProgramare >= now;
        } else {
            return dataProgramare < now;
        }
    });

    if (programariFiltrate.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = programariFiltrate.map(programare => {
        if (currentUser?.rol === 'doctor') {
            return createCardProgramareDoctor(programare);
        } else {
            return createCardProgramarePacient(programare);
        }
    }).join('');

    // Add cancel button listeners (only for patients on future programari)
    if (currentUser?.rol === 'pacient') {
        container.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.target as HTMLElement).dataset.id;
                if (id) anuleazaProgramare(parseInt(id));
            });
        });
    }
}

// Create programare card for patients (shows doctor info)
function createCardProgramarePacient(programare: any): string {
    const data = new Date(programare.data_programare);
    const dataStr = data.toLocaleDateString('ro-RO', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
    const oraStr = data.toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const isPast = data < new Date();
    const cancelButton = !isPast ? `
        <button data-id="${programare.id_programare}" class="cancel-btn absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold">
            Anulează →
        </button>
    ` : '';

    ///fetchuim poza corecta din prenume_nume.jpg
    const imageName = `${programare.doctor_prenume}_${programare.doctor_nume}.jpg`.toLowerCase();

    return `
        <div class="bg-gray-50 rounded-2xl shadow-lg p-6 relative">
            ${cancelButton}
            
            <div class="flex items-center gap-4 mb-6">
                <img src="./doctors/${imageName}" 
                     alt="Dr. ${programare.doctor_nume} ${programare.doctor_prenume}" 
                     class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-16 h-16 rounded-full bg-web-dark-blue flex-shrink-0" style="display: none;"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Dr. ${programare.doctor_nume || ''} ${programare.doctor_prenume || ''}</h3>
                    <p class="text-gray-600">${programare.doctor_specializare || 'Medicină internă'}</p>
                </div>
            </div>
            
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-700 mb-1">Data consultatiei</p>
                    <p class="font-bold text-gray-900">${dataStr}</p>
                    <p class="font-bold text-gray-900">${oraStr}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-700 mb-1">Locatia</p>
                    <p class="font-bold text-gray-900">${programare.doctor_locatie || 'Cluj Zorilor'}</p>
                    <p class="text-gray-900 text-sm">Clinicum Center</p>
                </div>
            </div>
        </div>
    `;
}

// Create programare card for doctors (shows patient info)
function createCardProgramareDoctor(programare: any): string {
    const data = new Date(programare.data_programare);
    const dataStr = data.toLocaleDateString('ro-RO', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
    const oraStr = data.toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });


    return `
        <div class="bg-gray-50 rounded-2xl shadow-lg p-6 relative">
            
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full bg-web-dark-blue flex-shrink-0"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">${programare.pacient_nume || ''} ${programare.pacient_prenume || ''}</h3>
                    <p class="text-gray-600">Pacient</p>
                </div>
            </div>
            
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-700 mb-1">Data consultatiei</p>
                    <p class="font-bold text-gray-900">${dataStr}</p>
                    <p class="font-bold text-gray-900">${oraStr}</p>
                </div>
            </div>
        </div>
    `;
}

// Cancel programare (only for patients)
async function anuleazaProgramare(id: number): Promise<void> {
    if (!confirm('Sigur doriți să anulați această programare?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/programari/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel programare');
        }

        // Reload programari
        await loadProgramari();
        alert('Programarea a fost anulată cu succes');
    } catch (error) {
        console.error('Error canceling programare:', error);
        alert('Eroare la anularea programării');
    }
}