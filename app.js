'use strict';

/* ============================================================
   STATE
   ============================================================ */
let currentUser = null;
let isLocalMode = false;
let currentView = 'dashboard';
let zones = {};
let activeZoneId = null;
let tasks = [];
let journalEntries = [];
let reminders = [];
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let activeCatalogFilter = 'all';
let activeJournalFilter = 'all';
let activeCalFilter = 'all';
let pickerTarget = null;
let editingBedId = null;
let editingReminderId = null;
let confirmCb = null;
let zonesRef = null;
let draftTimer = null;

const BED_COLORS = ['#4a7c59','#5b9166','#b07b4f','#d4a96a','#4a8fc8','#c25450','#8b5e3c','#a8d5a2'];

/* ============================================================
   LOCALSTORAGE
   ============================================================ */
const lsGet = (k, def = null) => {
  try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch { return def; }
};
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function loadLocalData() {
  tasks = lsGet('potager_tasks', []);
  journalEntries = lsGet('potager_journal', []);
  reminders = lsGet('potager_reminders', []);
}
function saveTasks() { lsSet('potager_tasks', tasks); }
function saveJournal() { lsSet('potager_journal', journalEntries); }
function saveReminders() { lsSet('potager_reminders', reminders); }

/* ============================================================
   FIREBASE HELPERS
   ============================================================ */
function isFirebaseConfigured() {
  try { return typeof firebase !== 'undefined' && firebase.apps.length > 0 && !!firebase.app().options.apiKey; }
  catch { return false; }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  wireNav();
  wireCatalogFilters();
  wireCalFilters();
  wireJournalFilters();
  wireQaTypes();
  wireModalBackdrops();

  document.getElementById('googleSignIn').addEventListener('click', handleGoogleSignIn);
  document.getElementById('localModeBtn').addEventListener('click', handleLocalMode);
  document.getElementById('topbarAccount').addEventListener('click', openAccountModal);
  document.getElementById('accountChipDesktop').addEventListener('click', openAccountModal);
  document.getElementById('calPrev').addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  document.getElementById('calNext').addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
  document.getElementById('calToday').addEventListener('click', () => { const n = new Date(); calYear = n.getFullYear(); calMonth = n.getMonth(); renderCalendar(); });
  document.getElementById('renameBedBtn').addEventListener('click', () => activeZoneId && openBedModal(activeZoneId));
  document.getElementById('confirmYes').addEventListener('click', () => { closeModal('confirmBackdrop'); if (typeof confirmCb === 'function') { confirmCb(); } confirmCb = null; });

  // Auto-save quickadd draft
  ['qaTaskTitle', 'qaNoteText'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', autosaveDraft);
  });

  if (!isFirebaseConfigured()) {
    document.getElementById('localModeNotice').style.display = 'flex';
    if (lsGet('potager_localMode')) { activateLocalMode(); }
    return;
  }

  auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
      activateApp(user);
    } else if (lsGet('potager_localMode')) {
      activateLocalMode();
    } else {
      showAuthScreen();
    }
  });
});

/* ============================================================
   AUTH
   ============================================================ */
function showAuthScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('fab').style.display = 'none';
}

function showApp() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'grid';
  document.getElementById('bottomNav').style.display = 'flex';
  document.getElementById('fab').style.display = 'flex';
}

function activateApp(user) {
  isLocalMode = false;
  lsSet('potager_localMode', false);
  loadLocalData();
  initZonesListener();
  updateAvatars(user);
  showApp();
  setView('dashboard');
}

function activateLocalMode() {
  isLocalMode = true;
  lsSet('potager_localMode', true);
  loadLocalData();
  zones = lsGet('potager_zones_local', {});
  updateAvatars(null);
  showApp();
  setView('dashboard');
  renderGarden();
}

async function handleGoogleSignIn() {
  const errEl = document.getElementById('authError');
  errEl.textContent = '';
  errEl.classList.remove('show');
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (e) {
    errEl.textContent = translateAuthError(e.code);
    errEl.classList.add('show');
  }
}

function handleLocalMode() {
  activateLocalMode();
}

async function signOut() {
  if (!isLocalMode && isFirebaseConfigured()) {
    if (zonesRef) { zonesRef.off(); zonesRef = null; }
    await auth.signOut();
  }
  currentUser = null;
  zones = {};
  lsSet('potager_localMode', false);
  isLocalMode = false;
  closeModal('accountBackdrop');
  showAuthScreen();
}

function updateAvatars(user) {
  const name = user ? (user.displayName || user.email || 'Jardinier') : (isLocalMode ? 'Local' : '?');
  const initial = name.charAt(0).toUpperCase();
  document.getElementById('avaDesktop').textContent = initial;
  document.getElementById('avaMobile').textContent = initial;
  document.getElementById('accNameDesktop').textContent = user ? (user.displayName || user.email) : 'Mode local';
  document.getElementById('accStateDesktop').textContent = isLocalMode ? 'Données locales' : (user?.email || 'Connecté');
}

