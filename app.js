// ===== EMOJIS PAR TYPE =====
const TYPE_EMOJIS = {
    legume: '🥬',
    fruit: '🍓',
    herbe: '🌿',
    fleur: '🌸',
    arbre: '🌳',
    autre: '🌱'
};

const TYPE_COLORS = {
    legume: '#4CAF50',
    fruit: '#FF5722',
    herbe: '#8BC34A',
    fleur: '#E91E63',
    arbre: '#795548',
    autre: '#9E9E9E'
};

// ===== STATE =====
let currentUser = null;
let zones = {};
let plants = {};
let currentZoneId = null;
let editingPlantId = null;
let editingCellIndex = null;
let editingZoneId = null;
let selectedColor = '#4CAF50';
let currentCalendarDate = new Date();
let calendarDate = new Date();

// ===== DOM REFS =====
const loginScreen = document.getElementById('loginScreen');
const appMain = document.getElementById('appMain');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const zonesList = document.getElementById('zonesList');
const gridContainer = document.getElementById('gridContainer');
const zoneHeader = document.getElementById('zoneHeader');
const welcomeMsg = document.getElementById('welcomeMsg');
const zoneName = document.getElementById('zoneName');
const zoneColorDot = document.getElementById('zoneColorDot');
const gridCols = document.getElementById('gridCols');
const gridRows = document.getElementById('gridRows');

// ============================================
// FIREBASE FUNCTIONS
// ============================================

function saveZone(zoneData) {
    return firebase.database().ref('zones/' + zoneData.id).set(zoneData);
}

function savePlant(plantData) {
    return firebase.database().ref('plants/' + plantData.id).set(plantData);
}

function deletePlantFromDB(plantId) {
    return firebase.database().ref('plants/' + plantId).remove();
}

function deleteZoneFromDB(zoneId) {
    const database = firebase.database();
    const updates = {};
    updates['zones/' + zoneId] = null;
    Object.keys(plants).forEach(pid => {
        if (plants[pid].zoneId === zoneId) updates['plants/' + pid] = null;
    });
    return database.ref().update(updates);
}

// ============================================
// REALTIME LISTENERS
// ============================================

function startListeners() {
    firebase.database().ref('zones').on('value', snapshot => {
        const data = snapshot.val() || {};
        zones = {};
        plants = {};
        Object.values(data).forEach(zone => {
            zones[zone.id] = {
                id: zone.id,
                name: zone.name,
                rows: zone.rows || 3,
                cols: zone.cols || 4,
                color: zone.color || '#4CAF50'
            };
            if (zone.plants) {
                Object.values(zone.plants).forEach(plant => {
                    plants[plant.id] = plant;
                });
            }
        });
        renderZones();
        renderZonesList();
        checkReminders();
    });

    firebase.database().ref('plants').on('value', snapshot => {
        const data = snapshot.val() || {};
        Object.values(data).forEach(plant => {
            plants[plant.id] = plant;
        });
        renderZonesList();
        if (currentZoneId) renderGrid(currentZoneId);
    });
}

// ============================================
// RENDER ZONES
// ============================================

