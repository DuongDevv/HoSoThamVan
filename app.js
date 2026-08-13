document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DYNAMIC MODULAR COMPONENT LOADER (FETCH HEADER & FOOTER) ---
    const loadHeader = fetch('header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
            }
        })
        .catch(err => console.error('Error loading header component:', err));

    const loadFooter = fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(err => console.error('Error loading footer component:', err));

    // Wait for components to load before attaching event listeners
    Promise.all([loadHeader, loadFooter]).then(() => {
        initHeaderEvents();
    });

    // --- 2. EXPERTS CAROUSEL SLIDER DRAG & BUTTON NAV CONTROLS ---
    const expertsSlider = document.getElementById('expertsSlider');
    const expertPrevBtn = document.getElementById('expertPrevBtn');
    const expertNextBtn = document.getElementById('expertNextBtn');

    if (expertsSlider && expertPrevBtn && expertNextBtn) {
        expertPrevBtn.addEventListener('click', () => {
            expertsSlider.scrollBy({ left: -220, behavior: 'smooth' });
        });

        expertNextBtn.addEventListener('click', () => {
            expertsSlider.scrollBy({ left: 220, behavior: 'smooth' });
        });
    }

    // --- 3. HEADER EVENTS ---
    function initHeaderEvents() {
        const navAboutUsBtn = document.getElementById('navAboutUsBtn');
        const aboutModal = document.getElementById('aboutModal');
        const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');

        if (navAboutUsBtn && aboutModal) {
            navAboutUsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                aboutModal.classList.remove('hidden');
            });

            if (closeAboutModalBtn) {
                closeAboutModalBtn.addEventListener('click', () => {
                    aboutModal.classList.add('hidden');
                });
            }
        }
    }
});
