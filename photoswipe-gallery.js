// PhotoSwipe Gallery Module
const PhotoSwipeGallery = (function() {

    // Gallery image arrays (same as before)
    const luxuryBathwareImages = [
        'ACM2902409005A.jpg', 'ACM3402409004A.jpg', 'ACM3502409001B.jpg', 'ACM4502409003A.jpg',
        'ACS322001.jpg', 'ACS322002.jpg', 'ACS322003.jpg', 'ACS322004-1.jpg', 'ACS322005.jpg',
        'AH17005 - right corner view.jpg', 'AH17005 - side view.jpg', 'AH17005 - vertical view.jpg',
        'AH17005-vertical right view .jpg', 'AH17005B -side view.jpg', 'AH17005B -vertical view .jpg',
        'AH17005L -vertical view.jpg', 'AH17005L-right vertical view .jpg', 'AH17005L-side view.jpg',
        'AH17005R-vertical view.jpg', 'AH17006 - side view.jpg', 'AH17006-left side view.jpg',
        'AH17006-right side view.jpg', 'AH17006-vertical view.jpg', 'AH17006B - side view.jpg',
        'AH17006B-vertical view.jpg', 'AH17006L - side view.jpg', 'AH17006L-left side view .jpg',
        'AH17006L-vertical view .jpg', 'AH17008 side view.jpg', 'AH17008-half vertical view .jpg',
        'AH17008-right part view.jpg', 'AH17008-right view.jpg', 'AH17008-side view.jpg',
        'AH17008-vertical view.jpg', 'AH17008B-15 half vertical view.jpg', 'AH17008B-15 left side view.jpg',
        'AH17008B-15L side view.jpg', 'AH17008B-vertical view.jpg', 'AH17008WB side view.jpg',
        'AH17008WB vertical view .jpg', 'AH17008WR Right side view.jpg', 'AH17008WR side view.jpg',
        'AH17008WR vertical view.jpg'
    ];

    const premiumTilesImages = [
        'ACM3502409001A-1.png', 'ACM3502409001B-1.png', 'ACM3502409001C-1.png', 'ACS322001 (2).jpg',
        'ACS322004A.jpg', 'Armani- DK Grey.jpg', 'Armani-Bianco.jpg', 'Armani-Grey.jpg', 'Armani-LT Grey.jpg',
        'LAURA BEIGE- ACT311060 .jpg', 'LAURA BIANCO ACT310060.jpg', 'LAURA SILVER - ACT312060.jpg',
        'NF126910ML5.jpg', 'S12P80 Patrick Ivory.jpg', 'S12P81 Patrick Beige.jpg', 'S12P82 Patrick Charcoal.jpg',
        'S12P90 Patrick Ivory.jpg', 'S12P91 Patrick Beige.jpg', 'S12P92 Patrick Charcoal.jpg',
        'SAVAN -AC060315-E LT GREY.JPG', 'SAVAN EXTERNAL ACT315126  LT GREY.JPG',
        'SAVAN EXTERNAL ACT316126  GREY.jpg', 'SAVAN EXTERNAL ACT317126 DK GREY.jpg',
        'SAVAN-AC060316-E GREY.jpg', 'SAVAN-AC060317-E DK GREY.jpg'
    ];

    // PhotoSwipe lightbox instances
    let luxuryBathwareLightbox = null;
    let premiumTilesLightbox = null;

    // Create gallery grid HTML - clean version
    function createGalleryGrid(images, folder, gridId) {
        const gridContainer = document.getElementById(gridId);
        if (!gridContainer) {
            return;
        }

        // Clear existing content
        gridContainer.innerHTML = '';

        // Create gallery items
        for (let index = 0; index < images.length; index++) {
            const imageName = images[index];
            const imagePath = `./gallery/${folder}/${imageName}`;

            const item = document.createElement('a');
            item.href = imagePath;
            item.className = 'gallery-item loading';
            item.setAttribute('data-pswp-width', '1200');
            item.setAttribute('data-pswp-height', '800');

            // Add click handler
            item.onclick = function(e) {
                e.preventDefault();

                // Determine category
                const category = gridId.includes('luxury-bathware') ? 'luxury-bathware' : 'premium-tiles';

                // Initialize PhotoSwipe
                initPhotoSwipeOnDemand(category);

                // Open at this index
                setTimeout(() => {
                    const lightbox = category === 'luxury-bathware' ? luxuryBathwareLightbox : premiumTilesLightbox;
                    if (lightbox) {
                        lightbox.loadAndOpen(index);
                    }
                }, 200);
            };

            // Create image
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = imageName;
            img.style.width = '100%';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.display = 'none';

            // Create spinner
            const spinner = document.createElement('div');
            spinner.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 200px; background: #f0f0f0;';
            spinner.innerHTML = '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>';

            // Create title
            const title = document.createElement('div');
            title.className = 'gallery-item-title';
            title.textContent = imageName.replace(/\.(jpg|png|jpeg)$/i, '');

            // Add to item
            item.appendChild(spinner);
            item.appendChild(img);
            item.appendChild(title);

            // Add to grid
            gridContainer.appendChild(item);

            // Handle image loading
            img.onload = function() {
                item.classList.remove('loading');
                item.classList.add('loaded');
                spinner.style.display = 'none';
                img.style.display = 'block';

                // Update PhotoSwipe dimensions
                item.setAttribute('data-pswp-width', this.naturalWidth);
                item.setAttribute('data-pswp-height', this.naturalHeight);
            };

            img.onerror = function() {
                spinner.innerHTML = '⚠️ Error loading image';
                spinner.style.color = 'red';
            };
        }

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }

    // Initialize PhotoSwipe for a gallery - clean version
    function initPhotoSwipe(gallerySelector, category) {
        const lightbox = new PhotoSwipeLightbox({
            gallery: gallerySelector,
            children: 'a',
            pswpModule: PhotoSwipe,

            // Basic PhotoSwipe options
            bgOpacity: 0.9,
            spacing: 0.1,
            loop: true,
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

            // Add navigation arrows with proper styling
            const prevArrow = document.createElement('button');
            prevArrow.className = 'custom-prev-arrow';
            prevArrow.innerHTML = '‹';
            prevArrow.style.cssText = 'position: absolute; top: 50%; left: 20px; transform: translateY(-50%); width: 50px; height: 50px; background: rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.3); color: white; font-size: 30px; border-radius: 50%; cursor: pointer; z-index: 1001; display: flex; align-items: center; justify-content: center;';
            prevArrow.onclick = () => pswp.prev();
            pswp.scrollWrap.appendChild(prevArrow);

            const nextArrow = document.createElement('button');
            nextArrow.className = 'custom-next-arrow';
            nextArrow.innerHTML = '›';
            nextArrow.style.cssText = 'position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 50px; height: 50px; background: rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.3); color: white; font-size: 30px; border-radius: 50%; cursor: pointer; z-index: 1001; display: flex; align-items: center; justify-content: center;';
            nextArrow.onclick = () => pswp.next();
            pswp.scrollWrap.appendChild(nextArrow);

            // Add thumbnails
            const thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.className = 'custom-thumbnails';
            thumbnailsContainer.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); padding: 15px; display: flex; gap: 8px; overflow-x: auto; z-index: 1001; max-height: 90px;';

            // Get gallery images and add loading states for thumbnails
            const galleryLinks = document.querySelectorAll(`${gallerySelector} a`);
            galleryLinks.forEach((link, index) => {
                const thumbEl = document.createElement('div');
                thumbEl.className = 'custom-thumb loading'; // Start with loading state
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

                // Set thumbnail source
                const mainImg = link.querySelector('img');
                if (mainImg && mainImg.src && mainImg.complete) {
                    // Main image is already loaded, use it
                    thumbImg.src = mainImg.src;
                } else {
                    // Use href as fallback
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
                // Update counter
                counter.textContent = `${pswp.currIndex + 1} / ${pswp.getNumItems()}`;

                // Update active thumbnail
                const thumbnails = thumbnailsContainer.querySelectorAll('.custom-thumb');
                thumbnails.forEach((thumb, index) => {
                    if (index === pswp.currIndex) {
                        thumb.style.borderColor = '#667eea';
                        thumb.style.transform = 'scale(1.1)';
                    } else {
                        thumb.style.borderColor = 'transparent';
                        thumb.style.transform = 'scale(1)';
                    }
                });

                // Scroll active thumbnail into view
                const activeThumb = thumbnails[pswp.currIndex];
                if (activeThumb) {
                    activeThumb.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
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
        const categoryMappings = {
            'luxury-bathware': {
                images: luxuryBathwareImages,
                folder: 'luxury_bathware',
                containerId: 'luxury-bathware-gallery',
                gridId: 'luxury-bathware-grid'
            },
            'premium-tiles': {
                images: premiumTilesImages,
                folder: 'premium_porcelain_marbles_and_ceramic',
                containerId: 'premium-tiles-gallery',
                gridId: 'premium-tiles-grid'
            }
        };

        const config = categoryMappings[category];
        if (!config) {
            return;
        }

        const container = document.getElementById(config.containerId);
        const gridContainer = document.getElementById(config.gridId);

        if (!container || !gridContainer) {
            return;
        }

        // Show the gallery container
        container.style.display = 'block';

        // Smooth scroll to gallery
        setTimeout(() => {
            container.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);

        // Create gallery grid immediately and start loading
        if (gridContainer.children.length === 0) {
            createGalleryGrid(config.images, config.folder, config.gridId);
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

        try {
            if (category === 'luxury-bathware') {
                luxuryBathwareLightbox = initPhotoSwipe(gallerySelector, category);
            } else if (category === 'premium-tiles') {
                premiumTilesLightbox = initPhotoSwipe(gallerySelector, category);
            }
        } catch (error) {
            // Silent error handling
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
            // Initialize mobile events
            initMobileEvents();

            // Handle window resize
            window.addEventListener('resize', handleResize);
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