function renderZones() {
    const container = document.getElementById('zonesContainer');
    const emptyState = document.getElementById('emptyState');

    if (Object.keys(zones).length === 0) {
        if (container) container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (container) container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    if (container) container.innerHTML = '';

    Object.values(zones).forEach(zone => {
        const zoneEl = createZoneElement(zone);
        if (container) container.appendChild(zoneEl);
    });
}

function createZoneElement(zone) {
    const div = document.createElement('div');
    div.className = 'zone-card';
    div.style.borderColor = zone.color;
    const plantCount = Object.values(plants).filter(p => p.zoneId === zone.id).length;
    div.innerHTML = `
        <div class="zone-header" style="background: ${zone.color}20; border-bottom: 2px solid ${zone.color}">
            <div class="zone-title">
                <span class="zone-color-dot" style="background: ${zone.color}"></span>
                <h3>${zone.name}</h3>
            </div>
            <div class="zone-actions">
                <button onclick="openEditZone('${zone.id}')" class="btn-icon"><i class="fas fa-edit"></i></button>
                <button onclick="confirmDeleteZone('${zone.id}')" class="btn-icon btn-danger"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="zone-info">
            <span><i class="fas fa-seedling"></i> ${plantCount} plante(s)</span>
            <span><i class="fas fa-th"></i> ${zone.cols}×${zone.rows}</span>
        </div>
        <button class="btn-open-zone" onclick="selectZone('${zone.id}')">
            <i class="fas fa-eye"></i> Voir la zone
        </button>
    `;
    return div;
}

function renderZonesList() {
    if (!zonesList) return;
    zonesList.innerHTML = '';
    const zoneArray = Object.values(zones);

    if (zoneArray.length === 0) {
        zonesList.innerHTML = '<li style="color:rgba(255,255,255,0.4);padding:12px 20px;font-size:0.85rem;">Aucune zone créée</li>';
        return;
    }

    zoneArray.forEach(zone => {
        const plantCount = Object.values(plants).filter(p => p.zoneId === zone.id).length;
        const li = document.createElement('li');
        li.className = 'zone-item' + (zone.id === currentZoneId ? ' active' : '');
        li.dataset.zoneId = zone.id;
        li.innerHTML = `
            <span class="zone-dot" style="background:${zone.color}"></span>
            <span>${zone.name}</span>
            <span class="zone-plant-count">${plantCount}</span>
        `;
        li.addEventListener('click', () => selectZone(zone.id));
        zonesList.appendChild(li);
    });
}

// ============================================
// ZONE SELECTION & GRID
// ============================================

function selectZone(zoneId) {
    currentZoneId = zoneId;
    const zone = zones[zoneId];
    if (!zone) return;

    if (welcomeMsg) welcomeMsg.style.display = 'none';
    if (zoneHeader) zoneHeader.style.display = 'flex';
    if (zoneName) zoneName.textContent = zone.name;
    if (zoneColorDot) zoneColorDot.style.background = zone.color;
    if (gridCols) gridCols.value = zone.cols;
    if (gridRows) gridRows.value = zone.rows;

    renderZonesList();
    renderGrid(zoneId);
}

function renderGrid(zoneId) {
    if (!gridContainer) return;
    const zone = zones[zoneId];
    if (!zone) return;

    gridContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'garden-grid';
    grid.style.gridTemplateColumns = `repeat(${zone.cols}, 1fr)`;

    const total = zone.rows * zone.cols;
    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const plant = getPlantOnCell(zoneId, i);

        if (plant) {
            cell.classList.add('has-plant');
            cell.innerHTML = `
                <div class="cell-emoji">${getPlantEmoji(plant.type)}</div>
                <div class="cell-name">${plant.name}</div>
                ${plant.reminder?.enabled ? '<span class="cell-reminder">🔔</span>' : ''}
            `;
        } else {
            cell.innerHTML = `<i class="fas fa-plus cell-add-icon"></i>`;
        }

        cell.addEventListener('click', () => openPlantModal(zoneId, i, plant));
        grid.appendChild(cell);
    }

    gridContainer.appendChild(grid);
}

function getPlantOnCell(zoneId, cellIndex) {
    return Object.values(plants).find(p => p.zoneId === zoneId && p.cellIndex === cellIndex) || null;
}

function getPlantEmoji(type) {
    return TYPE_EMOJIS[type] || '🌱';
}

// ============================================
// ZONE MODAL
// ============================================

function openAddZone() {
    editingZoneId = null;
    document.getElementById('zoneModalTitle').textContent = 'Nouvelle Zone';
    document.getElementById('zoneName2') && (document.getElementById('zoneName2').value = '');
    const zoneNameInput = document.getElementById('zoneNameInput') || document.getElementById('zoneName2');
    if (zoneNameInput) zoneNameInput.value = '';
    document.getElementById('zoneRows') && (document.getElementById('zoneRows').value = 3);
    document.getElementById('zoneCols') && (document.getElementById('zoneCols').value = 4);
    document.getElementById('deleteZoneBtn') && (document.getElementById('deleteZoneBtn').style.display = 'none');
    document.getElementById('zoneModal').style.display = 'flex';
}

