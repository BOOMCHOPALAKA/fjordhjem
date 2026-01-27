// Import Sanity client
import {createClient} from 'https://esm.sh/@sanity/client@6.11.2'

// Sanity configuration
const SANITY_CONFIG = {
    projectId: '6ae0om2j',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Disable CDN for instant updates during development
};

// Create Sanity client
const sanityClient = createClient(SANITY_CONFIG);

class SanityContentManager {
    constructor() {
        this.content = {
            hero: null,
            about: null,
            experience: null,
            location: null,
            gallery: null,
            booking: null,
            bannerCarousel: null,
            siteSettings: null,
        };
    }

    // Helper to get image URL from Sanity with flexible aspect ratios
    getImageUrl(image, options = {}) {
        if (!image?.asset?._ref) return '';

        const ref = image.asset._ref;
        const [assetId, dimensions, format] = ref.replace('image-', '').split('-');
        const [width, height] = dimensions.split('x').map(Number);

        // Build URL with parameters
        // Default to 'max' to preserve aspect ratio, only use 'crop' when explicitly needed
        const params = new URLSearchParams({
            w: options.width || 1200,
            h: options.height || '',
            auto: 'format',
            fit: options.fit || 'max',
        });

        // Remove empty height
        if (!params.get('h')) params.delete('h');

        // Add crop parameters if present (Sanity stores as 0-1 normalized values)
        if (image.crop) {
            const { top, bottom, left, right } = image.crop;
            if (top || bottom || left || right) {
                // Convert to pixel values for rect parameter
                const rectLeft = Math.round(left * width);
                const rectTop = Math.round(top * height);
                const rectWidth = Math.round((1 - left - right) * width);
                const rectHeight = Math.round((1 - top - bottom) * height);
                params.set('rect', `${rectLeft},${rectTop},${rectWidth},${rectHeight}`);
            }
        }

        // Add hotspot for focal point (when using fit=crop)
        if (image.hotspot && options.fit === 'crop') {
            params.set('fp-x', image.hotspot.x);
            params.set('fp-y', image.hotspot.y);
        }

        return `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${assetId}-${dimensions}.${format}?${params}`;
    }

    // Fetch content from Sanity
    async fetchContent() {
        try {
            // Fetch all singleton documents
            const hero = await sanityClient.fetch('*[_type == "hero"][0]');
            const about = await sanityClient.fetch('*[_type == "about"][0]');
            const experienceSection = await sanityClient.fetch('*[_type == "experienceSection"][0]');
            const experienceCards = await sanityClient.fetch('*[_type == "experienceCard"] | order(order asc)');
            const locationSection = await sanityClient.fetch('*[_type == "locationSection"][0]');
            const locationPoints = await sanityClient.fetch('*[_type == "locationPoint"] | order(order asc)');
            const gallery = await sanityClient.fetch('*[_type == "gallery"][0]');
            const booking = await sanityClient.fetch('*[_type == "booking"][0]');
            const bannerCarousel = await sanityClient.fetch('*[_type == "bannerCarousel"][0]');
            const siteSettings = await sanityClient.fetch('*[_type == "siteSettings"][0]');

            // Store in content object
            this.content.hero = hero;
            this.content.about = about;
            this.content.experience = {
                section: experienceSection,
                cards: experienceCards,
            };
            this.content.location = {
                section: locationSection,
                points: locationPoints,
            };
            this.content.gallery = gallery;
            this.content.booking = booking;
            this.content.bannerCarousel = bannerCarousel;
            this.content.siteSettings = siteSettings;

            console.log('Content loaded from Sanity:', this.content);
        } catch (error) {
            console.error('Error fetching content from Sanity:', error);
        }
    }

