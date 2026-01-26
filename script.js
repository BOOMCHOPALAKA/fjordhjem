// ============================================
// CONTENT MANAGEMENT SYSTEM
// Load content from YAML files and populate HTML
// ============================================

const ContentLoader = {
    content: {},

    // Load a YAML file and parse it
    async loadYAML(filename) {
        try {
            const response = await fetch(`content/${filename}`);
            const text = await response.text();
            return jsyaml.load(text);
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    },

    // Load all content files
    async loadAllContent() {
        const files = [
            'hero.yml',
            'banner-carousel.yml',
            'about.yml',
            'house-carousel.yml',
            'experience.yml',
            'gallery.yml',
            'location.yml',
            'booking.yml'
        ];

        for (const file of files) {
            const key = file.replace('.yml', '').replace(/-/g, '_');
            this.content[key] = await this.loadYAML(file);
        }

        return this.content;
    },

    // Initialize all content
    async init() {
        await this.loadAllContent();
        this.populateHero();
        this.populateBannerCarousel();
        this.populateAbout();
        this.populateHouseCarousel();
        this.populateExperience();
        this.populateGallery();
        this.populateLocation();
        this.populateBooking();
    },

    populateHero() {
        const data = this.content.hero;
        if (!data) return;

        document.querySelector('.hero-title').innerHTML = data.title;
        document.querySelector('.hero-subtitle').textContent = data.subtitle;
        document.querySelector('.hero-image img').src = data.heroImage;
        document.querySelector('.hero-buttons .btn-primary').textContent = data.primaryButton;
        document.querySelector('.hero-buttons .btn-secondary').textContent = data.secondaryButton;
    },

    populateBannerCarousel() {
        const data = this.content.banner_carousel;
        if (!data || !data.slides) return;

        const track = document.getElementById('bannerCarouselTrack');
        if (!track) return;

        // Clear existing slides
        track.innerHTML = '';

        // Add original slides
        data.slides.forEach(slide => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'banner-carousel-slide';
            slideDiv.innerHTML = `<img src="${slide.image}" alt="${slide.alt}" loading="lazy">`;
            track.appendChild(slideDiv);
        });

        // Add duplicate slides for seamless loop
        data.slides.forEach(slide => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'banner-carousel-slide';
            slideDiv.setAttribute('aria-hidden', 'true');
            slideDiv.innerHTML = `<img src="${slide.image}" alt="" loading="lazy">`;
            track.appendChild(slideDiv);
        });

        // Reinitialize banner carousel if function exists
        if (typeof initBannerCarousel === 'function') {
            initBannerCarousel();
        }
    },

    populateAbout() {
        const data = this.content.about;
        if (!data) return;

        // Update text content
        const aboutSection = document.querySelector('#about');
        const sectionLabel = aboutSection.querySelector('.section-label');
        const heading = aboutSection.querySelector('h2');
        const paragraphs = aboutSection.querySelectorAll('.about-text p');

        if (sectionLabel) sectionLabel.textContent = data.label;
        if (heading) heading.innerHTML = data.heading.replace(/\n/g, '<br>');
        if (paragraphs[0]) paragraphs[0].textContent = data.paragraph1;
        if (paragraphs[1]) paragraphs[1].textContent = data.paragraph2;

        // Update features
        const featuresGrid = aboutSection.querySelector('.about-features');
        if (featuresGrid && data.features) {
            featuresGrid.innerHTML = '';
            data.features.forEach(feature => {
                const featureDiv = document.createElement('div');
                featureDiv.className = 'feature-item';
                featureDiv.innerHTML = `
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                `;
                featuresGrid.appendChild(featureDiv);
            });
        }
    },

    populateHouseCarousel() {
        const data = this.content.house_carousel;
        if (!data || !data.photos) return;

        const track = document.getElementById('houseCarouselTrack');
        if (!track) return;

        track.innerHTML = '';
        data.photos.forEach(photo => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'house-carousel-slide';
            slideDiv.innerHTML = `<img src="${photo.image}" alt="${photo.alt}">`;
            track.appendChild(slideDiv);
        });

        // Reinitialize house carousel if function exists
        if (typeof initHouseCarousel === 'function') {
            initHouseCarousel();
        }
    },

    populateExperience() {
        const data = this.content.experience;
        if (!data) return;

        const section = document.querySelector('#experience');
        const sectionLabel = section.querySelector('.section-label');
        const heading = section.querySelector('h2');

        if (sectionLabel) sectionLabel.textContent = data.label;
        if (heading) heading.innerHTML = data.heading.replace(/\n/g, '<br>');

        const grid = section.querySelector('.experience-grid');
        if (grid && data.cards) {
            grid.innerHTML = '';
            data.cards.forEach((card, index) => {
                const isReverse = index % 2 === 1;
                const cardDiv = document.createElement('div');
                cardDiv.className = `experience-card${isReverse ? ' reverse' : ''}`;
                cardDiv.innerHTML = `
                    <div class="experience-image">
                        <img src="${card.image}" alt="${card.title}" loading="lazy">
                    </div>
                    <div class="experience-text">
                        <h3>${card.title}</h3>
                        <p>${card.description}</p>
                    </div>
                `;
                grid.appendChild(cardDiv);
            });
        }
    },

    populateGallery() {
        const data = this.content.gallery;
        if (!data) return;

        const section = document.querySelector('#gallery');
        const sectionLabel = section.querySelector('.section-label');
        const heading = section.querySelector('h2');

        if (sectionLabel) sectionLabel.textContent = data.label;
        if (heading) heading.innerHTML = data.heading.replace(/\n/g, '<br>');

        const grid = section.querySelector('.gallery-grid');
        if (grid && data.images) {
            grid.innerHTML = '';
            data.images.forEach(item => {
                const imageDiv = document.createElement('div');
                imageDiv.className = `gallery-item${item.size !== 'normal' ? ' ' + item.size : ''}`;
                imageDiv.innerHTML = `<img src="${item.image}" alt="${item.alt}" loading="lazy">`;
                grid.appendChild(imageDiv);
            });
        }
    },

    populateLocation() {
        const data = this.content.location;
        if (!data) return;

        const section = document.querySelector('#location');
        const sectionLabel = section.querySelector('.section-label');
        const heading = section.querySelector('h2');
        const intro = section.querySelector('.location-content > p');

        if (sectionLabel) sectionLabel.textContent = data.label;
        if (heading) heading.innerHTML = data.heading.replace(/\n/g, '<br>');
        if (intro) intro.textContent = data.intro;

        const pointsContainer = section.querySelector('.location-points');
        if (pointsContainer && data.points) {
            pointsContainer.innerHTML = '';
            data.points.forEach(point => {
                const pointDiv = document.createElement('div');
                pointDiv.className = 'location-point';
                pointDiv.innerHTML = `
                    <h3>${point.title}</h3>
                    <p>${point.description}</p>
                `;
                pointsContainer.appendChild(pointDiv);
            });
        }

        const imagesContainer = section.querySelector('.location-images');
        if (imagesContainer && data.images) {
            imagesContainer.innerHTML = '';
            data.images.forEach(image => {
                const img = document.createElement('img');
                img.src = image.image;
                img.alt = image.alt;
                img.loading = 'lazy';
                imagesContainer.appendChild(img);
            });
        }
    },

    populateBooking() {
        const data = this.content.booking;
        if (!data) return;

        const section = document.querySelector('#book');
        const sectionLabel = section.querySelector('.section-label');
        const heading = section.querySelector('h2');
        const description = section.querySelector('.booking-text > p');

        if (sectionLabel) sectionLabel.textContent = data.label;
        if (heading) heading.innerHTML = data.heading.replace(/\n/g, '<br>');
        if (description) description.textContent = data.description;

        const airbnbLink = section.querySelector('.booking-buttons .btn-primary:first-child');
        const vrboLink = section.querySelector('.booking-buttons .btn-primary:last-child');

        if (airbnbLink && data.airbnbUrl) airbnbLink.href = data.airbnbUrl;
        if (vrboLink && data.vrboUrl) vrboLink.href = data.vrboUrl;

        const contactEmail = section.querySelector('.contact-info a[href^="mailto:"]');
        if (contactEmail && data.contactEmail) {
            contactEmail.href = `mailto:${data.contactEmail}`;
            contactEmail.textContent = data.contactEmail;
        }
    }
};