function translateAuthError(code) {
  const map = {
    'auth/popup-closed-by-user': 'Connexion annulée.',
    'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.',
    'auth/user-not-found': 'Aucun compte avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    'auth/cancelled-popup-request': 'Une seule fenêtre à la fois.',
  };
  return map[code] || 'Erreur de connexion. Réessayez.';
}

/* ============================================================
   FIREBASE ZONES
   ============================================================ */
function initZonesListener() {
  if (!isFirebaseConfigured() || isLocalMode) return;
  zonesRef = db.ref('jardin/zones');
  zonesRef.on('value', snap => {
    zones = snap.val() || {};
    if (currentView === 'garden') renderGarden();
    if (currentView === 'dashboard') renderDashboard();
  });
}

function savePlantToCell(zoneId, cellKey, plant) {
  if (isLocalMode) {
    if (!zones[zoneId]) return;
    if (!zones[zoneId].plants) zones[zoneId].plants = {};
    if (plant) zones[zoneId].plants[cellKey] = plant;
    else delete zones[zoneId].plants[cellKey];
    lsSet('potager_zones_local', zones);
    renderBedStage(zones[zoneId]);
    if (currentView === 'dashboard') renderDashboard();
  } else {
    const ref = db.ref(`jardin/zones/${zoneId}/plants/${cellKey}`);
    if (plant) ref.set(plant);
    else ref.remove();
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function wireNav() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.nav));
  });
}

function setView(viewId) {
  currentView = viewId;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.dataset.view === viewId));
  document.querySelectorAll('.nav-item[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === viewId));
  document.querySelectorAll('.tab[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === viewId));

  if (viewId === 'dashboard') renderDashboard();
  else if (viewId === 'garden') renderGarden();
  else if (viewId === 'catalog') renderCatalog();
  else if (viewId === 'calendar') renderCalendar();
  else if (viewId === 'journal') renderJournal();
  else if (viewId === 'reminders') renderReminders();
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  if (currentView !== 'dashboard') return;
  const now = new Date();

  document.getElementById('todayDate').textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const hour = now.getHours();
  const part = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const uname = currentUser?.displayName?.split(' ')[0] || 'jardinier·ère';
  document.getElementById('greeting').textContent = `${part}, ${uname}`;
  document.getElementById('greetSub').textContent = isLocalMode ? 'Mode local — données sur cet appareil.' : 'Voici le résumé de votre potager.';

  const allPlants = Object.values(zones).flatMap(z => Object.values(z.plants || {}));
  const needWater = allPlants.filter(p => p.water === '2jours');
  const todayIso = toISODate(now);
  const todayTasks = tasks.filter(t => t.date === todayIso);
  const todayDone = todayTasks.filter(t => t.done).length;

  document.getElementById('statPlants').textContent = allPlants.length;
  document.getElementById('statWater').textContent = needWater.length;
  document.getElementById('statTasks').textContent = todayTasks.length - todayDone;
  document.getElementById('statBeds').textContent = Object.keys(zones).length;

  document.getElementById('tasksMeta').textContent = `${todayDone}/${todayTasks.length}`;
  const tl = document.getElementById('tasksList');
  if (todayTasks.length === 0) {
    tl.innerHTML = `<div class="empty-inline"><span>✅</span> Aucune tâche pour aujourd'hui</div>`;
  } else {
    tl.innerHTML = todayTasks.map(t => `
      <div class="task-row" onclick="toggleTask('${t.id}')">
        <span class="task-check ${t.done ? 'done' : ''}"></span>
        <span class="task-kind-ic">${kindIcon(t.kind)}</span>
        <span class="task-label ${t.done ? 'strikethrough' : ''}">${esc(t.title)}</span>
      </div>`).join('');
  }

  renderAlerts();
  renderWeekGlance();
}

function renderAlerts() {
  const el = document.getElementById('alertsList');
  const alerts = [];
  const allPlants = Object.values(zones).flatMap(z => Object.values(z.plants || {}));
  const daily = allPlants.filter(p => p.water === '2jours');
  if (daily.length > 0) alerts.push({ type: 'warn', icon: '💧', text: `${daily.length} plante(s) à arrosage fréquent`, action: 'garden' });
  const todayPending = tasks.filter(t => t.date === toISODate(new Date()) && !t.done);
  if (todayPending.length >= 3) alerts.push({ type: 'urgent', icon: '⚠️', text: `${todayPending.length} tâches en attente aujourd'hui`, action: 'calendar' });
  el.innerHTML = alerts.map(a => `
    <div class="alert-banner ${a.type}">
      <span>${a.icon}</span>
      <span>${esc(a.text)}</span>
      <button class="btn ghost sm" onclick="setView('${a.action}')">Voir →</button>
    </div>`).join('');
}

function renderWeekGlance() {
  const el = document.getElementById('weekGlance');
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() + i);
    return { date: d, tasks: tasks.filter(t => t.date === toISODate(d)) };
  });
  el.innerHTML = days.map((d, i) => `
    <div class="week-day ${i === 0 ? 'today' : ''}" onclick="setView('calendar')">
      <div class="wd-label">${d.date.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
      <div class="wd-num">${d.date.getDate()}</div>
      <div class="wd-dots">${d.tasks.slice(0, 3).map(t => `<span class="d-dot" style="background:${taskColor(t.kind)}"></span>`).join('')}</div>
    </div>`).join('');
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTasks();
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'calendar') renderCalendar();
}

