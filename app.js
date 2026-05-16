// ===== PLANT LIBRARY =====
// Base de données des plantes du potager

const PLANT_LIBRARY = [
    // LÉGUMES
    { id: 'tomate', name: 'Tomate', type: 'legume', emoji: '🍅', water: 'semaine', notes: 'Plein soleil, tuteurer' },
    { id: 'tomate_cerise', name: 'Tomate cerise', type: 'legume', emoji: '🍅', water: 'semaine', notes: 'Très productive, plein soleil' },
    { id: 'courgette', name: 'Courgette', type: 'legume', emoji: '🥒', water: 'semaine', notes: 'Beaucoup de place, arrosage régulier' },
    { id: 'carotte', name: 'Carotte', type: 'legume', emoji: '🥕', water: 'semaine', notes: 'Sol meuble et profond' },
    { id: 'salade', name: 'Salade', type: 'legume', emoji: '🥬', water: '2jours', notes: "Mi-ombre accepté" },
    { id: 'laitue', name: 'Laitue', type: 'legume', emoji: '🥬', water: '2jours', notes: 'Arrosage régulier' },
    { id: 'epinard', name: 'Épinard', type: 'legume', emoji: '🥬', water: 'semaine', notes: 'Pousse rapide, tolère le froid' },
    { id: 'radis', name: 'Radis', type: 'legume', emoji: '🌱', water: '2jours', notes: 'Récolte en 3-4 semaines' },
    { id: 'haricot', name: 'Haricot vert', type: 'legume', emoji: '🫘', water: 'semaine', notes: 'Plein soleil, semis direct' },
    { id: 'petit_pois', name: 'Petit pois', type: 'legume', emoji: '🫛', water: 'semaine', notes: 'Tuteurer, semis tôt' },
    { id: 'poivron', name: 'Poivron', type: 'legume', emoji: '🫑', water: 'semaine', notes: 'Chaleur nécessaire' },
    { id: 'aubergine', name: 'Aubergine', type: 'legume', emoji: '🍆', water: 'semaine', notes: 'Plein soleil, chaleur' },
    { id: 'concombre', name: 'Concombre', type: 'legume', emoji: '🥒', water: '2jours', notes: 'Tuteurer, arrosage régulier' },
    { id: 'poireau', name: 'Poireau', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Long à cultiver, résistant' },
    { id: 'oignon', name: 'Oignon', type: 'legume', emoji: '🧅', water: 'semaine', notes: 'Sol bien drainé' },
    { id: 'ail', name: 'Ail', type: 'legume', emoji: '🧄', water: 'rarement', notes: 'Plantation automne ou printemps' },
    { id: 'brocoli', name: 'Brocoli', type: 'legume', emoji: '🥦', water: 'semaine', notes: 'Résistant au froid' },
    { id: 'chou', name: 'Chou', type: 'legume', emoji: '🥬', water: 'semaine', notes: 'Beaucoup de place' },
    { id: 'chou_fleur', name: 'Chou-fleur', type: 'legume', emoji: '🥦', water: 'semaine', notes: 'Sol riche' },
    { id: 'betterave', name: 'Betterave', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Sol profond' },
    { id: 'panais', name: 'Panais', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Semis direct, sol profond' },
    { id: 'navet', name: 'Navet', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Croissance rapide' },
    { id: 'celeri', name: 'Céleri', type: 'legume', emoji: '🌱', water: '2jours', notes: "Beaucoup d'eau" },
    { id: 'fenouil', name: 'Fenouil', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Isoler des autres légumes' },
    { id: 'artichaut', name: 'Artichaut', type: 'legume', emoji: '🌱', water: 'semaine', notes: 'Vivace, grande place' },
    { id: 'patate_douce', name: 'Patate douce', type: 'legume', emoji: '🍠', water: 'semaine', notes: 'Sol léger, chaleur' },
    { id: 'mais', name: 'Maïs', type: 'legume', emoji: '🌽', water: 'semaine', notes: 'Planter en groupe' },
    { id: 'potiron', name: 'Potiron', type: 'legume', emoji: '🎃', water: 'semaine', notes: 'Beaucoup de place' },
    { id: 'courgette_ronde', name: 'Courge', type: 'legume', emoji: '🥒', water: 'semaine', notes: 'Sol riche, soleil' },

    // FRUITS
    { id: 'fraise', name: 'Fraise', type: 'fruit', emoji: '🍓', water: '2jours', notes: 'Plein soleil, stolons à couper' },
    { id: 'framboise', name: 'Framboise', type: 'fruit', emoji: '🫐', water: 'semaine', notes: 'Tuteurage, mi-ombre ok' },
    { id: 'myrtille', name: 'Myrtille', type: 'fruit', emoji: '🫐', water: 'semaine', notes: 'Sol acide obligatoire' },
    { id: 'groseille', name: 'Groseille', type: 'fruit', emoji: '🍇', water: 'semaine', notes: "Résistant, peu d'entretien" },
    { id: 'cassis', name: 'Cassis', type: 'fruit', emoji: '🍇', water: 'semaine', notes: "Mi-ombre accepté" },
    { id: 'melon', name: 'Melon', type: 'fruit', emoji: '🍈', water: 'semaine', notes: 'Chaleur et soleil indispensables' },
    { id: 'pastèque', name: "Pastèque", type: 'fruit', emoji: '🍉', water: 'semaine', notes: 'Très grande place, chaleur' },
    { id: 'raisin', name: 'Vigne', type: 'fruit', emoji: '🍇', water: 'rarement', notes: 'Taille annuelle nécessaire' },

    // HERBES AROMATIQUES
    { id: 'basilic', name: 'Basilic', type: 'herbe', emoji: '🌿', water: '2jours', notes: "Chaud, pas de courant d'air" },
    { id: 'persil', name: 'Persil', type: 'herbe', emoji: '🌿', water: 'semaine', notes: "Mi-ombre accepté" },
    { id: 'ciboulette', name: 'Ciboulette', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Vivace, facile' },
    { id: 'thym', name: 'Thym', type: 'herbe', emoji: '🌿', water: 'rarement', notes: 'Sol sec, plein soleil' },
    { id: 'romarin', name: 'Romarin', type: 'herbe', emoji: '🌿', water: 'rarement', notes: 'Sol drainant, résistant' },
    { id: 'menthe', name: 'Menthe', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Envahissante, isoler en pot' },
    { id: 'sauge', name: 'Sauge', type: 'herbe', emoji: '🌿', water: 'rarement', notes: 'Sol sec, plein soleil' },
    { id: 'origan', name: 'Origan', type: 'herbe', emoji: '🌿', water: 'rarement', notes: 'Vivace, plein soleil' },
    { id: 'estragon', name: 'Estragon', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Vivace, sol bien drainé' },
    { id: 'laurier', name: 'Laurier', type: 'herbe', emoji: '🌿', water: 'rarement', notes: 'Arbuste, résistant' },
    { id: 'aneth', name: 'Aneth', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Semis direct, ne transplante pas bien' },
    { id: 'coriandre', name: 'Coriandre', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Monte vite en graine' },
    { id: 'lavande', name: 'Lavande', type: 'herbe', emoji: '💜', water: 'rarement', notes: 'Sol calcaire, plein soleil' },
    { id: 'citronnelle', name: 'Citronnelle', type: 'herbe', emoji: '🌿', water: 'semaine', notes: 'Repousse les moustiques' },

    // FLEURS
    { id: 'tournesol', name: 'Tournesol', type: 'fleur', emoji: '🌻', water: 'semaine', notes: 'Plein soleil, grand' },
    { id: 'rose', name: 'Rose', type: 'fleur', emoji: '🌹', water: 'semaine', notes: 'Tailler chaque année' },
    { id: 'capucine', name: 'Capucine', type: 'fleur', emoji: '🌸', water: 'semaine', notes: 'Comestible, repousse pucerons' },
    { id: 'souci', name: 'Souci', type: 'fleur', emoji: '🌼', water: 'semaine', notes: 'Protège le potager' },
    { id: 'lavande_fleur', name: 'Lavande', type: 'fleur', emoji: '💜', water: 'rarement', notes: 'Attire les abeilles' },
    { id: 'cosmos', name: 'Cosmos', type: 'fleur', emoji: '🌸', water: 'semaine', notes: 'Facile, floraison estivale' },
    { id: 'zinnia', name: 'Zinnia', type: 'fleur', emoji: '🌺', water: 'semaine', notes: 'Chaleur, plein soleil' },
    { id: 'dahlia', name: 'Dahlia', type: 'fleur', emoji: '🌸', water: 'semaine', notes: 'Tubeuse, rentrer en hiver' },
    { id: 'coquelicot', name: 'Coquelicot', type: 'fleur', emoji: '🌺', water: 'rarement', notes: 'Semis direct en automne' },
    { id: 'bleuet', name: 'Bleuet', type: 'fleur', emoji: '💙', water: 'rarement', notes: 'Semis direct, mellifère' },
    { id: 'bourrache', name: 'Bourrache', type: 'fleur', emoji: '🌸', water: 'semaine', notes: 'Fleurs comestibles, mellifère' },
    { id: 'pensee', name: 'Pensée', type: 'fleur', emoji: '💜', water: '2jours', notes: 'Floraison printanière' },

    // ARBRES / ARBUSTES
    { id: 'tomate_arbre', name: 'Tomate en arbre', type: 'arbre', emoji: '🌳', water: 'semaine', notes: 'Variété arbustive' },
    { id: 'pommier', name: 'Pommier', type: 'arbre', emoji: '🍎', water: 'semaine', notes: 'Taille annuelle' },
    { id: 'poirier', name: 'Poirier', type: 'arbre', emoji: '🍐', water: 'semaine', notes: 'Plantation en bonne exposition' },
    { id: 'cerisier', name: 'Cerisier', type: 'arbre', emoji: '🍒', water: 'semaine', notes: 'Grand arbre' },
    { id: 'prunier', name: 'Prunier', type: 'arbre', emoji: '🍑', water: 'semaine', notes: 'Sol profond' },
    { id: 'figuier', name: 'Figuier', type: 'arbre', emoji: '🫐', water: 'rarement', notes: "Résistant, peu d'entretien" },
    { id: 'olivier', name: 'Olivier', type: 'arbre', emoji: '🫒', water: 'rarement', notes: 'Sol drainant, chaleur' },
    { id: 'lilas', name: 'Lilas', type: 'arbre', emoji: '💜', water: 'semaine', notes: 'Floraison printanière parfumée' },
    { id: 'hortensia', name: 'Hortensia', type: 'arbre', emoji: '🌸', water: '2jours', notes: 'Mi-ombre, sol frais' }
];

// ============================================================
// APP.JS - Le Potager des Brauds
// ============================================================

// ===== STATE =====
let state = {
    zones: [],
    currentZoneId: null,
    selectedCell: null,
    editingPlantId: null,
    touchDragPlant: null,
    selectedPlantFromLibrary: null,
    draggedPlant: null
};

let currentUser = null;
let calendarDate = new Date();
let selectedColor = '#4CAF50';
let copiedPlant = null;

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
    document.body.classList.remove('app-ready');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appMain').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showApp(user) {
    document.body.classList.add('app-ready');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appMain').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('logoutBtn').style.display = 'flex';
    const avatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    if (avatar) { avatar.src = user.photoURL || ''; avatar.style.display = user.photoURL ? 'block' : 'none'; }
    if (userName) userName.textContent = user.displayName || user.email || '';
}

// ===== FIREBASE REF =====
function dbRef() {
    return firebase.database().ref('jardin');
}

// ===== ZONES =====
function loadZones() {
    dbRef().child('zones').on('value', snapshot => {
        const data = snapshot.val() || {};
        state.zones = Object.entries(data).map(([id, z]) => ({ ...z, id }));
        renderZonesList();
        updateStats();
        updateRemindersBadge();
        showSeasonalTip();
        if (state.currentZoneId) {
            const zone = getZone(state.currentZoneId);
            if (zone) {
                renderGrid(zone);
                renderLegend('all');
            }
        }
    });
}

function getZone(id) {
    return state.zones.find(z => z.id === id) || null;
}

function getCurrentZone() {
    return getZone(state.currentZoneId);
}

function renderZonesList() {
    const list = document.getElementById('zonesList');
    if (!list) return;
    list.innerHTML = '';
    state.zones.forEach(zone => {
        const item = document.createElement('li');
        item.className = 'zone-item' + (zone.id === state.currentZoneId ? ' active' : '');
        const plantCount = zone.plants ? Object.keys(zone.plants).length : 0;
        item.innerHTML = `
            <span class="zone-dot" style="background:${zone.color || '#2d6a4f'}"></span>
            <span>${zone.name}</span>
            ${plantCount > 0 ? `<span class="zone-plant-count">${plantCount}</span>` : ''}
        `;
        item.addEventListener('click', () => selectZone(zone.id));
        list.appendChild(item);
    });
}

function selectZone(id) {
    state.currentZoneId = id;
    const zone = getZone(id);
    if (!zone) return;

    document.getElementById('zoneHeader').style.display = 'flex';
    document.getElementById('welcomeMsg').style.display = 'none';

    document.getElementById('zoneName').textContent = zone.name;
    document.getElementById('zoneSize').textContent = `${zone.cols} × ${zone.rows}`;
    document.getElementById('zoneColorDot').style.background = zone.color || '#2d6a4f';

    const gridColsEl = document.getElementById('gridCols');
    const gridRowsEl = document.getElementById('gridRows');
    if (gridColsEl) gridColsEl.value = zone.cols || 5;
    if (gridRowsEl) gridRowsEl.value = zone.rows || 5;

    renderGrid(zone);
    renderLegend('all');
    renderZonesList();
    updateStats();
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
            renderZonesList();
            updateStats();
            showToast('Zone supprimée 🗑️', 'info');
        })
        .catch(err => showToast('Erreur: ' + err.message, 'error'));
}

// ===== ZONE MODAL =====
function openZoneModal(zone = null) {
    document.getElementById('zoneModalTitle').textContent = zone ? 'Modifier la zone' : 'Nouvelle zone';
    document.getElementById('zoneName_input').value = zone ? zone.name || '' : '';
    document.getElementById('zoneCols').value = zone ? zone.cols || 5 : 5;
    document.getElementById('zoneRows').value = zone ? zone.rows || 5 : 5;
    const saveZoneText = document.getElementById('saveZoneText');
    if (saveZoneText) saveZoneText.textContent = zone ? 'Modifier' : 'Créer';

    // Couleur
    selectedColor = zone ? (zone.color || '#4CAF50') : '#4CAF50';
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.color === selectedColor);
    });

    state.editingZoneId = zone ? zone.id : null;
    openModal('zoneModal');
}

function saveZoneModal() {
    const name = document.getElementById('zoneName_input').value.trim();
    if (!name) { showToast('Le nom est obligatoire', 'error'); return; }

    const cols = parseInt(document.getElementById('zoneCols').value) || 5;
    const rows = parseInt(document.getElementById('zoneRows').value) || 5;

    if (state.editingZoneId) {
        dbRef().child(`zones/${state.editingZoneId}`).update({ name, cols, rows, color: selectedColor })
            .then(() => {
                closeModal('zoneModal');
                showToast('Zone modifiée ✅', 'success');
            })
            .catch(err => showToast('Erreur: ' + err.message, 'error'));
    } else {
        const newZone = { name, cols, rows, color: selectedColor, plants: {} };
        dbRef().child('zones').push(newZone)
            .then(ref => {
                closeModal('zoneModal');
                selectZone(ref.key);
                showToast('Zone créée 🌿', 'success');
            })
            .catch(err => showToast('Erreur: ' + err.message, 'error'));
    }
}

// ===== GRID =====
function renderGrid(zone) {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    const cols = zone.cols || 5;
    const rows = zone.rows || 5;

    const grid = document.createElement('div');
    grid.className = 'garden-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r}_${c}`;
            const plant = zone.plants && zone.plants[key];

            const cell = document.createElement('div');
            cell.className = 'grid-cell' + (plant ? ' has-plant' : '');
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (plant && plant.name) {
                cell.dataset.type = plant.type || 'autre';
                const wMap = { quotidien: 'water-daily', '2jours': 'water-2days', semaine: 'water-weekly', rarement: 'water-rare' };
                cell.classList.add(wMap[plant.water] || 'water-weekly');
                cell.innerHTML = plant.photo
                    ? `<img src="${plant.photo}" class="cell-photo" alt="${plant.name}"><div class="cell-name">${plant.name}</div><div class="cell-water-dot"></div>`
                    : `<div class="cell-emoji">${getPlantEmoji(plant)}</div><div class="cell-name">${plant.name}</div><div class="cell-water-dot"></div>`;
                if (window.innerWidth > 768) {
                    cell.addEventListener('mouseenter', (e) => showPlantTooltip(e, plant));
                    cell.addEventListener('mouseleave', hidePlantTooltip);
                    cell.addEventListener('mousemove', positionTooltip);
                }
            } else {
                cell.style.borderColor = zone.color || '#2d6a4f';
                cell.innerHTML = '<div class="cell-add-icon"><i class="fas fa-plus"></i></div>';
            }

            // Appui long (mobile) → menu contextuel
            let pressTimer = null;
            let longPressOccurred = false;

            cell.addEventListener('touchstart', (e) => {
                longPressOccurred = false;
                pressTimer = setTimeout(() => {
                    const touch = e.touches[0];
                    longPressOccurred = true;
                    handleCellRightClick({
                        preventDefault: () => {},
                        clientX: touch.clientX,
                        clientY: touch.clientY - 10
                    }, r, c);
                }, 550);
            }, { passive: true });

            cell.addEventListener('touchend', () => clearTimeout(pressTimer));
            cell.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
                longPressOccurred = false;
            });

            // Clic gauche
            cell.addEventListener('click', () => {
                if (longPressOccurred) { longPressOccurred = false; return; }
                if (state.selectedPlantFromLibrary) {
                    dropLibraryPlant(r, c);
                } else if (state.touchDragPlant) {
                    dropTouchPlant(r, c);
                } else {
                    openPlantModal(r, c);
                }
            });

            // Clic droit
            cell.addEventListener('contextmenu', (e) => handleCellRightClick(e, r, c));

            // Drag & drop desktop
            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('plant');
                if (!data) return;
                const plant = JSON.parse(data);
                savePlantToCell(r, c, plant);
            });

            // Touch drop
            cell.addEventListener('touchend', () => {
                if (state.touchDragPlant) {
                    dropTouchPlant(r, c);
                }
            });

            grid.appendChild(cell);
        }
    }

    container.appendChild(grid);
}