// Initialize content loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContentLoader.init());
} else {
    ContentLoader.init();
}

// ============================================
// EXISTING SCRIPTS
// ============================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
}

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.about-content, .experience-card, .location-content, .gallery-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0001})`;
    }
});

// Gallery lightbox (simple implementation)
const galleryItems = document.querySelectorAll('.gallery-item img');
galleryItems.forEach(img => {
    img.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => lightbox.classList.add('active'), 10);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    });
});

// Add lightbox styles dynamically
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox.active {
        opacity: 1;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        animation: zoomIn 0.3s ease;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: opacity 0.3s ease;
    }
    
    .lightbox-close:hover {
        opacity: 0.7;
    }
    
    @keyframes zoomIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .lightbox-content {
            max-width: 95vw;
            max-height: 95vh;
        }
        
        .lightbox-close {
            top: -50px;
            font-size: 2rem;
        }
    }
`;
document.head.appendChild(lightboxStyles);

// Add mobile menu styles dynamically
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            max-width: 300px;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            align-items: flex-start;
            padding: 2rem;
            gap: 1.5rem;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
        }
        
        .nav-links.active {
            right: 0;
        }
        
        .nav-links a {
            font-size: 1.125rem;
            width: 100%;
            padding: 0.5rem 0;
        }
        
        .nav-links .btn-primary {
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
        }
        
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(7px, 7px);
        }
        
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// House Carousel functionality
function initHouseCarousel() {
    const track = document.getElementById('houseCarouselTrack');
    const slides = document.querySelectorAll('.house-carousel-slide');
    const prevBtn = document.querySelector('.house-carousel-prev');
    const nextBtn = document.querySelector('.house-carousel-next');
    const dotsContainer = document.getElementById('houseCarouselDots');

    if (!track || !slides.length || !prevBtn || !nextBtn || !dotsContainer) {
        console.error('House carousel elements not found', {
            track: !!track,
            slides: slides.length,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            dotsContainer: !!dotsContainer
        });
        return;
    }

    console.log('House carousel initializing with', slides.length, 'slides');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('house-carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.house-carousel-dot');

    function updateCarousel() {
        const offset = currentIndex * 100;
        track.style.transform = `translateX(-${offset}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        console.log('Carousel updated to slide', currentIndex);
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoplay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        console.log('Prev button clicked');
        prevSlide();
        resetAutoplay();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
        startAutoplay();
    });

    // Pause autoplay on hover
    track.parentElement.addEventListener('mouseenter', stopAutoplay);
    track.parentElement.addEventListener('mouseleave', startAutoplay);

    // Initialize
    updateCarousel();
    startAutoplay();

    console.log('House carousel initialized successfully');
}

// Initialize carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHouseCarousel);
} else {
    initHouseCarousel();
}

// Banner Carousel functionality
function initBannerCarousel() {
    const track = document.getElementById('bannerCarouselTrack');
    const indicatorsContainer = document.getElementById('bannerCarouselIndicators');
    const bannerSection = document.querySelector('.banner-carousel');

    if (!track || !indicatorsContainer || !bannerSection) {
        console.error('Banner carousel elements not found');
        return;
    }

    // Get only the original slides (not the duplicates)
    const originalSlides = Array.from(document.querySelectorAll('.banner-carousel-slide')).filter(
        slide => !slide.hasAttribute('aria-hidden')
    );
    const totalOriginalSlides = originalSlides.length;

    console.log('Banner carousel initializing with', totalOriginalSlides, 'unique slides');

    // Create indicators for original slides only
    originalSlides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('banner-carousel-indicator');
        indicator.setAttribute('aria-label', `View slide ${index + 1}`);
        indicatorsContainer.appendChild(indicator);
    });

    // Disable CSS animation - we'll handle scrolling with JavaScript
    track.style.animation = 'none';

    // State management
    let currentTranslate = 0;
    let isDragging = false;
    let startPos = 0;
    let dragStartTranslate = 0;
    let autoScrollSpeed = 0.5; // pixels per frame
    let isPageVisible = true;

    // Calculate the total width of one set of images
    function getTotalWidth() {
        let width = 0;
        originalSlides.forEach(slide => {
            width += slide.offsetWidth + 2; // +2 for margin
        });
        return width;
    }

    // Auto-scroll function
    function autoScroll() {
        if (!isDragging && isPageVisible) {
            currentTranslate -= autoScrollSpeed;

            // Reset position when we've scrolled through half (one set of images)
            const totalWidth = getTotalWidth();
            if (Math.abs(currentTranslate) >= totalWidth) {
                currentTranslate = 0;
            }

            track.style.transform = `translateX(${currentTranslate}px)`;
        }
        requestAnimationFrame(autoScroll);
    }

    // Start auto-scrolling
    autoScroll();

    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });

    // Touch/Mouse start
    function touchStart(event) {
        isDragging = true;

        if (event.type === 'mousedown') {
            startPos = event.clientX;
            bannerSection.style.cursor = 'grabbing';
        } else {
            startPos = event.touches[0].clientX;
        }

        dragStartTranslate = currentTranslate;
    }

    // Touch/Mouse move
    function touchMove(event) {
        if (!isDragging) return;

        const currentPosition = event.type === 'mousemove'
            ? event.clientX
            : event.touches[0].clientX;

        const diff = currentPosition - startPos;
        currentTranslate = dragStartTranslate + diff;

        // Update position immediately during drag
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Touch/Mouse end
    function touchEnd() {
        if (!isDragging) return;

        isDragging = false;
        bannerSection.style.cursor = 'grab';

        // Check if we need to loop around
        const totalWidth = getTotalWidth();
        if (Math.abs(currentTranslate) >= totalWidth) {
            currentTranslate = currentTranslate % totalWidth;
        }
        // Handle positive scrolling (scrolling right)
        if (currentTranslate > 0) {
            currentTranslate = -totalWidth + (currentTranslate % totalWidth);
        }
    }

    // Desktop mouse events
    bannerSection.addEventListener('mousedown', touchStart);
    bannerSection.addEventListener('mousemove', touchMove);
    bannerSection.addEventListener('mouseup', touchEnd);
    bannerSection.addEventListener('mouseleave', () => {
        if (isDragging) {
            touchEnd();
        }
    });

    // Mobile touch events
    bannerSection.addEventListener('touchstart', touchStart, { passive: true });
    bannerSection.addEventListener('touchmove', touchMove, { passive: true });
    bannerSection.addEventListener('touchend', touchEnd, { passive: true });

    // Prevent context menu on long press
    bannerSection.addEventListener('contextmenu', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    // Set cursor style
    bannerSection.style.cursor = 'grab';

    // Adjust scroll speed based on screen size
    function updateScrollSpeed() {
        const width = window.innerWidth;
        if (width <= 480) {
            autoScrollSpeed = 0.8; // Faster on small screens
        } else if (width <= 768) {
            autoScrollSpeed = 0.65; // Medium speed on tablets
        } else {
            autoScrollSpeed = 0.5; // Normal speed on desktop
        }
    }

    updateScrollSpeed();
    window.addEventListener('resize', updateScrollSpeed);

    console.log('Banner carousel initialized successfully with smooth continuous scroll and drag support');
}

// Initialize banner carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBannerCarousel);
} else {
    initBannerCarousel();
}

console.log('Fjordhjem site loaded successfully');
