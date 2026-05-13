// ============================================================
// APP.JS - Le Potager des Brauds
// ============================================================

// ===== STATE =====
let state = {
    zones: [],
    currentZoneId: null,
    selectedCell: null,
    editingPlantId: null
};

let currentUser = null;
let calendarDate = new Date();
let selectedColor = '#4CAF50';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    initAuth();
});

// ===== AUTH =====
function initAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            showApp(user);
            loadZones();
        } else {
            showLogin();
        }
    });
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appMain').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showApp(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appMain').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('logoutBtn').style.display = 'flex';

    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    avatar.src = user.photoURL || '';
    avatar.style.display = user.photoURL ? 'block' : 'none';
    name.textContent = user.displayName || user.email;
}

// ===== DB REF =====
function dbRef() {
    return firebase.database().ref('users/' + currentUser.uid);
}

// ===== ZONES =====
function loadZones() {
    dbRef().child('zones').on('value', snapshot => {
        state.zones = [];
        snapshot.forEach(child => {
            state.zones.push({ id: child.key, ...child.val() });
        });
        renderZonesList();
        updateStats();

        if (state.currentZoneId) {
            const zone = getZone(state.currentZoneId);
            if (zone) renderZone(zone);
        }
    });
}

function getZone(id) {
    return state.zones.find(z => z.id === id);
}

function renderZonesList() {
    const list = document.getElementById('zonesList');
    list.innerHTML = '';

    if (state.zones.length === 0) {
        list.innerHTML = '<li class="empty-zones">Aucune zone</li>';
        return;
    }

    state.zones.forEach(zone => {
        const li = document.createElement('li');
        li.className = 'zone-item' + (zone.id === state.currentZoneId ? ' active' : '');
        li.innerHTML = `
            <span class="zone-dot" style="background:${zone.color}"></span>
            <span class="zone-label">${zone.name}</span>
            <span class="zone-count">${countPlants(zone)} 🌱</span>
        `;
        li.addEventListener('click', () => selectZone(zone.id));
        list.appendChild(li);
    });
}

function countPlants(zone) {
    if (!zone.plants) return 0;
    return Object.values(zone.plants).filter(p => p && p.name).length;
}

function selectZone(id) {
    state.currentZoneId = id;
    const zone = getZone(id);
    if (zone) renderZone(zone);
    renderZonesList();
}

function renderZone(zone) {
    document.getElementById('welcomeMsg').style.display = 'none';
    document.getElementById('zoneHeader').style.display = 'flex';
    document.getElementById('legend').style.display = 'flex';

    document.getElementById('zoneName').textContent = zone.name;
    document.getElementById('zoneColorDot').style.background = zone.color;
    document.getElementById('gridCols').value = zone.cols || 5;
    document.getElementById('gridRows').value = zone.rows || 5;

    renderGrid(zone);
    renderLegend(zone);
}

const PLANT_LIBRARY = [
    // Légumes
    { name: 'Tomate',      emoji: '🍅', type: 'legume' },
    { name: 'Courgette',   emoji: '🥒', type: 'legume' },
    { name: 'Carotte',     emoji: '🥕', type: 'legume' },
    { name: 'Salade',      emoji: '🥬', type: 'legume' },
    { name: 'Poivron',     emoji: '🫑', type: 'legume' },
    { name: 'Maïs',        emoji: '🌽', type: 'legume' },
    { name: 'Aubergine',   emoji: '🍆', type: 'legume' },
    { name: 'Oignon',      emoji: '🧅', type: 'legume' },
    { name: 'Ail',         emoji: '🧄', type: 'legume' },
    { name: 'Brocoli',     emoji: '🥦', type: 'legume' },
    { name: 'Concombre',   emoji: '🥒', type: 'legume' },
    { name: 'Piment',      emoji: '🌶️', type: 'legume' },
    { name: 'Patate',      emoji: '🥔', type: 'legume' },
    { name: 'Haricot',     emoji: '🫘', type: 'legume' },
    { name: 'Petit pois',  emoji: '🟢', type: 'legume' },
    { name: 'Navet',       emoji: '🫒', type: 'legume' },
    // Fruits
    { name: 'Fraise',      emoji: '🍓', type: 'fruit' },
    { name: 'Pastèque',    emoji: '🍉', type: 'fruit' },
    { name: 'Melon',       emoji: '🍈', type: 'fruit' },
    { name: 'Framboise',   emoji: '🫐', type: 'fruit' },
    { name: 'Tomate cerise',emoji: '🍒', type: 'fruit' },
    // Herbes
    { name: 'Basilic',     emoji: '🌿', type: 'herbe' },
    { name: 'Persil',      emoji: '🌱', type: 'herbe' },
    { name: 'Menthe',      emoji: '🍃', type: 'herbe' },
    { name: 'Thym',        emoji: '🌾', type: 'herbe' },
    { name: 'Romarin',     emoji: '🪴', type: 'herbe' },
    { name: 'Ciboulette',  emoji: '🎋', type: 'herbe' },
    // Fleurs
    { name: 'Tournesol',   emoji: '🌻', type: 'fleur' },
    { name: 'Rose',        emoji: '🌹', type: 'fleur' },
    { name: 'Lavande',     emoji: '💜', type: 'fleur' },
    { name: 'Capucine',    emoji: '🌸', type: 'fleur' },
    // Arbres
    { name: 'Pommier',     emoji: '🍎', type: 'arbre' },
    { name: 'Poirier',     emoji: '🍐', type: 'arbre' },
    { name: 'Cerisier',    emoji: '🍒', type: 'arbre' },
    { name: 'Figuier',     emoji: '🌳', type: 'arbre' },
];

