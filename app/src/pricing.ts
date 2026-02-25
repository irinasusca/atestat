///mobile menu, maybe move to separate file later

import './style.css'

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




// pricing.ts

// Get all toggle buttons
const toggleButtons = document.querySelectorAll<HTMLButtonElement>('.category-toggle');

/**
 * Toggle a category's visibility
 */
function toggleCategory(button: HTMLButtonElement): void {
    const categoryId = button.getAttribute('data-category');
    if (!categoryId) return;
    
    const content = document.getElementById(categoryId);
    const icon = button.querySelector<SVGElement>('.toggle-icon');
    
    if (!content || !icon) return;
    
    const isHidden = content.classList.contains('hidden');
    
    if (isHidden) {
        // Show content
        content.classList.remove('hidden');
        // Rotate icon to minus (no rotation)
        icon.classList.remove('rotate-45');
    } else {
        // Hide content
        content.classList.add('hidden');
        // Rotate icon to plus (45 degrees)
        icon.classList.add('rotate-45');
    }
}

// Add click event listeners to all toggle buttons
toggleButtons.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', (): void => {
        toggleCategory(button);
    });
});

// Initialize: First category open, others closed
document.addEventListener('DOMContentLoaded', (): void => {
    const firstCategory = document.getElementById('category-1');
    const firstIcon = document.querySelector('[data-category="category-1"] .toggle-icon');
    
    if (firstCategory && firstIcon) {
        firstCategory.classList.remove('hidden');
        firstIcon.classList.remove('rotate-45');
    }
});