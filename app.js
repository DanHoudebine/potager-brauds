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
                    <div class="cell-emoji">${getTypeEmoji(plant.type)}</div>
                    <div class="cell-name">${plant.name}</div>
                    ${plant.variety ? `<div class="cell-variety">${plant.variety}</div>` : ''}
                `;
            } else {
                cell.innerHTML = '<div class="cell-empty">+</div>';
            }

            cell.addEventListener('click', () => openPlantModal(r, c));
            container.appendChild(cell);
        }
    }
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

    if (!zone.plants) return;

    const types = {};
    Object.values(zone.plants).forEach(p => {
        if (p && p.name) {
            types[p.type] = (types[p.type] || 0) + 1;
        }
    });

    Object.entries(types).forEach(([type, count]) => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `${getTypeEmoji(type)} ${type} <strong>(${count})</strong>`;
        items.appendChild(div);
    });
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
    if (!confirm('Supprimer cette plante ?')) return;
    const key = `${state.selectedCell.row}_${state.selectedCell.col}`;
    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).remove()
        .then(() => {
            showToast('Plante supprimée', 'info');
            closeModal('plantModal');
        });
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

function deleteZone() {
    if (!confirm('Supprimer cette zone et toutes ses plantes ?')) return;
    dbRef().child(`zones/${state.currentZoneId}`).remove()
        .then(() => {
            state.currentZoneId = null;
            document.getElementById('zoneHeader').style.display = 'none';
            document.getElementById('welcomeMsg').style.display = 'flex';
            document.getElementById('gridContainer').innerHTML = '';
            document.getElementById('legend').style.display = 'none';
            showToast('Zone supprimée', 'info');
        });
}

function applyGrid() {
    const cols = parseInt(document.getElementById('gridCols').value) || 5;
    const rows = parseInt(document.getElementById('gridRows').value) || 5;
    dbRef().child(`zones/${state.currentZoneId}`).update({ cols, rows })
        .then(() => showToast('Grille mise à jour !', 'success'));
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
