// script.js
// Tab switching functionality + small interactive counters (bonus animations)

document.addEventListener('DOMContentLoaded', () => {
    // ---------- TABBED INTERFACE ----------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        // Deactivate all panes and buttons
        tabPanes.forEach(pane => pane.classList.remove('active'));
        tabBtns.forEach(btn => btn.classList.remove('active'));

        // Activate current pane & button
        const activePane = document.getElementById(tabId);
        if (activePane) activePane.classList.add('active');

        const correspondingBtn = Array.from(tabBtns).find(btn => btn.getAttribute('data-tab') === tabId);
        if (correspondingBtn) correspondingBtn.classList.add('active');
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    // Optional: small floating stats simulation – shows dynamic hover counts
    // (just to bring life but keeping it lightweight, consistent with tab base)
    const statCounts = document.querySelectorAll('.stat-info .count');
    
    // Add tiny count pulse effect on each stat hover (just for engagement)
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const countElem = this.querySelector('.count');
            if (countElem) {
                countElem.style.transform = 'scale(1.02)';
                countElem.style.transition = 'transform 0.2s ease';
                countElem.style.display = 'inline-block';
            }
        });
        card.addEventListener('mouseleave', function() {
            const countElem = this.querySelector('.count');
            if (countElem) countElem.style.transform = 'scale(1)';
        });
    });

    // Ensure that any external clicks or dynamic resize does not break tabs
    // Also adds a tiny console greeting (non-intrusive)
    console.log('✨ Nexus Tabs active — three-panel base with left heading and solid styling');

    // Optional: Add simple interactive acknowledgment on tab switch (improves UX)
    // Attach subtle micro interaction when tab changes — update browser fragment? (just nice)
    const originalTitle = document.title;
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.innerText.trim();
            // briefly update title feedback (optional, but friendly)
            document.title = `📖 ${tabName} · Fandom Atlas`;
            setTimeout(() => {
                document.title = originalTitle;
            }, 1500);
        });
    });

    // Additional safeguard: if any card inside tab uses favorite or edit simulation (future proof),
    // just pure UI ensures no errors. This base covers three distinct tabs.
    // for dynamic demo, some card images are from LoremFlick but we used picsum reliably.
    // also ensures image container hover effects don't glitch
    
    // Adaptive handling: if any missing image, just ignore (graceful)
    const allImages = document.querySelectorAll('.ship-image');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://picsum.photos/id/42/400/200';
            this.alt = 'placeholder realm';
        });
    });
});