function dropLibraryPlant(r, c) {
    const p = state.selectedPlantFromLibrary;
    savePlantToCell(r, c, {
        name: p.name, emoji: p.emoji, type: p.type,
        variety: '', water: 'semaine', notes: '', photo: '', date: ''
    });
    state.selectedPlantFromLibrary = null;
}

function dropTouchPlant(r, c) {
    savePlantToCell(r, c, state.touchDragPlant);
    state.touchDragPlant = null;
}

function savePlantToCell(r, c, plantData) {
    const key = `${r}_${c}`;
    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).set(plantData)
        .then(() => showToast(`${plantData.emoji || '🌱'} ${plantData.name} planté !`, 'success'))
        .catch(err => showToast('Erreur: ' + err.message, 'error'));
}

function applyGrid() {
    const cols = parseInt(document.getElementById('gridCols').value) || 5;
    const rows = parseInt(document.getElementById('gridRows').value) || 5;
    if (!state.currentZoneId) return;
    dbRef().child(`zones/${state.currentZoneId}`).update({ cols, rows })
        .then(() => showToast('Grille redimensionnée ✅', 'success'))
        .catch(err => showToast('Erreur: ' + err.message, 'error'));
}

// ===== LEGEND =====
const CATEGORY_LABELS = {
    legume: '\ud83e\udd55 L\u00e9gumes',
    fruit:  '\ud83c\udf53 Fruits',
    herbe:  '\ud83c\udf3f Herbes aromatiques',
    fleur:  '\ud83c\udf38 Fleurs',
    arbre:  '\ud83c\udf33 Arbres & Arbustes',
};

