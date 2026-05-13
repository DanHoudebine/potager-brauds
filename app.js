// ============================================================
// APP.JS - Le Potager des Brauds
// ============================================================

// ===== STATE =====
let state = {
    zones: [],
    currentZoneId: null,
    selectedCell: null,  // { row, col }
    editingPlantId: null,
    draggedPlant: null
};

let currentUser = null;
let db = null;
let calendarDate = new Date();
let selectedColor = '#4CAF50';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    bindEvents();
    initAuth();
});

// ===== FIREBASE INIT =====
function initFirebase() {
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
}

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
}

function showApp(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appMain').style.display = 'flex';
    document.getElementById('userName').textContent = user.displayName || 'Utilisateur';
    document.getElementById('userAvatar').src = user.photoURL || '';
}

// ===== DATABASE REF =====
function dbRef() {
    return db.ref();
}

// ===== ZONE MANAGEMENT =====
function getZone(id) {
    return state.zones.find(z => z.id === id);
}

function getCurrentZone() {
    return state.zones.find(z => z.id === state.currentZoneId);
}

function loadZones() {
    dbRef().child('zones').once('value', snapshot => {
        const zones = snapshot.val() || {};
        state.zones = Object.entries(zones).map(([id, data]) => ({
            id,
            ...data
        }));
        renderZones();
        updateStats();
    });
}

function renderZones() {
    const zonesList = document.getElementById('zonesList');
    zonesList.innerHTML = '';

    state.zones.forEach(zone => {
        const zoneItem = document.createElement('li');
        zoneItem.className = `zone-item ${state.currentZoneId === zone.id ? 'active' : ''}`;
        zoneItem.innerHTML = `
            <span class="zone-color-dot" style="background:${zone.color || '#4CAF50'}"></span>
            <span>${zone.name || 'Zone sans nom'}</span>
        `;
        zoneItem.addEventListener('click', () => selectZone(zone.id));
        zonesList.appendChild(zoneItem);
    });
}

function selectZone(zoneId) {
    state.currentZoneId = zoneId;
    const zone = getZone(zoneId);

    // Update UI
    document.getElementById('zoneHeader').style.display = 'flex';
    document.getElementById('welcomeMsg').style.display = 'none';

    document.getElementById('zoneName').textContent = zone.name || 'Zone sans nom';
    document.getElementById('zoneColorDot').style.background = zone.color || '#4CAF50';
    document.getElementById('gridCols').value = zone.cols || 5;
    document.getElementById('gridRows').value = zone.rows || 5;

    renderGrid(zone);
    renderZones(); // Refresh to highlight active zone
}

function openZoneModal(zone = null) {
    const modal = document.getElementById('zoneModal');
    const title = document.getElementById('zoneModalTitle');
    const nameInput = document.getElementById('zoneNameInput');
    const colsInput = document.getElementById('zoneCols');
    const rowsInput = document.getElementById('zoneRows');
    const saveBtn = document.getElementById('saveZone');

    title.textContent = zone ? 'Modifier la zone' : 'Nouvelle zone';
    nameInput.value = zone ? zone.name : '';
    colsInput.value = zone ? zone.cols : 5;
    rowsInput.value = zone ? zone.rows : 5;

    // Set selected color
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
        if (zone && opt.dataset.color === zone.color) {
            opt.classList.add('selected');
            selectedColor = zone.color;
        }
    });

    document.getElementById('colorPicker').addEventListener('click', e => {
        if (e.target.classList.contains('color-option')) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.dataset.color;
        }
    });

    modal.style.display = 'flex';
    saveBtn.onclick = () => saveZone(zone);
}

function saveZone(editingZone = null) {
    const name = document.getElementById('zoneNameInput').value.trim();
    const cols = parseInt(document.getElementById('zoneCols').value) || 5;
    const rows = parseInt(document.getElementById('zoneRows').value) || 5;

    if (!name) {
        showToast('Veuillez entrer un nom de zone', 'error');
        return;
    }

    if (editingZone) {
        dbRef().child(`zones/${editingZone.id}`).update({ name, color: selectedColor, cols, rows })
            .then(() => {
                showToast('Zone modifiée !', 'success');
                closeModal('zoneModal');
                loadZones();
            });
    } else {
        const newRef = dbRef().child('zones').push();
        newRef.set({ name, color: selectedColor, cols, rows, plants: {} })
            .then(() => {
                showToast('Zone créée ! 🎉', 'success');
                closeModal('zoneModal');
                state.currentZoneId = newRef.key;
                loadZones();
                selectZone(newRef.key);
            });
    }
}

