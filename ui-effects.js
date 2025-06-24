// UI Effects Module
const UIEffects = (function() {
    
    // Background image slider
    function initBackgroundSlider() {
        const images = document.querySelectorAll('.background-slider img');
        let currentImageIndex = 0;

        function changeBackgroundImage() {
            // Remove active class from current image
            images[currentImageIndex].classList.remove('active');
            
            // Move to next image
            currentImageIndex = (currentImageIndex + 1) % images.length;
            
            // Add active class to new image
            images[currentImageIndex].classList.add('active');
        }

        // Only start slider if there are images
        if (images.length > 1) {
            // Change image every 3 seconds
            setInterval(changeBackgroundImage, 3000);
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navbar scroll effect
    function initNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.classList.add('scrolled');
            } else {
                navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                navbar.style.backdropFilter = 'none';
                navbar.classList.remove('scrolled');
            }
        }

        // Initial check
        updateNavbar();

        // Listen for scroll events
        window.addEventListener('scroll', updateNavbar);
        
        // Throttle scroll events for better performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
                setTimeout(() => { ticking = false; }, 16); // ~60fps
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    // Parallax effect for header (optional enhancement)
    function initParallaxEffect() {
        const header = document.getElementById('header');
        
        if (!header) return;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            header.style.transform = `translateY(${rate}px)`;
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateParallax);
        });
    }

    // Fade in animation for sections on scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('fade-in-ready');
            observer.observe(section);
        });
    }

    // Hover effects for interactive elements
    function initHoverEffects() {
        // Gallery category hover sound effect (if audio is desired)
        const galleryCategories = document.querySelectorAll('.gallery-category');
        
        galleryCategories.forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Feature box animations
        const featureBoxes = document.querySelectorAll('.feature-box');
        
        featureBoxes.forEach(box => {
            box.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.color = '#764ba2';
                }
            });
            
            box.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.color = '#667eea';
                }
            });
        });
    }

    // Loading animation
    function initLoadingEffects() {
        // Hide loader when page is fully loaded
        window.addEventListener('load', function() {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        });
    }

    // Typing effect for hero text (optional)
    function initTypingEffect() {
        const heroTitle = document.querySelector('.header-content h1');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Public API
    return {
        initBackgroundSlider,
        initSmoothScrolling,
        initNavbarScrollEffect,
        initParallaxEffect,
        initScrollAnimations,
        initHoverEffects,
        initLoadingEffects,
        initTypingEffect,
        
        init: function() {
            // Initialize all UI effects
            initBackgroundSlider();
            initSmoothScrolling();
            initNavbarScrollEffect();
            initHoverEffects();
            initLoadingEffects();
            // initParallaxEffect(); // Uncomment if desired
            // initScrollAnimations(); // Uncomment if desired
            // initTypingEffect(); // Uncomment if desired
            
            console.log('UI Effects module initialized');
        }
    };
})();

// Optional: Add CSS for fade-in animations
const fadeInCSS = `
    .fade-in-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    }
`;

// Inject CSS if needed
if (!document.querySelector('#ui-effects-css')) {
    const style = document.createElement('style');
    style.id = 'ui-effects-css';
    style.textContent = fadeInCSS;
    document.head.appendChild(style);
}