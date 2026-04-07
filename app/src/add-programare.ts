import './style.css';
import { updateNavBar, requireAuth } from './auth';

// Available options (you can modify these arrays later)
const SPECIALITATI = [
  'Dermatologie generala',
  'Dermatologie pediatrica',
  'Acnee',
  'Dermato-oncologie',
  'Dermatologie estetica',
  'Dermatologie alergologica',
  'Dermatologie infectioasa',
  'Tricologie',
  'Dermatologie chirurgicala'
];

const LOCATII = [
    'Cluj Zorilor',
    'Cluj Marasti',
    'Cluj Gheorgheni'
];

// State
let selectedSpecialitati: string[] = [];
let selectedLocatii: string[] = [];
let currentFilterType: 'specialitate' | 'locatie' = 'specialitate';


// Check authentication and update navbar when page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    //console.log('1. Starting DOMContentLoaded'); // DEBUG
    requireAuth(); // Redirect to login if not authenticated
    
    await updateNavBar();
    //console.log('3. Navbar updated'); // DEBUG
        
    setupEventListeners();
    //console.log('5. Event listeners setup'); // DEBUG

    renderOptions('specialitate'); // Show specialitati by default
  } catch (error) {
    console.error('ERROR in DOMContentLoaded:', error);
  }
});

function setupEventListeners(): void {
    // Filter box clicks
    document.getElementById('specialitate-filter')?.addEventListener('click', () => {
        currentFilterType = 'specialitate';
        openSelectionMenu();
    });

    document.getElementById('locatie-filter')?.addEventListener('click', () => {
        currentFilterType = 'locatie';
        openSelectionMenu();
    });

    // Mobile close button
    document.getElementById('close-mobile-menu')?.addEventListener('click', closeSelectionMenu);

    // Search inputs
    document.getElementById('search-input-desktop')?.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        filterOptions(query, 'desktop');
    });

    document.getElementById('search-input-mobile')?.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        filterOptions(query, 'mobile');
    });

    // Verify button
    document.getElementById('verify-btn')?.addEventListener('click', verificaDisponibilitatea);

    // Close mobile menu when clicking outside
    document.getElementById('selection-menu-mobile')?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).id === 'selection-menu-mobile') {
            closeSelectionMenu();
        }
    });
}

function openSelectionMenu(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        document.getElementById('selection-menu-mobile')?.classList.remove('hidden');
    } else {
        document.getElementById('selection-menu-desktop')?.classList.remove('hidden');
    }
    
    updateSelectionTitle();
    renderOptions(currentFilterType);
    clearSearch();
}

function closeSelectionMenu(): void {
    document.getElementById('selection-menu-mobile')?.classList.add('hidden');
}

function updateSelectionTitle(): void {
    const title = currentFilterType === 'specialitate' ? 'Alege specialitatea' : 'Alege locația';
    const placeholder = currentFilterType === 'specialitate' ? 'Caută specialitatea...' : 'Caută locația...';
    
    // Update desktop
    const desktopTitle = document.getElementById('selection-title');
    const desktopSearch = document.getElementById('search-input-desktop') as HTMLInputElement;
    if (desktopTitle) desktopTitle.textContent = title;
    if (desktopSearch) desktopSearch.placeholder = placeholder;
    
    // Update mobile
    const mobileTitle = document.getElementById('selection-title-mobile');
    const mobileSearch = document.getElementById('search-input-mobile') as HTMLInputElement;
    if (mobileTitle) mobileTitle.textContent = title;
    if (mobileSearch) mobileSearch.placeholder = placeholder;
}

function renderOptions(type: 'specialitate' | 'locatie'): void {
    const options = type === 'specialitate' ? SPECIALITATI : LOCATII;
    const selectedItems = type === 'specialitate' ? selectedSpecialitati : selectedLocatii;
    
    const desktopList = document.getElementById('options-list-desktop');
    const mobileList = document.getElementById('options-list-mobile');
    
    const html = options.map(option => createOptionHTML(option, selectedItems.includes(option))).join('');
    
    if (desktopList) desktopList.innerHTML = html;
    if (mobileList) mobileList.innerHTML = html;
    
    // Add click listeners
    attachOptionListeners();
}

