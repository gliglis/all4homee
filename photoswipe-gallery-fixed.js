// PhotoSwipe Gallery Module - Fixed for local file access
const PhotoSwipeGallery = (function() {

    // PhotoSwipe lightbox instances
    let luxuryBathwareLightbox = null;
    let premiumTilesLightbox = null;

    // Get gallery data from the GalleryData object (no need for fetch)
    function getGalleryData(category) {
        return GalleryData[category] || null;
    }

    // Create gallery grid HTML with thumbnails
    function createGalleryGrid(category, gridId) {
        console.log(`createGalleryGrid called with category: ${category}, gridId: ${gridId}`);

        const gridContainer = document.getElementById(gridId);
        if (!gridContainer) {
            console.error(`Grid container not found: ${gridId}`);
            return;
        }

        console.log(`Grid container found:`, gridContainer);

        // Clear existing content
        gridContainer.innerHTML = '';

        // Get gallery data
        const data = getGalleryData(category);
        if (!data) {
            console.error(`No gallery data found for category: ${category}`);
            console.log('Available GalleryData keys:', Object.keys(GalleryData));
            return;
        }

        console.log(`Creating gallery grid for ${category} with ${data.images.length} images`);
        console.log('Gallery data:', data);

        // Create gallery items
        data.images.forEach((imageData, index) => {
            console.log(`Creating item ${index}:`, imageData);

            const { filename, thumbnail, title } = imageData;
            const fullImagePath = `./gallery/${data.folder}/${filename}`;
            const thumbnailPath = `./gallery/${data.thumbnailFolder}/${thumbnail}`;

            console.log(`Full image path: ${fullImagePath}`);
            console.log(`Thumbnail path: ${thumbnailPath}`);

            const item = document.createElement('a');
            item.href = fullImagePath;
            item.className = 'gallery-item loading';
            item.setAttribute('data-pswp-width', '1200');
            item.setAttribute('data-pswp-height', '800');

            // Add click handler
            item.onclick = function(e) {
                e.preventDefault();
                console.log(`Clicked on item ${index}`);
                initPhotoSwipeOnDemand(category);

                setTimeout(() => {
                    const lightbox = category === 'luxury-bathware' ? luxuryBathwareLightbox : premiumTilesLightbox;
                    if (lightbox) {
                        lightbox.loadAndOpen(index);
                    }
                }, 200);
            };

            // Create thumbnail image
            const img = document.createElement('img');
            img.src = thumbnailPath;
            img.alt = title;
            img.style.width = '100%';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.display = 'none';

            // Create spinner
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 200px; background: #f0f0f0; border-radius: 10px; flex-direction: column;';
            spinner.innerHTML = '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 10px;"></div><div style="color: #666; font-size: 14px;">Loading...</div>';

            // Create title
            const titleDiv = document.createElement('div');
            titleDiv.className = 'gallery-item-title';
            titleDiv.textContent = title;

            // Add to item
            item.appendChild(spinner);
            item.appendChild(img);
            item.appendChild(titleDiv);

            // Add to grid IMMEDIATELY to make it visible
            gridContainer.appendChild(item);
            console.log(`Item ${index} added to grid`);

            // Handle thumbnail loading
            img.onload = function() {
                console.log(`Image loaded successfully: ${thumbnailPath}`);
                item.classList.remove('loading');
                item.classList.add('loaded');
                spinner.style.display = 'none';
                img.style.display = 'block';

                // Load full image dimensions for PhotoSwipe
                const fullImg = new Image();
                fullImg.onload = function() {
                    item.setAttribute('data-pswp-width', this.naturalWidth);
                    item.setAttribute('data-pswp-height', this.naturalHeight);
                    console.log(`Full image dimensions: ${this.naturalWidth}x${this.naturalHeight}`);
                };
                fullImg.onerror = function() {
                    console.warn(`Failed to load full image: ${fullImagePath}`);
                };
                fullImg.src = fullImagePath;
            };

            img.onerror = function() {
                console.error(`Failed to load thumbnail: ${thumbnailPath}`);
                item.classList.remove('loading');
                item.classList.add('error');
                spinner.innerHTML = '<div style="color: #dc3545; text-align: center;"><i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i><br>Image not found</div>';
            };

            // Trigger image loading
            console.log(`Starting to load thumbnail: ${thumbnailPath}`);
        });

        console.log(`Grid now has ${gridContainer.children.length} items`);

        // Add CSS animation if not exists
        if (!document.querySelector('#gallery-spin-animation')) {
            const style = document.createElement('style');
            style.id = 'gallery-spin-animation';
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    }

    // Initialize PhotoSwipe for a gallery
    function initPhotoSwipe(gallerySelector, category) {
        const lightbox = new PhotoSwipeLightbox({
            gallery: gallerySelector,
            children: 'a',
            pswpModule: PhotoSwipe,

            // Basic PhotoSwipe options
            bgOpacity: 0.9,
            spacing: 0.1,
            loop: false,  // Disable looping to prevent issues at boundaries
            wheelToZoom: true,
            pinchToClose: true,
            closeOnVerticalDrag: true,
            preload: [1, 2],

            // Disable default navigation arrows
            arrowPrev: false,
            arrowNext: false,

            // Custom padding for thumbnails space
            paddingFn: (viewportSize) => {
                return {
                    top: 40,
                    bottom: 100,
                    left: 10,
                    right: 10
                };
            }
        });

        lightbox.init();

        // Add UI only once when PhotoSwipe opens
        lightbox.on('openingAnimationStart', () => {
            const pswp = lightbox.pswp;
            if (!pswp || pswp.scrollWrap.querySelector('[data-custom-ui-added]')) return;

            // Mark that we added custom UI
            pswp.scrollWrap.setAttribute('data-custom-ui-added', 'true');

            // Add counter
            const counter = document.createElement('div');
            counter.className = 'pswp__counter';
            counter.style.cssText = 'position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px; z-index: 1001;';
            pswp.scrollWrap.appendChild(counter);

            // Add navigation arrows
            const prevArrow = document.createElement('button');
            prevArrow.className = 'custom-prev-arrow';
            prevArrow.innerHTML = '‹';
            prevArrow.style.cssText = 'position: absolute; top: 50%; left: 20px; transform: translateY(-50%); width: 50px; height: 50px; background: rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.3); color: white; font-size: 30px; border-radius: 50%; cursor: pointer; z-index: 1001; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s ease;';
            prevArrow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (pswp.currIndex > 0) {
                    pswp.prev();
                }
            };
            pswp.scrollWrap.appendChild(prevArrow);

            const nextArrow = document.createElement('button');
            nextArrow.className = 'custom-next-arrow';
            nextArrow.innerHTML = '›';
            nextArrow.style.cssText = 'position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 50px; height: 50px; background: rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.3); color: white; font-size: 30px; border-radius: 50%; cursor: pointer; z-index: 1001; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s ease;';
            nextArrow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (pswp.currIndex < pswp.getNumItems() - 1) {
                    pswp.next();
                }
            };
            pswp.scrollWrap.appendChild(nextArrow);

            // Add thumbnails with optimized loading
            const thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.className = 'custom-thumbnails';
            thumbnailsContainer.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); padding: 15px; display: flex; gap: 8px; overflow-x: auto; z-index: 1001; max-height: 90px;';

            // Get gallery images and add loading states for thumbnails
            const galleryLinks = document.querySelectorAll(`${gallerySelector} a`);
            galleryLinks.forEach((link, index) => {
                const thumbEl = document.createElement('div');
                thumbEl.className = 'custom-thumb loading';
                thumbEl.style.cssText = 'flex-shrink: 0; width: 60px; height: 60px; border-radius: 4px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.3s;';

                const thumbImg = document.createElement('img');
                thumbImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover; opacity: 0;';

                // Handle thumbnail image loading
                thumbImg.onload = function() {
                    thumbEl.classList.remove('loading');
                    thumbEl.classList.add('loaded');
                    this.style.opacity = '1';
                };

                thumbImg.onerror = function() {
                    thumbEl.classList.remove('loading');
                    thumbEl.classList.add('error');
                    thumbEl.style.background = '#ffe6e6';
                    thumbEl.innerHTML = '⚠️';
                };

                // Use thumbnail from main gallery item (which loads the optimized thumbnail)
                const mainImg = link.querySelector('img');
                if (mainImg && mainImg.src && mainImg.complete) {
                    thumbImg.src = mainImg.src;
                } else {
                    thumbImg.src = link.href;
                }

                thumbEl.appendChild(thumbImg);

                thumbEl.addEventListener('click', () => {
                    pswp.goTo(index);
                });

                thumbnailsContainer.appendChild(thumbEl);
            });

            pswp.scrollWrap.appendChild(thumbnailsContainer);

            // Update UI on slide change
            const updateUI = () => {
                const currentIndex = pswp.currIndex;
                const totalItems = pswp.getNumItems();

                // Update counter
                counter.textContent = `${currentIndex + 1} / ${totalItems}`;

                // Update arrow visibility and state
                if (currentIndex === 0) {
                    prevArrow.style.opacity = '0.3';
                    prevArrow.style.cursor = 'not-allowed';
                } else {
                    prevArrow.style.opacity = '1';
                    prevArrow.style.cursor = 'pointer';
                }

                if (currentIndex === totalItems - 1) {
                    nextArrow.style.opacity = '0.3';
                    nextArrow.style.cursor = 'not-allowed';
                } else {
                    nextArrow.style.opacity = '1';
                    nextArrow.style.cursor = 'pointer';
                }

                // Update active thumbnail
                const thumbnails = thumbnailsContainer.querySelectorAll('.custom-thumb');
                thumbnails.forEach((thumb, index) => {
                    if (index === currentIndex) {
                        thumb.style.borderColor = '#667eea';
                        thumb.style.transform = 'scale(1.1)';
                    } else {
                        thumb.style.borderColor = 'transparent';
                        thumb.style.transform = 'scale(1)';
                    }
                });

                // Scroll active thumbnail into view - with better boundary control
                const activeThumb = thumbnails[currentIndex];
                if (activeThumb) {
                    // Check if thumbnail is in viewport
                    const containerRect = thumbnailsContainer.getBoundingClientRect();
                    const thumbRect = activeThumb.getBoundingClientRect();

                    if (thumbRect.left < containerRect.left || thumbRect.right > containerRect.right) {
                        activeThumb.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                }
            };

            // Initial UI update
            updateUI();

            // Listen for slide changes
            pswp.on('change', updateUI);
        });

        // Keyboard navigation
        lightbox.on('afterInit', () => {
            const pswp = lightbox.pswp;

            const handleKeyDown = (e) => {
                if (!pswp || !pswp.isOpen) return;

                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        pswp.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        pswp.next();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        pswp.close();
                        break;
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            pswp.on('close', () => {
                document.removeEventListener('keydown', handleKeyDown);
            });
        });

        return lightbox;
    }

    // Open PhotoSwipe gallery
    function openPhotoSwipeGallery(category) {
        console.log(`=== openPhotoSwipeGallery called with category: ${category} ===`);

        // Check if GalleryData is available
        if (typeof GalleryData === 'undefined') {
            console.error('GalleryData is not available!');
            return;
        }

        const categoryMappings = {
            'luxury-bathware': {
                containerId: 'luxury-bathware-gallery',
                gridId: 'luxury-bathware-grid'
            },
            'premium-tiles': {
                containerId: 'premium-tiles-gallery',
                gridId: 'premium-tiles-grid'
            }
        };

        const config = categoryMappings[category];
        if (!config) {
            console.error(`No mapping found for category: ${category}`);
            return;
        }

        console.log(`Using config:`, config);

        const container = document.getElementById(config.containerId);
        const gridContainer = document.getElementById(config.gridId);

        console.log(`Container found:`, container);
        console.log(`Grid container found:`, gridContainer);

        if (!container || !gridContainer) {
            console.error(`Container elements not found for category: ${category}`);
            console.log(`Available elements with ID containing 'gallery':`,
                Array.from(document.querySelectorAll('[id*="gallery"]')).map(el => el.id));
            return;
        }

        // Show the gallery container
        container.style.display = 'block';
        console.log(`Gallery container is now visible`);

        // Smooth scroll to gallery
        setTimeout(() => {
            container.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log(`Scrolled to gallery container`);
        }, 100);

        // Create gallery grid with optimized thumbnails
        console.log(`Grid container children count before: ${gridContainer.children.length}`);
        if (gridContainer.children.length === 0) {
            console.log(`Creating gallery grid...`);
            createGalleryGrid(category, config.gridId);
        } else {
            console.log(`Gallery grid already exists`);
        }
    }

    // Initialize PhotoSwipe when user clicks on an image
    function initPhotoSwipeOnDemand(category) {
        const categoryMappings = {
            'luxury-bathware': {
                gridId: 'luxury-bathware-grid'
            },
            'premium-tiles': {
                gridId: 'premium-tiles-grid'
            }
        };

        const config = categoryMappings[category];
        if (!config) {
            return;
        }

        const gallerySelector = `#${config.gridId}`;

        // Check if already initialized
        const isAlreadyInitialized = (category === 'luxury-bathware' && luxuryBathwareLightbox) ||
                                    (category === 'premium-tiles' && premiumTilesLightbox);

        if (isAlreadyInitialized) {
            return;
        }

        console.log(`Initializing PhotoSwipe for category: ${category}`);

        try {
            if (category === 'luxury-bathware') {
                luxuryBathwareLightbox = initPhotoSwipe(gallerySelector, category);
            } else if (category === 'premium-tiles') {
                premiumTilesLightbox = initPhotoSwipe(gallerySelector, category);
            }
        } catch (error) {
            console.error(`Error initializing PhotoSwipe for ${category}:`, error);
        }
    }

    // Close PhotoSwipe gallery
    function closePhotoSwipeGallery(category) {
        const categoryMappings = {
            'luxury-bathware': 'luxury-bathware-gallery',
            'premium-tiles': 'premium-tiles-gallery'
        };

        const containerId = categoryMappings[category];
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = 'none';

                // Scroll back to gallery section
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                    gallerySection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
    }

    // Handle window resize for PhotoSwipe
    function handleResize() {
        if (luxuryBathwareLightbox?.pswp?.isOpen) {
            luxuryBathwareLightbox.pswp.invalidateCurrItems();
            luxuryBathwareLightbox.pswp.updateSize(true);
        }
        if (premiumTilesLightbox?.pswp?.isOpen) {
            premiumTilesLightbox.pswp.invalidateCurrItems();
            premiumTilesLightbox.pswp.updateSize(true);
        }
    }

    // Initialize touch events for mobile
    function initMobileEvents() {
        // Add touch feedback for gallery items
        document.addEventListener('touchstart', function(e) {
            if (e.target.closest('.gallery-item')) {
                e.target.closest('.gallery-item').style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', function(e) {
            if (e.target.closest('.gallery-item')) {
                setTimeout(() => {
                    e.target.closest('.gallery-item').style.transform = '';
                }, 150);
            }
        });

        // Prevent zoom on double tap for gallery items
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300 && e.target.closest('.gallery-item')) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Public API
    return {
        openPhotoSwipeGallery,
        closePhotoSwipeGallery,
        handleResize,

        init: function() {
            console.log('PhotoSwipe Gallery module initializing...');

            // Check if GalleryData is available
            if (typeof GalleryData === 'undefined') {
                console.error('GalleryData not found! Make sure gallery-data.js is loaded before photoswipe-gallery.js');
                return;
            }

            // Initialize mobile events
            initMobileEvents();

            // Handle window resize
            window.addEventListener('resize', handleResize);

            console.log('PhotoSwipe Gallery module initialized successfully');
        }
    };
})();

// Make functions globally available
window.openPhotoSwipeGallery = PhotoSwipeGallery.openPhotoSwipeGallery;
window.closePhotoSwipeGallery = PhotoSwipeGallery.closePhotoSwipeGallery;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PhotoSwipeGallery.init();
});