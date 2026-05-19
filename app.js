'use strict';

/* ============================================================
   CATALOG
   ============================================================ */
const CATALOG = [
  { id:'tomato',    name:'Tomate',     sci:'Solanum lycopersicum',   icon:'🍅', family:'Solanacées',      season:['spring','summer'],          difficulty:2, sow:'mars–avr',  plant:'mai',      harvest:'juil–sept', space:'60 cm',  companions:['Basilic','Carotte','Oignon'],       waterEvery:2, tip:'Pincez les gourmands chaque semaine. Tuteurez tôt.' },
  { id:'basil',     name:'Basilic',    sci:'Ocimum basilicum',       icon:'🌿', family:'Lamiacées',       season:['spring','summer'],          difficulty:1, sow:'avr',       plant:'mai–juin', harvest:'juil–sept', space:'25 cm',  companions:['Tomate','Poivron'],                 waterEvery:2, tip:'Aime la chaleur. Pincez les fleurs pour relancer les feuilles.' },
  { id:'lettuce',   name:'Laitue',     sci:'Lactuca sativa',         icon:'🥬', family:'Astéracées',      season:['spring','autumn'],          difficulty:1, sow:'mars–sept', plant:'avr–sept', harvest:'mai–oct',   space:'25 cm',  companions:['Carotte','Radis','Fraisier'],        waterEvery:2, tip:'Semez toutes les 3 semaines pour une récolte continue.' },
  { id:'carrot',    name:'Carotte',    sci:'Daucus carota',          icon:'🥕', family:'Apiacées',        season:['spring','autumn'],          difficulty:2, sow:'mars–juil', plant:'—',        harvest:'juil–nov',  space:'5 cm',   companions:['Oignon','Laitue','Tomate'],          waterEvery:3, tip:'Éclaircissez à 5 cm dès que les plants font 5 cm.' },
  { id:'zucchini',  name:'Courgette',  sci:'Cucurbita pepo',         icon:'🥒', family:'Cucurbitacées',   season:['summer'],                   difficulty:1, sow:'avr',       plant:'mai–juin', harvest:'juil–oct',  space:'90 cm',  companions:['Capucine','Maïs'],                  waterEvery:2, tip:'Récoltez petit pour une chair tendre et plus de fleurs.' },
  { id:'leek',      name:'Poireau',    sci:'Allium ampeloprasum',    icon:'🧅', family:'Amaryllidacées',  season:['spring','autumn','winter'], difficulty:3, sow:'fév–avr',   plant:'mai–juil', harvest:'oct–mars',  space:'15 cm',  companions:['Carotte','Céleri'],                 waterEvery:4, tip:'Buttez la terre autour des pieds pour des fûts blancs.' },
  { id:'strawberry',name:'Fraisier',   sci:'Fragaria × ananassa',   icon:'🍓', family:'Rosacées',        season:['spring','summer'],          difficulty:2, sow:'—',         plant:'mars–mai', harvest:'mai–juil',  space:'30 cm',  companions:['Laitue','Épinard','Bourrache'],      waterEvery:2, tip:'Paillez avec de la paille pour des fruits propres.' },
  { id:'radish',    name:'Radis',      sci:'Raphanus sativus',       icon:'🟠', family:'Brassicacées',    season:['spring','autumn'],          difficulty:1, sow:'mars–sept', plant:'—',        harvest:'30 jours',  space:'5 cm',   companions:['Laitue','Carotte','Petit pois'],     waterEvery:2, tip:'La culture la plus rapide. Ne les laissez pas devenir creux.' },
  { id:'pepper',    name:'Poivron',    sci:'Capsicum annuum',        icon:'🌶️', family:'Solanacées',      season:['summer'],                   difficulty:3, sow:'fév–mars',  plant:'mai–juin', harvest:'juil–oct',  space:'45 cm',  companions:['Basilic','Tomate'],                 waterEvery:2, tip:'Aime la chaleur. Ne plantez pas avant des nuits >12°.' },
  { id:'eggplant',  name:'Aubergine',  sci:'Solanum melongena',      icon:'🍆', family:'Solanacées',      season:['summer'],                   difficulty:3, sow:'fév–mars',  plant:'mai–juin', harvest:'août–oct',  space:'60 cm',  companions:['Basilic','Poivron'],                waterEvery:2, tip:'Pincez la tête à 30 cm pour favoriser la ramification.' },
  { id:'pea',       name:'Petit pois', sci:'Pisum sativum',          icon:'🟢', family:'Fabacées',        season:['spring'],                   difficulty:1, sow:'fév–avr',   plant:'—',        harvest:'mai–juil',  space:'10 cm',  companions:['Carotte','Radis'],                  waterEvery:3, tip:"Installez un treillis tôt ; les vrilles ont besoin de s'accrocher." },
  { id:'pumpkin',   name:'Citrouille', sci:'Cucurbita pepo',         icon:'🎃', family:'Cucurbitacées',   season:['summer','autumn'],          difficulty:2, sow:'avr',       plant:'mai–juin', harvest:'sept–oct',  space:'120 cm', companions:['Maïs','Haricot'],                  waterEvery:3, tip:'Donnez-leur de la place — les tiges courent sur 3 m+.' }
];

/* ============================================================
   DEFAULT STATE
   ============================================================ */