function createOptionHTML(option: string, isSelected: boolean): string {
    return `
        <div class="option-item flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
        }" data-option="${option}">
            <span class="font-medium">${option}</span>
            ${isSelected ? '<span class="text-xl font-bold">×</span>' : ''}
        </div>
    `;
}

function attachOptionListeners(): void {
    document.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', () => {
            const option = (item as HTMLElement).dataset.option;
            if (option) toggleOption(option);
        });
    });
}

function toggleOption(option: string): void {
    if (currentFilterType === 'specialitate') {
        if (selectedSpecialitati.includes(option)) {
            selectedSpecialitati = selectedSpecialitati.filter(s => s !== option);
        } else {
            selectedSpecialitati.push(option);
        }
    } else {
        if (selectedLocatii.includes(option)) {
            selectedLocatii = selectedLocatii.filter(l => l !== option);
        } else {
            selectedLocatii.push(option);
        }
    }
    
    updateFilterDisplay();
    renderOptions(currentFilterType);
}

function updateFilterDisplay(): void {
    // Update specialitate filter
    const specialitateContainer = document.getElementById('specialitate-selected');
    if (specialitateContainer) {
        if (selectedSpecialitati.length === 0) {
            specialitateContainer.innerHTML = '<span class="text-gray-700 font-medium">Toate specialitățile</span>';
        } else {
            specialitateContainer.innerHTML = selectedSpecialitati.map(s => `
                <div class="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-red-700 flex-shrink-0" data-type="specialitate" data-value="${s}">
                    <span class="text-sm">${s}</span>
                    <span class="text-xl font-bold">×</span>
                </div>
            `).join('');
        }
    }
    
    // Update locatie filter
    const locatieContainer = document.getElementById('locatie-selected');
    if (locatieContainer) {
        if (selectedLocatii.length === 0) {
            locatieContainer.innerHTML = '<span class="text-gray-700 font-medium">Toate locațiile</span>';
        } else {
            locatieContainer.innerHTML = selectedLocatii.map(l => `
                <div class="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-red-700 flex-shrink-0" data-type="locatie" data-value="${l}">
                    <span class="text-sm">${l}</span>
                    <span class="text-xl font-bold">×</span>
                </div>
            `).join('');
        }
    }
    
    // Attach click listeners to remove tags
    document.querySelectorAll('[data-type="specialitate"]').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = (tag as HTMLElement).dataset.value;
            if (value) {
                // Set the correct filter type before toggling
                currentFilterType = 'specialitate';
                toggleOption(value);
            }
        });
    });
    
    document.querySelectorAll('[data-type="locatie"]').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = (tag as HTMLElement).dataset.value;
            if (value) {
                // Set the correct filter type before toggling
                currentFilterType = 'locatie';
                toggleOption(value);
            }
        });
    });
}

function filterOptions(query: string, device: 'desktop' | 'mobile'): void {
    const options = currentFilterType === 'specialitate' ? SPECIALITATI : LOCATII;
    const filtered = options.filter(option => 
        option.toLowerCase().includes(query.toLowerCase())
    );
    const selectedItems = currentFilterType === 'specialitate' ? selectedSpecialitati : selectedLocatii;
    
    const listId = device === 'desktop' ? 'options-list-desktop' : 'options-list-mobile';
    const list = document.getElementById(listId);
    
    if (list) {
        list.innerHTML = filtered.map(option => 
            createOptionHTML(option, selectedItems.includes(option))
        ).join('');
        attachOptionListeners();
    }
}

function clearSearch(): void {
    const desktopSearch = document.getElementById('search-input-desktop') as HTMLInputElement;
    const mobileSearch = document.getElementById('search-input-mobile') as HTMLInputElement;
    if (desktopSearch) desktopSearch.value = '';
    if (mobileSearch) mobileSearch.value = '';
}

function verificaDisponibilitatea(): void {
    //console.log('Verifică disponibilitatea clicked');
    //console.log('Selected specialități:', selectedSpecialitati);
    //console.log('Selected locații:', selectedLocatii);
    
    // Store filters in sessionStorage to pass to next page
    sessionStorage.setItem('selectedSpecialitati', JSON.stringify(selectedSpecialitati));
    sessionStorage.setItem('selectedLocatii', JSON.stringify(selectedLocatii));
    
    // Redirect to view-available page
    window.location.href = './view-available.html';
}