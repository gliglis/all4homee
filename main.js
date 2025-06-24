// Main Application Initializer
const App = (function() {
    
    // Application configuration
    const config = {
        version: '1.0.0',
        debug: false, // Set to true for development
        modules: ['Gallery', 'UIEffects', 'Utils'],
        features: {
            gallery: true,
            backgroundSlider: true,
            smoothScrolling: true,
            navbarEffects: true,
            formHandling: true,
            notifications: true,
            keyboardNavigation: true
        }
    };

    // Module dependency checker
    function checkDependencies() {
        const missing = [];
        
        config.modules.forEach(module => {
            if (typeof window[module] === 'undefined') {
                missing.push(module);
            }
        });
        
        if (missing.length > 0) {
            console.error('Missing required modules:', missing);
            return false;
        }
        
        return true;
    }

    // Initialize all modules
    function initializeModules() {
        const startTime = performance.now();
        
        try {
            // Initialize in specific order for dependencies
            if (config.features.gallery && window.Gallery) {
                Gallery.init();
                log('Gallery module initialized');
            }
            
            if (config.features.backgroundSlider || config.features.smoothScrolling || config.features.navbarEffects) {
                if (window.UIEffects) {
                    UIEffects.init();
                    log('UI Effects module initialized');
                }
            }
            
            if (config.features.formHandling || config.features.notifications || config.features.keyboardNavigation) {
                if (window.Utils) {
                    Utils.init();
                    log('Utils module initialized');
                }
            }
            
            const endTime = performance.now();
            log(`All modules initialized in ${(endTime - startTime).toFixed(2)}ms`);
            
            return true;
            
        } catch (error) {
            console.error('Error initializing modules:', error);
            return false;
        }
    }

    // Setup global error handling
    function setupErrorHandling() {
        window.addEventListener('error', function(event) {
            console.error('Global error:', event.error);
            
            // Show user-friendly message for critical errors
            if (window.Utils && Utils.showNotification) {
                Utils.showNotification('Something went wrong. Please refresh the page.', 'error');
            }
        });

        window.addEventListener('unhandledrejection', function(event) {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    // Performance monitoring
    function setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                
                // Monitor largest contentful paint
                if ('LargestContentfulPaint' in window) {
                    new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        log(`LCP: ${lastEntry.startTime}ms`);
                    }).observe({ entryTypes: ['largest-contentful-paint'] });
                }
            }, 0);
        });
    }

    // Feature detection
    function detectFeatures() {
        const features = {
            webp: false,
            intersectionObserver: 'IntersectionObserver' in window,
            resizeObserver: 'ResizeObserver' in window,
            localStorage: (function() {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        };

        // Test WebP support
        const webpTest = new Image();
        webpTest.onload = webpTest.onerror = function() {
            features.webp = (webpTest.height === 2);
            log('WebP support:', features.webp);
        };
        webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

        log('Feature detection:', features);
        return features;
    }

    // Console logging with debug mode
    function log(...args) {
        if (config.debug) {
            console.log('[App]', ...args);
        }
    }

    // Application health check
    function healthCheck() {
        const checks = {
            modules: checkDependencies(),
            dom: document.readyState === 'complete',
            viewport: window.innerWidth > 0 && window.innerHeight > 0
        };
        
        const healthy = Object.values(checks).every(check => check === true);
        
        log('Health check:', checks, 'Healthy:', healthy);
        return healthy;
    }

    // Initialize application
    function init() {
        log(`Initializing Newbridge Tile & Bath Wares App v${config.version}`);
        
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Setup error handling first
        setupErrorHandling();
        
        // Feature detection
        const features = detectFeatures();
        
        // Health check
        if (!healthCheck()) {
            console.error('Application health check failed');
            return;
        }
        
        // Performance monitoring
        if (config.debug) {
            setupPerformanceMonitoring();
        }
        
        // Initialize modules
        const success = initializeModules();
        
        if (success) {
            log('Application initialized successfully');
            
            // Dispatch custom event for other scripts
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { 
                    version: config.version,
                    features: features,
                    timestamp: Date.now()
                }
            }));
            
            // Show ready notification in debug mode
            if (config.debug && window.Utils && Utils.showNotification) {
                Utils.showNotification('Application loaded successfully!', 'success');
            }
            
        } else {
            console.error('Application initialization failed');
        }
    }

    // Public API
    return {
        init,
        config,
        log,
        healthCheck,
        version: config.version,
        
        // Allow runtime configuration updates
        updateConfig: function(newConfig) {
            Object.assign(config, newConfig);
            log('Configuration updated:', config);
        },
        
        // Get application state
        getState: function() {
            return {
                version: config.version,
                modules: config.modules,
                features: config.features,
                healthy: healthCheck()
            };
        }
    };
})();

// Auto-initialize when script loads
App.init();

// Global access for debugging
if (App.config.debug) {
    window.App = App;
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                App.log('ServiceWorker registered successfully');
            })
            .catch(function(error) {
                App.log('ServiceWorker registration failed');
            });
    });
}