function renderLegend(filter) {
    if (!filter || typeof filter === 'object') filter = 'all';

    const items = document.getElementById('legendItems');
    if (!items) { console.warn('legendItems introuvable'); return; }

    const lib = typeof PLANT_LIBRARY !== "undefined" ? PLANT_LIBRARY : null;
    if (!lib || !lib.length) {
        items.innerHTML = '<p style="color:red;text-align:center;">PLANT_LIBRARY manquant !</p>';
        console.error('PLANT_LIBRARY undefined ou vide', typeof lib);
        return;
    }

    items.innerHTML = '';
    items.style.cssText = '';

    const cats = filter === 'all'
        ? ['legume', 'fruit', 'herbe', 'fleur', 'arbre']
        : [filter];

    cats.forEach(function(cat) {
        var list = lib.filter(function(p) { return p.type === cat; });
        if (!list.length) return;

        var title = document.createElement('div');
        title.style.cssText = 'font-size:12px;font-weight:800;color:#2d6a4f;text-transform:uppercase;letter-spacing:.05em;margin:14px 0 6px;padding-bottom:4px;border-bottom:2px solid #e8f5e9;';
        title.textContent = CATEGORY_LABELS[cat] || cat;
        items.appendChild(title);

        var grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px;';

        list.forEach(function(plant) {
            var item = document.createElement('div');
            item.style.cssText = 'display:flex;flex-direction:column;align-items:center;border:2px solid #eee;border-radius:10px;padding:8px 6px;cursor:pointer;background:white;transition:all .2s;';
            item.innerHTML = '<span style="font-size:26px">' + plant.emoji + '</span>'
                + '<span style="font-size:11px;margin-top:4px;text-align:center;font-weight:700;line-height:1.2">' + plant.name + '</span>';

            item.onmouseenter = function() { item.style.border='2px solid #2d6a4f'; item.style.background='#f0faf4'; };
            item.onmouseleave = function() { item.style.border='2px solid #eee';    item.style.background='white'; };
            item.onclick = function() {
                state.selectedPlantFromLibrary = Object.assign({}, plant);
                showToast(plant.emoji + ' ' + plant.name + ' s\u00e9lectionn\u00e9 \u2014 cliquez sur une case', 'info');
                toggleLegend();
            };
            grid.appendChild(item);
        });
        items.appendChild(grid);
    });
}

