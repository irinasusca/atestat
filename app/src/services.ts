///mobile menu, maybe move to separate file later

import './style.css'

import { updateNavBar } from './auth';


// Check authentication and update navbar when page loads
document.addEventListener('DOMContentLoaded', async () => {
  await updateNavBar();
});
///MOBILE NAVBAR LOGIC 

const mobileMenuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement | null;
const mobileMenu = document.getElementById('mobile-menu') as HTMLDivElement | null;

// Check if elements exist before adding event listeners
if (mobileMenuButton && mobileMenu) {
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', (): void => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e: MouseEvent): void => {
        const target = e.target as Node;
        if (!mobileMenuButton.contains(target) && !mobileMenu.contains(target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link: Element): void => {
        link.addEventListener('click', (): void => {
            mobileMenu.classList.add('hidden');
        });
    });
} else {
    console.error('Mobile menu elements not found');
}




// services.ts

// Get DOM elements
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
const categoryButtons = document.querySelectorAll<HTMLButtonElement>('.category-filter');
const serviceCards = document.querySelectorAll<HTMLDivElement>('.service-card');
const servicesGrid = document.getElementById('services-grid') as HTMLDivElement | null;
const noResults = document.getElementById('no-results') as HTMLDivElement | null;

// Selected categories set
const selectedCategories = new Set<string>();

/**
 * Get URL parameter by name
 */
function getUrlParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Toggle category selection
 */
function toggleCategory(button: HTMLButtonElement): void {
    const category = button.getAttribute('data-category');
    if (!category) return;
    
    if (selectedCategories.has(category)) {
        // Deselect category
        selectedCategories.delete(category);
        button.classList.remove('bg-blue-600', 'text-white');
        button.classList.add('bg-web-white', 'text-gray-900');
        
        // Remove X icon
        const xIcon = button.querySelector('.x-icon');
        if (xIcon) {
            xIcon.remove();
        }
    } else {
        // Select category
        selectedCategories.add(category);
        button.classList.remove('bg-web-white', 'text-gray-900');
        button.classList.add('bg-blue-600', 'text-white');
        
        // Add X icon
        const xIcon = document.createElement('span');
        xIcon.className = 'x-icon ml-2';
        xIcon.innerHTML = '✕';
        button.appendChild(xIcon);
    }
    
    filterServices();
}

/**
 * Select a category programmatically (from URL param)
 */
function selectCategoryByName(categoryName: string): void {
    categoryButtons.forEach((button: HTMLButtonElement) => {
        const category = button.getAttribute('data-category');
        if (category === categoryName && !selectedCategories.has(categoryName)) {
            toggleCategory(button);
        }
    });
}

/**
 * Filter services based on selected categories and search query
 */
function filterServices(): void {
    const searchQuery = searchInput?.value.toLowerCase().trim() || '';
    let visibleCount = 0;
    
    serviceCards.forEach((card: HTMLDivElement) => {
        const cardCategories = card.getAttribute('data-categories')?.split(',') || [];
        const cardTitle = card.querySelector('h3')?.textContent?.toLowerCase() || '';
        const cardDescription = card.querySelector('p')?.textContent?.toLowerCase() || '';
        
        // Check if card matches selected categories
        const matchesCategory = selectedCategories.size === 0 || 
            cardCategories.some(cat => selectedCategories.has(cat.trim()));
        
        // Check if card matches search query
        const matchesSearch = searchQuery === '' || 
            cardTitle.includes(searchQuery) || 
            cardDescription.includes(searchQuery);
        
        // Show or hide card
        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show/hide no results message
    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
            servicesGrid?.classList.add('hidden');
        } else {
            noResults.classList.add('hidden');
            servicesGrid?.classList.remove('hidden');
        }
    }
}

/**
 * Handle search input
 */
function handleSearch(): void {
    filterServices();
}

// Add event listeners to category buttons
categoryButtons.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', (): void => {
        toggleCategory(button);
    });
});

// Add event listener to search input
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

// Check for URL parameter and auto-select category
const categoryParam = getUrlParameter('category');
if (categoryParam) {
    selectCategoryByName(categoryParam);
}

// Initialize: show all services
filterServices();