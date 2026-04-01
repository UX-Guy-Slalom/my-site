/**
 * Header Loader
 * Dynamically loads and injects the shared header fragment
 */
(function() {
    'use strict';

    const loadHeader = async () => {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        // Calculate base URL from script location
        const scriptUrl = document.currentScript.src;
        const scriptDir = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
        const baseDir = scriptDir.substring(0, scriptDir.lastIndexOf('/'));
        const headerUrl = baseDir + '/header.html';

        try {
            const response = await fetch(headerUrl);
            if (!response.ok) throw new Error(`Failed to load header: ${response.status}`);
            
            const html = await response.text();
            headerPlaceholder.outerHTML = html;

            // Fix navigation links based on current page location
            fixNavLinks();
            
            // Update navigation links based on current page
            updateNavLinks();
        } catch (error) {
            console.warn('Could not load header fragment:', error);
            // Fallback: minimal header if fetch fails
            headerPlaceholder.innerHTML = `
                <header>
                    <div class="header-brand">
                        <h1>Jason</h1>
                        <p>Creative Designer</p>
                    </div>
                </header>
            `;
        }
    };

    const fixNavLinks = () => {
        const currentPath = window.location.pathname;
        const isSubPage = currentPath.includes('/pages/');

        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(link => {
            let href = link.getAttribute('href');

            if (isSubPage) {
                // On a sub-page - adjust paths to work correctly from sub-page
                if (href === 'index.html') {
                    href = '../index.html';
                } else if (href.startsWith('pages/')) {
                    // Remove 'pages/' prefix for sibling page links
                    // pages/about.html becomes about.html
                    href = href.substring(6);
                } else if (!href.includes('../') && href.includes('.html')) {
                    // Already correct (about.html, portfolio.html, contact.html)
                }
            } else {
                // On root page - paths should relative or use pages/ prefix
                if (href.startsWith('../')) {
                    href = href.substring(3); // Remove ../
                }
            }

            link.setAttribute('href', href);
        });
    };

    const updateNavLinks = () => {
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        const isSubPage = currentPath.includes('/pages/');

        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            let isActive = false;

            if (isIndexPage && (href === 'index.html' || href === '../index.html')) {
                isActive = true;
            } else if (isSubPage && 
                      ((href.endsWith('about.html') && currentPath.includes('about')) ||
                       (href.endsWith('portfolio.html') && currentPath.includes('portfolio')) ||
                       (href.endsWith('contact.html') && currentPath.includes('contact')))) {
                isActive = true;
            }

            if (isActive) {
                link.style.color = '#e9d5ff';
            }
        });
    };

    // Load header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