function renderGrid(zone) {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    const cols = zone.cols || 5;
    const rows = zone.rows || 5;

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            const key = `${r}_${c}`;
            const plant = zone.plants && zone.plants[key];

            if (plant && plant.name) {
                cell.classList.add('has-plant');
                cell.style.borderColor = zone.color;
                cell.innerHTML = `
                    <div class="cell-emoji">${plant.emoji || getTypeEmoji(plant.type)}</div>
                    <div class="cell-name">${plant.name}</div>
                    ${plant.variety ? `<div class="cell-variety">${plant.variety}</div>` : ''}
                `;
            } else {
                cell.innerHTML = '<div class="cell-empty">+</div>';
            }

            cell.addEventListener('click', () => openPlantModal(r, c));

            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                cell.style.background = '#d8f3dc';
            });
            cell.addEventListener('dragleave', () => {
                cell.style.background = '';
            });
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                cell.style.background = '';
                const plant = JSON.parse(e.dataTransfer.getData('plant'));
                dropPlantOnCell(plant, r, c);
            });

            cell.addEventListener('contextmenu', (e) => handleCellRightClick(e, r, c));
            container.appendChild(cell);
        }
    }
}


function dropPlantOnCell(plant, row, col) {
    const zone = getZone(state.currentZoneId);
    if (!zone) return;

    if (!zone.plants) zone.plants = {};
    const key = `${row}_${col}`;

    zone.plants[key] = {
        name: plant.name,
        emoji: plant.emoji || '',
        variety: plant.variety || '',
        type: plant.type || 'autre',
        water: plant.water || 'semaine',
        notes: plant.notes || '',
        photo: plant.photo || '',
        date: plant.date || ''
    };

    // Mettre à jour dans state.zones
    const idx = state.zones.findIndex(z => z.id === state.currentZoneId);
    if (idx !== -1) state.zones[idx] = zone;

    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).set(zone.plants[key])
        .then(() => {
            renderGrid(zone);
            renderLegend(zone);
            showToast(`${plant.emoji || '🌱'} ${plant.name} placé !`, 'success');
        });
}

function getTypeEmoji(type) {
    const emojis = {
        legume: '🥬', fruit: '🍓', herbe: '🌿',
        fleur: '🌸', arbre: '🌳', autre: '🌱'
    };
    return emojis[type] || '🌱';
}