    // Render hero section
    renderHero() {
        if (!this.content.hero) return;

        const { title, subtitle, backgroundImage, primaryButtonText, primaryButtonUrl, secondaryButtonText, secondaryButtonUrl } = this.content.hero;

        // Update title
        const titleEl = document.querySelector('.hero-title');
        if (titleEl) titleEl.textContent = title;

        // Update subtitle
        const subtitleEl = document.querySelector('.hero-subtitle');
        if (subtitleEl) subtitleEl.textContent = subtitle;

        // Update background image with responsive sizes
        if (backgroundImage) {
            const heroImg = document.querySelector('.hero-image img');
            if (heroImg) {
                // Mobile: Portrait crop (9:16 aspect) to show more vertical content with hotspot
                // Desktop: Landscape crop (16:9 aspect) with hotspot for focal point cropping
                const mobileUrl = this.getImageUrl(backgroundImage, { width: 1080, height: 1920, fit: 'crop' });
                const desktopUrl = this.getImageUrl(backgroundImage, { width: 1920, height: 1080, fit: 'crop' });

                // Set up responsive image - only update if src has changed
                const newSrc = desktopUrl;
                if (heroImg.src !== newSrc) {
                    heroImg.style.opacity = '0';
                    heroImg.srcset = `${mobileUrl} 800w, ${desktopUrl} 1920w`;
                    heroImg.sizes = '100vw';
                    heroImg.src = newSrc;

                    // Fade in once loaded
                    heroImg.onload = () => {
                        heroImg.style.opacity = '1';
                    };
                } else {
                    // Image already loaded, make sure it's visible
                    heroImg.style.opacity = '1';
                }
            }
        }

        // Update hero buttons
        if (primaryButtonText && primaryButtonUrl) {
            const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
            if (primaryBtn) {
                primaryBtn.textContent = primaryButtonText;
                primaryBtn.href = primaryButtonUrl;
            }
        }

        if (secondaryButtonText && secondaryButtonUrl) {
            const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');
            if (secondaryBtn) {
                secondaryBtn.textContent = secondaryButtonText;
                secondaryBtn.href = secondaryButtonUrl;
            }
        }
    }

    // Render about section
    renderAbout() {
        if (!this.content.about) return;

        const { label, heading, description, photos, features } = this.content.about;

        // Update label
        const labelEl = document.querySelector('#about .section-label');
        if (labelEl) labelEl.textContent = label;

        // Update heading
        const headingEl = document.querySelector('#about h2');
        if (headingEl) headingEl.innerHTML = heading.replace(/\n/g, '<br>');

        // Update description - remove ALL hardcoded paragraphs and create from Sanity
        const aboutContent = document.querySelector('#about .about-content');
        if (aboutContent && description) {
            // Find the h2 element and features-grid
            const h2 = aboutContent.querySelector('h2');
            const featuresGrid = aboutContent.querySelector('.features-grid');

            if (h2 && featuresGrid) {
                // Remove all <p> elements between h2 and features-grid
                let currentElement = h2.nextElementSibling;
                while (currentElement && currentElement !== featuresGrid) {
                    const nextElement = currentElement.nextElementSibling;
                    if (currentElement.tagName === 'P') {
                        currentElement.remove();
                    }
                    currentElement = nextElement;
                }

                // Split description by double newlines to create separate paragraphs
                const paragraphs = description.split('\n\n').filter(p => p.trim());

                // Insert new paragraphs after h2
                paragraphs.forEach((paragraphText) => {
                    const p = document.createElement('p');
                    p.textContent = paragraphText.trim();
                    featuresGrid.parentNode.insertBefore(p, featuresGrid);
                });
            }
        }

        // Render features grid
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && features && features.length > 0) {
            featuresGrid.innerHTML = features.map(feature => `
                <div class="feature">
                    <h3>${feature.title}</h3>
                    <p>${feature.description || ' '}</p>
                </div>
            `).join('');
        }

        // Render photo carousel
        const carousel = document.querySelector('.house-carousel-track');
        const dotsContainer = document.getElementById('houseCarouselDots');

