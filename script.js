// script.js
// Interactive World Map with Notes, Hyperlinks, and Obsidian-like connectivity

document.addEventListener('DOMContentLoaded', () => {
    // ---------- TABBED INTERFACE ----------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        tabPanes.forEach(pane => pane.classList.remove('active'));
        tabBtns.forEach(btn => btn.classList.remove('active'));
        
        const activePane = document.getElementById(tabId);
        if (activePane) activePane.classList.add('active');
        
        const correspondingBtn = Array.from(tabBtns).find(btn => btn.getAttribute('data-tab') === tabId);
        if (correspondingBtn) correspondingBtn.classList.add('active');
        
        // If switching to map tab, invalidate map size to fix rendering
        if (tabId === 'tab1' && window.mapInstance) {
            setTimeout(() => {
                window.mapInstance.invalidateSize();
            }, 150);
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    // ----- DATA MODEL: Locations with notes and hyperlinks -----
    const locationData = [
        {
            id: "kyoto",
            name: "Kyoto, Japan",
            lat: 35.0116,
            lng: 135.7681,
            notes: [
                { id: "note1", title: "Zen Temple Diaries", content: "Recorded meditation insights at Ginkaku-ji. Serene atmosphere.", hyperlinkTo: "bali", hyperlinkText: "↗ Bali Connection" },
                { id: "note2", title: "Tea Ceremony Notes", content: "The philosophy of wabi-sabi and seasonal tea gatherings.", hyperlinkTo: null },
                { id: "note3", title: "Philosopher's Path", content: "Walk along cherry trees - inspiration for haiku compilation.", hyperlinkTo: "paris", hyperlinkText: "→ Parisian reflections" }
            ]
        },
        {
            id: "bali",
            name: "Bali, Indonesia",
            lat: -8.4095,
            lng: 115.1889,
            notes: [
                { id: "note4", title: "Ubud Rice Terraces", content: "Water temples and subak irrigation system. Harmony with nature.", hyperlinkTo: "kyoto", hyperlinkText: "🔗 Kyoto Parallels" },
                { id: "note5", title: "Coastal Rituals", content: "Melasti ceremony - purification at sea. Deep cultural resonance.", hyperlinkTo: null }
            ]
        },
        {
            id: "paris",
            name: "Paris, France",
            lat: 48.8566,
            lng: 2.3522,
            notes: [
                { id: "note6", title: "Café Existentialism", content: "Notes on Sartre and de Beauvoir at Les Deux Magots.", hyperlinkTo: "kyoto", hyperlinkText: "✧ Kyoto Zen connection" },
                { id: "note7", title: "Archives of Light", content: "Sainte-Chapelle stained glass - chromatic meditation.", hyperlinkTo: null }
            ]
        },
        {
            id: "cairo",
            name: "Cairo, Egypt",
            lat: 30.0444,
            lng: 31.2357,
            notes: [
                { id: "note8", title: "Papyrus Scrolls", content: "Ancient knowledge preservation techniques. Linking to Alexandria's legacy.", hyperlinkTo: "paris", hyperlinkText: "→ Bibliothèque Nationale" }
            ]
        },
        {
            id: "mexico_city",
            name: "Mexico City, Mexico",
            lat: 19.4326,
            lng: -99.1332,
            notes: [
                { id: "note9", title: "Frida's Blue House", content: "Art, identity, and resilience. Powerful diary excerpts.", hyperlinkTo: "bali", hyperlinkText: "🌺 Artistic parallels" },
                { id: "note10", title: "Teotihuacan Mystery", content: "Pyramid of the Sun - cosmic alignments and ritual pathways.", hyperlinkTo: null }
            ]
        }
    ];

    // Initialize Leaflet Map with zoom/pan capabilities
    const map = L.map('worldMap').setView([20, 10], 2);
    window.mapInstance = map;
    
    // Add tile layer (clean, readable basemap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 1.5
    }).addTo(map);
    
    const markers = [];
    
    // Helper: Escape HTML to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Function to handle hyperlink clicks (flies to location and opens popup)
    function handleHyperlinkClick(e) {
        e.stopPropagation();
        const target = e.currentTarget;
        const targetLat = parseFloat(target.getAttribute('data-target-lat'));
        const targetLng = parseFloat(target.getAttribute('data-target-lng'));
        const targetId = target.getAttribute('data-location-id');
        
        if (!isNaN(targetLat) && !isNaN(targetLng)) {
            map.flyTo([targetLat, targetLng], 8, { duration: 1.2 });
            const targetMarker = markers.find(m => m.options.locationId === targetId);
            if (targetMarker) {
                setTimeout(() => {
                    targetMarker.openPopup();
                }, 400);
            }
        }
    }
    
    // Attach hyperlink click handlers to all hyperlink badges
    function attachHyperlinkClickHandlers() {
        setTimeout(() => {
            const hyperlinks = document.querySelectorAll('.hyperlink-badge');
            hyperlinks.forEach(el => {
                el.removeEventListener('click', handleHyperlinkClick);
                el.addEventListener('click', handleHyperlinkClick);
            });
        }, 50);
    }
    
    // Render popup content for a location
    function renderPopupContent(location) {
        let notesHtml = '';
        if (location.notes && location.notes.length > 0) {
            notesHtml = `<div class="notes-list">`;
            location.notes.forEach(note => {
                let hyperlinkHtml = '';
                if (note.hyperlinkTo && note.hyperlinkText) {
                    const targetLocation = locationData.find(l => l.id === note.hyperlinkTo);
                    if (targetLocation) {
                        hyperlinkHtml = `<div class="hyperlink-badge" data-target-lat="${targetLocation.lat}" data-target-lng="${targetLocation.lng}" data-target-name="${targetLocation.name}" data-location-id="${targetLocation.id}" style="cursor:pointer;">
                            <i class="fas fa-link"></i> ${escapeHtml(note.hyperlinkText)}
                        </div>`;
                    }
                }
                notesHtml += `
                    <div class="note-item">
                        <div class="note-title">
                            <span><i class="fas fa-pen-fancy"></i> ${escapeHtml(note.title)}</span>
                            ${hyperlinkHtml}
                        </div>
                        <div class="note-content">${escapeHtml(note.content)}</div>
                        <div class="note-tags">
                            <span class="tag"><i class="far fa-sticky-note"></i> local note</span>
                        </div>
                    </div>
                `;
            });
            notesHtml += `</div>`;
        } else {
            notesHtml = `<div class="notes-list"><em>No notes yet. Be the first to add a research note.</em></div>`;
        }
        
        const addFormHtml = `
            <div class="add-note-form">
                <input type="text" id="newNoteTitle_${location.id}" placeholder="Note title (e.g., Discovery Log)" maxlength="60">
                <textarea id="newNoteContent_${location.id}" rows="2" placeholder="Write your note content..."></textarea>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="text" id="newNoteLink_${location.id}" placeholder="Optional: link to location ID (kyoto, bali, paris, cairo, mexico_city)" style="flex:1;">
                    <button id="addNoteBtn_${location.id}"><i class="fas fa-plus-circle"></i> Stick Note</button>
                </div>
                <small style="color:#666;"><i class="fas fa-info-circle"></i> Link to existing location IDs</small>
            </div>
        `;
        
        return `
            <div class="location-title">
                <i class="fas fa-map-marker-alt"></i> ${escapeHtml(location.name)}
                <span class="notes-count"><i class="fas fa-copy"></i> ${location.notes.length} note${location.notes.length !== 1 ? 's' : ''}</span>
            </div>
            ${notesHtml}
            ${addFormHtml}
        `;
    }
    
    // Bind popup with interactive add note functionality
    function bindPopupWithNotes(location, marker) {
        const popupContent = renderPopupContent(location);
        const popup = L.popup({ className: 'custom-popup', maxWidth: 350, minWidth: 260 })
            .setContent(popupContent);
        marker.bindPopup(popup);
        
        marker.on('popupopen', () => {
            const addBtn = document.getElementById(`addNoteBtn_${location.id}`);
            if (addBtn) {
                const newAddBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newAddBtn, addBtn);
                newAddBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const titleInput = document.getElementById(`newNoteTitle_${location.id}`);
                    const contentInput = document.getElementById(`newNoteContent_${location.id}`);
                    const linkInput = document.getElementById(`newNoteLink_${location.id}`);
                    const newTitle = titleInput?.value.trim();
                    const newContent = contentInput?.value.trim();
                    
                    if (!newTitle || !newContent) {
                        alert("Please provide both title and content for your note.");
                        return;
                    }
                    
                    const linkToId = linkInput?.value.trim().toLowerCase();
                    let hyperlinkTo = null;
                    let hyperlinkText = null;
                    
                    if (linkToId) {
                        const targetLoc = locationData.find(l => l.id === linkToId);
                        if (targetLoc) {
                            hyperlinkTo = targetLoc.id;
                            hyperlinkText = `↗ ${targetLoc.name} link`;
                        } else {
                            alert(`Location ID "${linkToId}" not found. Valid IDs: kyoto, bali, paris, cairo, mexico_city`);
                        }
                    }
                    
                    const newNoteObj = {
                        id: `note_${Date.now()}_${Math.random()}`,
                        title: newTitle,
                        content: newContent,
                        hyperlinkTo: hyperlinkTo,
                        hyperlinkText: hyperlinkText
                    };
                    
                    location.notes.push(newNoteObj);
                    marker.getPopup().setContent(renderPopupContent(location));
                    
                    if (titleInput) titleInput.value = '';
                    if (contentInput) contentInput.value = '';
                    if (linkInput) linkInput.value = '';
                    
                    attachHyperlinkClickHandlers();
                });
            }
            attachHyperlinkClickHandlers();
        });
    }
    
    // Create markers for each location
    locationData.forEach(location => {
        const noteCount = location.notes.length;
        const iconHtml = `
            <div class="custom-marker" style="background: #0992C2; border: 2px solid #FFD700;">
                ${noteCount > 0 ? `<span style="font-weight:bold;">${noteCount}</span>` : '<i class="fas fa-map-pin" style="font-size:14px;"></i>'}
            </div>
        `;
        
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [36, 36],
            popupAnchor: [0, -18]
        });
        
        const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
        marker.options.locationId = location.id;
        marker.locationRef = location;
        markers.push(marker);
        
        bindPopupWithNotes(location, marker);
    });
    
    // Add info control
    const infoControl = L.control({ position: 'bottomright' });
    infoControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'info-text');
        div.innerHTML = '<i class="fas fa-link" style="color:#0992C2;"></i> Click hyperlinks to jump between locations';
        div.style.backgroundColor = 'white';
        div.style.padding = '6px 12px';
        div.style.borderRadius = '30px';
        div.style.fontSize = '12px';
        div.style.fontWeight = '500';
        div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        div.style.fontFamily = "'Poppins', sans-serif";
        return div;
    };
    infoControl.addTo(map);
    
    // Initial map resize
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
    
    window.addEventListener('resize', () => {
        if (document.getElementById('tab1').classList.contains('active')) {
            map.invalidateSize();
        }
    });
    
    console.log('✅ Interactive world map ready with zoom/pan, notes, and hyperlinks');
});