function kindIcon(k) {
  return { water: '💧', sow: '🌱', harvest: '🥕', treat: '🛡️', other: '📌' }[k] || '📌';
}
function taskColor(k) {
  return { water: '#4a8fc8', sow: '#5b9166', harvest: '#b07b4f', treat: '#c25450', other: '#98a39b' }[k] || '#98a39b';
}

/* ============================================================
   GARDEN
   ============================================================ */
function renderGarden() {
  if (currentView !== 'garden') return;
  const ids = Object.keys(zones);
  const toolbar = document.getElementById('bedsToolbar');
  const empty = document.getElementById('gardenEmpty');
  const stage = document.getElementById('bedStage');

  if (ids.length === 0) {
    toolbar.innerHTML = '';
    stage.style.display = 'none';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  stage.style.display = 'block';

  toolbar.innerHTML = ids.map(id => {
    const z = zones[id];
    const color = z.color || BED_COLORS[0];
    return `<button class="bed-chip ${id === activeZoneId ? 'active' : ''}" onclick="selectZone('${id}')">
      <span class="bchip-dot" style="background:${color}"></span>${esc(z.name)}
    </button>`;
  }).join('');

  if (!activeZoneId || !zones[activeZoneId]) {
    activeZoneId = ids[0];
  }
  renderBedStage(zones[activeZoneId]);
}

function selectZone(id) {
  activeZoneId = id;
  document.querySelectorAll('.bed-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('onclick') === `selectZone('${id}')`);
  });
  renderBedStage(zones[id]);
}

function renderBedStage(zone) {
  if (!zone) return;
  document.getElementById('bedName').textContent = zone.name || 'Parcelle';
  const plantCount = Object.keys(zone.plants || {}).length;
  const total = (zone.cols || 4) * (zone.rows || 3);
  document.getElementById('bedSub').textContent = `${zone.cols || 4} × ${zone.rows || 3} cases · ${plantCount}/${total} occupées`;
  renderBedGrid(zone);
}

