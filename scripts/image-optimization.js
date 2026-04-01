/**
 * Image Optimization Script
 * Handles preloading, lazy loading, and smooth image rendering
 */

(function() {
    'use strict';

    // Preload parallax background images
    function preloadImages() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        parallaxSections.forEach(section => {
            const bgImageUrl = window.getComputedStyle(section).backgroundImage;
            if (bgImageUrl && bgImageUrl !== 'none') {
                const img = new Image();
                img.src = bgImageUrl.replace(/url\(['"]?(.*?)['"]\)/, '$1');
                // Image preloads in background, ready when needed
            }
        });
    }

    // Optimize Unsplash images with performance parameters
    function optimizeImageUrls() {
        const parallaxSections = document.querySelectorAll('[style*="background-image"]');
        
        parallaxSections.forEach(section => {
            const style = section.getAttribute('style');
            if (style && style.includes('unsplash')) {
                // Add optimization params for Unsplash images
                let optimizedStyle = style
                    .replace(/w=\d+/g, 'w=1600')      // Increase width for desktop
                    .replace(/h=\d+/g, 'h=800')       // Increase height
                    .replace(/fit=crop/g, 'fit=crop&q=80&auto=format'); // Add quality and format
                
                section.setAttribute('style', optimizedStyle);
            }
        });
    }

    // Add loading state to prevent flashing
    function addLoadingStates() {
        document.documentElement.classList.add('images-loading');
        
        window.addEventListener('load', () => {
            // Remove loading state once all images are loaded
            document.documentElement.classList.remove('images-loading');
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            preloadImages();
            optimizeImageUrls();
        });
    } else {
        preloadImages();
        optimizeImageUrls();
    }

    // Add loading states
    addLoadingStates();
})();