function renderLegend(zone) {
    const items = document.getElementById('legendItems');
    items.innerHTML = '';

    // ===== PALETTE BIBLIOTHÈQUE =====
    const paletteSection = document.createElement('div');
    paletteSection.innerHTML = `
        <div style="font-weight:bold; color:#2d6a4f; margin-bottom:8px; font-size:13px;">
            🌿 Bibliothèque de plantes
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:6px;">
            <button class="filter-btn active" data-filter="all" onclick="filterLibrary('all', this)">Tout</button>
            <button class="filter-btn" data-filter="legume" onclick="filterLibrary('legume', this)">🥬 Légumes</button>
            <button class="filter-btn" data-filter="fruit" onclick="filterLibrary('fruit', this)">🍓 Fruits</button>
            <button class="filter-btn" data-filter="herbe" onclick="filterLibrary('herbe', this)">🌿 Herbes</button>
            <button class="filter-btn" data-filter="fleur" onclick="filterLibrary('fleur', this)">🌸 Fleurs</button>
            <button class="filter-btn" data-filter="arbre" onclick="filterLibrary('arbre', this)">🌳 Arbres</button>
        </div>
        <div id="plantPalette" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;"></div>
    `;
    items.appendChild(paletteSection);
    renderPalette('all');

    // ===== SÉPARATEUR =====
    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:2px dashed #ccc; margin:10px 0; padding-top:10px;';
    sep.innerHTML = '<div style="font-weight:bold; color:#2d6a4f; font-size:13px; margin-bottom:8px;">📍 Plantes dans cette zone</div>';
    items.appendChild(sep);

    // ===== PLANTES EXISTANTES DANS LA ZONE =====
    if (!zone.plants) return;

    const unique = {};
    Object.values(zone.plants).forEach(p => {
        if (p && p.name && !unique[p.name]) unique[p.name] = p;
    });

    if (Object.keys(unique).length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'color:#aaa; font-size:12px; font-style:italic;';
        empty.textContent = 'Aucune plante placée pour l\'instant';
        items.appendChild(empty);
        return;
    }

    Object.values(unique).forEach(plant => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.draggable = true;
        div.style.cssText = `
            cursor: grab;
            padding: 6px 10px;
            border-radius: 8px;
            border: 2px solid #ddd;
            background: white;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        `;

        const emoji = getPlantEmoji(plant);
        div.innerHTML = `${emoji} <strong>${plant.name}</strong>${plant.variety ? ` <span style="color:#888;font-size:11px;">${plant.variety}</span>` : ''}`;

        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('plant', JSON.stringify(plant));
            div.style.opacity = '0.5';
        });
        div.addEventListener('dragend', () => { div.style.opacity = '1'; });

        items.appendChild(div);
    });
}