function deleteZone() {
    if (!state.currentZoneId) return;
    const zone = getZone(state.currentZoneId);
    if (!zone) return;
    if (!confirm(`Supprimer la zone "${zone.name}" et toutes ses plantes ?`)) return;

    dbRef().child(`zones/${state.currentZoneId}`).remove()
        .then(() => {
            state.currentZoneId = null;
            document.getElementById('zoneHeader').style.display = 'none';
            document.getElementById('welcomeMsg').style.display = 'flex';
            document.getElementById('gridContainer').innerHTML = '';
            showToast('Zone supprimée 🗑️', 'info');
            loadZones();
        })
        .catch(err => showToast('Erreur: ' + err.message, 'error'));
}

// ===== GRID RENDERING =====
function renderGrid(zone) {
    const grid = document.getElementById('gridContainer');
    grid.innerHTML = '';

    const cols = zone.cols || 5;
    const rows = zone.rows || 5;

    const gridElement = document.createElement('div');
    gridElement.className = 'garden-grid';
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            const plantKey = `${r}_${c}`;
            if (zone.plants && zone.plants[plantKey]) {
                const plant = zone.plants[plantKey];
                cell.classList.add('has-plant');
                cell.innerHTML = `
                    <div class="cell-emoji">${plant.emoji || '🌱'}</div>
                    <div style="font-size:10px; text-align:center; margin-top:2px;">${plant.name || 'Plante'}</div>
                `;
            }

            cell.addEventListener('click', () => openPlantModal(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showContextMenu(r, c);
            });

            gridElement.appendChild(cell);
        }
    }

    grid.appendChild(gridElement);
}

// ===== PLANT MANAGEMENT =====
const PLANT_LIBRARY = [
    // Légumes
    { name: 'Tomate',      emoji: '🍅', type: 'legume' },
    { name: 'Carotte',     emoji: '🥕', type: 'legume' },
    { name: 'Salade',      emoji: '🥬', type: 'legume' },
    { name: 'Pomme de terre', emoji: '🥔', type: 'legume' },
    { name: 'Courgette',   emoji: '🥒', type: 'legume' },
    { name: 'Aubergine',   emoji: '🍆', type: 'legume' },
    { name: 'Poivron',     emoji: '🌶️', type: 'legume' },
    // Herbes
    { name: 'Basilic',     emoji: '🌿', type: 'herbe' },
    { name: 'Persil',      emoji: '🌿', type: 'herbe' },
    { name: 'Coriandre',   emoji: '🌿', type: 'herbe' },
    { name: 'Menthe',      emoji: '🌱', type: 'herbe' },
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

function openPlantModal(row, col) {
    state.selectedCell = { row, col };
    const modal = document.getElementById('plantModal');
    const title = document.getElementById('plantModalTitle');
    const dateInput = document.getElementById('plantDate');
    const reminderInput = document.getElementById('plantReminder');

    title.textContent = 'Ajouter une plante';
    dateInput.valueAsDate = new Date();
    reminderInput.value = '';

    renderPlantPalette();

    modal.style.display = 'flex';
}

function renderPlantPalette() {
    const palette = document.getElementById('plantPalette');
    palette.innerHTML = '';

    PLANT_LIBRARY.forEach(plant => {
        const btn = document.createElement('div');
        btn.className = 'plant-option';
        btn.innerHTML = `
            <div style="font-size:24px;">${plant.emoji}</div>
            <div style="font-size:10px; text-align:center;">${plant.name}</div>
        `;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.plant-option').forEach(opt => opt.classList.remove('selected'));
            btn.classList.add('selected');
            state.selectedPlant = plant;
        });
        palette.appendChild(btn);
    });
}

function savePlant() {
    if (!state.selectedCell || !state.selectedPlant) {
        showToast('Veuillez sélectionner une plante', 'error');
        return;
    }

    const { row, col } = state.selectedCell;
    const zone = getCurrentZone();
    if (!zone) return;

    const date = document.getElementById('plantDate').value;
    const reminder = document.getElementById('plantReminder').value;

    const plantKey = `${row}_${col}`;
    zone.plants = zone.plants || {};
    zone.plants[plantKey] = {
        ...state.selectedPlant,
        plantedAt: date,
        reminder: reminder ? { date: reminder } : null
    };

    saveData();
    renderGrid(zone);
    closeModal('plantModal');
    showToast('Plante ajoutée ! 🌱', 'success');
}

function saveData() {
    if (!state.currentZoneId) return;
    const zone = getCurrentZone();
    dbRef().child(`zones/${state.currentZoneId}`).update(zone)
        .then(() => updateStats())
        .catch(err => showToast('Erreur sauvegarde: ' + err.message, 'error'));
}

function updateStats() {
    const totalPlants = state.zones.reduce((sum, z) => {
        return sum + (z.plants ? Object.keys(z.plants).length : 0);
    }, 0);

    const totalZones = state.zones.length;

    document.getElementById('totalPlants').textContent = totalPlants;
    document.getElementById('totalZones').textContent = totalZones;
}