const DEFAULT_STATE = {
  beds: [
    { id:'b1', name:'Parcelle du jardin', cols:4, rows:3, cells:[
      { id:'c1', plant:'tomato',     planted:'2026-05-01', status:'healthy', notes:'Variété : San Marzano. Tuteurée.' },
      { id:'c2', plant:'tomato',     planted:'2026-05-01', status:'warn',    notes:"Feuilles enroulées, manque d'eau peut-être." },
      { id:'c3', plant:'basil',      planted:'2026-05-10', status:'healthy', notes:'Plantée à côté des tomates.' },
      { id:'c4', plant:'lettuce',    planted:'2026-04-22', status:'healthy', notes:'Variété à couper.' },
      null, null,
      { id:'c5', plant:'leek',       planted:'2026-05-05', status:'urgent',  notes:"Pucerons repérés aujourd'hui." },
      { id:'c6', plant:'carrot',     planted:'2026-04-15', status:'healthy', notes:'Éclaircie la semaine dernière.' },
      { id:'c7', plant:'strawberry', planted:'2026-04-01', status:'healthy', notes:'Premières fleurs ouvertes !' },
      { id:'c8', plant:'strawberry', planted:'2026-04-01', status:'healthy', notes:'' },
      null,
      { id:'c9', plant:'radish',     planted:'2026-05-10', status:'healthy', notes:'Prêts dans ~2 semaines.' }
    ]},
    { id:'b2', name:'Serre', cols:3, rows:2, cells:[
      { id:'g1', plant:'pepper',   planted:'2026-04-25', status:'healthy', notes:'' },
      { id:'g2', plant:'eggplant', planted:'2026-04-25', status:'warn',    notes:'Démarrage lent, surveiller les températures nocturnes.' },
      { id:'g3', plant:'pepper',   planted:'2026-04-25', status:'healthy', notes:'' },
      null, null, null
    ]}
  ],
  activeBedId: 'b1',
  tasks: [
    { id:'t1', title:'Arroser les tomates',                                     kind:'water',   date: iso(new Date()), done:false, plantId:'tomato' },
    { id:'t2', title:'Récolter les premiers radis',                              kind:'harvest', date: iso(new Date()), done:false, plantId:'radish' },
    { id:'t3', title:'Pulvériser savon noir sur poireaux (pucerons)',            kind:'treat',   date: iso(new Date()), done:false, plantId:'leek' },
    { id:'t4', title:'Semer la 2ᵉ série de laitues',                            kind:'sow',     date: iso(addDays(new Date(),1)), done:false, plantId:'lettuce' },
    { id:'t5', title:'Arroser les poivrons',                                     kind:'water',   date: iso(addDays(new Date(),1)), done:false, plantId:'pepper' },
    { id:'t6', title:'Vérifier le filet des fraisiers',                          kind:'other',   date: iso(addDays(new Date(),2)), done:false, plantId:'strawberry' },
    { id:'t7', title:'Pincer les gourmands des tomates',                         kind:'other',   date: iso(addDays(new Date(),3)), done:false, plantId:'tomato' }
  ],
  journal: [
    { id:'j1', date: iso(addDays(new Date(),-1)), subject:'Poireaux',  icon:'🧅', text:'Pucerons trouvés sur trois pieds de poireau. Pulvérisation de savon noir dilué. Re-contrôle dans 48h.', tags:['pest'] },
    { id:'j2', date: iso(addDays(new Date(),-3)), subject:'Fraisiers', icon:'🍓', text:'Premières fleurs ouvertes sur la rangée 2. Paillage de paille pour garder les fruits propres.', tags:['experiment'] },
    { id:'j3', date: iso(addDays(new Date(),-5)), subject:'Météo',     icon:'🌧️', text:'Grosse pluie cette nuit (28 mm). Pas d\'arrosage aujourd\'hui. Les tomates ont meilleure mine.', tags:['weather'] },
    { id:'j4', date: iso(addDays(new Date(),-9)), subject:'Radis',     icon:'🟠', text:'Goûté les premiers — piquants mais pas creux. Bon timing.', tags:['harvest'] }
  ],
  reminders: [
    { id:'r1', title:'Arroser les tomates',    schedule:'Tous les 2 jours',   icon:'💧', on:true },
    { id:'r2', title:'Surveiller les poireaux', schedule:'Tous les samedis',  icon:'🐛', on:true },
    { id:'r3', title:'Semer la laitue',          schedule:'Toutes les 3 semaines', icon:'🌱', on:true },
    { id:'r4', title:'Apport potasse fraisiers', schedule:'Toutes les 2 semaines', icon:'🍓', on:false }
  ],
  prefs: { digest:true, weather:true, quiet:true, pushAsked:false, pushOn:false },
  onboarded: false,
  draft: null,
  streak: 7
};

const STORAGE_KEY = 'potager.state.v2.fr';
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    return { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...JSON.parse(raw) };
  } catch { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function plantById(id) { return CATALOG.find(p => p.id === id); }
function activeBed() { return state.beds.find(b => b.id === state.activeBedId) || state.beds[0]; }

/* ============================================================
   AUTH STATE
   ============================================================ */
let currentUser = null;
let isLocalMode = false;

function isFirebaseConfigured() {
  try { return typeof firebase !== 'undefined' && firebase.apps.length > 0 && !!firebase.app().options.apiKey; }
  catch { return false; }
}

function updateAccountUI() {
  const name = currentUser ? (currentUser.displayName || currentUser.email || 'Utilisateur') : (isLocalMode ? 'Mode local' : 'Non connecté');
  const email = currentUser ? (currentUser.email || '') : '';
  const initial = name[0].toUpperCase();

  const setAva = (el, src) => {
    if (!el) return;
    if (src) { el.style.backgroundImage = `url('${src}')`; el.style.backgroundSize = 'cover'; el.textContent = ''; }
    else { el.style.backgroundImage = ''; el.textContent = initial; }
  };

  setAva(document.getElementById('ava-desktop'), currentUser?.photoURL);
  setAva(document.getElementById('ava-mobile'), currentUser?.photoURL);
  setAva(document.getElementById('ava-menu'), currentUser?.photoURL);

  const nameEl = document.getElementById('acc-name-desktop');
  if (nameEl) nameEl.textContent = name;
  const stateEl = document.getElementById('acc-state-desktop');
  if (stateEl) stateEl.textContent = currentUser ? 'Connecté' : 'Mode local';
  const menuName = document.getElementById('acc-menu-name');
  if (menuName) menuName.textContent = name;
  const menuEmail = document.getElementById('acc-menu-email');
  if (menuEmail) menuEmail.textContent = email;
  const badge = document.getElementById('acc-sync-badge');
  if (badge) { badge.textContent = currentUser ? '☁ Synchro' : 'Local'; badge.className = 'sync-badge' + (currentUser ? '' : ' local'); }
}

function enterApp() {
  updateAccountUI();
  closeModal('auth-backdrop');
  boot();
}

function handleLocalMode() {
  isLocalMode = true;
  currentUser = null;
  enterApp();
}

function handleGoogleSignIn() {
  if (!isFirebaseConfigured()) {
    flash('Firebase non configuré — mode local activé.');
    handleLocalMode();
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(result => {
    currentUser = result.user;
    enterApp();
  }).catch(err => {
    const errEl = document.getElementById('auth-error');
    errEl.textContent = translateAuthError(err.code);
    errEl.classList.add('show');
  });
}

function translateAuthError(code) {
  const map = {
    'auth/popup-closed-by-user': 'Connexion annulée.',
    'auth/network-request-failed': 'Problème réseau. Vérifiez votre connexion.',
    'auth/user-disabled': 'Ce compte a été désactivé.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
  };
  return map[code] || 'Une erreur est survenue. Réessayez.';
}

/* ============================================================
   NAV
   ============================================================ */
function setView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.dataset.view === name));
  document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
  if (name === 'dashboard') renderDashboard();
  if (name === 'garden') renderGarden();
  if (name === 'catalog') renderCatalog();
  if (name === 'calendar') renderCalendar();
  if (name === 'journal') renderJournal();
  if (name === 'reminders') renderReminders();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const today = new Date();
  const fmt = today.toLocaleDateString('fr-FR', { weekday:'long', month:'long', day:'numeric' });
  document.getElementById('today-date').textContent = fmt;
  const hour = today.getHours();
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const userName = currentUser ? (currentUser.displayName || '').split(' ')[0] : 'jardinier';
  document.getElementById('greeting').textContent = `${greet}, ${userName || 'jardinier'}`;

  // Alerts
  const beds = state.beds;
  const alerts = [];
  const urgentCells = beds.flatMap(b => (b.cells || []).filter(c => c && c.status === 'urgent'));
  const warnCells = beds.flatMap(b => (b.cells || []).filter(c => c && c.status === 'warn'));
  urgentCells.slice(0, 2).forEach(c => {
    const p = plantById(c.plant);
    alerts.push({ kind:'urgent', icon:'🐛', text:`${p ? p.name : c.plant} demande de l'attention — ${c.notes || 'intervention urgente'}`, act:'TRAITER' });
  });
  warnCells.slice(0, 1).forEach(c => {
    const p = plantById(c.plant);
    alerts.push({ kind:'warn', icon:'⚠️', text:`${p ? p.name : c.plant} montre des signes de stress — à vérifier`, act:'VÉRIFIER' });
  });
  if (!urgentCells.length) alerts.push({ kind:'green', icon:'☀️', text:"Fenêtre météo parfaite pour semer aujourd'hui", act:'SEMER' });
  const al = document.getElementById('alerts-list');
  al.innerHTML = alerts.slice(0,3).map(a => `<div class="alert ${a.kind}"><span class="ai">${a.icon}</span><span>${escapeHTML(a.text)}</span><span class="act">${a.act}</span></div>`).join('');

  // Stats
  const allPlanted = beds.flatMap(b => (b.cells || []).filter(Boolean));
  const todayStr = iso(today);
  document.getElementById('stat-plants').textContent = allPlanted.length;
  document.getElementById('stat-water').textContent = state.tasks.filter(t => t.kind === 'water' && !t.done && t.date === todayStr).length;
  document.getElementById('stat-harvest').textContent = state.tasks.filter(t => t.kind === 'harvest' && !t.done).length;
  document.getElementById('stat-streak').textContent = `${state.streak}j`;

  // Tasks
  const todayTasks = state.tasks.filter(t => t.date === todayStr);
  renderTasks(todayTasks);

  // Week glance
  renderWeekGlance(today);
}