function renderBedGrid(zone) {
  const grid = document.getElementById('bedGrid');
  if (!zone) { grid.innerHTML = ''; return; }
  const cols = zone.cols || 4;
  const rows = zone.rows || 3;
  const plants = zone.plants || {};
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}_${c}`;
      const plant = plants[key];
      const cell = document.createElement('div');
      cell.className = `bed-cell ${plant ? 'has-plant' : 'empty'}`;
      if (plant) {
        cell.innerHTML = `
          <div class="pc-emoji">${plant.emoji || '🌱'}</div>
          <div class="pc-name">${esc(plant.name)}</div>
          ${plant.plantedDate ? `<div class="pc-date">${formatShortDate(plant.plantedDate)}</div>` : ''}`;
        cell.addEventListener('click', () => openPlantPanel(activeZoneId, key, plant));
      } else {
        cell.innerHTML = `<div class="pc-plus">+</div>`;
        cell.addEventListener('click', () => openPlantPicker(activeZoneId, key));
      }
      grid.appendChild(cell);
    }
  }
}

/* ============================================================
   PLANT PANEL
   ============================================================ */
function openPlantPanel(zoneId, cellKey, plant) {
  const z = zones[zoneId];
  document.getElementById('pdBedName').textContent = z?.name || '—';
  document.getElementById('pdStatus').className = 'dot healthy';

  const waterLabels = { '2jours': 'Tous les 2 jours', 'semaine': 'Hebdomadaire', 'rarement': 'Rarement' };
  const body = document.getElementById('panelBody');
  body.innerHTML = `
    <div class="pd-hero">
      <div class="pd-emoji">${plant.emoji || '🌱'}</div>
      <div>
        <h2 class="pd-name">${esc(plant.name)}</h2>
        <div class="pd-type muted small">${typeName(plant.type)}</div>
      </div>
    </div>
    ${plant.plantedDate ? `<div class="pd-meta"><span class="meta-key">Planté le</span><span>${formatDate(plant.plantedDate)}</span></div>` : ''}
    <div class="pd-meta"><span class="meta-key">Arrosage</span><span class="badge green">${waterLabels[plant.water] || plant.water || '—'}</span></div>
    ${plant.notes ? `<div class="pd-notes small muted">${esc(plant.notes)}</div>` : ''}
    <div class="pd-actions">
      <button class="btn primary" onclick="addTaskForPlant('${esc(plant.name)}','water')">💧 Arroser</button>
      <button class="btn" onclick="addTaskForPlant('${esc(plant.name)}','harvest')">🥕 Récolter</button>
      <button class="btn" onclick="addJournalFromPanel('${esc(plant.name)}')">📝 Noter</button>
      <button class="btn danger" onclick="confirmRemovePlant('${zoneId}','${cellKey}')">🗑️ Supprimer</button>
    </div>`;

  document.getElementById('panelBackdrop').style.display = 'block';
  document.getElementById('plantPanel').classList.add('open');
  document.getElementById('plantPanel').setAttribute('aria-hidden', 'false');
}

function closePanel() {
  document.getElementById('panelBackdrop').style.display = 'none';
  document.getElementById('plantPanel').classList.remove('open');
  document.getElementById('plantPanel').setAttribute('aria-hidden', 'true');
}

function confirmRemovePlant(zoneId, cellKey) {
  showConfirm('Supprimer la plante ?', 'Cette action est irréversible.', () => {
    savePlantToCell(zoneId, cellKey, null);
    closePanel();
    showToast('Plante supprimée');
  });
}

function addTaskForPlant(plantName, kind) {
  tasks.unshift({ id: uid(), title: `${kindIcon(kind)} ${plantName}`, kind, date: toISODate(new Date()), done: false, createdAt: Date.now() });
  saveTasks();
  closePanel();
  showToast('Tâche ajoutée !');
}

function addJournalFromPanel(plantName) {
  closePanel();
  openQuickAdd('note');
  const ns = document.getElementById('qaNoteSubject');
  if (ns) {
    const opt = Array.from(ns.options).find(o => o.value === plantName);
    if (opt) ns.value = plantName;
  }
}

function typeName(t) {
  return { legume: 'Légume', fruit: 'Fruit', herbe: 'Herbe aromatique', fleur: 'Fleur', arbre: 'Arbre / Arbuste' }[t] || t || '—';
}

/* ============================================================
   BED MODAL
   ============================================================ */
function openBedModal(zoneId = null) {
  editingBedId = zoneId;
  const z = zoneId ? zones[zoneId] : null;
  document.getElementById('bedModalTitle').textContent = z ? 'Modifier la parcelle' : 'Nouvelle parcelle';
  document.getElementById('bedModalName').value = z?.name || '';
  document.getElementById('bedModalCols').value = z?.cols || 4;
  document.getElementById('bedModalRows').value = z?.rows || 3;
  const currentColor = z?.color || BED_COLORS[0];
  document.getElementById('bedColorPicker').innerHTML = BED_COLORS.map(c => `
    <button class="color-swatch ${c === currentColor ? 'selected' : ''}" style="background:${c}" onclick="selectBedColor(this)" aria-label="Couleur ${c}"></button>`).join('');
  openModal('bedModalBackdrop');
}

function selectBedColor(el) {
  document.querySelectorAll('#bedColorPicker .color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

function saveBed() {
  const name = document.getElementById('bedModalName').value.trim();
  const cols = Math.min(10, Math.max(2, parseInt(document.getElementById('bedModalCols').value) || 4));
  const rows = Math.min(10, Math.max(2, parseInt(document.getElementById('bedModalRows').value) || 3));
  const selectedSwatch = document.querySelector('#bedColorPicker .color-swatch.selected');
  const color = selectedSwatch ? selectedSwatch.style.background : BED_COLORS[0];
  if (!name) { showToast('Donnez un nom à la parcelle', 'warn'); return; }

  const id = editingBedId || uid();
  const existing = editingBedId ? zones[editingBedId] : null;
  const data = { name, cols, rows, color, plants: existing?.plants || {} };

  if (isLocalMode) {
    zones[id] = data;
    lsSet('potager_zones_local', zones);
    activeZoneId = id;
    renderGarden();
    renderDashboard();
  } else {
    db.ref(`jardin/zones/${id}`).set(data);
    activeZoneId = id;
  }
  closeModal('bedModalBackdrop');
  showToast(editingBedId ? 'Parcelle modifiée !' : 'Parcelle créée !');
}

function deleteBed() {
  if (!activeZoneId) return;
  const z = zones[activeZoneId];
  showConfirm(`Supprimer « ${z?.name || 'cette parcelle'} » ?`, 'Toutes les plantes seront perdues.', () => {
    const idToDelete = activeZoneId;
    activeZoneId = null;
    if (isLocalMode) {
      delete zones[idToDelete];
      lsSet('potager_zones_local', zones);
      renderGarden();
      renderDashboard();
    } else {
      db.ref(`jardin/zones/${idToDelete}`).remove();
    }
    showToast('Parcelle supprimée');
  });
}

/* ============================================================
   PLANT PICKER
   ============================================================ */
function openPlantPicker(zoneId, cellKey) {
  pickerTarget = { zoneId, cellKey };
  document.getElementById('pickerSearch').value = '';
  renderPlantPicker();
  openModal('plantPickerBackdrop');
}

function renderPlantPicker() {
  const q = (document.getElementById('pickerSearch')?.value || '').toLowerCase();
  const grid = document.getElementById('plantPickerGrid');
  const filtered = PLANT_LIBRARY.filter(p => !q || p.name.toLowerCase().includes(q) || (p.notes || '').toLowerCase().includes(q));
  grid.innerHTML = filtered.map(p => `
    <button class="picker-cell" onclick="pickPlant('${p.id}')">
      <div class="picker-emoji">${p.emoji}</div>
      <div class="picker-name">${esc(p.name)}</div>
    </button>`).join('');
}

function pickPlant(plantId) {
  if (!pickerTarget) return;
  const plant = PLANT_LIBRARY.find(p => p.id === plantId);
  if (!plant) return;
  savePlantToCell(pickerTarget.zoneId, pickerTarget.cellKey, {
    name: plant.name, emoji: plant.emoji, type: plant.type,
    water: plant.water, notes: plant.notes, plantedDate: toISODate(new Date()),
  });
  closeModal('plantPickerBackdrop');
  pickerTarget = null;
  showToast(`${plant.emoji} ${plant.name} planté·e !`);
}

/* ============================================================
   CATALOG
   ============================================================ */
function wireCatalogFilters() {
  const types = [
    { id: 'all', label: '🌿 Tout' }, { id: 'legume', label: '🥕 Légumes' },
    { id: 'fruit', label: '🍓 Fruits' }, { id: 'herbe', label: '🌿 Herbes' },
    { id: 'fleur', label: '🌸 Fleurs' }, { id: 'arbre', label: '🌳 Arbres' },
  ];
  document.getElementById('catalogFilters').innerHTML = types.map(t => `
    <button class="filter-chip ${t.id === 'all' ? 'active' : ''}" data-cat-f="${t.id}" onclick="setCatalogFilter('${t.id}')">${t.label}</button>`).join('');
}

function setCatalogFilter(f) {
  activeCatalogFilter = f;
  document.querySelectorAll('[data-cat-f]').forEach(b => b.classList.toggle('active', b.dataset.catF === f));
  renderCatalog();
}

function renderCatalog() {
  const q = (document.getElementById('catalogSearch')?.value || '').toLowerCase();
  const grid = document.getElementById('catalogGrid');
  const filtered = PLANT_LIBRARY.filter(p =>
    (activeCatalogFilter === 'all' || p.type === activeCatalogFilter) &&
    (!q || p.name.toLowerCase().includes(q) || (p.notes || '').toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ei">🔍</div><h3>Aucun résultat</h3><p>Essayez un autre filtre ou terme de recherche.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="catalog-card">
      <div class="cc-head">
        <div class="cc-emoji">${p.emoji}</div>
        <div class="cc-info">
          <div class="cc-name">${esc(p.name)}</div>
          <div class="cc-type muted xsmall">${typeName(p.type)}</div>
        </div>
        <span class="badge ${waterBadgeClass(p.water)}">${waterLabel(p.water)}</span>
      </div>
      ${p.notes ? `<div class="cc-notes small muted">${esc(p.notes)}</div>` : ''}
      <button class="btn primary sm mt-3" onclick="catalogAddToGarden('${p.id}')">+ Ajouter au jardin</button>
    </div>`).join('');
}

