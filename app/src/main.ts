import './style.css'
import { Carousel } from './carousel.ts';

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

// carousel logic
///instantiate carousels; hero is a fade carousel different logic


///doctors carousel
new Carousel({
    trackSelector: '.doctors-track',
    itemSelector: '.doctor-card',
    prevBtnId: 'doctors-prev-btn',
    nextBtnId: 'doctors-next-btn',
    dotSelector: '.doctors-dot',
    autoPlay: true,
    getItemsPerView: () => (window.innerWidth < 768 ? 1 : 3),
    onIndexChange: (index) => {
        document.querySelectorAll('.doctors-dot').forEach((dot, i) => {
            dot.classList.toggle('scale-125', i === index);
        });
    }
});

///reviews carousel 

new Carousel({
    trackSelector: '.reviews-track',
    itemSelector: '.review-card',
    prevBtnId: 'reviews-prev-btn',
    nextBtnId: 'reviews-next-btn',
    dotSelector: '.reviews-dot',
    gap: 24,
    autoPlay: true,
    getItemsPerView: () =>
        window.innerWidth < 768 ? 1 :
        window.innerWidth < 1024 ? 2 : 3,
    onIndexChange: (index, perView) => {
        const page = Math.floor(index / perView);
        document.querySelectorAll('.reviews-dot').forEach((dot, i) => {
            dot.classList.toggle('scale-125', i === page);
        });
    }
});

// Get DOM elements with proper type assertions for HERO
const slides = document.querySelectorAll<HTMLDivElement>('.carousel-slide');
const dots = document.querySelectorAll<HTMLButtonElement>('.carousel-dot');
const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement | null;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement | null;

let currentSlide: number = 0;
let autoSlideInterval: number | null = null;

/**
 * Display the slide at the given index
 */
function showSlide(index: number): void {
    slides.forEach((slide: HTMLDivElement, i: number) => {
        if (i === index) {
            slide.classList.remove('opacity-0', 'z-0');
            slide.classList.add('opacity-100', 'z-10');
        } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'z-0');
        }
    });

    dots.forEach((dot: HTMLButtonElement, i: number) => {
        if (i === index) {
            dot.classList.remove('bg-opacity-50');
            dot.classList.add('bg-opacity-100', 'scale-125');
        } else {
            dot.classList.remove('bg-opacity-100', 'scale-125');
            dot.classList.add('bg-opacity-50');
        }
    });

    currentSlide = index;
}

/**
 * Move to the next slide
 */
function nextSlide(): void {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

/**
 * Move to the previous slide
 */
function prevSlide(): void {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

/**
 * Start automatic slide transition
 */
function startAutoSlide(): void {
    autoSlideInterval = window.setInterval(nextSlide, 10000); // 10 seconds
}

/**
 * Reset the auto-slide timer
 */
function resetAutoSlide(): void {
    if (autoSlideInterval !== null) {
        clearInterval(autoSlideInterval);
    }
    startAutoSlide();
}

// Desktop navigation buttons
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (): void => {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', (): void => {
        nextSlide();
        resetAutoSlide();
    });
}

// Dot navigation
dots.forEach((dot: HTMLButtonElement, index: number): void => {
    dot.addEventListener('click', (): void => {
        showSlide(index);
        resetAutoSlide();
    });
});

// Initialize carousel
if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
} else {
    console.error('No carousel slides found');
}