function openEditZone(zoneId) {
    editingZoneId = zoneId;
    const zone = zones[zoneId];
    if (!zone) return;
    document.getElementById('zoneModalTitle').textContent = 'Modifier la Zone';
    const zoneNameInput = document.getElementById('zoneNameInput') || document.getElementById('zoneName2');
    if (zoneNameInput) zoneNameInput.value = zone.name;
    if (document.getElementById('zoneRows')) document.getElementById('zoneRows').value = zone.rows;
    if (document.getElementById('zoneCols')) document.getElementById('zoneCols').value = zone.cols;
    if (document.getElementById('zoneColor')) document.getElementById('zoneColor').value = zone.color;
    if (document.getElementById('deleteZoneBtn')) document.getElementById('deleteZoneBtn').style.display = 'flex';
    document.getElementById('zoneModal').style.display = 'flex';
}

document.getElementById('saveZoneBtn') && document.getElementById('saveZoneBtn').addEventListener('click', async () => {
    const zoneNameInput = document.getElementById('zoneNameInput') || document.getElementById('zoneName2');
    const name = zoneNameInput?.value.trim();
    if (!name) { showToast('Veuillez entrer un nom de zone', 'error'); return; }

    const zoneData = {
        id: editingZoneId || 'zone_' + Date.now(),
        name,
        rows: parseInt(document.getElementById('zoneRows')?.value) || 3,
        cols: parseInt(document.getElementById('zoneCols')?.value) || 4,
        color: document.getElementById('zoneColor')?.value || '#4CAF50'
    };

    await saveZone(zoneData);
    showToast(editingZoneId ? 'Zone mise à jour !' : 'Zone créée ! 🌱', 'success');
    closeAllModals();
});

document.getElementById('deleteZoneBtn') && document.getElementById('deleteZoneBtn').addEventListener('click', () => {
    if (!editingZoneId) return;
    const zone = zones[editingZoneId];
    const zonePlants = Object.values(plants).filter(p => p.zoneId === editingZoneId);
    const msg = zonePlants.length > 0
        ? `Supprimer "${zone.name}" et ses ${zonePlants.length} plante(s) ?`
        : `Supprimer la zone "${zone.name}" ?`;

    if (confirm(msg)) {
        deleteZoneFromDB(editingZoneId).then(() => {
            showToast('Zone supprimée 🗑️', 'success');
            closeAllModals();
        });
    }
});

function confirmDeleteZone(zoneId) {
    editingZoneId = zoneId;
    const zone = zones[zoneId];
    const zonePlants = Object.values(plants).filter(p => p.zoneId === zoneId);
    const msg = zonePlants.length > 0
        ? `Supprimer "${zone.name}" et ses ${zonePlants.length} plante(s) ?`
        : `Supprimer la zone "${zone.name}" ?`;

    if (confirm(msg)) {
        deleteZoneFromDB(zoneId).then(() => {
            showToast('Zone supprimée 🗑️', 'success');
        });
    }
}

// Apply grid size
document.getElementById('applyGridBtn') && document.getElementById('applyGridBtn').addEventListener('click', () => {
    if (!currentZoneId) return;
    const zone = zones[currentZoneId];
    zone.cols = parseInt(gridCols.value) || 5;
    zone.rows = parseInt(gridRows.value) || 5;
    saveZone(zone).then(() => {
        renderGrid(currentZoneId);
        showToast('Grille mise à jour !', 'success');
    });
});

// Color picker
document.getElementById('colorPicker') && document.getElementById('colorPicker').addEventListener('click', e => {
    const opt = e.target.closest('.color-option');
    if (!opt) return;
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    opt.classList.add('selected');
    selectedColor = opt.dataset.color;
});

// ============================================
// PLANT MODAL
// ============================================