function catalogAddToGarden(plantId) {
  if (Object.keys(zones).length === 0) {
    showToast("Créez d'abord une parcelle dans « Mon jardin »", 'warn');
    return;
  }
  openQuickAdd('plant');
  setTimeout(() => {
    const sel = document.getElementById('qaPlantSelect');
    if (sel) sel.value = plantId;
  }, 50);
}

function waterLabel(w) { return { '2jours': '2 jours', 'semaine': 'Hebdo', 'rarement': 'Rarement' }[w] || w || '—'; }
function waterBadgeClass(w) { return { '2jours': 'green', 'semaine': 'earth', 'rarement': 'warn' }[w] || ''; }

/* ============================================================
   CALENDAR
   ============================================================ */
function wireCalFilters() {
  document.getElementById('calFilters').querySelectorAll('[data-cf]').forEach(b => {
    b.addEventListener('click', () => {
      activeCalFilter = b.dataset.cf;
      document.getElementById('calFilters').querySelectorAll('[data-cf]').forEach(x => x.classList.toggle('active', x.dataset.cf === activeCalFilter));
      renderCalendar();
    });
  });
}

function renderCalendar() {
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('calMonth').textContent = `${MONTHS[calMonth]} ${calYear}`;

  const first = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
  let startDow = first.getDay() - 1; if (startDow < 0) startDow = 6;

  const grid = document.getElementById('calGrid');
  const todayIso = toISODate(new Date());
  const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  let html = DAYS.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < startDow; i++) html += `<div class="cal-day empty"></div>`;

  for (let day = 1; day <= lastDay; day++) {
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.date === iso && (activeCalFilter === 'all' || t.kind === activeCalFilter));
    const isToday = iso === todayIso;
    const dots = dayTasks.slice(0, 4).map(t => `<span class="d-dot" style="background:${taskColor(t.kind)}"></span>`).join('');
    html += `<div class="cal-day ${isToday ? 'today' : ''}" onclick="selectCalDay('${iso}',${day})">
      <span class="cal-day-num">${day}</span>
      <div class="cal-dots">${dots}</div>
    </div>`;
  }
  grid.innerHTML = html;
}

