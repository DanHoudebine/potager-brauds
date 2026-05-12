// ============================================================
// APP.JS - Le Potager des Brauds
// ============================================================

// ===== STATE =====
let state = {
    zones: [],
    currentZoneId: null,
    selectedCell: null,  // { row, col }
    editingPlantId: null
};

let currentUser = null;
let db = null;
let calendarDate = new Date();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    bindEvents();
});

// ===== FIREBASE =====
function initFirebase() {
    db = firebase.database();

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

function dbRef() {
    return db.ref('users/' + currentUser.uid);
}

// ===== LOAD DATA =====
function loadZones() {
    dbRef().child('zones').on('value', snapshot => {
        const data = snapshot.val();
        state.zones = data ? Object.values(data) : [];
        renderSidebar();
        updateStats();

        // Recharge la zone courante si elle existe encore
        if (state.currentZoneId) {
            const zone = getZone(state.currentZoneId);
            if (zone) {
                selectZone(state.currentZoneId);
            } else {
                state.currentZoneId = null;
                showWelcome();
            }
        } else {
            showWelcome();
        }
    });
}

// ===== GETTERS =====
function getZone(id) {
    return state.zones.find(z => z.id === id);
}

function getCurrentZone() {
    return getZone(state.currentZoneId);
}

// ===== SIDEBAR =====
function renderSidebar() {
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
            <span class="zone-item-name">${zone.name}</span>
            <span class="zone-item-count">${countPlants(zone)} 🌱</span>
        `;
        li.addEventListener('click', () => selectZone(zone.id));
        list.appendChild(li);
    });
}

function countPlants(zone) {
    if (!zone.grid) return 0;
    let count = 0;
    zone.grid.forEach(row => {
        if (row) row.forEach(cell => { if (cell) count++; });
    });
    return count;
}

function updateStats() {
    let totalPlants = 0;
    state.zones.forEach(z => { totalPlants += countPlants(z); });
    document.getElementById('totalPlants').textContent = totalPlants;
    document.getElementById('totalZones').textContent = state.zones.length;
}

// ===== SELECT ZONE =====
function selectZone(id) {
    state.currentZoneId = id;
    const zone = getZone(id);
    if (!zone) return;

    // Update sidebar
    renderSidebar();

    // Show zone header
    document.getElementById('welcomeMsg').style.display = 'none';
    document.getElementById('zoneHeader').style.display = 'flex';
    document.getElementById('legend').style.display = 'flex';

    // Fill header
    document.getElementById('zoneName').textContent = zone.name;
    document.getElementById('zoneColorDot').style.background = zone.color;
    document.getElementById('gridCols').value = zone.cols || 5;
    document.getElementById('gridRows').value = zone.rows || 5;

    // Render grid
    renderGrid(zone);
    renderLegend(zone);
}

function showWelcome() {
    document.getElementById('welcomeMsg').style.display = 'flex';
    document.getElementById('zoneHeader').style.display = 'none';
    document.getElementById('gridContainer').innerHTML = '';
    document.getElementById('legend').style.display = 'none';
}

// ===== GRID =====
function renderGrid(zone) {
    const container = document.getElementById('gridContainer');
    const cols = zone.cols || 5;
    const rows = zone.rows || 5;
    const grid = zone.grid || [];

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            const plant = grid[r] && grid[r][c] ? grid[r][c] : null;

            if (plant) {
                cell.classList.add('occupied');
                cell.style.borderColor = getTypeColor(plant.type);
                cell.style.background = getTypeColor(plant.type) + '22';
                cell.innerHTML = `
                    <div class="cell-emoji">${getTypeEmoji(plant.type)}</div>
                    <div class="cell-name">${plant.name}</div>
                `;
            } else {
                cell.innerHTML = `<div class="cell-empty">+</div>`;
            }

            cell.addEventListener('click', () => openPlantModal(r, c));
            container.appendChild(cell);
        }
    }
}

function getTypeColor(type) {
    const colors = {
        legume: '#4CAF50',
        fruit: '#E91E63',
        herbe: '#00BCD4',
        fleur: '#FF9800',
        arbre: '#795548',
        autre: '#9E9E9E'
    };
    return colors[type] || '#9E9E9E';
}

function getTypeEmoji(type) {
    const emojis = {
        legume: '🥬',
        fruit: '🍓',
        herbe: '🌿',
        fleur: '🌸',
        arbre: '🌳',
        autre: '🌱'
    };
    return emojis[type] || '🌱';
}

// ===== LEGEND =====
function renderLegend(zone) {
    const items = document.getElementById('legendItems');
    items.innerHTML = '';

    if (!zone.grid) return;

    const seen = {};
    zone.grid.forEach(row => {
        if (!row) return;
        row.forEach(cell => {
            if (cell && !seen[cell.type]) {
                seen[cell.type] = true;
                const div = document.createElement('div');
                div.className = 'legend-item';
                div.innerHTML = `
                    <span class="legend-dot" style="background:${getTypeColor(cell.type)}"></span>
                    <span>${getTypeEmoji(cell.type)} ${capitalize(cell.type)}</span>
                `;
                items.appendChild(div);
            }
        });
    });
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ===== APPLY GRID SIZE =====
function applyGrid() {
    const zone = getCurrentZone();
    if (!zone) return;

    const newCols = parseInt(document.getElementById('gridCols').value) || 5;
    const newRows = parseInt(document.getElementById('gridRows').value) || 5;

    const oldGrid = zone.grid || [];
    const newGrid = [];

    for (let r = 0; r < newRows; r++) {
        newGrid[r] = [];
        for (let c = 0; c < newCols; c++) {
            newGrid[r][c] = (oldGrid[r] && oldGrid[r][c]) ? oldGrid[r][c] : null;
        }
    }

    zone.cols = newCols;
    zone.rows = newRows;
    zone.grid = newGrid;

    saveZoneToDb(zone);
    renderGrid(zone);
    showToast('Grille mise à jour ✅');
}

// ===== PLANT MODAL =====
function openPlantModal(row, col) {
    const zone = getCurrentZone();
    if (!zone) return;

    state.selectedCell = { row, col };
    const plant = zone.grid && zone.grid[row] && zone.grid[row][col] ? zone.grid[row][col] : null;

    // Reset form
    document.getElementById('plantName').value = plant ? plant.name : '';
    document.getElementById('plantVariety').value = plant ? (plant.variety || '') : '';
    document.getElementById('plantDate').value = plant ? (plant.date || '') : '';
    document.getElementById('plantType').value = plant ? (plant.type || 'legume') : 'legume';
    document.getElementById('plantWater').value = plant ? (plant.water || 'semaine') : 'semaine';
    document.getElementById('plantNotes').value = plant ? (plant.notes || '') : '';

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
    document.getElementById('reminderDate').value = plant ? (plant.reminderDate || '') : '';
    document.getElementById('reminderText').value = plant ? (plant.reminderText || '') : '';

    // Title & delete btn
    document.getElementById('plantModalTitle').textContent = plant ? '✏️ Modifier la plante' : '🌱 Ajouter une plante';
    document.getElementById('deletePlantBtn').style.display = plant ? 'inline-flex' : 'none';
    document.getElementById('saveZone').textContent = plant ? 'Modifier' : 'Créer'; // bouton zone modal, pas celui-ci
    document.getElementById('savePlant').innerHTML = plant
        ? '<i class="fas fa-save"></i> Modifier'
        : '<i class="fas fa-save"></i> Sauvegarder';

    openModal('plantModal');
}

function savePlant() {
    const name = document.getElementById('plantName').value.trim();
    if (!name) {
        showToast('Veuillez entrer un nom de plante ⚠️', 'warning');
        return;
    }

    const zone = getCurrentZone();
    if (!zone || !state.selectedCell) return;

    const { row, col } = state.selectedCell;

    // Init grid if needed
    if (!zone.grid) zone.grid = [];
    for (let r = 0; r <= row; r++) {
        if (!zone.grid[r]) zone.grid[r] = [];
    }

    const reminder = document.getElementById('reminderEnabled').checked;

    zone.grid[row][col] = {
        name,
        variety: document.getElementById('plantVariety').value.trim(),
        date: document.getElementById('plantDate').value,
        type: document.getElementById('plantType').value,
        water: document.getElementById('plantWater').value,
        notes: document.getElementById('plantNotes').value.trim(),
        photo: document.getElementById('photoPreview').src || null,
        reminder,
        reminderDate: reminder ? document.getElementById('reminderDate').value : null,
        reminderText: reminder ? document.getElementById('reminderText').value.trim() : null,
    };

    saveZoneToDb(zone);
    closeModal('plantModal');
    renderGrid(zone);
    renderLegend(zone);
    updateStats();
    showToast('Plante sauvegardée 🌱');
}

function deletePlant() {
    const zone = getCurrentZone();
    if (!zone || !state.selectedCell) return;

    const { row, col } = state.selectedCell;
    if (zone.grid && zone.grid[row]) {
        zone.grid[row][col] = null;
    }

    saveZoneToDb(zone);
    closeModal('plantModal');
    renderGrid(zone);
    renderLegend(zone);
    updateStats();
    showToast('Plante supprimée 🗑️');
}

// ===== ZONE MODAL =====
let editingZoneId = null;
let selectedColor = '#4CAF50';

function openAddZoneModal() {
    editingZoneId = null;
    selectedColor = '#4CAF50';
    document.getElementById('zoneModalTitle').textContent = 'Nouvelle zone';
    document.getElementById('zoneNameInput').value = '';
    document.getElementById('zoneColsInput').value = 5;
    document.getElementById('zoneRowsInput').value = 5;
    document.getElementById('saveZone').innerHTML = '<i class="fas fa-save"></i> Créer';

    // Reset color selection
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.color === selectedColor);
    });

    openModal('zoneModal');
}

function openEditZoneModal() {
    const zone = getCurrentZone();
    if (!zone) return;

    editingZoneId = zone.id;
    selectedColor = zone.color;
    document.getElementById('zoneModalTitle').textContent = 'Modifier la zone';
    document.getElementById('zoneNameInput').value = zone.name;
    document.getElementById('zoneColsInput').value = zone.cols || 5;
    document.getElementById('zoneRowsInput').value = zone.rows || 5;
    document.getElementById('saveZone').innerHTML = '<i class="fas fa-save"></i> Modifier';

    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.color === selectedColor);
    });

    openModal('zoneModal');
}

function saveZoneModal() {
    const name = document.getElementById('zoneNameInput').value.trim();
    if (!name) {
        showToast('Veuillez entrer un nom ⚠️', 'warning');
        return;
    }

    const cols = parseInt(document.getElementById('zoneColsInput').value) || 5;
    const rows = parseInt(document.getElementById('zoneRowsInput').value) || 5;

    if (editingZoneId) {
        // Edit existing
        const zone = getZone(editingZoneId);
        zone.name = name;
        zone.color = selectedColor;
        zone.cols = cols;
        zone.rows = rows;
        saveZoneToDb(zone);
        showToast('Zone modifiée ✅');
    } else {
        // Create new
        const id = 'zone_' + Date.now();
        const zone = {
            id,
            name,
            color: selectedColor,
            cols,
            rows,
            grid: []
        };
        dbRef().child('zones/' + id).set(zone);
        state.currentZoneId = id;
        showToast('Zone créée 🎉');
    }

    closeModal('zoneModal');
}

function deleteCurrentZone() {
    const zone = getCurrentZone();
    if (!zone) return;

    if (!confirm(`Supprimer la zone "${zone.name}" et toutes ses plantes ?`)) return;

    dbRef().child('zones/' + zone.id).remove();
    state.currentZoneId = null;
    showToast('Zone supprimée 🗑️');
}

function saveZoneToDb(zone) {
    dbRef().child('zones/' + zone.id).set(zone);
}

// ===== CALENDAR =====
function openCalendar() {
    calendarDate = new Date();
    renderCalendar();
    openModal('calendarModal');
}

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const months = ['Janvier','Février','Mars','Avril','Mai','Juin',
                    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('calendarMonthYear').textContent = `${months[month]} ${year}`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Headers
    ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'cal-header';
        h.textContent = d;
        grid.appendChild(h);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Collect all plant dates
    const plantDates = {};
    state.zones.forEach(zone => {
        if (!zone.grid) return;
        zone.grid.forEach(row => {
            if (!row) return;
            row.forEach(cell => {
                if (cell && cell.date) {
                    const d = cell.date.split('T')[0];
                    if (!plantDates[d]) plantDates[d] = [];
                    plantDates[d].push(cell.name);
                }
                if (cell && cell.reminderDate) {
                    const d = cell.reminderDate.split('T')[0];
                    if (!plantDates[d]) plantDates[d] = [];
                    plantDates[d].push('🔔 ' + (cell.reminderText || cell.name));
                }
            });
        });
    });

    for (let i = 0; i < offset; i++) {
        const blank = document.createElement('div');
        blank.className = 'cal-day empty';
        grid.appendChild(blank);
    }

    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement('div');
        div.className = 'cal-day';

        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        if (plantDates[dateStr]) div.classList.add('has-event');
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            div.classList.add('today');
        }

        div.innerHTML = `<span>${d}</span>`;
        if (plantDates[dateStr]) {
            div.title = plantDates[dateStr].join(', ');
        }
        grid.appendChild(div);
    }

    // Events list
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    const monthEvents = Object.entries(plantDates).filter(([d]) => {
        const [y, m] = d.split('-');
        return parseInt(y) === year && parseInt(m) === month + 1;
    });

    if (monthEvents.length === 0) {
        eventsList.innerHTML = '<li class="empty-msg">Aucun événement ce mois</li>';
    } else {
        monthEvents.sort(([a],[b]) => a.localeCompare(b)).forEach(([date, events]) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${date}</strong> — ${events.join(', ')}`;
            eventsList.appendChild(li);
        });
    }
}