        if (carousel) {
            if (photos && photos.length > 0) {
                // Update carousel slides
                carousel.innerHTML = photos.map((photo, index) => `
                    <div class="house-carousel-slide">
                        <img
                            src="${this.getImageUrl(photo, { width: 1200 })}"
                            srcset="${this.getImageUrl(photo, { width: 600 })} 600w, ${this.getImageUrl(photo, { width: 1200 })} 1200w, ${this.getImageUrl(photo, { width: 1600 })} 1600w"
                            sizes="(max-width: 768px) 100vw, 800px"
                            alt="${photo.alt || 'Cabin photo'}"
                            loading="${index === 0 ? 'eager' : 'lazy'}">
                    </div>
                `).join('');

                // Clear and reinitialize dots
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                }

                // Reinitialize carousel
                if (typeof window.initHouseCarousel === 'function') {
                    window.initHouseCarousel();
                }
            } else {
                // Clear carousel if no photos
                carousel.innerHTML = '<div class="house-carousel-slide"><p style="padding: 40px; text-align: center;">No photos uploaded yet. Add photos in the Sanity Studio.</p></div>';
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                }
            }
        }
    }

    // Render experience section
    renderExperience() {
        if (!this.content.experience) return;

        const { section, cards } = this.content.experience;

        if (section) {
            const labelEl = document.querySelector('#experience .section-label');
            if (labelEl) labelEl.textContent = section.label;

            const headingEl = document.querySelector('#experience h2');
            if (headingEl) headingEl.innerHTML = section.heading.replace(/\n/g, '<br>');
        }

        // Render experience cards
        if (cards && cards.length > 0) {
            const cardsContainer = document.querySelector('.experience-grid');
            if (cardsContainer) {
                cardsContainer.innerHTML = cards.map(card => `
                    <div class="experience-card">
                        <div class="experience-image">
                            <img
                                src="${this.getImageUrl(card.image, { width: 800 })}"
                                srcset="${this.getImageUrl(card.image, { width: 600 })} 600w, ${this.getImageUrl(card.image, { width: 800 })} 800w"
                                sizes="(max-width: 768px) 100vw, 600px"
                                alt="${card.title}"
                                loading="lazy">
                        </div>
                        <div class="experience-text">
                            <h3>${card.title}</h3>
                            <p>${card.description}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Render location section
    renderLocation() {
        if (!this.content.location) return;

        const { section, points } = this.content.location;

        if (section) {
            const labelEl = document.querySelector('#location .section-label');
            if (labelEl) labelEl.textContent = section.label;

            const headingEl = document.querySelector('#location h2');
            if (headingEl) headingEl.innerHTML = section.heading.replace(/\n/g, '<br>');

            const introEl = document.querySelector('#location p');
            if (introEl) introEl.textContent = section.intro;

            // Render section images
            if (section.images && section.images.length > 0) {
                const imagesContainer = document.querySelector('.location-images');
                if (imagesContainer) {
                    imagesContainer.innerHTML = section.images.map((image) => `
                        <img
                            src="${this.getImageUrl(image, { width: 800 })}"
                            srcset="${this.getImageUrl(image, { width: 600 })} 600w, ${this.getImageUrl(image, { width: 800 })} 800w"
                            sizes="(max-width: 768px) 100vw, 400px"
                            alt="${image.alt || 'Location view'}"
                            loading="lazy">
                    `).join('');
                }
            }
        }

        // Render location points
        if (points && points.length > 0) {
            const pointsContainer = document.querySelector('.location-points');
            if (pointsContainer) {
                pointsContainer.innerHTML = points.map(point => `
                    <div class="location-point">
                        <h3>${point.location} (${point.distance})</h3>
                        <p>${point.description || ''}</p>
                    </div>
                `).join('');
            }
        }
    }

    // Render gallery section
    renderGallery() {
        if (!this.content.gallery) return;

        const { label, heading, collections } = this.content.gallery;

        // Update label
        const labelEl = document.querySelector('#gallery .section-label');
        if (labelEl) labelEl.textContent = label;

        // Update heading
        const headingEl = document.querySelector('#gallery h2');
        if (headingEl) headingEl.innerHTML = heading.replace(/\n/g, '<br>');

        // Find the container-wide div to insert collections
        const containerWide = document.querySelector('#gallery .container-wide');
        if (!containerWide) return;

        // Remove existing gallery grids (everything after the section-header)
        const sectionHeader = containerWide.querySelector('.section-header');
        if (sectionHeader) {
            // Remove all siblings after the header
            while (sectionHeader.nextSibling) {
                containerWide.removeChild(sectionHeader.nextSibling);
            }
        }

        // Render each collection as a separate gallery grid
        if (collections && collections.length > 0) {
            collections.forEach((collection, collectionIndex) => {
                if (!collection.photos || collection.photos.length === 0) return;

                // Create collection container
                const collectionDiv = document.createElement('div');
                collectionDiv.style.marginTop = collectionIndex > 0 ? '80px' : '40px';

                // Add collection heading if it exists
                if (collection.collectionName) {
                    const collectionHeading = document.createElement('h3');
                    collectionHeading.textContent = collection.collectionName;
                    collectionHeading.style.fontSize = '1.8rem';
                    collectionHeading.style.marginBottom = '10px';
                    collectionHeading.style.textAlign = 'center';
                    collectionHeading.style.fontFamily = "'Crimson Pro', serif";
                    collectionDiv.appendChild(collectionHeading);
                }

                // Add collection subheading if it exists
                if (collection.subheading) {
                    const subheading = document.createElement('p');
                    subheading.textContent = collection.subheading;
                    subheading.style.textAlign = 'center';
                    subheading.style.marginBottom = '30px';
                    subheading.style.color = '#666';
                    collectionDiv.appendChild(subheading);
                }

                // Create gallery grid
                const galleryGrid = document.createElement('div');
                galleryGrid.className = 'gallery-grid';
                galleryGrid.innerHTML = collection.photos.map(photo => `
                    <div class="gallery-item ${photo.size || 'regular'}">
                        <img
                            src="${this.getImageUrl(photo, { width: 1200 })}"
                            srcset="${this.getImageUrl(photo, { width: 600 })} 600w, ${this.getImageUrl(photo, { width: 1200 })} 1200w"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            alt="${photo.alt || 'Gallery photo'}"
                            loading="lazy">
                    </div>
                `).join('');

                collectionDiv.appendChild(galleryGrid);
                containerWide.appendChild(collectionDiv);
            });
        }
    }

    // Render booking section
    renderBooking() {
        if (!this.content.booking) return;

        const { label, heading, description, airbnbButtonText, airbnbUrl, vrboButtonText, vrboUrl, contactQuestionText, contactEmail } = this.content.booking;

        const labelEl = document.querySelector('#book .section-label');
        if (labelEl) labelEl.textContent = label;

        const headingEl = document.querySelector('#book h2');
        if (headingEl) headingEl.innerHTML = heading.replace(/\n/g, '<br>');

        const descEl = document.querySelector('#book p');
        if (descEl) descEl.textContent = description;

        // Update Airbnb button
        const airbnbBtn = document.querySelector('#book .btn-booking.airbnb');
        if (airbnbBtn && airbnbButtonText && airbnbUrl) {
            airbnbBtn.textContent = airbnbButtonText;
            airbnbBtn.href = airbnbUrl;
        }

        // Update VRBO button
        const vrboBtn = document.querySelector('#book .btn-booking.vrbo');
        if (vrboBtn && vrboButtonText && vrboUrl) {
            vrboBtn.textContent = vrboButtonText;
            vrboBtn.href = vrboUrl;
        }

        // Update contact info
        if (contactQuestionText) {
            const contactQuestionEl = document.querySelector('#book .contact-info p');
            if (contactQuestionEl) contactQuestionEl.textContent = contactQuestionText;
        }

        if (contactEmail) {
            const contactEmailEl = document.querySelector('#book .contact-info a');
            if (contactEmailEl) {
                contactEmailEl.href = `mailto:${contactEmail}`;
                contactEmailEl.textContent = contactEmail;
            }
        }
    }

    // Render banner carousel
    renderBannerCarousel() {
        if (!this.content.bannerCarousel || !this.content.bannerCarousel.images) return;

        const { images } = this.content.bannerCarousel;
        if (!images || images.length === 0) return;

        const track = document.querySelector('.banner-carousel-track');
        if (!track) return;

        // Create slides - original + duplicates for seamless loop
        const slides = images.map(image => `
            <div class="banner-carousel-slide">
                <img
                    src="${this.getImageUrl(image, { width: 1200 })}"
                    alt="${image.alt || 'Cabin photo'}"
                    loading="lazy">
            </div>
        `).join('');

        // Duplicate slides for seamless loop (aria-hidden for duplicates)
        const duplicateSlides = images.map(image => `
            <div class="banner-carousel-slide" aria-hidden="true">
                <img
                    src="${this.getImageUrl(image, { width: 1200 })}"
                    alt=""
                    loading="lazy">
            </div>
        `).join('');

        track.innerHTML = slides + duplicateSlides;

        // Reinitialize carousel if function exists
        if (typeof window.initBannerCarousel === 'function') {
            window.initBannerCarousel();
        }
    }

    // Render site settings (footer, nav, etc.)
    renderSiteSettings() {
        if (!this.content.siteSettings) return;

        const { siteName, siteLocation, copyrightText } = this.content.siteSettings;

        // Update logo in nav
        if (siteName) {
            const logo = document.querySelector('.logo');
            if (logo) logo.textContent = siteName;

            // Update footer brand name
            const footerBrand = document.querySelector('.footer-brand h3');
            if (footerBrand) footerBrand.textContent = siteName;
        }

        // Update footer location
        if (siteLocation) {
            const footerLocation = document.querySelector('.footer-brand p');
            if (footerLocation) footerLocation.textContent = siteLocation;
        }

        // Update copyright with current year
        if (copyrightText) {
            const currentYear = new Date().getFullYear();
            const footerCopyright = document.querySelector('.footer-bottom p');
            if (footerCopyright) {
                footerCopyright.textContent = `© ${currentYear} ${copyrightText}`;
            }
        }
    }

    // Load and render all content
    async init() {
        console.log('Loading content from Sanity...');

        // Add loading class to body
        document.body.classList.add('sanity-loading');

        await this.fetchContent();

        this.renderSiteSettings();
        this.renderHero();
        this.renderBannerCarousel();
        this.renderAbout();
        this.renderExperience();
        this.renderLocation();
        this.renderGallery();
        this.renderBooking();

        // Remove loading class once done
        document.body.classList.remove('sanity-loading');
        document.body.classList.add('sanity-loaded');

        console.log('All content rendered!');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const contentManager = new SanityContentManager();
        await contentManager.init();
    });
} else {
    const contentManager = new SanityContentManager();
    await contentManager.init();
}