function selectCalDay(iso, day) {
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const detail = document.getElementById('calDayDetail');
  const dayTasks = tasks.filter(t => t.date === iso);
  document.getElementById('calDayTitle').textContent = `${day} ${MONTHS[calMonth]} ${calYear}`;
  document.getElementById('calDayTasks').innerHTML = dayTasks.length === 0
    ? `<div class="empty-inline"><span>✅</span> Aucune tâche ce jour</div>`
    : dayTasks.map(t => `
      <div class="task-row" onclick="toggleTask('${t.id}')">
        <span class="task-check ${t.done ? 'done' : ''}"></span>
        <span class="task-kind-ic">${kindIcon(t.kind)}</span>
        <span class="task-label ${t.done ? 'strikethrough' : ''}">${esc(t.title)}</span>
        <button class="btn ghost sm" onclick="event.stopPropagation();deleteTask('${t.id}')" style="margin-left:auto">✕</button>
      </div>`).join('');
  detail.style.display = 'block';
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  if (currentView === 'calendar') renderCalendar();
  else if (currentView === 'dashboard') renderDashboard();
}

/* ============================================================
   JOURNAL
   ============================================================ */
function wireJournalFilters() {
  document.querySelectorAll('[data-jf]').forEach(b => {
    b.addEventListener('click', () => {
      activeJournalFilter = b.dataset.jf;
      document.querySelectorAll('[data-jf]').forEach(x => x.classList.toggle('active', x.dataset.jf === activeJournalFilter));
      renderJournal();
    });
  });
}