function filterLibrary(type, btn) {
    document.querySelectorAll('#legendPanel .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    renderLegend(type);
}

function filterPalette(type, btn) {
    document.querySelectorAll('.filter-btns .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderPalette(type);
}

function toggleLegend() {
    const panel = document.getElementById('legendPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        renderLegend('all');
        updateMobileNav('library');
    } else {
        panel.style.display = 'none';
        updateMobileNav('zones');
    }
}

// ===== MOBILE NAV =====
function updateMobileNav(tab) {
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
    const el = document.getElementById('nav-' + tab);
    if (el) el.classList.add('active');
}

function mobileNavTo(tab) {
    const panel = document.getElementById('legendPanel');

    if (tab === 'library') {
        toggleLegend();
        return;
    }

    updateMobileNav(tab);

    if (panel && panel.style.display !== 'none') {
        panel.style.display = 'none';
    }

    if (tab === 'calendar') {
        renderCalendar();
        openModal('calendarModal');
    } else if (tab === 'reminders') {
        renderReminders();
        openModal('remindersModal');
    }
}

function updateRemindersBadge() {
    const badge = document.getElementById('remindersBadge');
    if (!badge) return;
    const today = new Date();
    let count = 0;
    state.zones.forEach(z => {
        if (!z.plants) return;
        Object.values(z.plants).forEach(p => {
            if (p && p.reminder && p.reminder.date) {
                const d = new Date(p.reminder.date);
                if (d <= today) count++;
            }
        });
    });
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
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

    document.getElementById('reminderEnabled').checked = plant ? !!plant.reminder : false;
    document.getElementById('reminderDetail').style.display = (plant && plant.reminder) ? 'flex' : 'none';
    document.getElementById('reminderDate').value = plant && plant.reminder ? plant.reminder.date || '' : '';
    document.getElementById('reminderText').value = plant && plant.reminder ? plant.reminder.text || '' : '';

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
    if (!state.editingPlantId) return;
    if (!confirm('Supprimer cette plante ?')) return;

    dbRef().child(`zones/${state.currentZoneId}/plants/${state.editingPlantId}`).remove()
        .then(() => {
            closeModal('plantModal');
            showToast('Plante supprimée 🗑️', 'success');
        });
}

function deletePlantFromMenu(r, c) {
    closeContextMenu();
    const key = `${r}_${c}`;
    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).remove()
        .then(() => showToast('Plante supprimée 🗑️', 'success'));
}

function editPlantFromMenu(r, c) {
    closeContextMenu();
    openPlantModal(r, c);
}

// ===== SAVE DATA (local zones sync) =====
function saveData() {
    const zone = getCurrentZone();
    if (!zone) return;
    dbRef().child(`zones/${state.currentZoneId}`).set(zone)
        .catch(err => showToast('Erreur sauvegarde: ' + err.message, 'error'));
}

// ===== STATS =====
function updateStats() {
    let total = 0;
    state.zones.forEach(z => {
        if (z.plants) total += Object.keys(z.plants).length;
    });
    const el1 = document.getElementById('totalPlants');
    const el2 = document.getElementById('totalZones');
    if (el1) el1.textContent = total;
    if (el2) el2.textContent = state.zones.length;
}

// ===== PALETTE / LIBRARY =====
function renderPalette(filter = 'all') {
    const palette = document.getElementById('plantPalette');
    if (!palette) return;
    palette.innerHTML = '';

    const list = filter === 'all' ? PLANT_LIBRARY : PLANT_LIBRARY.filter(p => p.type === filter);

    list.forEach(plant => {
        const btn = document.createElement('div');
        btn.className = 'palette-btn';
        btn.innerHTML = `
            <span class="palette-emoji">${plant.emoji}</span>
            <span class="palette-name">${plant.name}</span>
        `;

        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('plant', JSON.stringify({
                name: plant.name, emoji: plant.emoji, type: plant.type,
                variety: '', water: 'semaine', notes: '', photo: '', date: ''
            }));
            btn.style.opacity = '0.5';
        });
        btn.addEventListener('dragend', () => { btn.style.opacity = '1'; });

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            state.touchDragPlant = {
                name: plant.name, emoji: plant.emoji, type: plant.type,
                variety: '', water: 'semaine', notes: '', photo: '', date: ''
            };
            btn.style.opacity = '0.5';
            showToast(`${plant.emoji} ${plant.name} sélectionné — touchez une case`, 'info');
        }, { passive: false });
        btn.addEventListener('touchend', () => { btn.style.opacity = '1'; });

        btn.addEventListener('click', () => {
            state.selectedPlantFromLibrary = { ...plant };
            showToast(`${plant.emoji} ${plant.name} sélectionné — cliquez sur une cellule`, 'info');
        });

        palette.appendChild(btn);
    });
}

