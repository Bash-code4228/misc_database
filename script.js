// script.js
// Tab switching functionality for empty tabs base

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

    // Add click event to each tab button
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    // Optional: subtle tab name feedback in console (non-intrusive)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.innerText.trim();
            console.log(`✨ Switched to: ${tabName}`);
        });
    });

    console.log('✅ Three empty tabs ready — add your content anytime');
});