function openPlantModal(zoneId, cellIndex, existingPlant = null) {
    currentZoneId = zoneId;
    editingCellIndex = cellIndex;
    editingPlantId = existingPlant ? existingPlant.id : null;

    document.getElementById('plantModalTitle').textContent = existingPlant ? `✏️ ${existingPlant.name}` : '🌱 Ajouter une plante';
    document.getElementById('plantName').value = existingPlant?.name || '';
    document.getElementById('plantVariety').value = existingPlant?.variety || '';
    document.getElementById('plantDate').value = existingPlant?.plantDate || new Date().toISOString().split('T')[0];
    document.getElementById('plantType').value = existingPlant?.type || 'legume';
    document.getElementById('plantWater').value = existingPlant?.waterFreq || 'normal';
    document.getElementById('plantNotes').value = existingPlant?.notes || '';

    const reminderEnabled = existingPlant?.reminder?.enabled || false;
    document.getElementById('reminderEnabled').checked = reminderEnabled;
    document.getElementById('reminderDetail').style.display = reminderEnabled ? 'flex' : 'none';
    if (reminderEnabled) {
        document.getElementById('reminderDate').value = existingPlant.reminder.date || '';
        document.getElementById('reminderText').value = existingPlant.reminder.text || '';
    }

    const photoPreview = document.getElementById('photoPreview');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    if (existingPlant?.photoUrl) {
        photoPreview.src = existingPlant.photoUrl;
        photoPreview.style.display = 'block';
        photoPlaceholder.style.display = 'none';
    } else {
        photoPreview.style.display = 'none';
        photoPreview.src = '';
        photoPlaceholder.style.display = 'flex';
    }

    document.getElementById('deletePlantBtn').style.display = existingPlant ? 'flex' : 'none';
    document.getElementById('plantModal').style.display = 'flex';
}

function openAddPlant(zoneId, cellIndex) {
    openPlantModal(zoneId, cellIndex, null);
}

function openEditPlant(plantId, zoneId, cellIndex) {
    const plant = plants[plantId];
    if (!plant) return;
    openPlantModal(zoneId, cellIndex, plant);
}

// ============================================
// CALENDAR
// ============================================

function openCalendar() {
    renderCalendar();
    document.getElementById('calendarModal').style.display = 'flex';
}

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById('calendarTitle').textContent =
        calendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirst = (firstDay === 0 ? 6 : firstDay - 1);

    const reminderDates = {};
    Object.values(plants).forEach(plant => {
        if (plant.reminder?.enabled && plant.reminder?.date) {
            const d = plant.reminder.date;
            if (!reminderDates[d]) reminderDates[d] = [];
            reminderDates[d].push(plant);
        }
    });

    const plantDates = {};
    Object.values(plants).forEach(plant => {
        if (plant.plantDate) {
            if (!plantDates[plant.plantDate]) plantDates[plant.plantDate] = [];
            plantDates[plant.plantDate].push(plant);
        }
    });

    let html = '';
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayNames.forEach(d => { html += `<div class="cal-header-day">${d}</div>`; });

    for (let i = 0; i < adjustedFirst; i++) {
        html += '<div class="cal-day empty"></div>';
    }

    const today = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const isToday = dateStr === today;
        const hasReminder = reminderDates[dateStr];
        const hasPlanting = plantDates[dateStr];

        let classes = 'cal-day';
        if (isToday) classes += ' today';
        if (hasReminder) classes += ' has-reminder';
        if (hasPlanting) classes += ' has-planting';

        let dots = '';
        if (hasReminder) dots += '<span class="cal-dot reminder"></span>';
        if (hasPlanting) dots += '<span class="cal-dot planting"></span>';

        html += `
            <div class="${classes}" onclick="showDayEvents('${dateStr}')">
                <span>${day}</span>
                <div class="cal-dots">${dots}</div>
            </div>
        `;
    }

    document.getElementById('calendarGrid').innerHTML = html;
}