function renderTasks(tasks) {
  const el = document.getElementById('tasks-list');
  const done = tasks.filter(t => t.done).length;
  document.getElementById('tasks-meta').textContent = `${done} sur ${tasks.length} terminées`;
  if (!tasks.length) {
    el.innerHTML = `<div class="empty"><div class="ei">🌼</div><h3>Aucune tâche aujourd'hui</h3><p>Profitez du jardin, ou parcourez le catalogue.</p><button class="btn primary" onclick="setView('catalog')">Ouvrir le catalogue</button></div>`;
    return;
  }
  el.innerHTML = tasks.map(t => taskHTML(t)).join('');
  bindTaskCheckboxes(el);
}

function taskHTML(t) {
  const p = plantById(t.plantId);
  const kindIcons = { water:'💧', harvest:'🥕', treat:'🛡️', sow:'🌱', other:'📌' };
  const kindLabels = { water:'Arrosage', harvest:'Récolte', treat:'Traitement', sow:'Semis', other:'Note' };
  return `<div class="task ${t.done ? 'done' : ''}" data-task="${t.id}">
    <div class="t-kind ${t.kind}">${kindIcons[t.kind] || '📌'}</div>
    <div class="t-body">
      <div class="t-text">${escapeHTML(t.title)}</div>
      <div class="t-meta"><span>${kindLabels[t.kind] || ''}</span>${p ? `<span>•</span><span>${p.icon} ${p.name}</span>` : ''}</div>
    </div>
    <div class="checkbox" role="checkbox" tabindex="0" aria-checked="${t.done}"></div>
  </div>`;
}

function bindTaskCheckboxes(scope) {
  scope.querySelectorAll('.task').forEach(node => {
    const cb = node.querySelector('.checkbox');
    const toggle = () => {
      const id = node.dataset.task;
      const t = state.tasks.find(t => t.id === id);
      if (!t) return;
      t.done = !t.done;
      saveState();
      node.classList.toggle('done', t.done);
      cb.setAttribute('aria-checked', t.done);
      const todayStr = iso(new Date());
      const todayTasks = state.tasks.filter(t => t.date === todayStr);
      const doneCount = todayTasks.filter(t => t.done).length;
      const meta = document.getElementById('tasks-meta');
      if (meta) meta.textContent = `${doneCount} sur ${todayTasks.length} terminées`;
    };
    cb.addEventListener('click', toggle);
    cb.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
  });
}

function renderWeekGlance(today) {
  const el = document.getElementById('week-glance');
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const ds = iso(d);
    const tasks = state.tasks.filter(t => t.date === ds);
    const chips = ['water','sow','harvest','treat'].map(k => {
      const n = tasks.filter(t => t.kind === k).length;
      const colorClass = k === 'water' ? 'green' : k === 'harvest' ? 'earth' : k === 'treat' ? 'urgent' : 'green';
      return n ? `<span class="chip ${colorClass}" style="padding:1px 7px;font-size:11px">${{water:'💧',sow:'🌱',harvest:'🥕',treat:'🛡️'}[k]} ${n}</span>` : '';
    }).join('');
    out.push(`<div class="card" style="flex:none;min-width:130px;padding:12px">
      <div class="xsmall muted" style="font-weight:800;text-transform:uppercase;letter-spacing:.06em">${d.toLocaleDateString('fr-FR',{weekday:'short'})} ${d.getDate()}</div>
      <div style="font-family:var(--serif);font-size:22px;font-weight:600;margin-top:2px">${tasks.length}</div>
      <div class="row gap-2 mt-2">${chips}</div>
    </div>`);
  }
  el.innerHTML = out.join('');
}

/* ============================================================
   GARDEN
   ============================================================ */
function renderGarden() {
  const beds = state.beds;
  const bar = document.getElementById('beds-toolbar');
  bar.innerHTML = beds.map(b => `<button class="bed-tab ${b.id === state.activeBedId ? 'active' : ''}" data-bed="${b.id}">🌿 ${escapeHTML(b.name)}<span class="x">${(b.cells||[]).filter(Boolean).length}/${(b.cols||4)*(b.rows||3)}</span></button>`).join('');
  bar.querySelectorAll('[data-bed]').forEach(b => b.addEventListener('click', () => { state.activeBedId = b.dataset.bed; saveState(); renderGarden(); }));

  const stage = document.getElementById('bed-stage');
  const emptyEl = document.getElementById('garden-empty');
  const bed = activeBed();
  if (!bed) { stage.style.display = 'none'; emptyEl.style.display = ''; return; }
  stage.style.display = '';
  emptyEl.style.display = 'none';

  document.getElementById('bed-name').textContent = bed.name;
  const planted = (bed.cells || []).filter(Boolean).length;
  const total = (bed.cols || 4) * (bed.rows || 3);
  document.getElementById('bed-sub').textContent = `${bed.cols} × ${bed.rows} • ${planted} plantée${planted > 1 ? 's' : ''} • ${total - planted} libre${total - planted > 1 ? 's' : ''}`;

  const grid = document.getElementById('bed-grid');
  grid.style.setProperty('--cols', bed.cols || 4);
  while ((bed.cells || []).length < total) bed.cells.push(null);
  bed.cells.length = total;

  grid.innerHTML = bed.cells.map((c, i) => {
    if (c) {
      const p = plantById(c.plant);
      return `<div class="cell has-plant" draggable="true" data-idx="${i}" data-cell="${c.id}">
        <span class="status-dot" style="background:${statusColor(c.status)}"></span>
        <div class="pi">${p ? p.icon : '❓'}</div>
        <div class="pn">${p ? p.name : '?'}</div>
      </div>`;
    }
    return `<div class="cell" data-idx="${i}"><span class="empty-plus">+</span></div>`;
  }).join('');

  grid.querySelectorAll('.cell').forEach(node => {
    const idx = +node.dataset.idx;
    node.addEventListener('click', () => {
      if (node.classList.contains('has-plant')) openPlantPanel(idx);
      else openQuickAdd('plant');
    });
  });

  // Drag-and-drop
  let dragSrc = null;
  grid.querySelectorAll('.cell').forEach(node => {
    node.addEventListener('dragstart', e => {
      if (!node.classList.contains('has-plant')) { e.preventDefault(); return; }
      dragSrc = +node.dataset.idx;
      node.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(dragSrc)); } catch {}
    });
    node.addEventListener('dragend', () => grid.querySelectorAll('.cell').forEach(n => n.classList.remove('dragging','drag-over')));
    node.addEventListener('dragover', e => { e.preventDefault(); node.classList.add('drag-over'); });
    node.addEventListener('dragleave', () => node.classList.remove('drag-over'));
    node.addEventListener('drop', e => {
      e.preventDefault();
      const from = dragSrc; const to = +node.dataset.idx;
      if (from === null || from === to) return;
      const tmp = bed.cells[from]; bed.cells[from] = bed.cells[to]; bed.cells[to] = tmp;
      saveState(); renderGarden();
    });
  });
}