// ===== PALETTE =====
function renderPalette(filter) {
    const palette = document.getElementById('plantPalette');
    if (!palette) return;
    palette.innerHTML = '';

    const list = filter === 'all' ? PLANT_LIBRARY : PLANT_LIBRARY.filter(p => p.type === filter);

    list.forEach(plant => {
        const btn = document.createElement('div');
        btn.draggable = true;
        btn.title = plant.name;
        btn.style.cssText = `
            width: 44px;
            height: 44px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            border-radius: 10px;
            border: 2px solid #eee;
            background: white;
            cursor: grab;
            transition: all 0.2s;
            position: relative;
        `;
        btn.innerHTML = `
            <span>${plant.emoji}</span>
            <span style="font-size:7px; color:#666; margin-top:1px; text-align:center; line-height:1;">${plant.name}</span>
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.border = '2px solid #2d6a4f';
            btn.style.background = '#f0faf4';
            btn.style.transform = 'scale(1.15)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.border = '2px solid #eee';
            btn.style.background = 'white';
            btn.style.transform = 'scale(1)';
        });

        // Drag & drop
        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('plant', JSON.stringify({
                name: plant.name,
                emoji: plant.emoji,
                type: plant.type,
                variety: '',
                water: 'semaine',
                notes: '',
                photo: '',
                date: ''
            }));
            btn.style.opacity = '0.5';
        });
        btn.addEventListener('dragend', () => { btn.style.opacity = '1'; });

        // Clic = place directement si cellule sélectionnée
        btn.addEventListener('click', () => {
            showToast(`${plant.emoji} ${plant.name} sélectionné — cliquez sur une cellule`, 'info');
            state.selectedPlantFromLibrary = { ...plant };
        });

        palette.appendChild(btn);
    });
}

function filterLibrary(filter, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPalette(filter);
}

// Récupère l'emoji d'une plante (depuis la bibliothèque ou fallback)
function getPlantEmoji(plant) {
    if (plant.emoji) return plant.emoji;
    const found = PLANT_LIBRARY.find(p => p.name.toLowerCase() === plant.name.toLowerCase());
    if (found) return found.emoji;
    return getTypeEmoji(plant.type);
}

function updateStats() {
    let total = 0;
    state.zones.forEach(z => { total += countPlants(z); });
    document.getElementById('totalPlants').textContent = total;
    document.getElementById('totalZones').textContent = state.zones.length;
}

// ===== PLANT MODAL =====
function openPlantModal(row, col) {
    state.selectedCell = { row, col };
    const zone = getZone(state.currentZoneId);
    const key = `${row}_${col}`;
    const plant = zone.plants && zone.plants[key];

    state.editingPlantId = plant ? key : null;

    document.getElementById('plantModalTitle').textContent = plant ? 'Modifier la plante' : 'Ajouter une plante';
    document.getElementById('plantName').value = plant ? plant.name || '' : '';
    document.getElementById('plantVariety').value = plant ? plant.variety || '' : '';
    document.getElementById('plantDate').value = plant ? plant.date || '' : '';
    document.getElementById('plantType').value = plant ? plant.type || 'legume' : 'legume';
    document.getElementById('plantWater').value = plant ? plant.water || 'semaine' : 'semaine';
    document.getElementById('plantNotes').value = plant ? plant.notes || '' : '';

    // Photo
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('photoPlaceholder');
    if (plant && plant.photo) {
        preview.src = plant.photo;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.src = '';
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    }

    // Reminder
    document.getElementById('reminderEnabled').checked = plant ? !!plant.reminder : false;
    document.getElementById('reminderDetail').style.display = (plant && plant.reminder) ? 'flex' : 'none';
    document.getElementById('reminderDate').value = plant && plant.reminder ? plant.reminder.date || '' : '';
    document.getElementById('reminderText').value = plant && plant.reminder ? plant.reminder.text || '' : '';

    // Delete btn
    document.getElementById('deletePlantBtn').style.display = plant ? 'block' : 'none';

    openModal('plantModal');
}

function savePlant() {
    const name = document.getElementById('plantName').value.trim();
    if (!name) { showToast('Le nom est obligatoire', 'error'); return; }

    const zone = getZone(state.currentZoneId);
    const key = `${state.selectedCell.row}_${state.selectedCell.col}`;

    const reminderEnabled = document.getElementById('reminderEnabled').checked;
    const plant = {
        name,
        variety: document.getElementById('plantVariety').value.trim(),
        date: document.getElementById('plantDate').value,
        type: document.getElementById('plantType').value,
        water: document.getElementById('plantWater').value,
        notes: document.getElementById('plantNotes').value.trim(),
        photo: document.getElementById('photoPreview').src || '',
        reminder: reminderEnabled ? {
            date: document.getElementById('reminderDate').value,
            text: document.getElementById('reminderText').value.trim()
        } : null
    };

    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).set(plant)
        .then(() => {
            showToast('Plante sauvegardée ! 🌱', 'success');
            closeModal('plantModal');
        })
        .catch(err => showToast('Erreur: ' + err.message, 'error'));
}

function deletePlant() {
    const zone = getZone(state.currentZoneId);
    if (!zone || !state.editingPlantId) return;
    if (!confirm('Supprimer cette plante ?')) return;

    dbRef().child(`zones/${state.currentZoneId}/plants/${state.editingPlantId}`).remove()
        .then(() => {
            closeModal('plantModal');
            showToast('Plante supprimée 🗑️', 'success');
        });
}

function deletePlantFromMenu(r, c) {
    const old = document.getElementById('contextMenu');
    if (old) old.remove();

    const zone = getZone(state.currentZoneId);
    if (!zone) return;

    const key = `${r}_${c}`;
    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).remove()
        .then(() => showToast('Plante supprimée 🗑️', 'success'));
}

// ===== ZONE MODAL =====
function openZoneModal(zone = null) {
    document.getElementById('zoneModalTitle').textContent = zone ? 'Modifier la zone' : 'Nouvelle zone';
    document.getElementById('zoneNameInput').value = zone ? zone.name : '';
    document.getElementById('zoneColsInput').value = zone ? zone.cols : 5;
    document.getElementById('zoneRowsInput').value = zone ? zone.rows : 5;
    document.getElementById('saveZone').textContent = zone ? 'Modifier' : 'Créer';

    selectedColor = zone ? zone.color : '#4CAF50';
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.color === selectedColor);
    });

    openModal('zoneModal');
}

function saveZoneModal() {
    const name = document.getElementById('zoneNameInput').value.trim();
    if (!name) { showToast('Nom obligatoire', 'error'); return; }

    const cols = parseInt(document.getElementById('zoneColsInput').value) || 5;
    const rows = parseInt(document.getElementById('zoneRowsInput').value) || 5;

    const editing = state.currentZoneId && document.getElementById('zoneModalTitle').textContent === 'Modifier la zone';

    if (editing) {
        dbRef().child(`zones/${state.currentZoneId}`).update({ name, color: selectedColor, cols, rows })
            .then(() => {
                showToast('Zone modifiée !', 'success');
                closeModal('zoneModal');
            });
    } else {
        const newRef = dbRef().child('zones').push();
        newRef.set({ name, color: selectedColor, cols, rows, plants: {} })
            .then(() => {
                state.currentZoneId = newRef.key;
                showToast('Zone créée ! 🎉', 'success');
                closeModal('zoneModal');
            });
    }
}

function applyGrid() {
    const zone = getCurrentZone();
    if (!zone) return;
    
    const cols = parseInt(document.getElementById('gridCols').value) || 5;
    const rows = parseInt(document.getElementById('gridRows').value) || 5;
    
    zone.cols = cols;
    zone.rows = rows;
    
    dbRef().child(`zones/${state.currentZoneId}`).update({ cols, rows })
        .then(() => {
            renderGrid(zone);
            showToast('Grille mise à jour ✅', 'success');
        });
}

// ===== CALENDAR =====
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin',
                        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    days.forEach(d => {
        const h = document.createElement('div');
        h.className = 'cal-header';
        h.textContent = d;
        grid.appendChild(h);
    });

    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Collect plant dates
    const plantDates = {};
    state.zones.forEach(zone => {
        if (!zone.plants) return;
        Object.values(zone.plants).forEach(p => {
            if (p && p.date) {
                const d = new Date(p.date);
                if (d.getFullYear() === year && d.getMonth() === month) {
                    const day = d.getDate();
                    plantDates[day] = plantDates[day] || [];
                    plantDates[day].push(p.name);
                }
            }
            if (p && p.reminder && p.reminder.date) {
                const d = new Date(p.reminder.date);
                if (d.getFullYear() === year && d.getMonth() === month) {
                    const day = d.getDate();
                    plantDates[day] = plantDates[day] || [];
                    plantDates[day].push('🔔 ' + (p.reminder.text || p.name));
                }
            }
        });
    });

    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }
        if (plantDates[d]) cell.classList.add('has-event');
        cell.innerHTML = `<span>${d}</span>`;
        if (plantDates[d]) {
            const dot = document.createElement('div');
            dot.className = 'cal-dot';
            cell.appendChild(dot);
        }
        grid.appendChild(cell);
    }

    // Events list
    const list = document.getElementById('eventsList');
    list.innerHTML = '';
    let hasEvents = false;
    for (let d = 1; d <= daysInMonth; d++) {
        if (plantDates[d]) {
            hasEvents = true;
            plantDates[d].forEach(name => {
                const li = document.createElement('li');
                li.textContent = `${d} - ${name}`;
                list.appendChild(li);
            });
        }
    }
    if (!hasEvents) {
        list.innerHTML = '<li>Aucun événement ce mois</li>';
    }
}

// ===== REMINDERS =====
function renderReminders() {
    const container = document.getElementById('remindersList');
    container.innerHTML = '';
container.style.display = 'grid';

    const reminders = [];
    state.zones.forEach(zone => {
        if (!zone.plants) return;
        Object.values(zone.plants).forEach(p => {
            if (p && p.reminder && p.reminder.date) {
                reminders.push({
                    plant: p.name,
                    zone: zone.name,
                    date: p.reminder.date,
                    text: p.reminder.text
                });
            }
        });
    });

    if (reminders.length === 0) {
        container.innerHTML = '<p class="empty-msg">Aucun rappel pour le moment</p>';
        return;
    }

    reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

    reminders.forEach(r => {
        const div = document.createElement('div');
        div.className = 'reminder-item';
        div.innerHTML = `
            <div class="reminder-date">${formatDate(r.date)}</div>
            <div class="reminder-info">
                <strong>${r.plant}</strong> - ${r.zone}
                ${r.text ? `<p>${r.text}</p>` : ''}
            </div>
        `;
        container.appendChild(div);
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== PHOTO UPLOAD =====
function initPhotoUpload() {
    const area = document.getElementById('photoUploadArea');
    const input = document.getElementById('plantPhoto');
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('photoPlaceholder');

    area.addEventListener('click', () => input.click());

    input.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            preview.src = ev.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

// ===== MODAL HELPERS =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== BIND EVENTS =====
function bindEvents() {
    // Auth
    document.getElementById('loginBtn').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => showToast('Erreur connexion: ' + err.message, 'error'));
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        firebase.auth().signOut();
    });

    // Header buttons
    document.getElementById('calendarBtn').addEventListener('click', () => {
        renderCalendar();
        openModal('calendarModal');
    });

    document.getElementById('reminderBtn').addEventListener('click', () => {
        renderReminders();
        openModal('remindersModal');
    });

    // Zone buttons
    document.getElementById('addZoneBtn').addEventListener('click', () => openZoneModal());
    document.getElementById('editZoneBtn').addEventListener('click', () => {
        const zone = getZone(state.currentZoneId);
        if (zone) openZoneModal(zone);
    });
    document.getElementById('deleteZoneBtn').addEventListener('click', deleteZone);
    document.getElementById('applyGridBtn').addEventListener('click', applyGrid);

    // Plant modal
    document.getElementById('savePlant').addEventListener('click', savePlant);
    document.getElementById('deletePlantBtn').addEventListener('click', deletePlant);
    document.getElementById('cancelModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('closeModal').addEventListener('click', () => closeModal('plantModal'));

    // Reminder toggle
    document.getElementById('reminderEnabled').addEventListener('change', e => {
        document.getElementById('reminderDetail').style.display = e.target.checked ? 'flex' : 'none';
    });

    // Zone modal
    document.getElementById('saveZone').addEventListener('click', saveZoneModal);
    document.getElementById('cancelZoneModal').addEventListener('click', () => closeModal('zoneModal'));
    document.getElementById('closeZoneModal').addEventListener('click', () => closeModal('zoneModal'));

    // Color picker
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor = opt.dataset.color;
        });
    });

    // Calendar
    document.getElementById('closeCalendarModal').addEventListener('click', () => closeModal('calendarModal'));
    document.getElementById('prevMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Reminders modal
    document.getElementById('closeRemindersModal').addEventListener('click', () => closeModal('remindersModal'));

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Photo upload
    initPhotoUpload();
}
function saveData() {
    const zone = getCurrentZone();
    if (!zone) return;
    
    dbRef().child(`zones/${state.currentZoneId}`).set(zone)
        .then(() => {
            renderZone(zone);
            updateStats();
        })
        .catch(err => showToast('Erreur sauvegarde: ' + err.message, 'error'));
}

function exportPDF() {
    const zone = getCurrentZone();
    if (!zone) return;

    // Créer le contenu PDF
    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.fontFamily = 'Arial, sans-serif';

    // Titre
    content.innerHTML = `
        <h1 style="color:${zone.color || '#2d6a4f'}; text-align:center; margin-bottom:5px;">
            🌿 ${zone.name}
        </h1>
        <p style="text-align:center; color:#666; margin-bottom:20px;">
            Grille ${zone.cols} × ${zone.rows} — Imprimé le ${new Date().toLocaleDateString('fr-FR')}
        </p>
    `;

    // Grille
    const gridDiv = document.createElement('div');
    gridDiv.style.display = 'grid';
    gridDiv.style.gridTemplateColumns = `repeat(${zone.cols}, 1fr)`;
    gridDiv.style.gap = '4px';
    gridDiv.style.marginBottom = '30px';

    const cols = zone.cols || 5;
    const rows = zone.rows || 5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r}_${c}`;
            const plant = zone.plants && zone.plants[key];
            const cell = document.createElement('div');

            cell.style.border = `2px solid ${plant ? (zone.color || '#2d6a4f') : '#ccc'}`;
            cell.style.borderRadius = '6px';
            cell.style.padding = '4px 2px';
            cell.style.textAlign = 'center';
            cell.style.minHeight = '50px';
            cell.style.fontSize = '11px';
            cell.style.backgroundColor = plant ? '#f0faf4' : '#fafafa';
            cell.style.display = 'flex';
            cell.style.flexDirection = 'column';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';

            if (plant && plant.name) {
                cell.innerHTML = `
                    <div style="font-size:18px;">${getPlantEmoji(plant)}</div>
                    <div style="font-weight:bold; font-size:10px;">${plant.name}</div>
                    ${plant.variety ? `<div style="color:#888; font-size:9px;">${plant.variety}</div>` : ''}
                `;
            } else {
                cell.innerHTML = `<div style="color:#ddd; font-size:18px;">·</div>`;
            }

            gridDiv.appendChild(cell);
        }
    }
    content.appendChild(gridDiv);

  
    // Options PDF
    const options = {
        margin: 10,
        filename: `jardin_${zone.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: cols > 10 ? 'landscape' : 'portrait' }
    };

    showToast('Génération du PDF...', 'info');
    html2pdf().set(options).from(content).save()
        .then(() => showToast('PDF exporté ! 📄', 'success'));
}
// ===== SYSTÈME TAMPON =====
let copiedPlant = null;

function handleCellRightClick(e, row, col) {
    e.preventDefault();
    const zone = getCurrentZone();
    if (!zone) return;

    const key = `${row}_${col}`;
    const plant = zone.plants && zone.plants[key];
    if (!plant || !plant.name) return;

    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: white;
        border: 2px solid #2d6a4f;
        border-radius: 10px;
        padding: 8px 0;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        min-width: 200px;
    `;

    menu.innerHTML = `
        <div style="padding:8px 16px; font-weight:bold; color:#2d6a4f; border-bottom:1px solid #eee; margin-bottom:4px;">
            ${getTypeEmoji(plant.type)} ${plant.name}
        </div>
        <div class="ctx-item" onclick="openPlantModal(${row}, ${col}); closeContextMenu()">
            ✏️ Modifier
        </div>
        <div class="ctx-item" onclick="stampLine(${row}, ${col})">
            ➡️ Copier sur toute la ligne
        </div>
        <div class="ctx-item" onclick="stampColumn(${row}, ${col})">
            ⬇️ Copier sur toute la colonne
        </div>
        <div class="ctx-item" onclick="stampRectPrompt(${row}, ${col})">
            ▦ Copier sur une zone rectangle
        </div>
        <div style="border-top:1px solid #eee; margin-top:4px;">
            <div class="ctx-item" style="color:#e63946;" onclick="clearCell(${row}, ${col}); closeContextMenu()">
                🗑️ Supprimer cette plante
            </div>
        </div>
    `;

    document.body.appendChild(menu);
    copiedPlant = { ...plant, sourceRow: row, sourceCol: col };

    highlightSourceCell(row, col);

    setTimeout(() => {
        document.addEventListener('click', closeContextMenu, { once: true });
    }, 100);
}

function closeContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) menu.remove();
}