function showDayEvents(dateStr) {
    const reminders = Object.values(plants).filter(p => p.reminder?.enabled && p.reminder?.date === dateStr);
    const planted = Object.values(plants).filter(p => p.plantDate === dateStr);

    let html = `<h4>📅 ${new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}</h4>`;

    if (reminders.length > 0) {
        html += `<p><strong>🔔 Rappels :</strong></p>`;
        reminders.forEach(p => {
            html += `<div class="day-event reminder-event" onclick="openEditPlant('${p.id}','${p.zoneId}',${p.cellIndex})">${getPlantEmoji(p.type)} ${p.name} — ${p.reminder.text || 'Rappel'}</div>`;
        });
    }
    if (planted.length > 0) {
        html += `<p><strong>🌱 Plantations :</strong></p>`;
        planted.forEach(p => {
            html += `<div class="day-event plant-event" onclick="openEditPlant('${p.id}','${p.zoneId}',${p.cellIndex})">${getPlantEmoji(p.type)} ${p.name}</div>`;
        });
    }
    if (reminders.length === 0 && planted.length === 0) {
        html += `<p style="color:#999">Rien de prévu ce jour.</p>`;
    }

    const popup = document.getElementById('dayEventsPopup') || (() => {
        const el = document.createElement('div');
        el.id = 'dayEventsPopup';
        el.className = 'day-events-popup';
        document.body.appendChild(el);
        return el;
    })();

    popup.innerHTML = html + `<button onclick="document.getElementById('dayEventsPopup').style.display='none'" class="btn-close-popup">Fermer</button>`;
    popup.style.display = 'block';
}

document.getElementById('calPrev') && document.getElementById('calPrev').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('calNext') && document.getElementById('calNext').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('calendarBtn') && document.getElementById('calendarBtn').addEventListener('click', openCalendar);

// ============================================
// REMINDERS
// ============================================

function checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    const due = Object.values(plants).filter(p =>
        p.reminder?.enabled && p.reminder?.date && p.reminder.date <= today
    );
    const badge = document.getElementById('reminderBadge');
    if (badge) badge.textContent = due.length > 0 ? due.length : '';
}