function statusColor(s) { return s === 'urgent' ? 'var(--urgent)' : s === 'warn' ? 'var(--warn)' : 'var(--healthy)'; }

function openPlantPanel(idx) {
  const bed = activeBed();
  if (!bed) return;
  const cell = bed.cells[idx];
  if (!cell) return;
  const p = plantById(cell.plant);
  document.getElementById('pd-bed-name').textContent = `${bed.name} • cellule ${idx + 1}`;
  const dot = document.getElementById('pd-status');
  dot.className = 'dot ' + (cell.status === 'urgent' ? 'urgent' : cell.status === 'warn' ? 'warn' : 'healthy');

  const today = new Date();
  const since = daysBetween(parseISO(cell.planted), today);
  const tip = p ? p.tip : '';
  const sci = p ? p.sci : '';
  const season = p && p.season ? p.season : [];
  const family = p ? p.family : '';
  const companions = p && p.companions ? p.companions : [];

  document.getElementById('panel-body').innerHTML = `
    <div class="pd-hero">
      <div class="pdi">${p ? p.icon : '❓'}</div>
      <div>
        <h2>${p ? p.name : (cell.plant || '?')}</h2>
        ${sci ? `<div class="sci">${escapeHTML(sci)}</div>` : ''}
        <div class="row gap-2 mt-2">
          ${season.slice(0,1).map(s => `<span class="chip green">${seasonLabel(s)}</span>`).join('')}
          ${family ? `<span class="chip">${escapeHTML(family)}</span>` : ''}
        </div>
      </div>
    </div>

    <div class="pd-section">
      <h4>En un coup d'œil</h4>
      <div class="pd-rows">
        <div class="pd-row"><b>État</b><span class="v">${{healthy:'🌿 En forme', warn:'⚠️ À surveiller', urgent:'🚨 Intervention urgente'}[cell.status] || '—'}</span></div>
        <div class="pd-row"><b>Plantée</b><span class="v">${formatDate(cell.planted)} — il y a ${since} jour${since > 1 ? 's' : ''}</span></div>
        ${p ? `<div class="pd-row"><b>Rythme d'arrosage</b><span class="v">Tous les ${p.waterEvery} jours</span></div>` : ''}
        ${p ? `<div class="pd-row"><b>Récolte prévue</b><span class="v">${p.harvest}</span></div>` : ''}
        ${p ? `<div class="pd-row"><b>Espacement</b><span class="v">${p.space}</span></div>` : ''}
      </div>
    </div>

    ${tip ? `<div class="pd-section">
      <h4>Conseils</h4>
      <div class="card" style="background:var(--green-tint);border-color:transparent">
        <div class="small">💡 <b>Astuce :</b> ${escapeHTML(tip)}</div>
      </div>
      ${cell.notes ? `<div class="card mt-3"><div class="small"><b>Vos notes :</b> ${escapeHTML(cell.notes)}</div></div>` : ''}
    </div>` : ''}

    ${companions.length ? `<div class="pd-section">
      <h4>Bons voisinages</h4>
      <div class="row gap-2" style="flex-wrap:wrap">
        ${companions.map(c => `<span class="chip earth">🤝 ${escapeHTML(c)}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="pd-section">
      <h4>Historique</h4>
      <div class="pd-history">
        <div class="pd-event"><div class="pe-d">${formatDate(cell.planted)}</div><div class="pe-t">🌱 Plantée dans ${escapeHTML(bed.name)}</div></div>
        ${since > 7 ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(parseISO(cell.planted), 7)))}</div><div class="pe-t">💧 Premier arrosage hebdomadaire</div></div>` : ''}
        ${cell.status === 'urgent' ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(today, -1)))}</div><div class="pe-t">🐛 Ravageur repéré — traitement programmé</div></div>` : ''}
        ${cell.status === 'warn' ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(today, -2)))}</div><div class="pe-t">⚠️ Signes de stress — mise sous surveillance</div></div>` : ''}
      </div>
    </div>

    <div class="row gap-2 mt-4">
      <button class="btn" id="pd-water">💧 Marquer arrosée</button>
      <button class="btn danger" id="pd-remove">🗑️ Retirer</button>
    </div>
  `;

  document.getElementById('pd-water').onclick = () => { flash('Arrosée ✓'); closePanel(); };
  document.getElementById('pd-remove').onclick = () => {
    confirmDialog({
      title: `Retirer ${p ? p.name : 'cette plante'} ?`,
      msg: 'La plante sera retirée de cette cellule.',
      yesLabel: 'Oui, retirer',
      onYes: () => { bed.cells[idx] = null; saveState(); closePanel(); renderGarden(); }
    });
  };

  document.getElementById('plant-panel').classList.add('open');
  document.getElementById('panel-backdrop').classList.add('open');
}

function closePanel() {
  document.getElementById('plant-panel').classList.remove('open');
  document.getElementById('panel-backdrop').classList.remove('open');
}

function addBed() {
  openBedModal();
}

function openBedModal(bedId) {
  const bed = bedId ? state.beds.find(b => b.id === bedId) : null;
  document.getElementById('bed-modal-title').textContent = bed ? 'Modifier la parcelle' : 'Nouvelle parcelle';
  document.getElementById('bed-modal-name').value = bed ? bed.name : '';
  document.getElementById('bed-modal-cols').value = bed ? bed.cols : 4;
  document.getElementById('bed-modal-rows').value = bed ? bed.rows : 3;
  document.getElementById('bed-modal-save').onclick = () => saveBedModal(bedId);
  openModal('bed-modal-backdrop');
}

function saveBedModal(editId) {
  const name = document.getElementById('bed-modal-name').value.trim();
  if (!name) { flash('Donnez un nom à la parcelle'); return; }
  const cols = clampInt(document.getElementById('bed-modal-cols').value, 2, 10, 4);
  const rows = clampInt(document.getElementById('bed-modal-rows').value, 2, 10, 3);
  if (editId) {
    const bed = state.beds.find(b => b.id === editId);
    if (bed) { bed.name = name; bed.cols = cols; bed.rows = rows; while (bed.cells.length < cols*rows) bed.cells.push(null); bed.cells.length = cols*rows; }
  } else {
    const newBed = { id:'b'+Date.now(), name, cols, rows, cells: Array(cols*rows).fill(null) };
    state.beds.push(newBed);
    state.activeBedId = newBed.id;
  }
  saveState(); closeModal('bed-modal-backdrop'); renderGarden();
  flash(editId ? 'Parcelle modifiée ✓' : 'Parcelle créée ✓');
}

