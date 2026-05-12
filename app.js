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
let selectedColor = '#4CAF50';
let currentCalendarDate = new Date();

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

// ===== AUTH =====
loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(err => showToast('Erreur de connexion', 'error'));
});

logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loginScreen.style.display = 'none';
        appMain.style.display = 'flex';
        userAvatar.src = user.photoURL || '';
        userAvatar.style.display = user.photoURL ? 'block' : 'none';
        userName.textContent = user.displayName?.split(' ')[0] || 'Jardinier';
        loadData();
    } else {
        currentUser = null;
        loginScreen.style.display = 'flex';
        appMain.style.display = 'none';
    }
});

// ===== FIREBASE DATA =====
function loadData() {
    const db = firebase.database();
    
    // Charger zones
    db.ref('zones').on('value', snap => {
        zones = snap.val() || {};
        renderZonesList();
        if (currentZoneId && zones[currentZoneId]) {
            renderGrid(currentZoneId);
        }
        updateStats();
    });
    
    // Charger plantes
    db.ref('plants').on('value', snap => {
        plants = snap.val() || {};
        if (currentZoneId) renderGrid(currentZoneId);
        updateStats();
        updateLegend();
    });
}

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
    // Supprimer zone et toutes ses plantes
    const db = firebase.database();
    const updates = {};
    updates['zones/' + zoneId] = null;
    // Supprimer les plantes de cette zone
    Object.keys(plants).forEach(pid => {
        if (plants[pid].zoneId === zoneId) updates['plants/' + pid] = null;
    });
    return db.ref().update(updates);
}

// ===== ZONES =====
document.getElementById('addZoneBtn').addEventListener('click', () => {
    openZoneModal();
});

function openZoneModal(zoneId = null) {
    const modal = document.getElementById('zoneModal');
    const title = document.getElementById('zoneModalTitle');
    const nameInput = document.getElementById('zoneNameInput');
    const colsInput = document.getElementById('zoneColsInput');
    const rowsInput = document.getElementById('zoneRowsInput');
    const saveBtn = document.getElementById('saveZone');

    if (zoneId && zones[zoneId]) {
        const z = zones[zoneId];
        title.textContent = 'Modifier la zone';
        nameInput.value = z.name;
        colsInput.value = z.cols;
        rowsInput.value = z.rows;
        selectedColor = z.color;
        saveBtn.textContent = 'Modifier';
        saveBtn.dataset.editId = zoneId;
    } else {
        title.textContent = 'Nouvelle zone';
        nameInput.value = '';
        colsInput.value = 5;
        rowsInput.value = 5;
        selectedColor = '#4CAF50';
        saveBtn.textContent = 'Créer';
        delete saveBtn.dataset.editId;
    }
    
    // Màj couleurs
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.color === selectedColor);
    });
    
    modal.classList.add('active');
}

document.getElementById('saveZone').addEventListener('click', () => {
    const nameInput = document.getElementById('zoneNameInput');
    const colsInput = document.getElementById('zoneColsInput');
    const rowsInput = document.getElementById('zoneRowsInput');
    const saveBtn = document.getElementById('saveZone');
    
    const name = nameInput.value.trim();
    if (!name) { showToast('Veuillez entrer un nom pour la zone', 'error'); return; }
    
    const editId = saveBtn.dataset.editId;
    const zoneId = editId || 'zone_' + Date.now();
    
    const zoneData = {
        id: zoneId,
        name,
        color: selectedColor,
        cols: parseInt(colsInput.value) || 5,
        rows: parseInt(rowsInput.value) || 5,
        createdAt: editId ? zones[editId].createdAt : Date.now()
    };
    
    saveZone(zoneData).then(() => {
        showToast(editId ? 'Zone modifiée !' : 'Zone créée !', 'success');
        closeAllModals();
        if (!editId) selectZone(zoneId);
    });
});

document.getElementById('closeZoneModal').addEventListener('click', closeAllModals);
document.getElementById('cancelZoneModal').addEventListener('click', closeAllModals);

// Color picker
document.getElementById('colorPicker').addEventListener('click', e => {
    const opt = e.target.closest('.color-option');
    if (!opt) return;
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    opt.classList.add('selected');
    selectedColor = opt.dataset.color;
});