// ===== HELPERS =====
function getPlantEmoji(plant) {
    if (plant.emoji) return plant.emoji;
    const found = PLANT_LIBRARY.find(p => p.name.toLowerCase() === plant.name.toLowerCase());
    if (found) return found.emoji;
    return getTypeEmoji(plant.type);
}

function getTypeEmoji(type) {
    const map = {
        legume: '🥦', fruit: '🍓', herbe: '🌿', fleur: '🌸', arbre: '🌳'
    };
    return map[type] || '🌱';
}

function getWaterLabel(water) {
    const map = { quotidien: '💧 Quotidien', '2jours': '💧 Tous les 2 jours', semaine: '💧 1x / semaine', rarement: '💧 Rarement' };
    return map[water] || '💧 Arrosage non précisé';
}

function showPlantTooltip(e, plant) {
    const tip = document.getElementById('plantTooltip');
    if (!tip) return;
    document.getElementById('tip-emoji').textContent = plant.emoji || getTypeEmoji(plant.type);
    document.getElementById('tip-name').textContent = plant.name + (plant.variety ? ` — ${plant.variety}` : '');
    document.getElementById('tip-water').textContent = getWaterLabel(plant.water);
    const dateEl = document.getElementById('tip-date');
    dateEl.textContent = plant.date ? `📅 Planté le ${plant.date}` : '';
    dateEl.style.display = plant.date ? '' : 'none';
    const notesEl = document.getElementById('tip-notes');
    notesEl.textContent = plant.notes || '';
    notesEl.style.display = plant.notes ? '' : 'none';
    tip.style.opacity = '1';
    tip.style.pointerEvents = 'none';
    positionTooltip(e);
}