function deleteBed() {
  const bed = activeBed(); if (!bed) return;
  confirmDialog({
    title: `Supprimer « ${bed.name} » ?`,
    msg: `Les ${(bed.cells||[]).filter(Boolean).length} plantes seront retirées. Action irréversible.`,
    yesLabel: 'Oui, supprimer',
    onYes: () => {
      state.beds = state.beds.filter(b => b.id !== bed.id);
      state.activeBedId = state.beds[0] ? state.beds[0].id : null;
      saveState(); renderGarden();
    }
  });
}

/* ============================================================
   CATALOG
   ============================================================ */
let catalogFilter = { q:'', season:'all', difficulty:'all' };

function renderCatalog() {
  const f = document.getElementById('catalog-filters');
  const filters = [
    { k:'season', v:'all', label:'Toutes saisons' },
    { k:'season', v:'spring', label:'🌷 Printemps' },
    { k:'season', v:'summer', label:'☀️ Été' },
    { k:'season', v:'autumn', label:'🍂 Automne' },
    { k:'season', v:'winter', label:'❄️ Hiver' },
    { k:'difficulty', v:'all', label:'Tous niveaux' },
    { k:'difficulty', v:'1', label:'🟢 Facile' },
    { k:'difficulty', v:'2', label:'🟡 Moyen' },
    { k:'difficulty', v:'3', label:'🔴 Délicat' }
  ];
  f.innerHTML = filters.map(x => `<button class="filter-chip ${catalogFilter[x.k] === x.v ? 'active' : ''}" data-k="${x.k}" data-v="${x.v}">${x.label}</button>`).join('');
  f.querySelectorAll('.filter-chip').forEach(b => b.addEventListener('click', () => { catalogFilter[b.dataset.k] = b.dataset.v; renderCatalog(); }));

  const q = catalogFilter.q.trim().toLowerCase();
  const list = CATALOG.filter(p => {
    if (q && !p.name.toLowerCase().includes(q) && !(p.family||'').toLowerCase().includes(q)) return false;
    if (catalogFilter.season !== 'all' && !(p.season||[]).includes(catalogFilter.season)) return false;
    if (catalogFilter.difficulty !== 'all' && p.difficulty !== +catalogFilter.difficulty) return false;
    return true;
  });

  const grid = document.getElementById('catalog-grid');
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ei">🔍</div><h3>Aucune plante ne correspond</h3><p>Retirez un filtre ou essayez un autre mot-clé.</p><button class="btn primary" id="reset-catalog">Réinitialiser</button></div>`;
    document.getElementById('reset-catalog').addEventListener('click', () => { catalogFilter = { q:'', season:'all', difficulty:'all' }; document.getElementById('catalog-search').value = ''; renderCatalog(); });
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="plant-card">
      <div class="pc-head">
        <div class="pc-icon">${p.icon}</div>
        <div>
          <h3>${escapeHTML(p.name)}</h3>
          <div class="pc-sub">${escapeHTML(p.family||'')} • <em>${escapeHTML(p.sci||'')}</em></div>
          <div class="row gap-2 mt-2">
            <span class="difficulty" aria-label="Difficulté ${p.difficulty} sur 3">
              ${[1,2,3].map(n => `<span class="pip ${n <= p.difficulty ? 'on' : ''}"></span>`).join('')}
            </span>
            <span class="xsmall muted">${['Facile','Moyen','Délicat'][(p.difficulty||1)-1]}</span>
          </div>
        </div>
      </div>
      <div class="pc-rows">
        <div class="r"><b>Semer</b> ${escapeHTML(p.sow||'—')}</div>
        <div class="r"><b>Planter</b> ${escapeHTML(p.plant||'—')}</div>
        <div class="r"><b>Récolter</b> ${escapeHTML(p.harvest||'—')}</div>
        <div class="r"><b>Espacement</b> ${escapeHTML(p.space||'—')}</div>
      </div>
      <div class="pc-tags">
        ${(p.season||[]).map(s => `<span class="chip green">${seasonLabel(s)}</span>`).join('')}
        ${(p.companions||[]).length ? `<span class="chip earth">🤝 ${escapeHTML((p.companions||[]).slice(0,2).join(', '))}</span>` : ''}
      </div>
      <div class="pc-actions">
        <button class="btn primary" data-add="${p.id}">+ Ajouter à mon jardin</button>
      </div>
    </article>`).join('');

  grid.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => openAddToBedPicker(b.dataset.add)));
}

function openAddToBedPicker(plantId) {
  const p = plantById(plantId);
  document.getElementById('addbed-msg').textContent = `Où voulez-vous planter ${p ? p.icon + ' ' + p.name : plantId} ?`;
  const wrap = document.getElementById('addbed-grid');
  if (!state.beds.length) {
    wrap.innerHTML = `<div class="empty"><div class="ei">🪴</div><h3>Aucune parcelle</h3><p>Créez d'abord une parcelle dans Mon jardin.</p></div>`;
    openModal('addbed-backdrop'); return;
  }
  wrap.innerHTML = state.beds.map(b => {
    const cells = b.cells || [];
    const free = cells.filter(c => !c).length;
    return `<div class="card mb-2" style="padding:12px;cursor:pointer${free === 0 ? ';opacity:.5;pointer-events:none' : ''}" data-bed="${b.id}">
      <div class="row between">
        <div><div style="font-weight:800">🌿 ${escapeHTML(b.name)}</div><div class="xsmall muted">${cells.filter(Boolean).length}/${(b.cols||4)*(b.rows||3)} plantées • ${free} libre${free>1?'s':''}</div></div>
        ${free > 0 ? '<div class="btn primary sm">Planter ici →</div>' : '<div class="xsmall muted">Plein</div>'}
      </div>
    </div>`;
  }).join('');
  wrap.querySelectorAll('[data-bed]').forEach(node => {
    node.addEventListener('click', () => {
      const bed = state.beds.find(b => b.id === node.dataset.bed);
      const emptyIdx = (bed.cells || []).findIndex(c => !c);
      if (emptyIdx === -1) { flash('Parcelle pleine.'); return; }
      bed.cells[emptyIdx] = { id:'c'+Date.now(), plant: plantId, planted: iso(new Date()), status:'healthy', notes:'' };
      saveState();
      closeModal('addbed-backdrop');
      flash(`${p ? p.name : plantId} ajoutée dans ${bed.name} ✓`);
      state.activeBedId = bed.id;
      setView('garden');
    });
  });
  openModal('addbed-backdrop');
}

/* ============================================================
   CALENDAR
   ============================================================ */
let calMonth = new Date(); calMonth.setDate(1);
let calFilter = 'all';

function renderCalendar() {
  document.getElementById('cal-month').textContent = calMonth.toLocaleDateString('fr-FR', { month:'long', year:'numeric' });
  document.querySelectorAll('#cal-filters .filter-chip').forEach(b => b.classList.toggle('active', b.dataset.cf === calFilter));

  const grid = document.getElementById('cal-grid');
  const dows = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const today = new Date();
  let html = dows.map(d => `<div class="cal-dow">${d}</div>`).join('');
  const first = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth()+1, 0).getDate();

  for (let i = 0; i < startOffset; i++) html += `<div class="cal-day off"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dd = new Date(calMonth.getFullYear(), calMonth.getMonth(), d);
    const dStr = iso(dd);
    const tasks = state.tasks.filter(t => t.date === dStr && (calFilter === 'all' || t.kind === calFilter));
    const kinds = new Set(tasks.map(t => t.kind));
    const dots = ['water','sow','harvest','treat'].filter(k => kinds.has(k)).map(k => `<span class="d-dot ${k}"></span>`).join('');
    const isToday = iso(dd) === iso(today);
    html += `<button class="cal-day ${isToday ? 'today' : ''}" data-d="${dStr}"><div>${d}</div><div class="dots">${dots}</div></button>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll('[data-d]').forEach(node => {
    node.addEventListener('click', () => {
      const date = node.dataset.d;
      const tasks = state.tasks.filter(t => t.date === date && (calFilter === 'all' || t.kind === calFilter));
      if (!tasks.length) { flash(`Aucune tâche le ${formatDate(date)}`); return; }
      showDayTasks(date, tasks);
    });
  });
}