function renderZonesList() {
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

function selectZone(zoneId) {
    currentZoneId = zoneId;
    renderZonesList();
    renderGrid(zoneId);
    
    const zone = zones[zoneId];
    if (zone) {
        zoneName.textContent = zone.name;
        zoneColorDot.style.background = zone.color;
        gridCols.value = zone.cols;
        gridRows.value = zone.rows;
        zoneHeader.style.display = 'flex';
        welcomeMsg.style.display = 'none';
        updateLegend();
    }
}

// Edit/Delete zone
document.getElementById('editZoneBtn').addEventListener('click', () => {
    if (currentZoneId) openZoneModal(currentZoneId);
});

document.getElementById('deleteZoneBtn').addEventListener('click', () => {
    if (!currentZoneId) return;
    const zone = zones[currentZoneId];
    if (confirm(`Supprimer la zone "${zone.name}" et toutes ses plantes ?`)) {
        deleteZoneFromDB(currentZoneId).then(() => {
            currentZoneId = null;
            zoneHeader.style.display = 'none';
            welcomeMsg.style.display = 'block';
            gridContainer.innerHTML = '';
            document.getElementById('legend').style.display = 'none';
            showToast('Zone supprimée', 'success');
        });
    }
});

// Apply grid size
document.getElementById('applyGridBtn').addEventListener('click', () => {
    if (!currentZoneId) return;
    const zone = zones[currentZoneId];
    zone.cols = parseInt(gridCols.value) || 5;
    zone.rows = parseInt(gridRows.value) || 5;
    saveZone(zone).then(() => {
        renderGrid(currentZoneId);
        showToast('Grille mise à jour !', 'success');
    });
});

// ===== GRID =====
function renderGrid(zoneId) {
    const zone = zones[zoneId];
    if (!zone) return;
    
    const cols = zone.cols || 5;
    const rows = zone.rows || 5;
    const totalCells = cols * rows;
    
    gridContainer.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'garden-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        
        // Chercher une plante sur cette case
        const plant = getPlantOnCell(zoneId, i);
        
        if (plant) {
            cell.classList.add('has-plant');
            cell.style.background = TYPE_COLORS[plant.type] + '22';
            cell.style.borderColor = TYPE_COLORS[plant.type];
            
            if (plant.photoUrl) {
                cell.innerHTML = `
                    <img class="cell-photo" src="${plant.photoUrl}" alt="${plant.name}">
                    <span class="cell-name">${plant.name}</span>
                `;
            } else {
                cell.innerHTML = `
                    <span class="cell-emoji">${TYPE_EMOJIS[plant.type] || '🌱'}</span>
                    <span class="cell-name">${plant.name}</span>
                `;
            }
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

// ===== PLANT MODAL =====
function openPlantModal(zoneId, cellIndex, existingPlant = null) {
    editingPlantId = existingPlant ? existingPlant.id : null;
    editingCellIndex = cellIndex;
    
    const modal = document.getElementById('plantModal');
    const title = document.getElementById('modalTitle');
    const deleteBtn = document.getElementById('deletePlantBtn');
    
    // Reset form
    document.getElementById('plantName').value = existingPlant?.name || '';
    document.getElementById('plantVariety').value = existingPlant?.variety || '';
    document.getElementById('plantDate').value = existingPlant?.plantDate || '';
    document.getElementById('plantType').value = existingPlant?.type || 'legume';
    document.getElementById('plantWater').value = existingPlant?.waterFreq || 'quotidien';
    document.getElementById('plantNotes').value = existingPlant?.notes || '';
    document.getElementById('reminderEnabled').checked = existingPlant?.reminder?.enabled || false;
    document.getElementById('reminderDate').value = existingPlant?.reminder?.date || '';
    document.getElementById('reminderText').value = existingPlant?.reminder?.text || '';
    document.getElementById('reminderDetail').style.display = existingPlant?.reminder?.enabled ? 'flex' : 'none';
    
    // Photo
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
    
    title.textContent = existingPlant ? `✏️ ${existingPlant.name}` : '🌱 Ajouter une plante';
    deleteBtn.style.display = existingPlant ? 'flex' : 'none';
    
    modal.classList.add('active');
}

// Photo upload
document.getElementById('photoUploadArea').addEventListener('click', () => {
    document.getElementById('plantPhoto').click();
});

document.getElementById('plantPhoto').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('photoPreview');
        preview.src = ev.target.result;
        preview.style.display = 'block';
        document.getElementById('photoPlaceholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

// Reminder toggle
document.getElementById('reminderEnabled').addEventListener('change', e => {
    document.getElementById('reminderDetail').style.display = e.target.checked ? 'flex' : 'none';
});

// Save plant
document.getElementById('savePlant').addEventListener('click', async () => {
    const name = document.getElementById('plantName').value.trim();
    if (!name) { showToast('Veuillez entrer un nom de plante', 'error'); return; }
    
    const reminderEnabled = document.getElementById('reminderEnabled').checked;
    
    // Gestion photo (base64 si nouvelle, sinon garder l'ancienne)
    let photoUrl = '';
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview.style.display !== 'none' && photoPreview.src) {
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
    showToast(editingPlantId ? 'Plante mise à jour !' : 'Plante ajoutée ! 🌱', 'success');
    closeAllModals();
});

// Delete plant
document.getElementById('deletePlantBtn').addEventListener('click', () => {
    if (!editingPlantId) return;
    const plant = plants[editingPlantId];
    if (confirm(`Supprimer "${plant?.name}" ?`)) {
        deletePlantFromDB(editingPlantId).then(() => {
            showToast('Plante supprimée
// ============================================
// SUITE ET FIN DE app.js
// ============================================

// Delete plant (suite)
document.getElementById('deletePlantBtn').addEventListener('click', () => {
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
// FIREBASE FUNCTIONS
// ============================================

async function savePlant(plantData) {
    try {
        await db.ref(`zones/${plantData.zoneId}/plants/${plantData.id}`).set(plantData);
    } catch(e) {
        console.error(e);
        showToast('Erreur de sauvegarde', 'error');
    }
}

async function deletePlantFromDB(plantId) {
    const plant = plants[plantId];
    if (!plant) return;
    try {
        await db.ref(`zones/${plant.zoneId}/plants/${plantId}`).remove();
    } catch(e) {
        console.error(e);
        showToast('Erreur de suppression', 'error');
    }
}

async function saveZone(zoneData) {
    try {
        await db.ref(`zones/${zoneData.id}`).update({
            id: zoneData.id,
            name: zoneData.name,
            rows: zoneData.rows,
            cols: zoneData.cols,
            color: zoneData.color,
            updatedAt: Date.now()
        });
    } catch(e) {
        console.error(e);
        showToast('Erreur de sauvegarde zone', 'error');
    }
}

async function deleteZoneFromDB(zoneId) {
    try {
        await db.ref(`zones/${zoneId}`).remove();
    } catch(e) {
        console.error(e);
        showToast('Erreur de suppression zone', 'error');
    }
}

// ============================================
// REALTIME LISTENERS
// ============================================

function startListeners() {
    // Écoute toutes les zones en temps réel
    db.ref('zones').on('value', snapshot => {
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
        checkReminders();
    });
}

// ============================================
// RENDER ZONES
// ============================================

function renderZones() {
    const container = document.getElementById('zonesContainer');
    const emptyState = document.getElementById('emptyState');

    if (Object.keys(zones).length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';

    Object.values(zones).forEach(zone => {
        const zoneEl = createZoneElement(zone);
        container.appendChild(zoneEl);
    });
}

function createZoneElement(zone) {
    const div = document.createElement('div');
    div.className = 'zone-card';
    div.style.borderColor = zone.color;

    const zonePlants = Object.values(plants).filter(p => p.zoneId === zone.id);
    const totalCells = zone.rows * zone.cols;
    const occupied = zonePlants.length;

    div.innerHTML = `
        <div class="zone-header" style="background: ${zone.color}20; border-bottom: 2px solid ${zone.color}">
            <div class="zone-title">
                <span class="zone-color-dot" style="background: ${zone.color}"></span>
                <h3>${zone.name}</h3>
            </div>
            <div class="zone-actions">
                <span class="zone-stats">${occupied}/${totalCells} cases</span>
                <button class="btn btn-icon-sm" onclick="openEditZone('${zone.id}')" title="Modifier la zone">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="btn btn-icon-sm btn-danger" onclick="confirmDeleteZone('${zone.id}')" title="Supprimer la zone">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="zone-grid" style="grid-template-columns: repeat(${zone.cols}, 1fr)">
            ${renderCells(zone)}
        </div>
    `;
    return div;
}

function renderCells(zone) {
    let html = '';
    const totalCells = zone.rows * zone.cols;
    const zonePlants = Object.values(plants).filter(p => p.zoneId === zone.id);

    for (let i = 0; i < totalCells; i++) {
        const plant = zonePlants.find(p => p.cellIndex === i);
        if (plant) {
            const typeEmoji = getPlantEmoji(plant.type);
            const hasReminder = plant.reminder?.enabled && plant.reminder?.date;
            html += `
                <div class="cell occupied" onclick="openEditPlant('${plant.id}', '${zone.id}', ${i})" title="${plant.name}">
                    <span class="cell-emoji">${typeEmoji}</span>
                    <span class="cell-name">${plant.name}</span>
                    ${hasReminder ? '<span class="cell-reminder">🔔</span>' : ''}
                </div>
            `;
        } else {
            html += `
                <div class="cell empty" onclick="openAddPlant('${zone.id}', ${i})">
                    <i class="fas fa-plus"></i>
                </div>
            `;
        }
    }
    return html;
}

function getPlantEmoji(type) {
    const emojis = {
        'legume': '🥦',
        'fruit': '🍅',
        'herbe': '🌿',
        'fleur': '🌸',
        'autre': '🌱'
    };
    return emojis[type] || '🌱';
}

// ============================================
// ZONE MODAL
// ============================================

let editingZoneId = null;

function openAddZone() {
    editingZoneId = null;
    document.getElementById('zoneModalTitle').textContent = 'Nouvelle Zone';
    document.getElementById('zoneName').value = '';
    document.getElementById('zoneRows').value = 3;
    document.getElementById('zoneCols').value = 4;
    document.getElementById('zoneColor').value = '#4CAF50';
    document.getElementById('deleteZoneBtn').style.display = 'none';
    document.getElementById('zoneModal').style.display = 'flex';
}

function openEditZone(zoneId) {
    editingZoneId = zoneId;
    const zone = zones[zoneId];
    document.getElementById('zoneModalTitle').textContent = 'Modifier la Zone';
    document.getElementById('zoneName').value = zone.name;
    document.getElementById('zoneRows').value = zone.rows;
    document.getElementById('zoneCols').value = zone.cols;
    document.getElementById('zoneColor').value = zone.color || '#4CAF50';
    document.getElementById('deleteZoneBtn').style.display = 'block';
    document.getElementById('zoneModal').style.display = 'flex';
}

document.getElementById('saveZone').addEventListener('click', async () => {
    const name = document.getElementById('zoneName').value.trim();
    if (!name) { showToast('Veuillez entrer un nom de zone', 'error'); return; }

    const zoneData = {
        id: editingZoneId || 'zone_' + Date.now(),
        name,
        rows: parseInt(document.getElementById('zoneRows').value) || 3,
        cols: parseInt(document.getElementById('zoneCols').value) || 4,
        color: document.getElementById('zoneColor').value
    };

    await saveZone(zoneData);
    showToast(editingZoneId ? 'Zone mise à jour !' : 'Zone créée ! 🌱', 'success');
    closeAllModals();
});

document.getElementById('deleteZoneBtn').addEventListener('click', () => {
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

// ============================================
// PLANT MODAL
// ============================================

let editingPlantId = null;
let editingCellIndex = null;
let currentZoneId = null;

function openAddPlant(zoneId, cellIndex) {
    editingPlantId = null;
    editingCellIndex = cellIndex;
    currentZoneId = zoneId;

    document.getElementById('plantModalTitle').textContent = 'Nouvelle Plante';
    document.getElementById('plantName').value = '';
    document.getElementById('plantVariety').value = '';
    document.getElementById('plantDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('plantType').value = 'legume';
    document.getElementById('plantWater').value = 'normal';
    document.getElementById('plantNotes').value = '';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoPlaceholder').style.display = 'flex';
    document.getElementById('reminderEnabled').checked = false;
    document.getElementById('reminderDetail').style.display = 'none';
    document.getElementById('deletePlantBtn').style.display = 'none';
    document.getElementById('plantModal').style.display = 'flex';
}

function openEditPlant(plantId, zoneId, cellIndex) {
    const plant = plants[plantId];
    if (!plant) return;

    editingPlantId = plantId;
    editingCellIndex = cellIndex;
    currentZoneId = zoneId;

    document.getElementById('plantModalTitle').textContent = 'Modifier la Plante';
    document.getElementById('plantName').value = plant.name || '';
    document.getElementById('plantVariety').value = plant.variety || '';
    document.getElementById('plantDate').value = plant.plantDate || '';
    document.getElementById('plantType').value = plant.type || 'legume';
    document.getElementById('plantWater').value = plant.waterFreq || 'normal';
    document.getElementById('plantNotes').value = plant.notes || '';

    const preview = document.getElementById('photoPreview');
    if (plant.photoUrl) {
        preview.src = plant.photoUrl;
        preview.style.display = 'block';
        document.getElementById('photoPlaceholder').style.display = 'none';
    } else {
        preview.style.display = 'none';
        document.getElementById('photoPlaceholder').style.display = 'flex';
    }

    const hasReminder = plant.reminder?.enabled;
    document.getElementById('reminderEnabled').checked = hasReminder || false;
    document.getElementById('reminderDetail').style.display = hasReminder ? 'flex' : 'none';
    if (hasReminder) {
        document.getElementById('reminderDate').value = plant.reminder.date || '';
        document.getElementById('reminderText').value = plant.reminder.text || '';
    }

    document.getElementById('deletePlantBtn').style.display = 'block';
    document.getElementById('plantModal').style.display = 'flex';
}

// ============================================
// CALENDAR
// ============================================

let calendarDate = new Date();

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

    // Collecter les dates avec rappels
    const reminderDates = {};
    Object.values(plants).forEach(plant => {
        if (plant.reminder?.enabled && plant.reminder?.date) {
            const d = plant.reminder.date;
            if (!reminderDates[d]) reminderDates[d] = [];
            reminderDates[d].push(plant);
        }
    });

    // Collecter les dates de plantation
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
    const reminderPlants = Object.values(plants).filter(p =>
        p.reminder?.enabled && p.reminder?.date === dateStr
    );
    const plantingPlants = Object.values(plants).filter(p => p.plantDate === dateStr);

    if (reminderPlants.length === 0 && plantingPlants.length === 0) return;

    let msg = `📅 ${new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'})}\n\n`;

    if (plantingPlants.length > 0) {
        msg += '🌱 Plantations :\n';
        plantingPlants.forEach(p => { msg += `  • ${p.name} (${p.variety || 'sans variété'})\n`; });
    }
    if (reminderPlants.length > 0) {
        msg += '\n🔔 Rappels :\n';
        reminderPlants.forEach(p => { msg += `  • ${p.name} : ${p.reminder.text || 'Rappel'}\n`; });
    }

    alert(msg);
}

document.getElementById('calendarPrev').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('calendarNext').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('calendarBtn').addEventListener('click', openCalendar);

// ============================================
// REMINDERS
// ============================================

function checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = Object.values(plants).filter(p => {
        if (!p.reminder?.enabled || !p.reminder?.date) return false;
        return p.reminder.date <= today;
    });

    const badge = document.getElementById('reminderBadge');
    if (upcoming.length > 0) {
        badge.textContent = upcoming.length;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
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

document.getElementById('reminderBtn').addEventListener('click', openReminders);

// ============================================
// SEARCH
// ============================================

document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderZones();
        return;
    }

    const container = document.getElementById('zonesContainer');
    container.innerHTML = '';
    container.style.display = 'grid';
    document.getElementById('emptyState').style.display = 'none';

    const matchingPlants = Object.values(plants).filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.variety && p.variety.toLowerCase().includes(query)) ||
        (p.notes && p.notes.toLowerCase().includes(query))
    );

    if (matchingPlants.length === 0) {
        container.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i><p>Aucune plante trouvée</p></div>';
        return;
    }

    // Grouper par zone
    const byZone = {};
    matchingPlants.forEach(p => {
        if (!byZone[p.zoneId]) byZone[p.zoneId] = [];
        byZone[p.zoneId].push(p);
    });

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

document.getElementById('addZoneBtn').addEventListener('click', openAddZone);
document.getElementById('addZoneFab').addEventListener('click', openAddZone);

// ============================================
// INIT
// ============================================

// Auth state listener
auth.onAuthStateChanged(user => {
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

document.getElementById('loginBtn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => {
        showToast('Erreur de connexion', 'error');
        console.error(e);
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Se déconnecter ?')) {
        auth.signOut();
    }
});

// Photo upload
document.getElementById('photoInput').addEventListener('change', e => {
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

// Reminder toggle
document.getElementById('reminderEnabled').addEventListener('change', e => {
    document.getElementById('reminderDetail').style.display = e.target.checked ? 'flex' : 'none';
});

// Save plant
document.getElementById('savePlant').addEventListener('click', async () => {
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

// Delete plant
document.getElementById('deletePlantBtn').addEventListener('click', () => {
    if (!editingPlantId) return;
    const plant = plants[editingPlantId];
    if (confirm(`Supprimer "${plant?.name}" ?`)) {
        deletePlantFromDB(editingPlantId).then(() => {
            showToast('Plante supprimée 🗑️', 'success');
            closeAllModals();
        });
    }
});
