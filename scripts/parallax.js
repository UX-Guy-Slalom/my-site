/**
 * Parallax Scroll Effect
 * Enhances visual depth on supported browsers
 */
(function() {
    'use strict';

    // Check if browser supports background-attachment: fixed
    const supportsParallax = () => {
        const div = document.createElement('div');
        div.style.backgroundAttachment = 'fixed';
        return div.style.backgroundAttachment === 'fixed';
    };

    // Enhanced parallax for browsers that need it
    const initParallax = () => {
        if (!supportsParallax()) {
            // Fallback: Simple scroll-based parallax using transform
            const parallaxSections = document.querySelectorAll('.parallax-section');

            const handleScroll = () => {
                parallaxSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    const sectionTop = section.offsetTop;

                    // Calculate parallax offset (30% of scroll distance)
                    const yPos = (window.pageYOffset - sectionTop) * 0.3;

                    const bgImg = window.getComputedStyle(section).backgroundImage;
                    if (bgImg && bgImg !== 'none') {
                        section.style.backgroundPosition = `center ${yPos}px`;
                    }
                });
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        // Add fade-in animation to parallax content as it comes into view
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

        // Observe all parallax content
        document.querySelectorAll('.parallax-content').forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(content);
        });

        // Animate service and expertise cards on scroll
        const cards = document.querySelectorAll(
            '.service-card, .expertise-item, .approach-item'
        );

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardObserver.observe(card);
        });
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallax);
    } else {
        initParallax();
    }
})();