function highlightSourceCell(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.style.outline = '3px solid orange';
        cell.style.outlineOffset = '-3px';
        setTimeout(() => {
            cell.style.outline = '';
            cell.style.outlineOffset = '';
        }, 3000);
    }
}

function flashCell(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.style.transition = 'background 0.3s';
        cell.style.background = '#95d5b2';
        setTimeout(() => {
            cell.style.background = '';
        }, 600);
    }
}

function clearCell(row, col) {
    const zone = getCurrentZone();
    if (!zone) return;
    const key = `${row}_${col}`;
    if (zone.plants) delete zone.plants[key];
    saveData();
    renderGrid(zone);
    renderLegend(zone);
    updateStats();
    showToast('Plante supprimée 🗑️', 'success');
}

function stampLine(row, col) {
    closeContextMenu();
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const cols = zone.cols || 5;
    let count = 0;

    for (let c = 0; c < cols; c++) {
        if (c !== col) {
            const key = `${row}_${c}`;
            zone.plants[key] = { ...copiedPlant };
            delete zone.plants[key].sourceRow;
            delete zone.plants[key].sourceCol;
            flashCell(row, c);
            count++;
        }
    }

    saveData();
    renderGrid(getCurrentZone());
    showToast(`✅ ${count} cellules remplies sur la ligne !`, 'success');
}