function renderJournal() {
  const list = document.getElementById('journalList');
  const filtered = journalEntries.filter(e => activeJournalFilter === 'all' || e.tag === activeJournalFilter);
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty"><div class="ei">📓</div><h3>Aucune entrée</h3><p>Notez vos premières observations du jardin.</p><button class="btn primary" onclick="openQuickAdd('note')">+ Nouvelle note</button></div>`;
    return;
  }
  list.innerHTML = filtered.map(e => `
    <div class="journal-entry">
      <div class="je-meta">
        <span class="je-time muted xsmall">${relativeTime(e.timestamp)}</span>
        ${e.tag ? `<span class="badge earth">#${tagLabel(e.tag)}</span>` : ''}
        ${e.subject ? `<span class="muted xsmall">· ${esc(e.subject)}</span>` : ''}
        <button class="btn ghost sm" onclick="deleteJournalEntry('${e.id}')" style="margin-left:auto;color:var(--urgent)">✕</button>
      </div>
      <div class="je-text">${esc(e.text)}</div>
    </div>`).join('');
}

function deleteJournalEntry(id) {
  showConfirm('Supprimer cette note ?', 'Cette action est irréversible.', () => {
    journalEntries = journalEntries.filter(e => e.id !== id);
    saveJournal();
    renderJournal();
    showToast('Note supprimée');
  });
}

function tagLabel(t) {
  return { harvest: 'récolte', pest: 'ravageur', weather: 'météo', experiment: 'essai' }[t] || t;
}

/* ============================================================
   REMINDERS
   ============================================================ */
function renderReminders() {
  const list = document.getElementById('remindersList');
  if (reminders.length === 0) {
    list.innerHTML = `<div class="empty-inline"><span>🔔</span> Aucun rappel configuré</div>`;
    return;
  }
  list.innerHTML = reminders.map(r => `
    <div class="reminder">
      <div class="ri">${r.icon || '🔔'}</div>
      <div class="rb">
        <div class="rt">${esc(r.title)}</div>
        <div class="rs muted xsmall">${esc(r.freq)}</div>
      </div>
      <button class="btn ghost sm" onclick="openReminderModal('${r.id}')">✏️</button>
      <button class="btn ghost sm" onclick="deleteReminder('${r.id}')" style="color:var(--urgent)">✕</button>
      <div class="toggle ${r.on ? 'on' : ''}" onclick="toggleReminder('${r.id}')"></div>
    </div>`).join('');
}

function toggleReminder(id) {
  const r = reminders.find(x => x.id === id);
  if (r) { r.on = !r.on; saveReminders(); renderReminders(); }
}

function deleteReminder(id) {
  showConfirm('Supprimer ce rappel ?', 'Cette action est irréversible.', () => {
    reminders = reminders.filter(r => r.id !== id);
    saveReminders();
    renderReminders();
    showToast('Rappel supprimé');
  });
}

function openReminderModal(id = null) {
  editingReminderId = id || null;
  const r = id ? reminders.find(x => x.id === id) : null;
  document.getElementById('reminderModalTitle').textContent = r ? 'Modifier le rappel' : 'Nouveau rappel';
  document.getElementById('reminderTitle').value = r?.title || '';
  document.getElementById('reminderFreq').value = r?.freq || 'Tous les jours';
  document.getElementById('reminderIcon').value = r?.icon || '💧';
  openModal('reminderModalBackdrop');
}

function saveReminder() {
  const title = document.getElementById('reminderTitle').value.trim();
  const freq = document.getElementById('reminderFreq').value;
  const icon = document.getElementById('reminderIcon').value;
  if (!title) { showToast('Donnez un titre au rappel', 'warn'); return; }
  if (editingReminderId) {
    const r = reminders.find(x => x.id === editingReminderId);
    if (r) Object.assign(r, { title, freq, icon });
  } else {
    reminders.unshift({ id: uid(), title, freq, icon, on: true, createdAt: Date.now() });
  }
  saveReminders();
  closeModal('reminderModalBackdrop');
  renderReminders();
  showToast(editingReminderId ? 'Rappel modifié !' : 'Rappel créé !');
}

/* ============================================================
   QUICK ADD
   ============================================================ */
let currentQaType = 'task';

function wireQaTypes() {
  document.querySelectorAll('.qa-type').forEach(btn => {
    btn.addEventListener('click', () => switchQaType(btn.dataset.qa));
  });
}

function openQuickAdd(type = 'task') {
  currentQaType = type;
  switchQaType(type);

  // Populate bed select
  const bs = document.getElementById('qaBedSelect');
  const zids = Object.keys(zones);
  bs.innerHTML = zids.length
    ? zids.map(id => `<option value="${id}">${esc(zones[id].name)}</option>`).join('')
    : '<option value="">Aucune parcelle disponible</option>';

  // Populate plant select
  const ps = document.getElementById('qaPlantSelect');
  ps.innerHTML = PLANT_LIBRARY.map(p => `<option value="${p.id}">${p.emoji} ${p.name}</option>`).join('');

  // Populate note subject
  const ns = document.getElementById('qaNoteSubject');
  const allPlants = Object.values(zones).flatMap(z => Object.values(z.plants || {}));
  const unique = [...new Map(allPlants.map(p => [p.name, p])).values()];
  ns.innerHTML = '<option value="">—</option>' + unique.map(p => `<option value="${p.name}">${p.emoji} ${p.name}</option>`).join('');

  document.getElementById('qaTaskDate').value = toISODate(new Date());
  document.getElementById('qaPlantDate').value = toISODate(new Date());

  loadDraft();
  openModal('quickaddBackdrop');
}

function switchQaType(type) {
  currentQaType = type;
  document.querySelectorAll('.qa-type').forEach(b => b.classList.toggle('active', b.dataset.qa === type));
  document.querySelectorAll('[data-qa-form]').forEach(f => f.style.display = f.dataset.qaForm === type ? 'block' : 'none');
  const titles = { task: 'Nouvelle tâche', plant: 'Planter dans le jardin', note: 'Nouvelle observation' };
  document.getElementById('qaTitle').textContent = titles[type] || 'Ajout rapide';
}

function saveQuickAdd() {
  if (currentQaType === 'task') {
    const title = document.getElementById('qaTaskTitle').value.trim();
    if (!title) { showToast('Entrez le titre de la tâche', 'warn'); return; }
    tasks.unshift({
      id: uid(), title,
      kind: document.getElementById('qaTaskKind').value,
      date: document.getElementById('qaTaskDate').value || toISODate(new Date()),
      done: false, createdAt: Date.now(),
    });
    saveTasks();
    document.getElementById('qaTaskTitle').value = '';

  } else if (currentQaType === 'plant') {
    const plantId = document.getElementById('qaPlantSelect').value;
    const zoneId = document.getElementById('qaBedSelect').value;
    if (!zoneId) { showToast("Créez d'abord une parcelle", 'warn'); return; }
    const plant = PLANT_LIBRARY.find(p => p.id === plantId);
    const zone = zones[zoneId];
    if (!plant || !zone) return;
    const plants = zone.plants || {};
    let placed = false;
    outer: for (let r = 0; r < (zone.rows || 3); r++) {
      for (let c = 0; c < (zone.cols || 4); c++) {
        const key = `${r}_${c}`;
        if (!plants[key]) {
          savePlantToCell(zoneId, key, {
            name: plant.name, emoji: plant.emoji, type: plant.type,
            water: plant.water, notes: plant.notes,
            plantedDate: document.getElementById('qaPlantDate').value || toISODate(new Date()),
          });
          placed = true;
          break outer;
        }
      }
    }
    if (!placed) { showToast('Parcelle pleine ! Choisissez-en une autre.', 'warn'); return; }
    showToast(`${plant.emoji} ${plant.name} planté·e !`);

  } else if (currentQaType === 'note') {
    const text = document.getElementById('qaNoteText').value.trim();
    if (!text) { showToast('Entrez votre observation', 'warn'); return; }
    journalEntries.unshift({
      id: uid(), text,
      tag: document.getElementById('qaNoteTag').value || '',
      subject: document.getElementById('qaNoteSubject').value || '',
      timestamp: Date.now(),
    });
    saveJournal();
    document.getElementById('qaNoteText').value = '';
  }

  lsSet('draft:quickadd', null);
  document.getElementById('qaDraft').style.display = 'none';
  closeModal('quickaddBackdrop');
  showToast(currentQaType === 'task' ? 'Tâche ajoutée !' : currentQaType === 'note' ? 'Note ajoutée !' : '');
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'journal') renderJournal();
  else if (currentView === 'calendar') renderCalendar();
}

function autosaveDraft() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    lsSet('draft:quickadd', {
      type: currentQaType,
      taskTitle: document.getElementById('qaTaskTitle').value,
      noteText: document.getElementById('qaNoteText').value,
    });
    document.getElementById('qaDraft').style.display = 'inline-flex';
  }, 500);
}

function loadDraft() {
  const draft = lsGet('draft:quickadd');
  if (!draft) return;
  if (draft.taskTitle && currentQaType === 'task') {
    document.getElementById('qaTaskTitle').value = draft.taskTitle;
    document.getElementById('qaDraft').style.display = 'inline-flex';
  }
  if (draft.noteText && currentQaType === 'note') {
    document.getElementById('qaNoteText').value = draft.noteText;
    document.getElementById('qaDraft').style.display = 'inline-flex';
  }
}

/* ============================================================
   ACCOUNT MODAL
   ============================================================ */
function openAccountModal() {
  const body = document.getElementById('accountBody');
  if (currentUser) {
    body.innerHTML = `
      <div class="ac-profile" style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
        <div class="ava" style="width:56px;height:56px;font-size:24px;border-radius:50%;flex-shrink:0">${currentUser.displayName?.charAt(0).toUpperCase() || '?'}</div>
        <div>
          <div style="font-weight:700;font-size:16px">${esc(currentUser.displayName || 'Jardinier')}</div>
          <div class="muted small">${esc(currentUser.email || '')}</div>
        </div>
      </div>
      <div class="muted small" style="margin-bottom:16px">Données synchronisées via Firebase · ${Object.keys(zones).length} parcelle(s)</div>
      <button class="btn danger" onclick="confirmSignOut()" style="width:100%">Se déconnecter</button>`;
  } else {
    body.innerHTML = `
      <div class="ac-profile" style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
        <div class="ava" style="width:56px;height:56px;font-size:24px;border-radius:50%;flex-shrink:0">L</div>
        <div>
          <div style="font-weight:700;font-size:16px">Mode local</div>
          <div class="muted small">Données sur cet appareil uniquement</div>
        </div>
      </div>
      <div class="muted small" style="margin-bottom:16px">Connectez-vous pour synchroniser vos données sur tous vos appareils.</div>
      <button class="btn primary" onclick="closeModal('accountBackdrop');lsSet('potager_localMode',false);showAuthScreen()" style="width:100%">Se connecter</button>`;
  }
  openModal('accountBackdrop');
}

function confirmSignOut() {
  showConfirm('Se déconnecter ?', "Vous serez redirigé·e vers l'écran de connexion.", signOut);
}

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
function wireModalBackdrops() {
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => { if (e.target === bd) closeModal(bd.id); });
  });
}

function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function showConfirm(title, msg, cb) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  confirmCb = cb;
  openModal('confirmBackdrop');
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type = 'ok') {
  if (!msg) return;
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ============================================================
   UTILITIES
   ============================================================ */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  const m = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return `${d.getDate()} ${m[d.getMonth()]}`;
}

function relativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "À l'instant";
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
  if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)} jour(s)`;
  return new Date(ts).toLocaleDateString('fr-FR');
}

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
