// src/carousel.ts

export type CarouselOptions = {
    trackSelector: string;
    itemSelector: string;
    prevBtnId?: string;
    nextBtnId?: string;
    dotSelector?: string;
    gap?: number;
    autoPlay?: boolean;
    autoPlayDelay?: number;
    getItemsPerView: () => number;
    onIndexChange?: (index: number, itemsPerView: number) => void;
};

export class Carousel {
    private track: HTMLDivElement;
    private items: HTMLDivElement[];
    private dots: HTMLButtonElement[];
    private currentIndex = 0;
    private interval: number | null = null;
    private gap: number;
    private options: CarouselOptions;

    constructor(options: CarouselOptions) {
        this.options = options;
        this.gap = options.gap ?? 0;

        const track = document.querySelector<HTMLDivElement>(options.trackSelector);
        const items = document.querySelectorAll<HTMLDivElement>(options.itemSelector);

        if (!track || items.length === 0) {
            throw new Error(`Carousel elements not found for ${options.trackSelector}`);
        }

        this.track = track;
        this.items = Array.from(items);
        this.dots = options.dotSelector
            ? Array.from(document.querySelectorAll<HTMLButtonElement>(options.dotSelector))
            : [];

        this.bindControls();
        this.handleResize();
        this.show(0);

        if (options.autoPlay) {
            this.startAutoPlay();
        }
    }

    private bindControls() {
        const { prevBtnId, nextBtnId } = this.options;

        if (prevBtnId) {
            document.getElementById(prevBtnId)?.addEventListener('click', () => this.prev());
        }

        if (nextBtnId) {
            document.getElementById(nextBtnId)?.addEventListener('click', () => this.next());
        }

        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.show(i * this.itemsPerView());
                this.resetAutoPlay();
            });
        });

        

        window.addEventListener('resize', this.debouncedResize);
    }

    private itemsPerView() {
        return this.options.getItemsPerView();
    }

    private maxIndex() {
        return Math.max(0, this.items.length - this.itemsPerView());
    }

    private show(index: number) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex()));

        const itemWidth = this.items[0].offsetWidth;
        const offset = -(this.currentIndex * (itemWidth + this.gap));
        this.track.style.transform = `translateX(${offset}px)`;

        this.options.onIndexChange?.(this.currentIndex, this.itemsPerView());

        this.dots.forEach((dot: HTMLButtonElement, i: number) => {
        if (i === index) {
            dot.classList.remove('bg-gray-400');
            dot.classList.add('bg-web-dark-blue', 'scale-125');
        } else {
            dot.classList.remove('bg-web-dark-blue', 'scale-125');
            dot.classList.add('bg-gray-400');
        }
    });
    }

    private next() {
        this.show(this.currentIndex >= this.maxIndex() ? 0 : this.currentIndex + 1);
    }

    private prev() {
        this.show(this.currentIndex <= 0 ? this.maxIndex() : this.currentIndex - 1);
    }

    private startAutoPlay() {
        this.interval = window.setInterval(
            () => this.next(),
            this.options.autoPlayDelay ?? 10000
        );
    }

    private resetAutoPlay() {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.startAutoPlay();
        }
    }

    private handleResize() {
        this.show(this.currentIndex);
    }

    private debouncedResize = (() => {
        let timeout: number;
        return () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => this.handleResize(), 200);
        };
    })();
}
