// Gallery Module with Optimized Loading
const Gallery = (function() {
    // Gallery image arrays
    const luxuryBathwareImages = [
    'ACM2902409005A.jpg', 'ACM3402409004A.jpg', 'ACM3502409001B.jpg', 'ACM4502409003A.jpg',
    'ACS322001.jpg', 'ACS322002.jpg', 'ACS322003.jpg', 'ACS322004-1.jpg', 'ACS322005.jpg',
    'AH17005_-_right_corner_view.jpg', 'AH17005_-_side_view.jpg', 'AH17005_-_vertical_view.jpg',
    'AH17005-vertical_right_view_.jpg', 'AH17005B_-side_view.jpg', 'AH17005B_-vertical_view_.jpg',
    'AH17005L_-vertical_view.jpg', 'AH17005L-right_vertical_view_.jpg', 'AH17005L-side_view.jpg',
    'AH17005R-vertical_view.jpg', 'AH17006_-_side_view.jpg', 'AH17006-left_side_view.jpg',
    'AH17006-right_side_view.jpg', 'AH17006-vertical_view.jpg', 'AH17006B_-_side_view.jpg',
    'AH17006B-vertical_view.jpg', 'AH17006L_-_side_view.jpg', 'AH17006L-left_side_view_.jpg',
    'AH17006L-vertical_view_.jpg', 'AH17008_side_view.jpg', 'AH17008-half_vertical_view_.jpg',
    'AH17008-right_part_view.jpg', 'AH17008-right_view.jpg', 'AH17008-side_view.jpg',
    'AH17008-vertical_view.jpg', 'AH17008B-15_half_vertical_view.jpg', 'AH17008B-15_left_side_view.jpg',
    'AH17008B-15L_side_view.jpg', 'AH17008B-vertical_view.jpg', 'AH17008WB_side_view.jpg',
    'AH17008WB_vertical_view_.jpg', 'AH17008WR_Right_side_view.jpg', 'AH17008WR_side_view.jpg',
    'AH17008WR_vertical_view.jpg'
    ];

    const premiumTilesImages = [
    'ACM3502409001A-1.png', 'ACM3502409001B-1.png', 'ACM3502409001C-1.png', 'ACS322001_(2).jpg',
    'ACS322004A.jpg', 'Armani-_DK_Grey.jpg', 'Armani-Bianco.jpg', 'Armani-Grey.jpg', 'Armani-LT_Grey.jpg',
    'LAURA_BEIGE-_ACT311060_.jpg', 'LAURA_BIANCO_ACT310060.jpg', 'LAURA_SILVER_-_ACT312060.jpg',
    'NF126910ML5.jpg', 'S12P80_Patrick_Ivory.jpg', 'S12P81_Patrick_Beige.jpg', 'S12P82_Patrick_Charcoal.jpg',
    'S12P90_Patrick_Ivory.jpg', 'S12P91_Patrick_Beige.jpg', 'S12P92_Patrick_Charcoal.jpg',
    'SAVAN_-AC060315-E_LT_GREY.JPG', 'SAVAN_EXTERNAL_ACT315126__LT_GREY.JPG',
    'SAVAN_EXTERNAL_ACT316126__GREY.jpg', 'SAVAN_EXTERNAL_ACT317126_DK_GREY.jpg',
    'SAVAN-AC060316-E_GREY.jpg', 'SAVAN-AC060317-E_DK_GREY.jpg'
    ];

    // ============ OPTIMIZATION FEATURES ============

    // Image cache for loaded images
    const imageCache = new Map();

    // Loading queue management
    let loadingQueue = [];
    let currentlyLoading = 0;
    const MAX_CONCURRENT_LOADS = 4; // Maximum simultaneous image loads

    // Gallery lightbox variables
    let currentImageIndex = 0;
    let currentImageArray = [];
    let currentImageFolder = '';

    // ============ OPTIMIZED LOADING SYSTEM ============

    // Get cache key for image
    function getCacheKey(folder, imageName) {
        return `${folder}/${imageName}`;
    }

    // Add image to loading queue
    function queueImageLoad(item, img, placeholder, folder, imageName, priority = false) {
        const loadTask = {
            item,
            img,
            placeholder,
            folder,
            imageName,
            priority
        };

        if (priority) {
            loadingQueue.unshift(loadTask);
        } else {
            loadingQueue.push(loadTask);
        }

        processLoadingQueue();
    }

    // Process the loading queue
    function processLoadingQueue() {
        while (currentlyLoading < MAX_CONCURRENT_LOADS && loadingQueue.length > 0) {
            const task = loadingQueue.shift();
            currentlyLoading++;
            loadImageForItem(task.img, task.placeholder, task.item, task.folder, task.imageName);
        }
    }

    // Check if image is visible in viewport
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top < windowHeight &&
            rect.bottom > 0 &&
            rect.left < windowWidth &&
            rect.right > 0
        );
    }

    // ============ MAIN GALLERY FUNCTIONS ============

    function openGalleryLightbox(category) {
        const modal = document.getElementById(category + '-modal');
        const gallery = document.getElementById(category + '-gallery');

        if (!modal || !gallery) {
            return;
        }

        // Show modal immediately
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Get images for the category
        const images = category === 'luxury-bathware' ? luxuryBathwareImages : premiumTilesImages;
        const folder = category === 'luxury-bathware' ? 'luxury_bathware' : 'premium_porcelain_marbles_and_ceramic';

        // Create gallery grid with optimized loading
        createOptimizedGallery(images, folder, gallery);
    }

    function createOptimizedGallery(images, folder, gallery) {
        // Clear gallery and reset queue
        gallery.innerHTML = '';
        gallery.className = 'lightbox-gallery';
        loadingQueue = [];
        currentlyLoading = 0;

        // Create all placeholders first
        const galleryItems = [];

        images.forEach((imageName, index) => {
            const item = document.createElement('div');
            item.className = 'lightbox-item placeholder-active';

            // Placeholder with loader
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder loading';
            placeholder.innerHTML = `
                <div class="spinner"></div>
                <div class="loading-text">Loading...</div>
            `;

            // Hidden image element
            const img = document.createElement('img');
            img.style.display = 'none';
            img.alt = imageName.replace(/\.(jpg|png|jpeg)$/i, '');

            const title = document.createElement('div');
            title.className = 'lightbox-item-title';
            title.textContent = imageName.replace(/\.(jpg|png|jpeg)$/i, '');

            item.appendChild(placeholder);
            item.appendChild(img);
            item.appendChild(title);
            gallery.appendChild(item);

            galleryItems.push({
                item,
                img,
                placeholder,
                imageName,
                index
            });
        });

        // Prioritize visible images, then queue the rest
        setTimeout(() => {
            // First, identify visible images
            const visibleItems = [];
            const hiddenItems = [];

            galleryItems.forEach(galleryItem => {
                if (isElementVisible(galleryItem.item)) {
                    visibleItems.push(galleryItem);
                } else {
                    hiddenItems.push(galleryItem);
                }
            });

            // Load visible images first (high priority)
            visibleItems.forEach(galleryItem => {
                queueImageLoad(
                    galleryItem.item,
                    galleryItem.img,
                    galleryItem.placeholder,
                    folder,
                    galleryItem.imageName,
                    true // high priority
                );
            });

            // Then queue hidden images
            hiddenItems.forEach(galleryItem => {
                queueImageLoad(
                    galleryItem.item,
                    galleryItem.img,
                    galleryItem.placeholder,
                    folder,
                    galleryItem.imageName,
                    false // normal priority
                );
            });

        }, 50);
    }

    function loadImageForItem(img, placeholder, item, folder, imageName) {
        const cacheKey = getCacheKey(folder, imageName);

        // Check if image is already in cache
        if (imageCache.has(cacheKey)) {
            const cachedSrc = imageCache.get(cacheKey);
            img.src = cachedSrc;
            showLoadedImage(img, placeholder, item, imageName);
            currentlyLoading--;
            processLoadingQueue(); // Continue with queue
            return;
        }

        // Load image with error handling and retry
        loadImageWithRetry(img, folder, imageName, 3)
            .then(() => {
                // Cache the loaded image
                imageCache.set(cacheKey, img.src);
                showLoadedImage(img, placeholder, item, imageName);
            })
            .catch(() => {
                showImageError(placeholder);
            })
            .finally(() => {
                currentlyLoading--;
                processLoadingQueue(); // Continue with queue
            });
    }

    // Load image with retry mechanism
    function loadImageWithRetry(img, folder, imageName, maxRetries) {
        return new Promise((resolve, reject) => {
            let retries = 0;

            function attemptLoad() {
                const newImg = new Image();

                newImg.onload = function() {
                    img.src = this.src;
                    resolve();
                };

                newImg.onerror = function() {
                    retries++;
                    if (retries < maxRetries) {
                        // Exponential backoff: 500ms, 1s, 2s
                        const delay = Math.pow(2, retries - 1) * 500;
                        setTimeout(attemptLoad, delay);
                    } else {
                        reject();
                    }
                };

                newImg.src = `./gallery/${folder}/${imageName}`;
            }

            attemptLoad();
        });
    }

    // Show successfully loaded image
    function showLoadedImage(img, placeholder, item, imageName) {
        placeholder.style.display = 'none';
        img.style.display = 'block';
        img.style.opacity = '0';

        // Fade in image
        setTimeout(() => {
            img.style.opacity = '1';
            item.classList.remove('placeholder-active');
            item.classList.add('image-loaded');
        }, 50);

        // Add click event when image is loaded
        item.addEventListener('click', function() {
            const cleanImageName = imageName.replace(/\.(jpg|png|jpeg)$/i, '');
            openImageZoom(img.src, cleanImageName);
        });
    }

    // Show image error
    function showImageError(placeholder) {
        placeholder.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div class="error-text">Failed to load</div>
        `;
        placeholder.classList.add('error');
    }

    // ============ IMAGE ZOOM FUNCTIONS (Optimized) ============

    function openImageZoom(imageSrc, imageTitle) {
        // Clear previous image immediately
        const zoomedImage = document.getElementById('zoomed-image');
        const zoomedTitle = document.getElementById('zoomed-title');

        // Reset image state immediately
        zoomedImage.src = '';
        zoomedImage.style.opacity = '0';
        zoomedTitle.textContent = 'Loading...';

        // Find current image index and set up array
        const category = imageSrc.includes('luxury_bathware') ? 'luxury-bathware' : 'premium-tiles';
        currentImageArray = category === 'luxury-bathware' ? luxuryBathwareImages : premiumTilesImages;
        currentImageFolder = category === 'luxury-bathware' ? 'luxury_bathware' : 'premium_porcelain_marbles_and_ceramic';

        // Find current image index
        const fileName = imageSrc.split('/').pop();
        currentImageIndex = currentImageArray.findIndex(img => img === fileName);

        // Show modal immediately
        const modal = document.getElementById('image-zoom-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Show loader immediately
        const imageContainer = zoomedImage.parentElement;
        let loader = imageContainer.querySelector('.zoom-loader');

        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'zoom-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            imageContainer.appendChild(loader);
        }

        loader.style.display = 'flex';

        // Clear thumbnails container
        const thumbnailsContainer = document.getElementById('thumbnails-container');
        thumbnailsContainer.innerHTML = '';

        // Load the selected image and create thumbnails
        updateZoomedImage();
        createThumbnails();

        // Preload next and previous images
        preloadAdjacentImages();
    }

    // Preload next and previous images for smooth navigation
    function preloadAdjacentImages() {
        const preloadIndexes = [
            (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length,
            (currentImageIndex + 1) % currentImageArray.length
        ];

        preloadIndexes.forEach(index => {
            const imageName = currentImageArray[index];
            const cacheKey = getCacheKey(currentImageFolder, imageName);

            if (!imageCache.has(cacheKey)) {
                const img = new Image();
                img.onload = () => {
                    imageCache.set(cacheKey, img.src);
                };
                img.src = `./gallery/${currentImageFolder}/${imageName}`;
            }
        });
    }

    function updateZoomedImage() {
        const zoomedImage = document.getElementById('zoomed-image');
        const zoomedTitle = document.getElementById('zoomed-title');
        const currentImage = currentImageArray[currentImageIndex];
        const cacheKey = getCacheKey(currentImageFolder, currentImage);

        // Show loading state for zoom
        const imageContainer = zoomedImage.parentElement;
        let loader = imageContainer.querySelector('.zoom-loader');

        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'zoom-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            imageContainer.appendChild(loader);
        }

        loader.style.display = 'flex';
        zoomedImage.style.opacity = '0.3';

        // Check cache first
        if (imageCache.has(cacheKey)) {
            // Use cached image
            const cachedSrc = imageCache.get(cacheKey);
            showZoomedImage(zoomedImage, zoomedTitle, cachedSrc, currentImage, loader);
        } else {
            // Load new image
            const tempImg = new Image();
            tempImg.onload = function() {
                // Cache the image
                imageCache.set(cacheKey, this.src);
                showZoomedImage(zoomedImage, zoomedTitle, this.src, currentImage, loader);
            };

            tempImg.onerror = function() {
                loader.style.display = 'none';
                zoomedImage.style.opacity = '1';
                zoomedTitle.textContent = 'Failed to load image';
            };

            tempImg.src = `./gallery/${currentImageFolder}/${currentImage}`;
        }

        // Update active thumbnail
        updateActiveThumbnail();

        // Preload adjacent images
        preloadAdjacentImages();
    }

    function showZoomedImage(zoomedImage, zoomedTitle, src, imageName, loader) {
        // Set the source and title
        zoomedImage.src = src;
        zoomedTitle.textContent = imageName.replace(/\.(jpg|png|jpeg)$/i, '');

        // Calculate optimal dimensions
        const tempImg = new Image();
        tempImg.onload = function() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const imageAspectRatio = this.naturalWidth / this.naturalHeight;

            const maxWidth = viewportWidth * 0.9;
            const maxHeight = viewportHeight * 0.7;
            const maxAspectRatio = maxWidth / maxHeight;

            let finalWidth, finalHeight;

            if (imageAspectRatio > maxAspectRatio) {
                finalWidth = Math.min(maxWidth, this.naturalWidth);
                finalHeight = finalWidth / imageAspectRatio;
            } else {
                finalHeight = Math.min(maxHeight, this.naturalHeight);
                finalWidth = finalHeight * imageAspectRatio;
            }

            zoomedImage.style.width = finalWidth + 'px';
            zoomedImage.style.height = finalHeight + 'px';
            zoomedImage.style.maxWidth = 'none';
            zoomedImage.style.maxHeight = 'none';

            // Hide loader and show image
            setTimeout(() => {
                loader.style.display = 'none';
                zoomedImage.style.opacity = '1';
            }, 100);
        };
        tempImg.src = src;
    }

    function createThumbnails() {
        const container = document.getElementById('thumbnails-container');
        container.innerHTML = '';

        currentImageArray.forEach((imageName, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'thumbnail-item';
            if (index === currentImageIndex) {
                thumbnailDiv.classList.add('active');
            }

            const img = document.createElement('img');
            const cacheKey = getCacheKey(currentImageFolder, imageName);

            // Use cached image if available
            if (imageCache.has(cacheKey)) {
                img.src = imageCache.get(cacheKey);
            } else {
                img.src = `./gallery/${currentImageFolder}/${imageName}`;
                img.loading = 'lazy';
            }

            img.alt = imageName.replace(/\.(jpg|png|jpeg)$/i, '');

            img.onerror = function() {
                this.style.display = 'none';
                thumbnailDiv.style.display = 'none';
            };

            thumbnailDiv.appendChild(img);
            thumbnailDiv.addEventListener('click', () => {
                currentImageIndex = index;
                updateZoomedImage();
            });

            container.appendChild(thumbnailDiv);
        });

        setTimeout(() => {
            scrollToActiveThumbnail();
        }, 100);
    }

    function scrollToActiveThumbnail() {
        const container = document.getElementById('thumbnails-container');
        const activeThumbnail = container.querySelector('.thumbnail-item.active');

        if (activeThumbnail && container) {
            const containerRect = container.getBoundingClientRect();
            const thumbnailRect = activeThumbnail.getBoundingClientRect();

            const isVisible = thumbnailRect.left >= containerRect.left &&
                             thumbnailRect.right <= containerRect.right;

            if (!isVisible) {
                const containerWidth = container.clientWidth;
                const thumbnailLeft = activeThumbnail.offsetLeft;
                const thumbnailWidth = activeThumbnail.offsetWidth;
                const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }

    function updateActiveThumbnail() {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });

        scrollToActiveThumbnail();
    }

    function nextImage() {
        if (currentImageArray.length > 0) {
            const zoomedImage = document.getElementById('zoomed-image');
            zoomedImage.style.opacity = '0.3';

            currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
            updateZoomedImage();
        }
    }

    function previousImage() {
        if (currentImageArray.length > 0) {
            const zoomedImage = document.getElementById('zoomed-image');
            zoomedImage.style.opacity = '0.3';

            currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
            updateZoomedImage();
        }
    }

    function closeImageZoom() {
        const modal = document.getElementById('image-zoom-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        const zoomedImage = document.getElementById('zoomed-image');
        const zoomedTitle = document.getElementById('zoomed-title');
        const thumbnailsContainer = document.getElementById('thumbnails-container');

        zoomedImage.src = '';
        zoomedImage.style.opacity = '0';
        zoomedTitle.textContent = '';
        thumbnailsContainer.innerHTML = '';

        const imageContainer = zoomedImage.parentElement;
        const loader = imageContainer.querySelector('.zoom-loader');
        if (loader) {
            loader.style.display = 'none';
        }

        currentImageIndex = 0;
        currentImageArray = [];
        currentImageFolder = '';
    }

    function closeGalleryLightbox(category) {
        const modal = document.getElementById(category + '-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Clear gallery content to prevent stale images
        const gallery = document.getElementById(category + '-gallery');
        if (gallery) {
            gallery.innerHTML = '';
        }

        // Clear loading queue
        loadingQueue = [];
        currentlyLoading = 0;
    }

    function handleResize() {
        const modal = document.getElementById('image-zoom-modal');
        if (modal && modal.style.display === 'block') {
            setTimeout(updateZoomedImage, 100);
        }
    }

    // ============ PUBLIC API ============
    return {
        openGalleryLightbox,
        closeGalleryLightbox,
        nextImage,
        previousImage,
        closeImageZoom,
        handleResize,

        // Debug methods
        getCacheSize: () => imageCache.size,
        clearCache: () => imageCache.clear(),
        getQueueLength: () => loadingQueue.length,

        init: function() {
            console.log('Optimized Gallery module initialized');
            console.log(`Max concurrent loads: ${MAX_CONCURRENT_LOADS}`);
        }
    };
})();

// Make functions globally available for onclick handlers
window.openGalleryLightbox = Gallery.openGalleryLightbox;
window.closeGalleryLightbox = Gallery.closeGalleryLightbox;
window.nextImage = Gallery.nextImage;
window.previousImage = Gallery.previousImage;
window.closeImageZoom = Gallery.closeImageZoom;