function hidePlantTooltip() {
    const tip = document.getElementById('plantTooltip');
    if (tip) tip.style.opacity = '0';
}

function positionTooltip(e) {
    const tip = document.getElementById('plantTooltip');
    if (!tip || tip.style.opacity === '0') return;
    const offset = 14;
    let x = e.clientX + offset;
    let y = e.clientY + offset;
    if (x + 240 > window.innerWidth) x = e.clientX - 240 - offset;
    if (y + 160 > window.innerHeight) y = e.clientY - 160 - offset;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
}

const SEASONAL_TIPS = [
    { months: [3, 4, 5], tip: '🌱 Printemps — Idéal pour semer tomates, courgettes et salades en pleine terre !' },
    { months: [6, 7, 8], tip: '☀️ Été — Arrosez tôt le matin ou le soir, jamais en plein soleil.' },
    { months: [9, 10, 11], tip: '🍂 Automne — Plantez ail, oignons et épinards pour l\'hiver.' },
    { months: [12, 1, 2], tip: '❄️ Hiver — Préparez vos plans de semis pour le printemps prochain !' },
];

function showSeasonalTip() {
    const el = document.getElementById('seasonalTip');
    if (!el) return;
    const month = new Date().getMonth() + 1;
    const entry = SEASONAL_TIPS.find(t => t.months.includes(month));
    if (entry) {
        el.textContent = entry.tip;
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

function searchPlantLibrary(query) {
    const q = query.trim().toLowerCase();
    const palette = document.getElementById('plantPalette');
    if (!palette) return;
    if (!q) { renderPalette('all'); return; }
    const matches = PLANT_LIBRARY.filter(p => p.name.toLowerCase().includes(q) || (p.notes && p.notes.toLowerCase().includes(q)));
    palette.innerHTML = '';
    matches.forEach(plant => {
        const btn = document.createElement('div');
        btn.className = 'palette-btn';
        btn.innerHTML = `<span style="font-size:28px;">${plant.emoji}</span><span style="font-size:11px; margin-top:4px; text-align:center; line-height:1;">${plant.name}</span>`;
        btn.addEventListener('click', () => {
            state.selectedPlantFromLibrary = { ...plant };
            showToast(`${plant.emoji} ${plant.name} sélectionné — cliquez sur une cellule`, 'info');
        });
        palette.appendChild(btn);
    });
}

// ===== CONTEXT MENU / TAMPON =====
function handleCellRightClick(e, row, col) {
    e.preventDefault();
    const zone = getCurrentZone();
    if (!zone) return;

    const key = `${row}_${col}`;
    const plant = zone.plants && zone.plants[key];
    if (!plant || !plant.name) return;

    closeContextMenu();

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
        <div class="ctx-item" onclick="editPlantFromMenu(${row}, ${col})">✏️ Modifier</div>
        <div class="ctx-item" onclick="stampLine(${row}, ${col})">➡️ Copier sur toute la ligne</div>
        <div class="ctx-item" onclick="stampColumn(${row}, ${col})">⬇️ Copier sur toute la colonne</div>
        <div class="ctx-item" onclick="stampRectPrompt(${row}, ${col})">▦ Copier sur une zone rectangle</div>
        <div style="border-top:1px solid #eee; margin-top:4px;">
            <div class="ctx-item" style="color:#e63946;" onclick="deletePlantFromMenu(${row}, ${col})">🗑️ Supprimer cette plante</div>
        </div>
    `;

    document.body.appendChild(menu);

    // Empêcher le menu de sortir de l'écran
    const rect = menu.getBoundingClientRect();
    const navH = window.innerWidth <= 480 ? 68 : 0;
    if (rect.right > window.innerWidth - 8) {
        menu.style.left = Math.max(8, e.clientX - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight - navH - 8) {
        menu.style.top = Math.max(80, e.clientY - rect.height) + 'px';
    }

    copiedPlant = { ...plant };
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
        setTimeout(() => { cell.style.background = ''; }, 600);
    }
}

function clearCell(row, col) {
    const zone = getCurrentZone();
    if (!zone) return;
    const key = `${row}_${col}`;
    dbRef().child(`zones/${state.currentZoneId}/plants/${key}`).remove()
        .then(() => showToast('Plante supprimée 🗑️', 'success'));
}

function stampLine(row, col) {
    closeContextMenu();
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const cols = zone.cols || 5;
    const updates = {};
    let count = 0;

    for (let c = 0; c < cols; c++) {
        if (c !== col) {
            updates[`zones/${state.currentZoneId}/plants/${row}_${c}`] = { ...copiedPlant };
            flashCell(row, c);
            count++;
        }
    }

    dbRef().update(updates)
        .then(() => showToast(`✅ ${count} cellules remplies sur la ligne !`, 'success'));
}

function stampColumn(row, col) {
    closeContextMenu();
    const zone = getCurrentZone();
    if (!zone || !copiedPlant) return;

    const rows = zone.rows || 5;
    const updates = {};
    let count = 0;

    for (let r = 0; r < rows; r++) {
        if (r !== row) {
            updates[`zones/${state.currentZoneId}/plants/${r}_${col}`] = { ...copiedPlant };
            flashCell(r, col);
            count++;
        }
    }

    dbRef().update(updates)
        .then(() => showToast(`✅ ${count} cellules remplies sur la colonne !`, 'success'));
}

function stampRectPrompt(row, col) {
    closeContextMenu();

    const modal = document.createElement('div');
    modal.id = 'rect-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        z-index: 9999; display: flex; align-items: center; justify-content: center;
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

    const updates = {};
    let count = 0;

    for (let r = startRow; r < startRow + nbRows && r < zone.rows; r++) {
        for (let c = startCol; c < startCol + nbCols && c < zone.cols; c++) {
            if (r === startRow && c === startCol) continue;
            updates[`zones/${state.currentZoneId}/plants/${r}_${c}`] = { ...copiedPlant };
            flashCell(r, c);
            count++;
        }
    }

    dbRef().update(updates)
        .then(() => showToast(`✅ ${count} cellules remplies dans la zone !`, 'success'));
}

// ===== EXPORT PDF =====
function exportPDF() {
    const zone = getCurrentZone();
    if (!zone) return;

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.fontFamily = 'Arial, sans-serif';
    content.innerHTML = `
        <h1 style="color:${zone.color || '#2d6a4f'}; text-align:center; margin-bottom:5px;">
            🌿 ${zone.name}
        </h1>
        <p style="text-align:center; color:#666; margin-bottom:20px;">
            Grille ${zone.cols} × ${zone.rows} — Imprimé le ${new Date().toLocaleDateString('fr-FR')}
        </p>
    `;

    const gridDiv = document.createElement('div');
    gridDiv.style.display = 'grid';
    gridDiv.style.gridTemplateColumns = `repeat(${zone.cols}, 1fr)`;
    gridDiv.style.gap = '4px';
    gridDiv.style.marginBottom = '30px';

    for (let r = 0; r < zone.rows; r++) {
        for (let c = 0; c < zone.cols; c++) {
            const key = `${r}_${c}`;
            const plant = zone.plants && zone.plants[key];
            const cell = document.createElement('div');
            cell.style.cssText = `
                border: 2px solid ${plant ? (zone.color || '#2d6a4f') : '#ccc'};
                border-radius: 6px; padding: 4px 2px; text-align: center;
                min-height: 50px; font-size: 11px;
                background: ${plant ? '#f0faf4' : '#fafafa'};
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
            `;
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

    const options = {
        margin: 10,
        filename: `jardin_${zone.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: zone.cols > 10 ? 'landscape' : 'portrait' }
    };

    showToast('Génération du PDF...', 'info');
    html2pdf().set(options).from(content).save()
        .then(() => showToast('PDF exporté ! 📄', 'success'));
}

// ===== CALENDAR =====
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById('calendarTitle').textContent =
        calendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay + 6) % 7;

    ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'cal-day-header';
        h.textContent = d;
        grid.appendChild(h);
    });

    for (let i = 0; i < offset; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.textContent = d;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        // Vérifier rappels
        let hasReminder = false;
        state.zones.forEach(z => {
            if (!z.plants) return;
            Object.values(z.plants).forEach(p => {
                if (p && p.reminder && p.reminder.date === dateStr) hasReminder = true;
                if (p && p.date === dateStr) hasReminder = true;
            });
        });
        if (hasReminder) dayEl.classList.add('has-event');

        grid.appendChild(dayEl);
    }
}