// ===== MODALS =====
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ===== CONTEXT MENU =====
function showContextMenu(row, col) {
    const menu = document.getElementById('contextMenu');
    menu.innerHTML = `
        <div class="context-menu-item" onclick="editPlant(${row}, ${col})">
            <i class="fas fa-edit"></i> Modifier
        </div>
        <div class="context-menu-item" onclick="removePlant(${row}, ${col})">
            <i class="fas fa-trash"></i> Supprimer
        </div>
    `;
    menu.style.display = 'block';
    menu.style.left = `${col * 80 + 20}px`;
    menu.style.top = `${row * 80 + 20}px`;
}

function editPlant(row, col) {
    state.selectedCell = { row, col };
    const zone = getCurrentZone();
    if (!zone || !zone.plants) return;

    const plantKey = `${row}_${col}`;
    const plant = zone.plants[plantKey];

    if (plant) {
        openPlantModal(row, col);
        // TODO: Pre-fill form with plant data
    }
}

function removePlant(row, col) {
    const zone = getCurrentZone();
    if (!zone || !zone.plants) return;

    const plantKey = `${row}_${col}`;
    delete zone.plants[plantKey];

    saveData();
    renderGrid(zone);
    showToast('Plante supprimée', 'info');
}

// ===== EVENTS =====
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
    document.getElementById('deleteZoneBtn').addEventListener('click', () => deleteZone());
    document.getElementById('applyGridBtn').addEventListener('click', () => {
        const zone = getCurrentZone();
        if (zone) {
            zone.cols = parseInt(document.getElementById('gridCols').value) || 5;
            zone.rows = parseInt(document.getElementById('gridRows').value) || 5;
            saveData();
            renderGrid(zone);
        }
    });

    // Modals
    document.getElementById('closeZoneModal').addEventListener('click', () => closeModal('zoneModal'));
    document.getElementById('cancelZoneModal').addEventListener('click', () => closeModal('zoneModal'));
    document.getElementById('closePlantModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('cancelPlantModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('closeCalendarModal').addEventListener('click', () => closeModal('calendarModal'));
    document.getElementById('closeRemindersModal').addEventListener('click', () => closeModal('remindersModal'));

    document.getElementById('savePlant').addEventListener('click', savePlant);

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

// ===== CALENDAR =====
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin',
                        'Juillet','Août','Septembre','Octembre','Novembre','Décembre'];
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;

    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for days before 1st
    for (let i = 0; i < firstDay; i++) {
        const day = document.createElement('div');
        day.className = 'cal-day empty';
        calendarGrid.appendChild(day);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
        const day = document.createElement('div');
        day.className = 'cal-day';
        day.textContent = d;
        if (d === new Date().getDate() && month === new Date().getMonth()) {
            day.classList.add('today');
        }
        calendarGrid.appendChild(day);
    }
}

function renderReminders() {
    const container = document.getElementById('remindersList');
    container.innerHTML = '';

    const reminders = [];
    state.zones.forEach(zone => {
        if (!zone.plants) return;
        Object.entries(zone.plants).forEach(([key, plant]) => {
            if (plant.reminder && plant.reminder.date) {
                reminders.push({
                    plant: plant.name,
                    zone: zone.name,
                    date: plant.reminder.date,
                    text: plant.reminder.text
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
            <div class="reminder-date">${new Date(r.date).toLocaleDateString('fr-FR')}</div>
            <div class="reminder-info">
                <strong>${r.plant}</strong> - ${r.zone}
                ${r.text ? `<p>${r.text}</p>` : ''}
            </div>
        `;
        container.appendChild(div);
    });
}

// ===== LEGEND =====
function toggleLegend() {
    const panel = document.getElementById('legendPanel');
    panel.classList.toggle('open');
}

function renderLegend() {
    const panel = document.getElementById('legendPanel');
    const items = document.getElementById('legendItems');
    items.innerHTML = '';

    const types = [...new Set(PLANT_LIBRARY.map(p => p.type))];
    types.forEach(type => {
        const plants = PLANT_LIBRARY.filter(p => p.type === type);
        const section = document.createElement('div');
        section.style.marginBottom = '16px';
        section.innerHTML = `<strong style="text-transform:uppercase; font-size:0.8rem; color:#666;">${type}</strong>`;
        plants.forEach(plant => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <span style="font-size:20px;">${plant.emoji}</span>
                <span style="margin-left:8px;">${plant.name}</span>
            `;
            items.appendChild(item);
        });
    });
}

// ===== EXPORT PDF =====
function exportPDF() {
    const element = document.querySelector('.grid-container');
    const opt = {
        margin: 10,
        filename: `Potager-${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