// ===== REMINDERS =====
function openReminders() {
    const list = document.getElementById('remindersList');
    list.innerHTML = '';

    const reminders = [];
    state.zones.forEach(zone => {
        if (!zone.grid) return;
        zone.grid.forEach(row => {
            if (!row) return;
            row.forEach(cell => {
                if (cell && cell.reminder && cell.reminderDate) {
                    reminders.push({ zone: zone.name, plant: cell.name, date: cell.reminderDate, text: cell.reminderText });
                }
            });
        });
    });

    if (reminders.length === 0) {
        list.innerHTML = '<p class="empty-msg">Aucun rappel pour le moment</p>';
    } else {
        reminders.sort((a,b) => a.date.localeCompare(b.date)).forEach(r => {
            const div = document.createElement('div');
            div.className = 'reminder-item';
            div.innerHTML = `
                <div class="reminder-icon">🔔</div>
                <div>
                    <strong>${r.plant}</strong> — ${r.zone}<br>
                    <small>${r.date}${r.text ? ' · ' + r.text : ''}</small>
                </div>
            `;
            list.appendChild(div);
        });
    }

    openModal('remindersModal');
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
function showToast(message, type = 'success') {
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
        firebase.auth().signInWithPopup(provider).catch(err => showToast(err.message, 'error'));
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        firebase.auth().signOut();
    });

    // Header buttons
    document.getElementById('calendarBtn').addEventListener('click', openCalendar);
    document.getElementById('reminderBtn').addEventListener('click', openReminders);

    // Sidebar
    document.getElementById('addZoneBtn').addEventListener('click', openAddZoneModal);

    // Zone header
    document.getElementById('applyGridBtn').addEventListener('click', applyGrid);
    document.getElementById('editZoneBtn').addEventListener('click', openEditZoneModal);
    document.getElementById('deleteZoneBtn').addEventListener('click', deleteCurrentZone);

    // Plant modal
    document.getElementById('savePlant').addEventListener('click', savePlant);
    document.getElementById('cancelModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('closeModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('deletePlantBtn').addEventListener('click', deletePlant);
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

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Photo upload
    initPhotoUpload();
}