// ===== REMINDERS =====
function renderReminders() {
    const list = document.getElementById('remindersList');
    list.innerHTML = '';

    const today = new Date();
    const reminders = [];

    state.zones.forEach(z => {
        if (!z.plants) return;
        Object.values(z.plants).forEach(p => {
            if (p && p.reminder && p.reminder.date) {
                reminders.push({
                    zone: z.name,
                    plant: p.name,
                    emoji: getPlantEmoji(p),
                    date: p.reminder.date,
                    text: p.reminder.text || ''
                });
            }
        });
    });

    reminders.sort((a, b) => a.date.localeCompare(b.date));

    if (reminders.length === 0) {
        list.innerHTML = '<li class="empty-msg">Aucun rappel pour le moment</li>';
        return;
    }

    reminders.forEach(r => {
        const d = new Date(r.date);
        const isPast = d < today;
        const item = document.createElement('li');
        item.className = 'reminder-card' + (isPast ? ' overdue' : '');
        item.innerHTML = `
            <div class="reminder-info">
                <h5>${r.emoji} ${r.plant} <small style="font-weight:400;color:var(--text-light)">— ${r.zone}</small></h5>
                <p>${d.toLocaleDateString('fr-FR')}${r.text ? ' — ' + r.text : ''}${isPast ? ' ⚠️' : ''}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

// ===== PHOTO UPLOAD =====
function initPhotoUpload() {
    const input = document.getElementById('photoInput');
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('photoPlaceholder');

    if (!input) return;

    placeholder.addEventListener('click', () => input.click());
    preview.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            preview.src = ev.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

// ===== MODALS =====
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
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 280);
    }, 3000);
}

// ===== BIND EVENTS =====
function bindEvents() {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => showToast('Erreur connexion: ' + err.message, 'error'));
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        firebase.auth().signOut();
    });

    document.getElementById('calendarBtn').addEventListener('click', () => {
        renderCalendar();
        openModal('calendarModal');
    });

    document.getElementById('reminderBtn').addEventListener('click', () => {
        renderReminders();
        openModal('remindersModal');
    });

    document.getElementById('addZoneBtn').addEventListener('click', () => openZoneModal());
    document.getElementById('editZoneBtn').addEventListener('click', () => {
        const zone = getZone(state.currentZoneId);
        if (zone) openZoneModal(zone);
    });
    document.getElementById('deleteZoneBtn').addEventListener('click', () => deleteZone());
    document.getElementById('applyGridBtn').addEventListener('click', applyGrid);

    document.getElementById('savePlant').addEventListener('click', savePlant);
    document.getElementById('deletePlantBtn').addEventListener('click', deletePlant);
    document.getElementById('cancelModal').addEventListener('click', () => closeModal('plantModal'));
    document.getElementById('closeModal').addEventListener('click', () => closeModal('plantModal'));

    document.getElementById('reminderEnabled').addEventListener('change', e => {
        document.getElementById('reminderDetail').style.display = e.target.checked ? 'flex' : 'none';
    });

    document.getElementById('saveZone').addEventListener('click', saveZoneModal);
    document.getElementById('cancelZoneModal').addEventListener('click', () => closeModal('zoneModal'));
    document.getElementById('closeZoneModal').addEventListener('click', () => closeModal('zoneModal'));

    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor = opt.dataset.color;
        });
    });

    document.getElementById('closeCalendarModal').addEventListener('click', () => closeModal('calendarModal'));
    document.getElementById('prevMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('closeRemindersModal').addEventListener('click', () => closeModal('remindersModal'));

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    initPhotoUpload();
    renderPalette('all');

    const librarySearch = document.getElementById('librarySearchInput');
    if (librarySearch) {
        librarySearch.addEventListener('input', (e) => searchPlantLibrary(e.target.value));
    }
}