function showDayTasks(date, tasks) {
  document.getElementById('pd-bed-name').textContent = formatDate(date);
  document.getElementById('pd-status').className = 'dot healthy';
  document.getElementById('panel-body').innerHTML = `<h2 class="mb-4">${tasks.length} tâche${tasks.length > 1 ? 's' : ''} ce jour-là</h2>${tasks.map(t => taskHTML(t)).join('')}`;
  bindTaskCheckboxes(document.getElementById('panel-body'));
  document.getElementById('plant-panel').classList.add('open');
  document.getElementById('panel-backdrop').classList.add('open');
}

/* ============================================================
   JOURNAL
   ============================================================ */
let journalFilter = 'all';

function renderJournal() {
  document.querySelectorAll('#journal-filters .filter-chip').forEach(b => b.classList.toggle('active', b.dataset.jf === journalFilter));
  const list = (state.journal || []).filter(j => journalFilter === 'all' || (j.tags||[]).includes(journalFilter)).sort((a,b) => b.date.localeCompare(a.date));
  const el = document.getElementById('journal-list');
  if (!list.length) {
    el.innerHTML = `<div class="empty"><div class="ei">📓</div><h3>Aucune note pour le moment</h3><p>Capturez observations et récoltes — votre futur vous remerciera.</p><button class="btn primary" id="empty-new-note">+ Écrire la première note</button></div>`;
    document.getElementById('empty-new-note').addEventListener('click', () => openQuickAdd('note'));
    return;
  }
  el.innerHTML = list.map(j => `
    <article class="journal-entry" data-j="${j.id}">
      <div class="je-img" ${j.photo ? `style="background-image:url('${j.photo}')"` : ''}>${j.photo ? '' : (j.icon||'🌿')}</div>
      <div class="je-body">
        <div class="je-meta"><span style="font-weight:800;color:var(--ink)">${formatDate(j.date)}</span><span>•</span><span>${escapeHTML(j.subject||'')}</span></div>
        <div class="je-text">${escapeHTML(j.text||'')}</div>
        <div class="je-tags">
          ${(j.tags||[]).map(t => `<span class="tag ${t}">#${t}</span>`).join('')}
          <button class="btn ghost sm" data-add-photo="${j.id}">📷</button>
          <button class="btn ghost sm danger" data-del="${j.id}">Supprimer</button>
        </div>
      </div>
    </article>`).join('');

  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const id = b.dataset.del;
    const j = (state.journal||[]).find(j => j.id === id);
    confirmDialog({ title:'Supprimer cette note ?', msg:'Action irréversible.', yesLabel:'Oui, supprimer', onYes: () => { state.journal = (state.journal||[]).filter(j => j.id !== id); saveState(); renderJournal(); } });
  }));
  el.querySelectorAll('[data-add-photo]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.addPhoto;
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0]; if (!file) return;
      const r = new FileReader(); r.onload = () => { const j = (state.journal||[]).find(j => j.id === id); if (j) { j.photo = r.result; saveState(); renderJournal(); flash('Photo ajoutée ✓'); } }; r.readAsDataURL(file);
    };
    input.click();
  }));
}

/* ============================================================
   REMINDERS
   ============================================================ */
function renderReminders() {
  const wrap = document.getElementById('push-prompt-wrap');
  if (!state.prefs.pushAsked) {
    wrap.innerHTML = `<div class="push-prompt"><span class="pi">🔔</span><div class="pb"><div class="pt">Activer les notifications push</div><div class="small">Alertes gel, ravageurs et résumé quotidien — ne ratez aucun moment clé.</div></div><button class="btn primary sm" id="push-enable">Activer</button><button class="btn ghost sm" id="push-skip">Plus tard</button></div>`;
    document.getElementById('push-enable').onclick = () => { state.prefs.pushAsked = true; state.prefs.pushOn = true; saveState(); flash('Notifications activées ✓'); renderReminders(); };
    document.getElementById('push-skip').onclick = () => { state.prefs.pushAsked = true; saveState(); renderReminders(); };
  } else wrap.innerHTML = '';

  const list = document.getElementById('reminders-list');
  if (!(state.reminders||[]).length) {
    list.innerHTML = `<div class="empty"><div class="ei">⏰</div><h3>Aucun rappel</h3><p>Créez votre premier rappel récurrent.</p><button class="btn primary" id="empty-rem">+ Nouveau rappel</button></div>`;
    document.getElementById('empty-rem').onclick = openReminderModal;
    return;
  }
  list.innerHTML = (state.reminders||[]).map(r => `
    <div class="reminder">
      <div class="ri">${r.icon}</div>
      <div class="rb"><div class="rt">${escapeHTML(r.title)}</div><div class="rs">${escapeHTML(r.schedule)}</div></div>
      <button class="btn ghost sm danger" data-rdel="${r.id}" aria-label="Supprimer">🗑️</button>
      <div class="toggle ${r.on ? 'on' : ''}" data-rid="${r.id}" role="switch" aria-checked="${r.on}" tabindex="0"></div>
    </div>`).join('');

  list.querySelectorAll('[data-rid]').forEach(node => {
    node.addEventListener('click', () => { const r = (state.reminders||[]).find(r => r.id === node.dataset.rid); if (r) { r.on = !r.on; node.classList.toggle('on', r.on); node.setAttribute('aria-checked', r.on); saveState(); } });
    node.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); node.click(); } });
  });
  list.querySelectorAll('[data-rdel]').forEach(node => {
    node.addEventListener('click', () => {
      const id = node.dataset.rdel;
      const r = (state.reminders||[]).find(r => r.id === id);
      confirmDialog({ title:`Supprimer « ${r ? r.title : '?' } » ?`, msg:'Ce rappel cessera immédiatement.', yesLabel:'Oui, supprimer', onYes: () => { state.reminders = (state.reminders||[]).filter(r => r.id !== id); saveState(); renderReminders(); } });
    });
  });

  document.querySelectorAll('[data-pref]').forEach(node => {
    node.classList.toggle('on', !!(state.prefs||{})[node.dataset.pref]);
    node.onclick = () => { const k = node.dataset.pref; if (!state.prefs) state.prefs = {}; state.prefs[k] = !state.prefs[k]; node.classList.toggle('on', state.prefs[k]); saveState(); };
  });
}

function openReminderModal() { openModal('reminder-modal-backdrop'); }

function saveReminder() {
  const title = document.getElementById('reminder-title').value.trim();
  if (!title) { flash('Donnez un titre au rappel'); return; }
  const schedule = document.getElementById('reminder-freq').value;
  const icon = document.getElementById('reminder-icon').value;
  state.reminders = state.reminders || [];
  state.reminders.push({ id:'r'+Date.now(), title, schedule, icon, on:true });
  saveState(); closeModal('reminder-modal-backdrop'); renderReminders(); flash('Rappel créé ✓');
}

/* ============================================================
   QUICK ADD
   ============================================================ */
let draftTimer = null;

function openQuickAdd(type = 'task') {
  type = type || 'task';
  const draft = state.draft;
  if (draft) {
    document.getElementById('qa-draft').style.display = 'inline-flex';
    Object.entries(draft.fields||{}).forEach(([k,v]) => { const el = document.querySelector(`[data-draft="${k}"]`); if (el) el.value = v; });
    type = draft.type || type;
  } else {
    document.getElementById('qa-draft').style.display = 'none';
  }
  const dtEl = document.querySelector('[data-draft="task-date"]');
  if (dtEl && !dtEl.value) dtEl.value = iso(new Date());
  const pdEl = document.querySelector('[data-draft="plant-date"]');
  if (pdEl && !pdEl.value) pdEl.value = iso(new Date());

  const psel = document.getElementById('qa-plant-select');
  psel.innerHTML = CATALOG.map(p => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('');
  const bsel = document.getElementById('qa-bed-select');
  bsel.innerHTML = (state.beds||[]).length ? (state.beds||[]).map(b => `<option value="${b.id}">${escapeHTML(b.name)}</option>`).join('') : '<option value="">Aucune parcelle</option>';

  const nsel = document.getElementById('qa-note-subject');
  nsel.innerHTML = '<option value="">Général</option>' + (state.beds||[]).flatMap(b => (b.cells||[]).filter(Boolean).map(c => { const p = plantById(c.plant); return `<option value="${b.name}: ${p ? p.name : c.plant}">${p ? p.icon : ''} ${b.name}: ${p ? p.name : c.plant}</option>`; })).join('');

  setQAType(type);
  openModal('quickadd-backdrop');
}

function setQAType(type) {
  document.querySelectorAll('[data-qa]').forEach(b => b.classList.toggle('active', b.dataset.qa === type));
  document.querySelectorAll('[data-qa-form]').forEach(f => f.style.display = f.dataset.qaForm === type ? '' : 'none');
}

function saveQuickAdd() {
  const activeTab = document.querySelector('[data-qa].active');
  if (!activeTab) return;
  const type = activeTab.dataset.qa;
  if (type === 'task') {
    const title = (document.querySelector('[data-draft="task-title"]').value || '').trim();
    if (!title) { flash("Donnez d'abord un nom à la tâche"); return; }
    const kind = document.querySelector('[data-draft="task-kind"]').value;
    const date = document.querySelector('[data-draft="task-date"]').value || iso(new Date());
    state.tasks = state.tasks || [];
    state.tasks.push({ id:'t'+Date.now(), title, kind, date, done:false, plantId:null });
    flash('Tâche ajoutée ✓');
  } else if (type === 'plant') {
    const plantId = document.querySelector('[data-draft="plant-id"]').value;
    const bedId = document.querySelector('[data-draft="plant-bed"]').value;
    const planted = document.querySelector('[data-draft="plant-date"]').value || iso(new Date());
    const bed = (state.beds||[]).find(b => b.id === bedId);
    if (!bed) { flash('Choisissez une parcelle'); return; }
    const emptyIdx = (bed.cells||[]).findIndex(c => !c);
    if (emptyIdx === -1) { flash('Parcelle pleine.'); return; }
    bed.cells[emptyIdx] = { id:'c'+Date.now(), plant: plantId, planted, status:'healthy', notes:'' };
    flash(`${plantById(plantId)?.name || plantId} ajoutée ✓`);
  } else if (type === 'note') {
    const text = (document.querySelector('[data-draft="note-text"]').value || '').trim();
    if (!text) { flash("Écrivez une note d'abord"); return; }
    const tag = document.querySelector('[data-draft="note-tag"]').value;
    const subject = document.querySelector('[data-draft="note-subject"]').value || 'Général';
    state.journal = state.journal || [];
    state.journal.push({ id:'j'+Date.now(), date: iso(new Date()), subject, icon:'🌿', text, tags: tag ? [tag] : [] });
    flash('Note enregistrée ✓');
  }
  state.draft = null; saveState();
  document.querySelectorAll('[data-draft]').forEach(el => { if (el.type !== 'date' && el.tagName !== 'SELECT') el.value = ''; });
  closeModal('quickadd-backdrop');
  const active = document.querySelector('.view.active');
  if (active) setView(active.dataset.view);
}

/* ============================================================
   ONBOARDING
   ============================================================ */
let onbStep = 1;
function renderOnb() {
  document.querySelectorAll('.onb-step').forEach(s => s.classList.toggle('active', +s.dataset.step === onbStep));
  document.querySelectorAll('.onb-progress .pp').forEach((p, i) => p.classList.toggle('on', i < onbStep));
}

/* ============================================================
   CONFIRM DIALOG
   ============================================================ */
let confirmCb = null;
function confirmDialog({ title, msg, yesLabel = 'Oui, supprimer', onYes }) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-yes').textContent = yesLabel;
  confirmCb = onYes;
  openModal('confirm-backdrop');
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

/* ============================================================
   UTILITIES
   ============================================================ */
function iso(d) { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function parseISO(s) { if (!s) return new Date(); const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
function formatDate(s) { try { return parseISO(s).toLocaleDateString('fr-FR', { month:'short', day:'numeric', year:'numeric' }); } catch { return s||'—'; } }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function clampInt(v, min, max, def) { const n = parseInt(v,10); if (isNaN(n)) return def; return Math.max(min, Math.min(max, n)); }
function escapeHTML(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function capitalize(s) { return (s||'').charAt(0).toUpperCase() + (s||'').slice(1); }
function seasonLabel(s) { return ({spring:'Printemps', summer:'Été', autumn:'Automne', winter:'Hiver'})[s] || capitalize(s); }

function flash(msg) {
  let el = document.getElementById('_toast');
  if (!el) {
    el = document.createElement('div'); el.id = '_toast';
    el.style.cssText = 'position:fixed;left:50%;bottom:calc(var(--bottom-h) + 24px + env(safe-area-inset-bottom));transform:translate(-50%,20px);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:var(--shadow-lg);opacity:0;transition:transform .25s,opacity .25s;z-index:300;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translate(-50%,0)'; });
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%,20px)'; }, 2400);
}

/* ============================================================
   ACCOUNT MODAL
   ============================================================ */
function openAccountModal() {
  updateAccountUI();
  openModal('acc-backdrop');
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  // Wire all nav
  document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => setView(b.dataset.nav)));

  // Wire topbar buttons
  document.getElementById('topbar-search').addEventListener('click', () => setView('catalog'));
  document.getElementById('topbar-bell').addEventListener('click', () => setView('reminders'));
  document.getElementById('topbar-account').addEventListener('click', openAccountModal);
  document.getElementById('account-chip-desktop').addEventListener('click', openAccountModal);

  // Panel
  document.getElementById('panel-close').addEventListener('click', closePanel);
  document.getElementById('panel-backdrop').addEventListener('click', closePanel);

  // Calendar nav
  document.getElementById('cal-prev').addEventListener('click', () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth()-1, 1); renderCalendar(); });
  document.getElementById('cal-next').addEventListener('click', () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth()+1, 1); renderCalendar(); });
  document.getElementById('cal-today').addEventListener('click', () => { calMonth = new Date(); calMonth.setDate(1); renderCalendar(); });
  document.querySelectorAll('#cal-filters .filter-chip').forEach(b => b.addEventListener('click', () => { calFilter = b.dataset.cf; renderCalendar(); }));

  // Calendar swipe
  let calTouchX = null;
  document.getElementById('cal-grid').addEventListener('touchstart', e => { calTouchX = e.touches[0].clientX; }, { passive:true });
  document.getElementById('cal-grid').addEventListener('touchend', e => {
    if (calTouchX === null) return;
    const dx = e.changedTouches[0].clientX - calTouchX;
    if (Math.abs(dx) > 60) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + (dx<0?1:-1), 1); renderCalendar(); }
    calTouchX = null;
  }, { passive:true });

  // Panel swipe to close
  let panelTY = 0;
  document.getElementById('plant-panel').addEventListener('touchstart', e => { panelTY = e.touches[0].clientY; }, { passive:true });
  document.getElementById('plant-panel').addEventListener('touchend', e => { if (e.changedTouches[0].clientY - panelTY > 80) closePanel(); }, { passive:true });

  // FAB
  document.getElementById('fab').addEventListener('click', () => openQuickAdd('task'));

  // Quick add
  document.getElementById('qa-close').addEventListener('click', () => closeModal('quickadd-backdrop'));
  document.getElementById('qa-cancel').addEventListener('click', () => closeModal('quickadd-backdrop'));
  document.getElementById('qa-save').addEventListener('click', saveQuickAdd);
  document.querySelectorAll('[data-qa]').forEach(b => b.addEventListener('click', () => setQAType(b.dataset.qa)));
  document.getElementById('qa-clear-draft').addEventListener('click', () => {
    state.draft = null; saveState();
    document.querySelectorAll('[data-draft]').forEach(el => { if (el.type !== 'date' && el.tagName !== 'SELECT') el.value = ''; });
    document.getElementById('qa-draft').style.display = 'none';
    flash('Brouillon effacé');
  });

  // Auto-save draft
  document.querySelectorAll('[data-draft]').forEach(el => {
    el.addEventListener('input', () => {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => {
        const activeTab = document.querySelector('[data-qa].active');
        if (!activeTab) return;
        const type = activeTab.dataset.qa;
        const fields = {};
        document.querySelectorAll(`[data-qa-form="${type}"] [data-draft]`).forEach(n => { fields[n.dataset.draft] = n.value; });
        state.draft = { type, fields, ts: Date.now() };
        saveState();
        document.getElementById('qa-draft').style.display = 'inline-flex';
      }, 400);
    });
  });

  // Journal
  document.getElementById('new-note-btn').addEventListener('click', () => openQuickAdd('note'));
  document.querySelectorAll('#journal-filters .filter-chip').forEach(b => b.addEventListener('click', () => { journalFilter = b.dataset.jf; renderJournal(); }));

  // Reminders
  document.getElementById('new-reminder-btn').addEventListener('click', openReminderModal);
  document.getElementById('reminder-modal-close').addEventListener('click', () => closeModal('reminder-modal-backdrop'));
  document.getElementById('reminder-modal-cancel').addEventListener('click', () => closeModal('reminder-modal-backdrop'));
  document.getElementById('reminder-modal-save').addEventListener('click', saveReminder);

  // Garden
  document.getElementById('rename-bed').addEventListener('click', () => { const bed = activeBed(); if (bed) openBedModal(bed.id); });
  document.getElementById('delete-bed').addEventListener('click', deleteBed);
  document.getElementById('add-bed-btn').addEventListener('click', addBed);
  document.getElementById('empty-add-bed-btn').addEventListener('click', addBed);

  // Bed modal
  document.getElementById('bed-modal-close').addEventListener('click', () => closeModal('bed-modal-backdrop'));
  document.getElementById('bed-modal-cancel').addEventListener('click', () => closeModal('bed-modal-backdrop'));

  // Addbed backdrop
  document.getElementById('addbed-close').addEventListener('click', () => closeModal('addbed-backdrop'));

  // Catalog
  document.getElementById('catalog-search').addEventListener('input', e => { catalogFilter.q = e.target.value; renderCatalog(); });

  // Confirm
  document.querySelectorAll('[data-confirm-no]').forEach(b => b.addEventListener('click', () => { confirmCb = null; closeModal('confirm-backdrop'); }));
  document.getElementById('confirm-yes').addEventListener('click', () => { const cb = confirmCb; confirmCb = null; closeModal('confirm-backdrop'); if (cb) cb(); });

  // Auth
  document.getElementById('google-signin').addEventListener('click', handleGoogleSignIn);
  document.getElementById('auth-skip').addEventListener('click', handleLocalMode);

  // Account modal
  document.getElementById('acc-close').addEventListener('click', () => closeModal('acc-backdrop'));
  document.getElementById('acc-signout').addEventListener('click', () => {
    confirmDialog({ title:'Se déconnecter ?', msg:'Vos données locales seront conservées.', yesLabel:'Se déconnecter', onYes: () => {
      if (isFirebaseConfigured()) { try { firebase.auth().signOut(); } catch {} }
      currentUser = null; isLocalMode = false;
      closeModal('acc-backdrop');
      openModal('auth-backdrop');
    }});
  });
  document.getElementById('acc-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'potager-export.json'; a.click();
    flash('Export téléchargé ✓');
  });

  // Click-outside to close modals
  document.querySelectorAll('.modal-backdrop').forEach(bd => bd.addEventListener('click', e => { if (e.target === bd) { bd.classList.remove('open'); document.body.style.overflow = ''; } }));

  // ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => { m.classList.remove('open'); document.body.style.overflow = ''; });
      closePanel();
    }
  });

  // Onboarding
  document.querySelectorAll('[data-onb-next]').forEach(b => b.addEventListener('click', () => { onbStep = Math.min(3, onbStep+1); renderOnb(); }));
  document.querySelectorAll('[data-onb-prev]').forEach(b => b.addEventListener('click', () => { onbStep = Math.max(1, onbStep-1); renderOnb(); }));
  document.querySelectorAll('[data-onb-done]').forEach(b => b.addEventListener('click', () => {
    const name = (document.getElementById('onb-bed-name').value||'').trim() || 'Parcelle du jardin';
    const cols = clampInt(document.getElementById('onb-cols').value, 2, 8, 4);
    const rows = clampInt(document.getElementById('onb-rows').value, 2, 8, 3);
    if (state.beds.length) { state.beds[0].name = name; state.beds[0].cols = cols; state.beds[0].rows = rows; while (state.beds[0].cells.length < cols*rows) state.beds[0].cells.push(null); state.beds[0].cells.length = cols*rows; }
    state.onboarded = true; saveState(); closeModal('onb-backdrop'); setView('garden');
  }));

  // Render initial view
  renderDashboard();
  renderGarden();

  // Onboarding check
  if (!state.onboarded) { onbStep = 1; renderOnb(); openModal('onb-backdrop'); }
}

/* ============================================================
   INIT — Firebase auth or direct boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Check Firebase
  if (!isFirebaseConfigured()) {
    document.getElementById('auth-firebase-warning').style.display = 'flex';
  }

  // Try Firebase auth
  if (isFirebaseConfigured()) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        enterApp();
      } else {
        // Show auth modal
        openModal('auth-backdrop');
      }
    });
  } else {
    // No Firebase — show auth modal with local option
    openModal('auth-backdrop');
  }
});
