///mobile menu, maybe move to separate file later

import './style.css'



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