function openReminders() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = Object.values(plants)
        .filter(p => p.reminder?.enabled && p.reminder?.date)
        .sort((a, b) => a.reminder.date.localeCompare(b.reminder.date));

    const list = document.getElementById('reminderList');

    if (upcoming.length === 0) {
        list.innerHTML = '<div class="empty-reminders"><i class="fas fa-bell-slash"></i><p>Aucun rappel programmé</p></div>';
    } else {
        list.innerHTML = upcoming.map(plant => {
            const isPast = plant.reminder.date <= today;
            const zone = zones[plant.zoneId];
            return `
                <div class="reminder-item ${isPast ? 'past' : 'future'}">
                    <div class="reminder-icon">${getPlantEmoji(plant.type)}</div>
                    <div class="reminder-info">
                        <strong>${plant.name}</strong>
                        <span>${plant.reminder.text || 'Rappel'}</span>
                        <small>📍 ${zone?.name || 'Zone inconnue'} • 📅 ${new Date(plant.reminder.date + 'T12:00:00').toLocaleDateString('fr-FR')}</small>
                    </div>
                    <div class="reminder-status">
                        ${isPast ? '<span class="badge badge-past">Échu</span>' : '<span class="badge badge-future">À venir</span>'}
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('reminderModal').style.display = 'flex';
}

document.getElementById('reminderBtn') && document.getElementById('reminderBtn').addEventListener('click', openReminders);

// ============================================
// SEARCH
// ============================================

document.getElementById('searchInput') && document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.trim().toLowerCase();
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!query) { container.innerHTML = ''; return; }

    const results = Object.values(plants).filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.variety && p.variety.toLowerCase().includes(query)) ||
        (p.notes && p.notes.toLowerCase().includes(query))
    );

    if (results.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">Aucun résultat</p>';
        return;
    }

    const byZone = {};
    results.forEach(p => {
        if (!byZone[p.zoneId]) byZone[p.zoneId] = [];
        byZone[p.zoneId].push(p);
    });

    container.innerHTML = '';
    Object.entries(byZone).forEach(([zoneId, zonePlants]) => {
        const zone = zones[zoneId];
        if (!zone) return;
        const div = document.createElement('div');
        div.className = 'zone-card search-result';
        div.style.borderColor = zone.color;
        div.innerHTML = `
            <div class="zone-header" style="background: ${zone.color}20; border-bottom: 2px solid ${zone.color}">
                <div class="zone-title">
                    <span class="zone-color-dot" style="background: ${zone.color}"></span>
                    <h3>${zone.name}</h3>
                </div>
            </div>
            <div class="search-plants-list">
                ${zonePlants.map(p => `
                    <div class="search-plant-item" onclick="openEditPlant('${p.id}', '${p.zoneId}', ${p.cellIndex})">
                        <span>${getPlantEmoji(p.type)}</span>
                        <div>
                            <strong>${p.name}</strong>
                            ${p.variety ? `<small>${p.variety}</small>` : ''}
                        </div>
                        ${p.reminder?.enabled ? '<span class="cell-reminder">🔔</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });
});

// ============================================
// MODAL CLOSE HELPERS
// ============================================

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeAllModals();
    });
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// ADD ZONE BUTTON
// ============================================

document.getElementById('addZoneBtn') && document.getElementById('addZoneBtn').addEventListener('click', openAddZone);
document.getElementById('addZoneFab') && document.getElementById('addZoneFab').addEventListener('click', openAddZone);

// ============================================
// PHOTO UPLOAD
// ============================================

document.getElementById('photoInput') && document.getElementById('photoInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast('Photo trop lourde (max 2MB)', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('photoPreview');
        preview.src = ev.target.result;
        preview.style.display = 'block';
        document.getElementById('photoPlaceholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

// ============================================
// REMINDER TOGGLE
// ============================================

document.getElementById('reminderEnabled') && document.getElementById('reminderEnabled').addEventListener('change', e => {
    document.getElementById('reminderDetail').style.display = e.target.checked ? 'flex' : 'none';
});

// ============================================
// SAVE PLANT
// ============================================

document.getElementById('savePlant') && document.getElementById('savePlant').addEventListener('click', async () => {
    const name = document.getElementById('plantName').value.trim();
    if (!name) { showToast('Veuillez entrer un nom de plante', 'error'); return; }

    const reminderEnabled = document.getElementById('reminderEnabled').checked;

    let photoUrl = '';
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview.style.display !== 'none' && photoPreview.src && photoPreview.src !== window.location.href) {
        photoUrl = photoPreview.src;
    }

    const plantData = {
        id: editingPlantId || 'plant_' + Date.now(),
        zoneId: currentZoneId,
        cellIndex: editingCellIndex,
        name,
        variety: document.getElementById('plantVariety').value.trim(),
        plantDate: document.getElementById('plantDate').value,
        type: document.getElementById('plantType').value,
        waterFreq: document.getElementById('plantWater').value,
        notes: document.getElementById('plantNotes').value.trim(),
        photoUrl,
        reminder: {
            enabled: reminderEnabled,
            date: reminderEnabled ? document.getElementById('reminderDate').value : '',
            text: reminderEnabled ? document.getElementById('reminderText').value.trim() : ''
        },
        addedBy: currentUser?.displayName || 'Inconnu',
        updatedAt: Date.now(),
        createdAt: editingPlantId ? (plants[editingPlantId]?.createdAt || Date.now()) : Date.now()
    };

    await savePlant(plantData);
    showToast(editingPlantId ? 'Plante mise à jour ! 🌿' : 'Plante ajoutée ! 🌱', 'success');
    closeAllModals();
});

// ============================================
// DELETE PLANT
// ============================================

document.getElementById('deletePlantBtn') && document.getElementById('deletePlantBtn').addEventListener('click', () => {
    if (!editingPlantId) return;
    const plant = plants[editingPlantId];
    if (confirm(`Supprimer "${plant?.name}" ?`)) {
        deletePlantFromDB(editingPlantId).then(() => {
            showToast('Plante supprimée 🗑️', 'success');
            closeAllModals();
        });
    }
});

// ============================================
// INIT - AUTH
// ============================================

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userName').textContent = user.displayName?.split(' ')[0] || 'Jardinier';
        if (user.photoURL) {
            document.getElementById('userAvatar').src = user.photoURL;
            document.getElementById('userAvatar').style.display = 'block';
        }
        startListeners();
    } else {
        currentUser = null;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
});

document.getElementById('loginBtn') && document.getElementById('loginBtn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(e => {
        showToast('Erreur de connexion', 'error');
        console.error(e);
    });
});

document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Se déconnecter ?')) {
        firebase.auth().signOut();
    }
});
