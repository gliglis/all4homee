function closeGalleryLightbox(category) {
        const modal = document.getElementById(category + '-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }// Gallery Module
const Gallery = (function() {
    // Gallery image arrays
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

    // Gallery lightbox variables
    let currentImageIndex = 0;
    let currentImageArray = [];
    let currentImageFolder = '';

    // Gallery Lightbox Functions
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
        
        // Create gallery grid immediately with placeholders
        createGalleryWithPlaceholders(images, folder, gallery);
    }

    function createGalleryWithPlaceholders(images, folder, gallery) {
        // Clear and create grid immediately
        gallery.innerHTML = '';
        gallery.className = 'lightbox-gallery';
        
        // Create all placeholders first - visible immediately
        images.forEach((imageName, index) => {
            const item = document.createElement('div');
            item.className = 'lightbox-item placeholder-active';
            
            // Placeholder with loader - visible immediately
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
            
            // Start loading image after placeholder is visible
            setTimeout(() => {
                loadImageForItem(img, placeholder, item, folder, imageName);
            }, index * 50); // Stagger loading for smoother experience
        });
    }

    function loadImageForItem(img, placeholder, item, folder, imageName) {
        img.onload = function() {
            // Hide placeholder, show image
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
                openImageZoom(img.src, imageName.replace(/\.(jpg|png|jpeg)$/i, ''));
            });
        };
        
        img.onerror = function() {
            placeholder.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <div class="error-text">Failed to load</div>
            `;
            placeholder.classList.add('error');
        };
        
        // Start loading
        img.src = `./gallery/${folder}/${imageName}`;
    }

    // Image zoom functions
    function openImageZoom(imageSrc, imageTitle) {
        // Find current image index and set up array
        const category = imageSrc.includes('luxury_bathware') ? 'luxury-bathware' : 'premium-tiles';
        currentImageArray = category === 'luxury-bathware' ? luxuryBathwareImages : premiumTilesImages;
        currentImageFolder = category === 'luxury-bathware' ? 'luxury_bathware' : 'premium_porcelain_marbles_and_ceramic';
        
        // Find current image index
        const fileName = imageSrc.split('/').pop();
        currentImageIndex = currentImageArray.findIndex(img => img === fileName);
        
        // Show modal and update content
        const modal = document.getElementById('image-zoom-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        updateZoomedImage();
        createThumbnails();
    }

    function updateZoomedImage() {
        const zoomedImage = document.getElementById('zoomed-image');
        const zoomedTitle = document.getElementById('zoomed-title');
        const currentImage = currentImageArray[currentImageIndex];
        
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
        
        // Create new image to get natural dimensions and preload
        const tempImg = new Image();
        tempImg.onload = function() {
            // Set the source
            zoomedImage.src = `./gallery/${currentImageFolder}/${currentImage}`;
            zoomedTitle.textContent = currentImage.replace(/\.(jpg|png|jpeg)$/i, '');
            
            // Calculate optimal dimensions based on viewport and image aspect ratio
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const imageAspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            
            // Calculate maximum dimensions (leaving space for controls and thumbnails)
            const maxWidth = viewportWidth * 0.9;
            const maxHeight = viewportHeight * 0.7;
            const maxAspectRatio = maxWidth / maxHeight;
            
            let finalWidth, finalHeight;
            
            if (imageAspectRatio > maxAspectRatio) {
                // Image is wider - limit by width
                finalWidth = Math.min(maxWidth, tempImg.naturalWidth);
                finalHeight = finalWidth / imageAspectRatio;
            } else {
                // Image is taller - limit by height
                finalHeight = Math.min(maxHeight, tempImg.naturalHeight);
                finalWidth = finalHeight * imageAspectRatio;
            }
            
            // Apply calculated dimensions
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
        
        tempImg.onerror = function() {
            loader.style.display = 'none';
            zoomedImage.style.opacity = '1';
            zoomedTitle.textContent = 'Failed to load image';
        };
        
        tempImg.src = `./gallery/${currentImageFolder}/${currentImage}`;
        
        // Update active thumbnail
        updateActiveThumbnail();
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
            img.src = `./gallery/${currentImageFolder}/${imageName}`;
            img.alt = imageName.replace(/\.(jpg|png|jpeg)$/i, '');
            img.loading = 'lazy';
            
            // Error handling for images
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
        
        // Scroll active thumbnail into view after a short delay
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
            
            // Calculate if thumbnail is visible
            const isVisible = thumbnailRect.left >= containerRect.left && 
                             thumbnailRect.right <= containerRect.right;
            
            if (!isVisible) {
                // Calculate scroll position to center the thumbnail
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
        
        // Scroll active thumbnail into view
        scrollToActiveThumbnail();
    }

    function nextImage() {
        if (currentImageArray.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
            updateZoomedImage();
        }
    }

    function previousImage() {
        if (currentImageArray.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
            updateZoomedImage();
        }
    }

    function closeImageZoom() {
        const modal = document.getElementById('image-zoom-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function handleResize() {
        const modal = document.getElementById('image-zoom-modal');
        if (modal && modal.style.display === 'block') {
            // Recalculate image size on window resize
            setTimeout(updateZoomedImage, 100);
        }
    }

    // Public API
    return {
        openGalleryLightbox,
        closeGalleryLightbox,
        nextImage,
        previousImage,
        closeImageZoom,
        handleResize,
        init: function() {
            // Gallery-specific initialization if needed
            console.log('Gallery module initialized');
        }
    };
})();

// Make functions globally available for onclick handlers
window.openGalleryLightbox = Gallery.openGalleryLightbox;
window.closeGalleryLightbox = Gallery.closeGalleryLightbox;
window.nextImage = Gallery.nextImage;
window.previousImage = Gallery.previousImage;
window.closeImageZoom = Gallery.closeImageZoom;