function stampColumn(row, col) {
    closeContextMenu();
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const rows = zone.rows || 5;
    let count = 0;

    for (let r = 0; r < rows; r++) {
        if (r !== row) {
            const key = `${r}_${col}`;
            zone.plants[key] = { ...copiedPlant };
            delete zone.plants[key].sourceRow;
            delete zone.plants[key].sourceCol;
            flashCell(r, col);
            count++;
        }
    }

    saveData();
    renderGrid(getCurrentZone());
    showToast(`✅ ${count} cellules remplies sur la colonne !`, 'success');
}

function stampRectPrompt(row, col) {
    closeContextMenu();

    const modal = document.createElement('div');
    modal.id = 'rect-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="background:white; border-radius:16px; padding:30px; min-width:300px; text-align:center; box-shadow:0 8px 30px rgba(0,0,0,0.3);">
            <h3 style="color:#2d6a4f; margin-bottom:20px;">▦ Zone rectangle</h3>
            <p style="color:#666; margin-bottom:16px;">Depuis la cellule source, copier sur :</p>
            <div style="display:flex; gap:16px; justify-content:center; margin-bottom:20px;">
                <div>
                    <label style="display:block; color:#333; margin-bottom:6px; font-weight:bold;">Colonnes →</label>
                    <input id="rect-cols" type="number" min="1" max="50" value="3"
                        style="width:80px; padding:8px; border:2px solid #2d6a4f; border-radius:8px; text-align:center; font-size:18px;">
                </div>
                <div>
                    <label style="display:block; color:#333; margin-bottom:6px; font-weight:bold;">Lignes ↓</label>
                    <input id="rect-rows" type="number" min="1" max="50" value="3"
                        style="width:80px; padding:8px; border:2px solid #2d6a4f; border-radius:8px; text-align:center; font-size:18px;">
                </div>
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="applyRectStamp(${row}, ${col})"
                    style="background:#2d6a4f; color:white; border:none; padding:10px 24px; border-radius:10px; cursor:pointer; font-weight:bold;">
                    ✅ Appliquer
                </button>
                <button onclick="document.getElementById('rect-modal').remove()"
                    style="background:#eee; color:#333; border:none; padding:10px 24px; border-radius:10px; cursor:pointer;">
                    Annuler
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function applyRectStamp(startRow, startCol) {
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const nbCols = parseInt(document.getElementById('rect-cols').value) || 1;
    const nbRows = parseInt(document.getElementById('rect-rows').value) || 1;

    document.getElementById('rect-modal').remove();

    let count = 0;

    for (let r = startRow; r < startRow + nbRows && r < zone.rows; r++) {
        for (let c = startCol; c < startCol + nbCols && c < zone.cols; c++) {
            if (r === startRow && c === startCol) continue;
            const key = `${r}_${c}`;
            zone.plants[key] = { ...copiedPlant };
            delete zone.plants[key].sourceRow;
            delete zone.plants[key].sourceCol;
            flashCell(r, c);
            count++;
        }
    }

    saveData();
    renderGrid(getCurrentZone());
    showToast(`✅ ${count} cellules remplies dans la zone !`, 'success');
}

function stampColumn(row, col) {
    closeContextMenu();
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const rows = zone.rows || 5;
    let count = 0;

    for (let r = 0; r < rows; r++) {
        const key = `${r}_${col}`;
        if (r !== row) {
            zone.plants[key] = { ...copiedPlant };
            delete zone.plants[key].sourceRow;
            delete zone.plants[key].sourceCol;
            flashCell(r, col);
            count++;
        }
    }

    saveData();
    renderGrid(getCurrentZone());
    showToast(`✅ ${count} cellules remplies sur la colonne !`, 'success');
}

function stampRectPrompt(row, col) {
    closeContextMenu();
    
    const modal = document.createElement('div');
    modal.id = 'rect-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="background:white; border-radius:16px; padding:30px; min-width:300px; text-align:center; box-shadow:0 8px 30px rgba(0,0,0,0.3);">
            <h3 style="color:#2d6a4f; margin-bottom:20px;">▦ Zone rectangle</h3>
            <p style="color:#666; margin-bottom:16px;">Depuis la cellule source, copier sur :</p>
            <div style="display:flex; gap:16px; justify-content:center; margin-bottom:20px;">
                <div>
                    <label style="display:block; color:#333; margin-bottom:6px; font-weight:bold;">Colonnes →</label>
                    <input id="rect-cols" type="number" min="1" max="50" value="3"
                        style="width:80px; padding:8px; border:2px solid #2d6a4f; border-radius:8px; text-align:center; font-size:18px;">
                </div>
                <div>
                    <label style="display:block; color:#333; margin-bottom:6px; font-weight:bold;">Lignes ↓</label>
                    <input id="rect-rows" type="number" min="1" max="50" value="3"
                        style="width:80px; padding:8px; border:2px solid #2d6a4f; border-radius:8px; text-align:center; font-size:18px;">
                </div>
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="applyRectStamp(${row}, ${col})"
                    style="background:#2d6a4f; color:white; border:none; padding:10px 24px; border-radius:10px; cursor:pointer; font-weight:bold; font-size:15px;">
                    ✅ Appliquer
                </button>
                <button onclick="document.getElementById('rect-modal').remove()"
                    style="background:#eee; color:#333; border:none; padding:10px 24px; border-radius:10px; cursor:pointer; font-size:15px;">
                    Annuler
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function applyRectStamp(startRow, startCol) {
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const nbCols = parseInt(document.getElementById('rect-cols').value) || 1;
    const nbRows = parseInt(document.getElementById('rect-rows').value) || 1;

    document.getElementById('rect-modal').remove();

    let count = 0;

    for (let r = startRow; r < startRow + nbRows && r < zone.rows; r++) {
        for (let c = startCol; c < startCol + nbCols && c < zone.cols; c++) {
            if (r === startRow && c === startCol) continue; // skip source
            const key = `${r}_${c}`;
            zone.plants[key] = { ...copiedPlant };
            delete zone.plants[key].sourceRow;
            delete zone.plants[key].sourceCol;
            flashCell(r, c);
            count++;
        }
    }

    saveData();
    renderGrid(getCurrentZone());
    showToast(`✅ ${count} cellules remplies dans la zone !`, 'success');
}
function editPlantFromMenu(r, c) {
    const old = document.getElementById('contextMenu');
    if (old) old.remove();
    openPlantModal(r, c);
}

function deletePlantFromMenu(r, c) {
    const old = document.getElementById('contextMenu');
    if (old) old.remove();

    const zone = getZone(state.currentZoneId);
    if (!zone) return;

    const key = `${r}_${c}`;
    if (!zone.plants) return;
    delete zone.plants[key];

    saveData();
    renderGrid(zone);
    renderLegend(zone);
    updateStats();
}

