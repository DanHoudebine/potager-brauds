'use strict';

/* ============================================================
   CATALOG
   ============================================================ */
const CATALOG = [
  // ── Légumes & Potager ─────────────────────────────────────────
  { id:'tomato',          name:'Tomate',            sci:'Solanum lycopersicum',          icon:'🍅', category:'legume',         family:'Solanacées',     season:['spring','summer'],          difficulty:2, sow:'mars–avr',  plant:'mai',      harvest:'juil–sept', space:'60 cm',  companions:['Basilic','Carotte','Oignon'],         waterEvery:2,  tip:'Pincez les gourmands chaque semaine. Tuteurez tôt.',                   varieties:['Cerise','Cœur de bœuf','Roma','Beefsteak','Noire de Crimée','Marmande'] },
  { id:'basil',           name:'Basilic',            sci:'Ocimum basilicum',              icon:'🌿', category:'herbe',          family:'Lamiacées',      season:['spring','summer'],          difficulty:1, sow:'avr',       plant:'mai–juin', harvest:'juil–sept', space:'25 cm',  companions:['Tomate','Poivron'],                   waterEvery:2,  tip:'Aime la chaleur. Pincez les fleurs pour relancer les feuilles.',       varieties:['Grand vert','Pourpre','Citron','Thaï','Nain fin vert'] },
  { id:'lettuce',         name:'Laitue',             sci:'Lactuca sativa',                icon:'🥬', category:'legume',         family:'Astéracées',     season:['spring','autumn'],          difficulty:1, sow:'mars–sept', plant:'avr–sept', harvest:'mai–oct',   space:'25 cm',  companions:['Carotte','Radis','Fraisier'],          waterEvery:2,  tip:'Semez toutes les 3 semaines pour une récolte continue.',              varieties:['Batavia','Feuille de chêne','Romaine','Butterhead','Lollo Rossa'] },
  { id:'carrot',          name:'Carotte',            sci:'Daucus carota',                 icon:'🥕', category:'legume',         family:'Apiacées',       season:['spring','autumn'],          difficulty:2, sow:'mars–juil', plant:'—',        harvest:'juil–nov',  space:'5 cm',   companions:['Oignon','Laitue','Tomate'],            waterEvery:3,  tip:'Éclaircissez à 5 cm dès que les plants font 5 cm.',                   varieties:['Nantaise','Chantenay','Baby','Purple Haze','Touchon'] },
  { id:'zucchini',        name:'Courgette',          sci:'Cucurbita pepo',                icon:'🥒', category:'legume',         family:'Cucurbitacées',  season:['summer'],                   difficulty:1, sow:'avr',       plant:'mai–juin', harvest:'juil–oct',  space:'90 cm',  companions:['Capucine','Maïs'],                    waterEvery:2,  tip:'Récoltez petit pour une chair tendre et plus de fleurs.',             varieties:['Black Beauty','Ronde de Nice','Striée d\'Italie','Gold Rush'] },
  { id:'leek',            name:'Poireau',            sci:'Allium ampeloprasum',           icon:'🧅', category:'legume',         family:'Amaryllidacées', season:['spring','autumn','winter'], difficulty:3, sow:'fév–avr',   plant:'mai–juil', harvest:'oct–mars',  space:'15 cm',  companions:['Carotte','Céleri'],                    waterEvery:4,  tip:'Buttez la terre autour des pieds pour des fûts blancs.',              varieties:['Bleu de Solaise','Monstrueux de Carentan','Saint Victor'] },
  { id:'strawberry',      name:'Fraisier',           sci:'Fragaria × ananassa',          icon:'🍓', category:'fruit',          family:'Rosacées',       season:['spring','summer'],          difficulty:2, sow:'—',         plant:'mars–mai', harvest:'mai–juil',  space:'30 cm',  companions:['Laitue','Épinard','Bourrache'],        waterEvery:2,  tip:'Paillez avec de la paille pour des fruits propres.',                  varieties:['Gariguette','Mara des Bois','Charlotte','Ciflorette','Fraises des bois'] },
  { id:'radish',          name:'Radis',              sci:'Raphanus sativus',              icon:'🟠', category:'legume',         family:'Brassicacées',   season:['spring','autumn'],          difficulty:1, sow:'mars–sept', plant:'—',        harvest:'30 jours',  space:'5 cm',   companions:['Laitue','Carotte','Petit pois'],       waterEvery:2,  tip:'La culture la plus rapide. Ne les laissez pas devenir creux.',        varieties:['Rond rouge écarlate','Flambeau','Long de 18 jours','D\'été blanc'] },
  { id:'pepper',          name:'Poivron',            sci:'Capsicum annuum',               icon:'🌶️', category:'legume',         family:'Solanacées',     season:['summer'],                   difficulty:3, sow:'fév–mars',  plant:'mai–juin', harvest:'juil–oct',  space:'45 cm',  companions:['Basilic','Tomate'],                    waterEvery:2,  tip:'Aime la chaleur. Ne plantez pas avant des nuits >12°.',               varieties:['Lamuyo','California Wonder','Doux d\'Espagne','Corno di Toro'] },
  { id:'eggplant',        name:'Aubergine',          sci:'Solanum melongena',             icon:'🍆', category:'legume',         family:'Solanacées',     season:['summer'],                   difficulty:3, sow:'fév–mars',  plant:'mai–juin', harvest:'août–oct',  space:'60 cm',  companions:['Basilic','Poivron'],                   waterEvery:2,  tip:'Pincez la tête à 30 cm pour favoriser la ramification.',             varieties:['Barbentane','Violette de Florence','Blanche de Vernou'] },
  { id:'pea',             name:'Petit pois',         sci:'Pisum sativum',                 icon:'🟢', category:'legume',         family:'Fabacées',       season:['spring'],                   difficulty:1, sow:'fév–avr',   plant:'—',        harvest:'mai–juil',  space:'10 cm',  companions:['Carotte','Radis'],                     waterEvery:3,  tip:"Installez un treillis tôt ; les vrilles ont besoin de s'accrocher.",  varieties:['Merveille de Kelvedon','Maestro','Douce Provence','Mangetout Norli'] },
  { id:'pumpkin',         name:'Citrouille',         sci:'Cucurbita pepo',                icon:'🎃', category:'legume',         family:'Cucurbitacées',  season:['summer','autumn'],          difficulty:2, sow:'avr',       plant:'mai–juin', harvest:'sept–oct',  space:'120 cm', companions:['Maïs','Haricot'],                     waterEvery:3,  tip:'Donnez-leur de la place — les tiges courent sur 3 m+.',               varieties:['Lumina (blanche)','Rouge vif d\'Étampes','Jack-o\'-lantern'] },
  // ── Nouvelles cultures maraîchères ────────────────────────────
  { id:'squash-spaghetti',name:'Courge spaghetti',   sci:'Cucurbita pepo',                icon:'🌕', category:'legume',         family:'Cucurbitacées',  season:['summer','autumn'],          difficulty:1, sow:'avr–mai',   plant:'mai–juin', harvest:'sept–oct',  space:'100 cm', companions:['Maïs','Haricot'],                     waterEvery:3,  tip:"Laissez mûrir jusqu'à ce que la peau soit dorée et dure avant de récolter.",  varieties:['Tivoli'] },
  { id:'butternut',       name:'Courge butternut',   sci:'Cucurbita moschata',            icon:'🟤', category:'legume',         family:'Cucurbitacées',  season:['summer','autumn'],          difficulty:1, sow:'avr–mai',   plant:'mai–juin', harvest:'sept–oct',  space:'100 cm', companions:['Maïs','Capucine'],                    waterEvery:3,  tip:'Récoltez quand le pédoncule commence à se liéger et à sécher.',               varieties:['Waltham','Hunter','Solo'] },
  { id:'pumpkin-marron',  name:'Courge petit marron',sci:'Cucurbita maxima',              icon:'🌰', category:'legume',         family:'Cucurbitacées',  season:['summer','autumn'],          difficulty:2, sow:'avr–mai',   plant:'mai–juin', harvest:'sept–oct',  space:'100 cm', companions:['Maïs','Haricot'],                     waterEvery:3,  tip:'Excellente courge de conservation. Gardez au frais et au sec après récolte.',  varieties:['Uchiki Kuri','Delicata'] },
  { id:'chili',           name:'Piment',             sci:'Capsicum frutescens',           icon:'🌶️', category:'legume',         family:'Solanacées',     season:['summer'],                   difficulty:2, sow:'fév–mars',  plant:'mai–juin', harvest:'juil–oct',  space:'40 cm',  companions:['Tomate','Basilic'],                    waterEvery:2,  tip:'Plus le sol est sec et stressé, plus le piment sera fort.',                   varieties:['Jalapeño','Cayenne','Bird\'s Eye','Habanero','Anaheim'] },
  { id:'sweet-potato',    name:'Patate douce',       sci:'Ipomoea batatas',               icon:'🍠', category:'legume',         family:'Convolvulacées', season:['summer'],                   difficulty:3, sow:'—',         plant:'mai–juin', harvest:'sept–oct',  space:'40 cm',  companions:['Courge','Maïs'],                       waterEvery:3,  tip:'Plantez en butées en sol léger et chaud. Récoltez avant les premiers gels.',   varieties:['Beauregard','O\'Henry','Violette d\'Okinawa'] },
  { id:'gherkin',         name:'Cornichon',          sci:'Cucumis sativus',               icon:'🥒', category:'legume',         family:'Cucurbitacées',  season:['summer'],                   difficulty:1, sow:'mai',       plant:'mai–juin', harvest:'juil–sept', space:'50 cm',  companions:['Haricot','Radis','Laitue'],            waterEvery:2,  tip:'Récoltez souvent à 5–7 cm de long pour maintenir la production.',             varieties:['Vert Petit de Paris','National Pickling'] },
  { id:'red-cabbage',     name:'Chou rouge',         sci:'Brassica oleracea capitata',    icon:'🔴', category:'legume',         family:'Brassicacées',   season:['spring','autumn'],          difficulty:2, sow:'mars–avr',  plant:'mai–juin', harvest:'août–nov',  space:'50 cm',  companions:['Aneth','Camomille'],                   waterEvery:3,  tip:'Se conserve plusieurs mois en cave. Surveiller la piéride du chou.',          varieties:['Red Acre','Kalibos'] },
  { id:'cabbage',         name:'Chou pommé',         sci:'Brassica oleracea capitata',    icon:'🥬', category:'legume',         family:'Brassicacées',   season:['spring','autumn','winter'], difficulty:2, sow:'mars–avr',  plant:'mai–juil', harvest:'sept–mars', space:'50 cm',  companions:['Aneth','Céleri'],                      waterEvery:3,  tip:'Binez souvent et buttez les pieds pour une bonne tenue des pommes.',          varieties:['Quintal d\'Alsace','Cabus','Pixie'] },
  { id:'beans',           name:'Haricots',           sci:'Phaseolus vulgaris',            icon:'🫘', category:'legume',         family:'Fabacées',       season:['summer'],                   difficulty:1, sow:'mai–juin',  plant:'—',        harvest:'juil–sept', space:'15 cm',  companions:['Maïs','Courge','Carotte'],             waterEvery:2,  tip:"N'arrosez pas les fleurs pour éviter la chute. Récoltez régulièrement.",      varieties:['Contender','Borlotti','Mangetout','Nain beurre'] },
  { id:'watermelon',      name:'Pastèque',           sci:'Citrullus lanatus',             icon:'🍉', category:'fruit',          family:'Cucurbitacées',  season:['summer'],                   difficulty:3, sow:'avr–mai',   plant:'mai–juin', harvest:'août–sept', space:'150 cm', companions:['Radis','Laitue'],                     waterEvery:3,  tip:"Sol chaud et bien drainé. Tapez le fruit : un son creux indique la maturité.", varieties:['Sugar Baby','Charleston Gray','Crimson Sweet'] },
  { id:'melon',           name:'Melon',              sci:'Cucumis melo',                  icon:'🍈', category:'fruit',          family:'Cucurbitacées',  season:['summer'],                   difficulty:3, sow:'avr',       plant:'mai–juin', harvest:'juil–sept', space:'100 cm', companions:['Radis','Maïs'],                       waterEvery:2,  tip:"Pincez la tige principale après la 4ᵉ feuille. Réduisez l'arrosage à maturité.", varieties:['Charentais','Cavaillon','Cantaloup','Galia'] },
  // ── Arbres fruitiers ──────────────────────────────────────────
  { id:'mirabelle',       name:'Mirabelle',          sci:'Prunus domestica syriaca',      icon:'🟡', category:'arbre-fruitier', family:'Rosacées',       season:['summer'],                   difficulty:1, sow:'—',         plant:'nov–mars', harvest:'juil–août', space:'4 m',    companions:['Reine Claude','Prunellier'],           waterEvery:7,  tip:'Taille en gobelet. Récolte à la main dès que les fruits se détachent facilement.', varieties:['De Nancy','De Metz'] },
  { id:'reine-claude',    name:'Reine Claude',       sci:'Prunus domestica',              icon:'🍏', category:'arbre-fruitier', family:'Rosacées',       season:['summer'],                   difficulty:2, sow:'—',         plant:'nov–mars', harvest:'août–sept', space:'5 m',    companions:['Mirabelle','Prunellier'],              waterEvery:7,  tip:'Préfère un sol profond et bien drainé. Taille minimale pour conserver la saveur.', varieties:['Verte','Dorée','Bavay'] },
  { id:'quetsche',        name:'Quetsche (Coutch)',  sci:'Prunus domestica',              icon:'🍇', category:'arbre-fruitier', family:'Rosacées',       season:['summer','autumn'],          difficulty:1, sow:'—',         plant:'nov–mars', harvest:'août–oct',  space:'4–5 m',  companions:['Mirabelle','Reine Claude'],            waterEvery:7,  tip:'Variété rustique et très productive. Excellente pour confitures et eau-de-vie.', varieties:['Coutch d\'Alsace','Stanley'] },
  { id:'apple',           name:'Pomme',              sci:'Malus domestica',               icon:'🍎', category:'arbre-fruitier', family:'Rosacées',       season:['autumn'],                   difficulty:2, sow:'—',         plant:'nov–mars', harvest:'août–nov',  space:'5–8 m',  companions:['Capucine','Ciboulette','Pissenlit'],   waterEvery:10, tip:'Taille en hiver dormant. Traitez à la bouillie bordelaise avant le débourrement.', varieties:['Golden','Granny Smith','Gala','Fuji','Cox','Reinette'] },
  { id:'pear',            name:'Poire',              sci:'Pyrus communis',                icon:'🍐', category:'arbre-fruitier', family:'Rosacées',       season:['autumn'],                   difficulty:2, sow:'—',         plant:'nov–mars', harvest:'août–oct',  space:'5–8 m',  companions:['Ail','Ciboulette'],                    waterEvery:10, tip:'Sensible au feu bactérien. Taille en palmette pour de bonnes récoltes.',      varieties:['Williams','Conférence','Passe-Crassane','Comice'] },
  { id:'cherry',          name:'Cerise',             sci:'Prunus avium',                  icon:'🍒', category:'arbre-fruitier', family:'Rosacées',       season:['summer'],                   difficulty:2, sow:'—',         plant:'nov–mars', harvest:'juin–juil', space:'8 m',    companions:['Ciboulette','Pissenlit'],              waterEvery:7,  tip:'Couvrez d\'un filet avant maturité pour protéger des oiseaux.',              varieties:['Burlat','Summit','Reverchon','Napoléon'] },
  { id:'peach',           name:'Pêche',              sci:'Prunus persica',                icon:'🍑', category:'arbre-fruitier', family:'Rosacées',       season:['summer'],                   difficulty:3, sow:'—',         plant:'nov–mars', harvest:'juil–sept', space:'4–5 m',  companions:['Ail','Basilic'],                       waterEvery:5,  tip:'Très sensible à la cloque. Traitement cuivre obligatoire au gonflement des bourgeons.', varieties:['Redhaven','Amsden','Pêche de vigne'] },
  { id:'nectarine',       name:'Nectarine',          sci:'Prunus persica var. nucipersica',icon:'🍑', category:'arbre-fruitier', family:'Rosacées',      season:['summer'],                   difficulty:3, sow:'—',         plant:'nov–mars', harvest:'juil–sept', space:'4–5 m',  companions:['Ail','Basilic'],                       waterEvery:5,  tip:'Même sensibilité à la cloque que le pêcher. Traitez dès le gonflement des bourgeons.', varieties:['Fantasia','Stark Red Gold','Nectared'] },
  { id:'apricot',         name:'Abricot',            sci:'Prunus armeniaca',              icon:'🍊', category:'arbre-fruitier', family:'Rosacées',       season:['summer'],                   difficulty:3, sow:'—',         plant:'nov–mars', harvest:'juin–août', space:'5 m',    companions:['Lavande','Ail'],                       waterEvery:7,  tip:'Fleurit tôt — protégez à la floraison contre les gelées tardives. Sol calcaire apprécié.', varieties:['Bergeron','Goldrich','Polonais','Orangé de Provence'] },
];

/* ============================================================
   RÉGIONS CLIMATIQUES & TAUX DE RÉUSSITE PAR PLANTE
   ============================================================ */
const REGIONS = [
  { id:'nord',     emoji:'🌧️', label:'Nord & Bretagne',         desc:'Frais, pluvieux, hivers doux' },
  { id:'idf',      emoji:'☁️',  label:'Île-de-France & Centre',  desc:'Tempéré, variable, été chaud' },
  { id:'ocean',    emoji:'🌊',  label:'Grand Ouest & Atlantique', desc:'Océanique, doux, humide' },
  { id:'sudouest', emoji:'☀️',  label:'Sud-Ouest & Occitanie',   desc:'Chaud et humide en été' },
  { id:'med',      emoji:'🌞',  label:'Méditerranée & PACA',     desc:'Très chaud et sec l\'été' },
  { id:'est',      emoji:'🌡️', label:'Est & Rhône-Alpes',       desc:'Continental, hivers froids' },
  { id:'montagne', emoji:'⛰️',  label:'Montagne',                desc:'Été court, gel possible tardif' },
];

/* ============================================================
   MÉTÉO — Open-Meteo (gratuit, sans clé API)
   ============================================================ */
const WEATHER_CODES = {
  0:{icon:'☀️',label:'Ciel dégagé'}, 1:{icon:'🌤️',label:'Peu nuageux'},
  2:{icon:'⛅',label:'Partiellement nuageux'}, 3:{icon:'☁️',label:'Couvert'},
  45:{icon:'🌫️',label:'Brouillard'}, 48:{icon:'🌫️',label:'Brouillard givrant'},
  51:{icon:'🌦️',label:'Bruine'}, 53:{icon:'🌦️',label:'Bruine modérée'},
  55:{icon:'🌧️',label:'Bruine dense'}, 61:{icon:'🌧️',label:'Pluie légère'},
  63:{icon:'🌧️',label:'Pluie'}, 65:{icon:'🌧️',label:'Forte pluie'},
  71:{icon:'🌨️',label:'Neige légère'}, 73:{icon:'🌨️',label:'Neige'},
  75:{icon:'❄️',label:'Forte neige'}, 80:{icon:'🌦️',label:'Averses légères'},
  81:{icon:'🌧️',label:'Averses'}, 82:{icon:'⛈️',label:'Fortes averses'},
  95:{icon:'⛈️',label:'Orage'}, 96:{icon:'⛈️',label:'Orage avec grêle'},
  99:{icon:'⛈️',label:'Orage violent'},
};

async function fetchWeather() {
  if (!state.prefs.weather) return;
  const now = Date.now();
  if (state.weather && state.weather.fetched && now - state.weather.fetched < 3600000) return; // cache 1h
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude: lat, longitude: lon } = pos.coords;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,precipitation,weathercode,windspeed_10m&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const cur = data.current;
      state.weather = {
        fetched: now, lat, lon,
        temp: Math.round(cur.temperature_2m),
        rain: cur.precipitation,
        code: cur.weathercode,
        wind: Math.round(cur.windspeed_10m),
      };
      saveState();
      renderWeatherWidget();
    } catch {}
  }, () => {}, { timeout: 5000 });
}

function renderWeatherWidget() {
  const w = state.weather;
  const el = document.getElementById('weather-widget');
  if (!el) return;
  if (!w || !state.prefs.weather) { el.style.display = 'none'; return; }
  const wc = WEATHER_CODES[w.code] || {icon:'🌡️', label:'—'};
  const isRainy = [51,53,55,61,63,65,80,81,82,95,96,99].includes(w.code);
  const isHot = w.temp >= 30;
  let advice = '';
  if (isRainy && w.rain > 1) advice = '💧 Il pleut — arrosage inutile aujourd\'hui';
  else if (isHot) advice = '🌡️ Chaleur — arrosez en soirée, pas au soleil';
  else if (w.temp <= 5) advice = '❄️ Risque de gel — protégez les plants fragiles';
  el.style.display = '';
  el.innerHTML = `<div class="wx-main"><span class="wx-icon">${wc.icon}</span><div class="wx-body"><div class="wx-temp">${w.temp}°C <span class="wx-label">${wc.label}</span></div>${advice ? `<div class="wx-advice">${advice}</div>` : ''}</div></div>`;
}

/* ============================================================
   SYMPTÔMES — Identification des problèmes courants
   ============================================================ */
const SYMPTOMS = [
  { id:'yellow', icon:'🍂', label:'Feuilles jaunes', causes:[
    { name:'Carence en azote', signs:'Jaunissement progressif du bas vers le haut', treat:'Purin d\'ortie dilué (10:1) ou engrais azoté', sev:'medium' },
    { name:'Excès d\'eau', signs:'Feuilles molles + jaunes, sol détrempé', treat:'Stopper l\'arrosage, améliorer le drainage', sev:'high' },
    { name:'Carence en fer', signs:'Nervures vertes mais feuilles jaunes entre elles', treat:'Chélate de fer ou corriger le pH (6–6,5)', sev:'medium' },
    { name:'Déficit d\'eau', signs:'Feuilles tombantes + bords secs puis jaunes', treat:'Arrosage profond au pied, paillage', sev:'medium' },
  ]},
  { id:'spots', icon:'🔴', label:'Taches sur les feuilles', causes:[
    { name:'Mildiou', signs:'Taches huileuses dessus, duvet gris/blanc dessous', treat:'Bouillie bordelaise, supprimer feuilles atteintes', sev:'high' },
    { name:'Oïdium', signs:'Poudre blanche sur la face supérieure', treat:'Bicarbonate de soude (1 c.c/L eau), bien aérer', sev:'medium' },
    { name:'Alternariose', signs:'Taches brunes cerclées de jaune (tomates, choux)', treat:'Supprimer feuilles, éviter l\'arrosage foliaire', sev:'medium' },
    { name:'Bactériose', signs:'Taches angulaires humides qui noircissent', treat:'Cuivre, aération, rotation des cultures', sev:'high' },
  ]},
  { id:'holes', icon:'🕳️', label:'Trous dans les feuilles', causes:[
    { name:'Limaces / Escargots', signs:'Trous irréguliers, traces de bave argentée', treat:'Cendres de bois, pièges à bière, granulés ferriques', sev:'medium' },
    { name:'Piéride du chou', signs:'Trous sur choux, chenilles vert-jaune visibles', treat:'Filet insect-proof, Bt (Bacillus thuringiensis)', sev:'medium' },
    { name:'Doryphores', signs:'Feuilles de pomme de terre dévorées, larves orangées', treat:'Ramassage manuel, décoction de fougère', sev:'high' },
    { name:'Altises', signs:'Petits trous ronds sur radis, navets, brassicacées', treat:'Filet, cendres de bois, rotation', sev:'low' },
  ]},
  { id:'wilt', icon:'😿', label:'Plante qui fane / se dessèche', causes:[
    { name:'Sécheresse', signs:'Feuilles tombantes, sol sec', treat:'Arrosage profond, paillage, arroser tôt le matin', sev:'medium' },
    { name:'Fusariose', signs:'Jaunissement unilatéral, tige brune en coupe', treat:'Supprimer la plante, ne pas composter, rotation obligatoire', sev:'high' },
    { name:'Pourriture du collet', signs:'Collier noir à la base, racines brunes molles', treat:'Moins d\'arrosage, bon drainage, supprimer si très atteinte', sev:'high' },
    { name:'Chaleur excessive', signs:'Toute la plante fléchit le midi, récupère le soir', treat:'Ombrage temporaire, arrosage régulier en soirée', sev:'low' },
  ]},
  { id:'deformed', icon:'🔀', label:'Feuilles / fruits déformés', causes:[
    { name:'Pucerons', signs:'Feuilles enroulées, collantes, insectes verts/noirs/blancs', treat:'Savon noir (10 ml/L), favoriser coccinelles', sev:'medium' },
    { name:'Araignées rouges', signs:'Feuilles blanchâtres/bronzées, toiles fines dessous', treat:'Pulvériser eau fraîche, augmenter l\'humidité', sev:'medium' },
    { name:'Virus (mosaïque)', signs:'Mosaïque vert clair/foncé, déformation foliaire', treat:'Supprimer la plante, lutter contre pucerons (vecteurs)', sev:'high' },
    { name:'Carences multiples', signs:'Déformation + décoloration irrégulière', treat:'Analyse de sol, apport de compost équilibré', sev:'medium' },
  ]},
  { id:'no-fruit', icon:'🌸', label:'Fleurs sans fruits', causes:[
    { name:'Manque de pollinisation', signs:'Fleurs tombent sans développement', treat:'Agiter les tiges (tomates), planter des fleurs pollinisatrices', sev:'medium' },
    { name:'Températures extrêmes', signs:'Fleurs avortent si nuit < 10°C ou jour > 35°C', treat:'Voile de protection la nuit, ombrage le jour', sev:'medium' },
    { name:'Excès d\'azote', signs:'Végétation luxuriante mais peu de fleurs ou fruits', treat:'Stopper l\'azote, apporter potasse et phosphore', sev:'medium' },
    { name:'Manque d\'eau à la floraison', signs:'Fruits mal formés, creux ou qui tombent', treat:'Arrosage régulier et profond, surtout pendant la floraison', sev:'medium' },
  ]},
];

let symptomStep = 0;
let selectedSymptom = null;

function openSymptomFinder() {
  symptomStep = 0; selectedSymptom = null;
  renderSymptomFinder();
  openModal('symptom-modal-backdrop');
}

function renderSymptomFinder() {
  const body = document.getElementById('symptom-modal-body');
  if (!body) return;
  if (symptomStep === 0) {
    body.innerHTML = `
      <p class="muted small mb-4">Quel est le principal symptôme observé sur votre plante ?</p>
      <div class="sf-grid">
        ${SYMPTOMS.map(s => `<button class="sf-item" data-sid="${s.id}"><span class="sf-icon">${s.icon}</span><span class="sf-label">${escapeHTML(s.label)}</span></button>`).join('')}
      </div>`;
    body.querySelectorAll('[data-sid]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedSymptom = SYMPTOMS.find(s => s.id === btn.dataset.sid);
        symptomStep = 1;
        renderSymptomFinder();
      });
    });
  } else if (symptomStep === 1 && selectedSymptom) {
    const sevColor = {high:'var(--urgent)',medium:'var(--warn)',low:'var(--green-dark)'};
    const sevLabel = {high:'Urgent',medium:'À surveiller',low:'Peu grave'};
    body.innerHTML = `
      <button class="btn ghost sm mb-3" id="sf-back">← Retour</button>
      <div class="sf-result-head">${selectedSymptom.icon} ${escapeHTML(selectedSymptom.label)}</div>
      <p class="muted small mb-4">${selectedSymptom.causes.length} causes possibles :</p>
      ${selectedSymptom.causes.map(c => `
        <div class="sf-cause">
          <div class="sf-cause-head">
            <b>${escapeHTML(c.name)}</b>
            <span class="sf-sev" style="color:${sevColor[c.sev]}">${sevLabel[c.sev]}</span>
          </div>
          <div class="sf-signs">🔎 ${escapeHTML(c.signs)}</div>
          <div class="sf-treat">✅ ${escapeHTML(c.treat)}</div>
        </div>`).join('')}`;
    body.querySelector('#sf-back').addEventListener('click', () => { symptomStep = 0; renderSymptomFinder(); });
  }
}

/* ============================================================
   LISTE DE COURSES
   ============================================================ */
function openShoppingList() {
  renderShoppingList();
  openModal('shopping-modal-backdrop');
}

function renderShoppingList() {
  const body = document.getElementById('shopping-modal-body');
  if (!body) return;
  const shopping = state.shopping || [];

  // Auto-suggestions : plantes à semer dans les 30 prochains jours selon leur fiche
  const MONTH_NAMES = ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'];
  const now = new Date();
  const m = now.getMonth(); // 0-based
  const suggestions = CATALOG.filter(p => {
    if (!p.sow || p.sow === '—') return false;
    const sow = p.sow.toLowerCase();
    const cur = MONTH_NAMES[m];
    const next = MONTH_NAMES[(m+1)%12];
    return sow.includes(cur) || sow.includes(next);
  }).map(p => `${p.icon} ${p.name} (semis : ${p.sow})`);

  body.innerHTML = `
    <div class="sl-section">
      <div class="sl-title">💡 À semer ce mois-ci</div>
      ${suggestions.length ? suggestions.map(s => `<div class="sl-suggest">${escapeHTML(s)}</div>`).join('') : '<div class="muted small">Aucune suggestion pour le moment.</div>'}
    </div>
    <div class="sl-section">
      <div class="sl-title">Ma liste personnelle</div>
      <div id="sl-items">${shopping.map((item,i) => `
        <div class="sl-item ${item.done ? 'sl-done' : ''}">
          <label class="sl-check"><input type="checkbox" data-si="${i}" ${item.done?'checked':''}/><span>${escapeHTML(item.text)}</span></label>
          <button class="btn ghost sm danger" data-sdel="${i}">✕</button>
        </div>`).join('') || '<div class="muted small">Aucun article.</div>'}
      </div>
      <div class="row gap-2 mt-3">
        <input class="input" id="sl-input" placeholder="Ajouter un article…" style="flex:1">
        <button class="btn primary" id="sl-add">Ajouter</button>
      </div>
    </div>`;

  body.querySelectorAll('[data-si]').forEach(cb => {
    cb.addEventListener('change', () => {
      const i = parseInt(cb.dataset.si);
      if (state.shopping[i]) { state.shopping[i].done = cb.checked; saveState(); renderShoppingList(); }
    });
  });
  body.querySelectorAll('[data-sdel]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.shopping.splice(parseInt(btn.dataset.sdel), 1);
      saveState(); renderShoppingList();
    });
  });
  document.getElementById('sl-add').addEventListener('click', () => {
    const v = document.getElementById('sl-input').value.trim();
    if (!v) return;
    state.shopping.push({ text: v, done: false });
    saveState(); renderShoppingList();
  });
  document.getElementById('sl-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('sl-add').click();
  });
}

const REGION_DATA = {
  tomato:              { nord:65, idf:75, ocean:78, sudouest:90, med:95, est:78, montagne:50 },
  basil:               { nord:55, idf:68, ocean:72, sudouest:88, med:95, est:70, montagne:38 },
  lettuce:             { nord:85, idf:88, ocean:88, sudouest:80, med:72, est:85, montagne:78 },
  carrot:              { nord:88, idf:90, ocean:88, sudouest:85, med:78, est:88, montagne:80 },
  zucchini:            { nord:68, idf:80, ocean:82, sudouest:92, med:90, est:80, montagne:58 },
  leek:                { nord:92, idf:88, ocean:88, sudouest:82, med:70, est:85, montagne:82 },
  strawberry:          { nord:82, idf:85, ocean:85, sudouest:85, med:80, est:82, montagne:72 },
  radish:              { nord:88, idf:90, ocean:90, sudouest:85, med:78, est:88, montagne:82 },
  pepper:              { nord:52, idf:65, ocean:68, sudouest:88, med:95, est:68, montagne:38 },
  eggplant:            { nord:48, idf:60, ocean:65, sudouest:85, med:95, est:62, montagne:32 },
  pea:                 { nord:85, idf:85, ocean:88, sudouest:80, med:70, est:82, montagne:78 },
  pumpkin:             { nord:65, idf:78, ocean:80, sudouest:88, med:88, est:78, montagne:55 },
  'squash-spaghetti':  { nord:62, idf:75, ocean:78, sudouest:88, med:88, est:75, montagne:52 },
  butternut:           { nord:60, idf:72, ocean:75, sudouest:90, med:92, est:75, montagne:50 },
  'pumpkin-marron':    { nord:60, idf:72, ocean:75, sudouest:88, med:88, est:75, montagne:50 },
  chili:               { nord:48, idf:60, ocean:65, sudouest:85, med:95, est:65, montagne:35 },
  'sweet-potato':      { nord:38, idf:52, ocean:58, sudouest:82, med:92, est:55, montagne:28 },
  gherkin:             { nord:60, idf:72, ocean:75, sudouest:88, med:90, est:72, montagne:50 },
  'red-cabbage':       { nord:90, idf:88, ocean:85, sudouest:80, med:70, est:85, montagne:80 },
  cabbage:             { nord:92, idf:88, ocean:88, sudouest:80, med:68, est:85, montagne:82 },
  beans:               { nord:68, idf:78, ocean:82, sudouest:88, med:90, est:80, montagne:58 },
  watermelon:          { nord:32, idf:45, ocean:50, sudouest:75, med:95, est:52, montagne:18 },
  melon:               { nord:38, idf:52, ocean:58, sudouest:82, med:95, est:58, montagne:22 },
  mirabelle:           { nord:70, idf:80, ocean:75, sudouest:85, med:78, est:92, montagne:62 },
  'reine-claude':      { nord:68, idf:78, ocean:75, sudouest:88, med:80, est:90, montagne:60 },
  quetsche:            { nord:72, idf:80, ocean:78, sudouest:85, med:75, est:92, montagne:68 },
  apple:               { nord:82, idf:85, ocean:82, sudouest:80, med:65, est:88, montagne:72 },
  pear:                { nord:78, idf:82, ocean:80, sudouest:82, med:70, est:85, montagne:68 },
  cherry:              { nord:72, idf:78, ocean:75, sudouest:82, med:88, est:85, montagne:65 },
  peach:               { nord:42, idf:58, ocean:62, sudouest:82, med:95, est:72, montagne:42 },
  nectarine:           { nord:38, idf:55, ocean:58, sudouest:80, med:95, est:68, montagne:38 },
  apricot:             { nord:38, idf:52, ocean:55, sudouest:78, med:95, est:65, montagne:35 },
};

/* ============================================================
   MILESTONES (système de progression débutant)
   ============================================================ */
const MILESTONES = [
  { id:'first_plant',  label:'Première plante',    icon:'🌱', xp:15,  req: s => s.beds.flatMap(b=>b.cells||[]).filter(Boolean).length >= 1 },
  { id:'first_task',   label:'À l\'action !',       icon:'✅', xp:10,  req: s => (s.tasks||[]).some(t=>t.done) },
  { id:'first_note',   label:'Observateur',          icon:'📝', xp:10,  req: s => (s.journal||[]).length >= 1 },
  { id:'plants_3',     label:'Mini jardin',          icon:'🌼', xp:20,  req: s => s.beds.flatMap(b=>b.cells||[]).filter(Boolean).length >= 3 },
  { id:'diversity_5',  label:'Diversité',            icon:'🌈', xp:25,  req: s => new Set(s.beds.flatMap(b=>b.cells||[]).filter(Boolean).map(c=>c.plant)).size >= 5 },
  { id:'xp_100',       label:'Curieux',              icon:'⭐', xp:0,   req: s => (s.profile?.xp||0) >= 100 },
  { id:'xp_300',       label:'Main verte',           icon:'🌿', xp:0,   req: s => (s.profile?.xp||0) >= 300 },
  { id:'streak_7',     label:'Régularité',           icon:'🔥', xp:20,  req: s => (s.streak||0) >= 7 },
  { id:'guide_done',   label:'Bon élève',            icon:'📚', xp:30,  req: s => (s.profile?.guideSeen||[]).length >= 5 },
  { id:'trees_planted',label:'Arboriculteur',        icon:'🌳', xp:20,  req: s => s.beds.flatMap(b=>b.cells||[]).filter(Boolean).some(c => { const p = CATALOG.find(x=>x.id===c.plant); return p?.category==='arbre-fruitier'; }) },
];

const XP_EVENTS = { task_done:5, plant_added:10, journal_entry:8, harvest_done:15, guide_read:5 };

// Paliers de progression — affichés dans le widget XP pour motiver
const LEVELS = [
  { xp:0,    icon:'🔰', label:'Débutant' },
  { xp:100,  icon:'🌱', label:'Apprenti' },
  { xp:300,  icon:'🌿', label:'Main verte' },
  { xp:600,  icon:'🌻', label:'Confirmé' },
  { xp:1000, icon:'🏆', label:'Maître du potager' },
];

function awardXP(event) {
  if (!state.profile || state.profile.level !== 'beginner') return;
  const amount = XP_EVENTS[event] || 0;
  if (!amount) return;
  state.profile.xp = (state.profile.xp || 0) + amount;
  state.profile.stars = Math.floor(state.profile.xp / 100);
  checkMilestones();
  saveState();
  renderXPWidget();
  const bar = document.querySelector('#xp-widget .xp-bar');
  if (bar) { bar.classList.remove('bump'); void bar.offsetWidth; bar.classList.add('bump'); }
  flash(`+${amount} XP ⭐`);
}

function checkMilestones() {
  if (!state.profile || state.profile.level !== 'beginner') return;
  const done = new Set(state.profile.milestones || []);
  let gained = false;
  MILESTONES.forEach(m => {
    if (!done.has(m.id) && m.req(state)) {
      state.profile.milestones = state.profile.milestones || [];
      state.profile.milestones.push(m.id);
      if (m.xp) { state.profile.xp = (state.profile.xp || 0) + m.xp; state.profile.stars = Math.floor(state.profile.xp / 100); }
      setTimeout(() => flash(`${m.icon} Défi débloqué : ${m.label} !`), gained ? 2500 : 500);
      gained = true;
    }
  });
  if (gained) renderXPWidget();
}

function renderXPWidget() {
  const xpWidget = document.getElementById('xp-widget');
  if (!xpWidget) return;
  const isBegin = state.profile && state.profile.level === 'beginner';
  xpWidget.style.display = isBegin ? '' : 'none';
  if (!isBegin) return;

  const xp = state.profile.xp || 0;
  let lvlIdx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.xp) lvlIdx = i; });
  const cur = LEVELS[lvlIdx];
  const next = LEVELS[lvlIdx + 1] || null;
  const pct = next ? Math.min(100, Math.round((xp - cur.xp) / (next.xp - cur.xp) * 100)) : 100;

  document.getElementById('xp-current').textContent = `${xp} XP`;
  document.getElementById('xp-next-label').textContent = next ? `Prochain : ${next.icon} ${next.label} à ${next.xp} XP` : '🏆 Niveau maximum atteint !';
  const fill = document.getElementById('xp-fill');
  if (fill) fill.style.width = pct + '%';
  document.getElementById('xp-level-label').textContent = `${cur.icon} ${cur.label}`;

  // Échelle des paliers — donne envie de viser le suivant
  const ladder = document.getElementById('xp-levels');
  if (ladder) ladder.innerHTML = LEVELS.map((l, i) => {
    const cls = i < lvlIdx ? 'past' : i === lvlIdx ? 'current' : '';
    const xpLabel = i === lvlIdx && next ? `${xp} / ${next.xp} XP` : `${l.xp} XP`;
    return `<div class="xp-level ${cls}" title="${escapeHTML(l.label)} — dès ${l.xp} XP">
      <div class="xl-icon">${i < lvlIdx ? '✅' : l.icon}</div>
      <div class="xl-name">${escapeHTML(l.label)}</div>
      <div class="xl-xp">${xpLabel}</div>
    </div>`;
  }).join('');

  const done = new Set(state.profile.milestones || []);
  const mRow = document.getElementById('milestones-row');
  if (mRow) mRow.innerHTML = MILESTONES.map(m => `<span class="milestone-badge ${done.has(m.id) ? 'done' : ''}" title="${escapeHTML(m.label)}">${m.icon}</span>`).join('');
}

/* ============================================================
   NOTIFICATIONS — Vrais rappels navigateur
   ============================================================ */
async function requestNotificationPermission() {
  // Capacitor native
  if (window.Capacitor?.isNativePlatform?.()) {
    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      const perm = await LocalNotifications.requestPermissions();
      const granted = perm.display === 'granted';
      state.prefs.pushAsked = true;
      state.prefs.pushOn = granted;
      saveState();
      return granted ? 'granted' : 'denied';
    } catch {}
  }
  // Web fallback
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  state.prefs.pushAsked = true;
  state.prefs.pushOn = result === 'granted';
  saveState();
  return result;
}

async function handleSurveyNotifRequest(btn) {
  btn.disabled = true;
  btn.textContent = '⏳ En attente…';
  const result = await requestNotificationPermission();
  if (result === 'granted') {
    btn.textContent = '✓ Notifications activées !';
    btn.style.background = 'var(--green-dark)';
    btn.style.borderColor = 'var(--green-dark)';
  } else if (result === 'denied') {
    btn.textContent = '✗ Bloquées — modifiez dans Paramètres';
    btn.style.background = 'var(--urgent)';
    btn.style.borderColor = 'var(--urgent)';
  } else if (result === 'unsupported') {
    btn.textContent = '⚠️ Non supporté sur cet appareil';
  } else {
    btn.disabled = false;
    btn.textContent = '🔔 Activer les notifications';
  }
}

async function sendNotification(title, body, tag = 'potager') {
  const hour = new Date().getHours();
  if (state.prefs && state.prefs.quiet && (hour < 7 || hour >= 21)) return;
  // Capacitor native
  if (window.Capacitor?.isNativePlatform?.()) {
    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      await LocalNotifications.schedule({ notifications: [{ title, body, id: Math.floor(Math.random() * 100000), extra: { tag } }] });
      return;
    } catch {}
  }
  // Web fallback
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!state.prefs || !state.prefs.pushOn) return;
  try {
    new Notification(title, { body, icon: 'icon-192.png', badge: 'icon-192.png', tag, vibrate: [200, 100, 200] });
  } catch {}
}

function scheduleWateringChecks() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const todayStr = iso(new Date());
  const waterTasks = state.tasks.filter(t => t.kind === 'water' && !t.done && t.date === todayStr);
  if (waterTasks.length && state.prefs.pushOn) {
    const names = waterTasks.slice(0, 3).map(t => t.title).join(', ');
    sendNotification('💧 Arrosage du potager', `${waterTasks.length} plante${waterTasks.length > 1 ? 's' : ''} à arroser : ${names}`, 'watering');
  }
  const urgentPlants = state.beds.flatMap(b => (b.cells||[]).filter(c => c && c.status === 'urgent'));
  if (urgentPlants.length && state.prefs.pushOn) {
    const pnames = urgentPlants.slice(0, 2).map(c => { const p = plantById(c.plant); return p ? p.name : c.plant; }).join(', ');
    sendNotification('🚨 Alerte au jardin', `${urgentPlants.length} plante${urgentPlants.length > 1 ? 's' : ''} urgente${urgentPlants.length > 1 ? 's' : ''} : ${pnames}`, 'urgent');
  }
}

function initNotificationScheduler() {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !(state.prefs||{}).pushOn) return;
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) scheduleWateringChecks();
  setInterval(() => {
    if (new Date().getHours() === 7) scheduleWateringChecks();
  }, 3600000);
}

/* ============================================================
   GUIDE DU POTAGER
   ============================================================ */
/* Compagnonnage : pour chaque légume, les bons voisins (✓) et ceux à éviter (✗).
   Les noms reprennent ceux du catalogue quand c'est possible. */
const COMPANION_DATA = [
  { icon:'🍅', plant:'Tomate',     good:['Basilic','Œillet d\'Inde','Carotte','Persil','Oignon','Ail','Capucine'], avoid:['Pomme de terre','Chou','Fenouil','Concombre'] },
  { icon:'🥕', plant:'Carotte',    good:['Oignon','Poireau','Radis','Laitue','Tomate','Romarin'],                avoid:['Aneth','Persil','Betterave'] },
  { icon:'🥬', plant:'Laitue',     good:['Carotte','Radis','Fraisier','Concombre','Betterave'],                 avoid:['Persil','Tournesol'] },
  { icon:'🥒', plant:'Courgette',  good:['Capucine','Maïs','Haricot','Œillet d\'Inde','Bourrache'],             avoid:['Pomme de terre','Concombre'] },
  { icon:'🧅', plant:'Oignon / Poireau', good:['Carotte','Betterave','Laitue','Fraisier','Tomate'],            avoid:['Pois','Haricot','Chou'] },
  { icon:'🫘', plant:'Haricot',    good:['Maïs','Courge','Carotte','Concombre','Capucine'],                     avoid:['Oignon','Ail','Poireau','Fenouil'] },
  { icon:'🟢', plant:'Petit pois', good:['Carotte','Radis','Concombre','Maïs','Navet'],                         avoid:['Oignon','Ail','Échalote'] },
  { icon:'🥬', plant:'Chou',       good:['Aneth','Camomille','Céleri','Bourrache','Capucine','Romarin'],        avoid:['Tomate','Fraisier','Oignon'] },
  { icon:'🍓', plant:'Fraisier',   good:['Laitue','Épinard','Bourrache','Ail','Haricot'],                       avoid:['Chou','Tomate'] },
  { icon:'🥔', plant:'Pomme de terre', good:['Haricot','Maïs','Chou','Capucine','Œillet d\'Inde'],              avoid:['Tomate','Courge','Concombre'] },
  { icon:'🌶️', plant:'Poivron / Piment', good:['Basilic','Tomate','Carotte','Oignon'],                         avoid:['Haricot','Fenouil'] },
  { icon:'🟠', plant:'Radis',      good:['Laitue','Carotte','Petit pois','Concombre','Épinard'],                avoid:['Hysope'] },
  { icon:'🎃', plant:'Courge / Citrouille', good:['Maïs','Haricot','Capucine','Bourrache'],                     avoid:['Pomme de terre'] },
  { icon:'🌿', plant:'Basilic',    good:['Tomate','Poivron','Aubergine','Courgette'],                           avoid:['Concombre','Rue'] },
];

/* Fleurs et aromatiques alliées du potager (compagnonnage utile partout). */
const COMPANION_FLOWERS = [
  { icon:'🌼', name:"Œillet d'Inde", role:"Repousse nématodes et pucerons. À semer entre tomates, choux, pommes de terre." },
  { icon:'🌺', name:'Capucine',      role:"Plante-piège à pucerons : ils s'y concentrent et épargnent les légumes." },
  { icon:'💙', name:'Bourrache',     role:"Attire les pollinisateurs, éloigne la piéride du chou et les limaces." },
  { icon:'🟡', name:'Souci (calendula)', role:"Attire syrphes et coccinelles, prédateurs des pucerons." },
  { icon:'💜', name:'Lavande',       role:"Éloigne pucerons et fourmis, attire abeilles. Idéale en bordure." },
];

const GUIDE_SECTIONS = [
  { id:'soil',     icon:'🌍', title:'Préparer le sol',        color:'earth',
    tips:["Amendez avec du compost mûr en automne (3–5 cm en surface).", "pH idéal : 6.0–7.0 pour la plupart des légumes — testez-le avec un kit du commerce.", "Évitez de trop travailler le sol — les micro-organismes sont vos alliés.", "Paillez pour conserver l'humidité et limiter les mauvaises herbes.", "Un sol qui s'émiette entre les doigts sans coller est bien structuré.", "En sol lourd (argileux), ajoutez sable et compost ; en sol sableux, du compost et de la matière organique."] },
  { id:'companion', icon:'🤝', title:'Compagnonnage : quoi planter ensemble', color:'green', type:'companion',
    tips:["Associez des familles complémentaires : une plante protège ou nourrit l'autre.", "Alternez plantes hautes et basses pour optimiser lumière et espace.", "Les fleurs (œillet d'Inde, capucine, bourrache) attirent pollinisateurs et auxiliaires.", "Ne regroupez pas des plantes de la même famille : mêmes maladies, mêmes ravageurs."] },
  { id:'sow',      icon:'🌱', title:'Semer & Planter',        color:'green',
    tips:["Profondeur de semis = 3× le diamètre de la graine.", "Arrosez avant de semer, pas juste après — cela évite de déplacer les graines.", "Repiquez par temps nuageux ou en soirée pour moins de stress.", "Respectez les espacements indiqués dans le catalogue.", "Semez les petites graines (carotte, laitue) en surface, à peine recouvertes.", "Échelonnez les semis de radis et laitue toutes les 3 semaines pour récolter en continu."] },
  { id:'water',    icon:'💧', title:'Arroser efficacement',   color:'green',
    tips:["Arrosez au pied, jamais sur le feuillage — réduit les maladies foliaires.", "Tôt le matin ou en soirée pour limiter l'évaporation.", "Un arrosage profond 2×/semaine vaut mieux que 7× superficiel.", "Paillez : cela réduit les besoins en eau de 30 à 50 %.", "Enfoncez un doigt dans la terre : arrosez seulement si c'est sec à 3 cm.", "Récupérez l'eau de pluie — elle est à température et sans calcaire."] },
  { id:'pests',    icon:'🐛', title:'Maladies & Ravageurs',   color:'urgent',
    tips:["Pucerons : savon noir dilué (10 ml/L), 2 traitements à 3 jours d'intervalle.", "Mildiou : bouillie bordelaise préventive, éviter l'arrosage foliaire.", "Limaces : cendres de bois autour des plants, pièges à bière.", "Observation hebdomadaire = détection précoce = intervention facile.", "Favorisez les coccinelles et syrphes : ils dévorent les pucerons.", "Le purin d'ortie dilué (10 %) renforce les défenses des plantes."] },
  { id:'companions-aux', icon:'🐞', title:'Auxiliaires & biodiversité', color:'green',
    tips:["Coccinelle : une larve dévore jusqu'à 150 pucerons par jour.", "Hérisson et crapaud régulent limaces et insectes — laissez-leur un abri.", "Installez un hôtel à insectes et un point d'eau pour fixer les auxiliaires.", "Laissez une zone enherbée ou des fleurs sauvages en bordure du potager.", "Évitez tout insecticide à large spectre : il tue aussi vos alliés."] },
  { id:'rotation', icon:'🔄', title:'Rotation des cultures',   color:'earth',
    tips:["Ne cultivez pas la même famille au même endroit avant 3–4 ans.", "Ordre type : légumes-feuilles → légumes-fruits → légumes-racines → légumineuses.", "Les légumineuses (pois, haricots) enrichissent le sol en azote : faites-les suivre par des gourmandes (choux, courges).", "Notez chaque année l'emplacement des familles pour ne pas vous tromper.", "La rotation casse le cycle des maladies et ravageurs du sol."] },
  { id:'harvest',  icon:'🥕', title:'Récolter au bon moment',  color:'earth',
    tips:["Tomate : récolte ferme, colorée mais encore légèrement résistante.", "Courgette : à 15–20 cm pour la tendreté. Ne laissez pas grossir.", "Herbes aromatiques : prélevez au max 1/3 du plant pour ne pas l'affaiblir.", "Haricots : récoltez souvent — plus vous récoltez, plus ça produit.", "Récoltez le matin : les légumes sont gorgés d'eau et plus croquants.", "Courges de conservation : récoltez avant les gelées, pédoncule bien sec."] },
  { id:'maintain', icon:'✂️', title:'Entretien régulier',      color:'green',
    tips:["Pincez les gourmands des tomates chaque semaine.", "Buttez les poireaux et pommes de terre pour les blanchir.", "Palissez cucurbitacées et haricots grimpants sur des treillis.", "Désherbez avant que les mauvaises herbes fleurissent.", "Binez régulièrement : « un binage vaut deux arrosages ».", "Retirez les feuilles jaunies ou malades pour limiter la propagation."] },
  { id:'trees',    icon:'🌳', title:'Arbres fruitiers — Bases',color:'earth',
    tips:["Plantez en dormance (nov–mars) en sol humide mais non gelé.", "Taille de formation les 3 premières années : choisissez 3–5 branches charpentières.", "Traitement cuivre (bouillie bordelaise) avant le débourrement de printemps.", "Greffage en écusson : juillet–août, sur porte-greffe vigoureux.", "Pour les pruniers (mirabelle, quetsche, reine-claude) : taille minimale, juste l'aération.", "Pêcher et nectarinier : traitez contre la cloque dès le gonflement des bourgeons."] },
];

function regionScore(plantId) {
  const rid = state.profile?.region;
  if (!rid) return null;
  return REGION_DATA[plantId]?.[rid] ?? null;
}
function regionScoreClass(s) { return s >= 85 ? 'excellent' : s >= 70 ? 'good' : s >= 55 ? 'medium' : 'hard'; }
function regionScoreLabel(s) { return s >= 85 ? 'Excellent' : s >= 70 ? 'Bon' : s >= 55 ? 'Moyen' : 'Difficile'; }
function regionScoreHTML(score) {
  const cls = regionScoreClass(score);
  const lbl = regionScoreLabel(score);
  return `<div class="region-score region-${cls}">
    <div class="rs-head"><span class="rs-label">${lbl} dans votre région</span><span class="rs-pct">${score}%</span></div>
    <div class="rs-bar"><div class="rs-fill" style="width:${score}%"></div></div>
  </div>`;
}

function companionGridHTML() {
  const rows = COMPANION_DATA.map(c => `
    <div class="comp-row">
      <div class="comp-veg"><span class="comp-veg-icon">${c.icon}</span><span class="comp-veg-name">${escapeHTML(c.plant)}</span></div>
      <div class="comp-lists">
        <div class="comp-line"><span class="comp-tag comp-tag-good">✓ avec</span>${c.good.map(x=>`<span class="comp-chip comp-chip-good">${escapeHTML(x)}</span>`).join('')}</div>
        <div class="comp-line"><span class="comp-tag comp-tag-bad">✗ éviter</span>${c.avoid.map(x=>`<span class="comp-chip comp-chip-bad">${escapeHTML(x)}</span>`).join('')}</div>
      </div>
    </div>`).join('');
  const flowers = COMPANION_FLOWERS.map(f => `
    <div class="comp-flower">
      <span class="comp-flower-icon">${f.icon}</span>
      <div><div class="comp-flower-name">${escapeHTML(f.name)}</div><div class="comp-flower-role">${escapeHTML(f.role)}</div></div>
    </div>`).join('');
  return `
    <div class="comp-grid">${rows}</div>
    <div class="comp-flowers-title">🌸 Fleurs alliées à glisser partout</div>
    <div class="comp-flowers">${flowers}</div>`;
}

function renderGuide() {
  const el = document.getElementById('guide-content');
  if (!el) return;
  const isBegin = state.profile && state.profile.level === 'beginner';
  const seen = new Set(state.profile?.guideSeen || []);
  el.innerHTML = GUIDE_SECTIONS.map(s => `
    <div class="guide-card card mb-3" data-gid="${s.id}">
      <div class="guide-head">
        <div class="guide-icon guide-icon-${s.color}">${s.icon}</div>
        <div class="guide-meta">
          <div class="guide-htitle">${escapeHTML(s.title)}</div>
          <div class="xsmall muted">${s.type === 'companion' ? COMPANION_DATA.length + ' légumes associés' : s.tips.length + ' conseils'}${seen.has(s.id) ? ' · <span style="color:var(--green-dark)">✓ Lu</span>' : ''}</div>
        </div>
        <div class="guide-chevron">›</div>
      </div>
      <div class="guide-body" style="display:none">
        <ul class="guide-list">${s.tips.map(t => `<li>${escapeHTML(t)}</li>`).join('')}</ul>
        ${s.type === 'companion' ? companionGridHTML() : ''}
        ${isBegin && !seen.has(s.id) ? `<button class="btn primary sm mt-3" data-guide-read="${s.id}">✓ Marquer comme lu (+5 XP)</button>` : ''}
      </div>
    </div>`).join('');

  el.querySelectorAll('.guide-card').forEach(card => {
    card.querySelector('.guide-head').addEventListener('click', () => {
      const body = card.querySelector('.guide-body');
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : 'block';
      card.querySelector('.guide-chevron').textContent = open ? '›' : '∨';
    });
  });
  el.querySelectorAll('[data-guide-read]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.guideRead;
      if (!state.profile.guideSeen) state.profile.guideSeen = [];
      if (!state.profile.guideSeen.includes(id)) {
        state.profile.guideSeen.push(id);
        awardXP('guide_read');
        checkMilestones();
        saveState();
      }
      btn.textContent = '✓ Lu'; btn.disabled = true;
      const meta = btn.closest('.guide-card').querySelector('.xsmall.muted');
      if (meta) meta.innerHTML = `${GUIDE_SECTIONS.find(s=>s.id===id)?.tips.length||0} conseils · <span style="color:var(--green-dark)">✓ Lu</span>`;
    });
  });
}

/* ============================================================
   TUTORIEL
   ============================================================ */
const TUTORIAL_STEPS = [
  { sel:'.greet,.hero-card', title:'Votre tableau de bord',   text:'Vue quotidienne : alertes sur vos plantes, tâches du jour, météo et semaine en un coup d\'œil.' },
  { sel:'#alerts-list',      title:'Alertes instantanées',    text:'Vos plantes qui ont besoin d\'attention apparaissent ici en priorité. Couleur rouge = urgent.' },
  { sel:'.stats',            title:'Vos statistiques',        text:'Plantes en terre, arrosages à faire aujourd\'hui, récoltes en attente et votre série de jours actifs.' },
  { sel:'.fab',              title:'Ajout rapide ⚡',          text:'Le bouton + vous permet d\'ajouter une tâche, une plante ou une note en 3 secondes depuis n\'importe quelle page.' },
  { sel:'[data-nav="catalog"]', title:'📍 Taux de réussite par région', text:'Le catalogue affiche la compatibilité climatique de chaque plante pour votre région — de "Excellent" à "Difficile". Configurez ou changez votre région depuis le bandeau en haut du catalogue.' },
  { sel:'nav.bottom-nav,.sidebar', title:'Navigation',         text:'Accédez à votre jardin, catalogue, guide, calendrier et journal. La serre et le jardin sont bien séparés dans "Jardin".' },
  { sel:'[data-view="guide"].view', title:'Le Guide du potager', text:'Le guide complet — sol, compagnonnage (quoi planter ensemble), semis, arrosage, ravageurs, rotation, récolte et arboriculture — accessible à tout moment.' },
];

let tutStep = 0;

function startTutorial() {
  setView('dashboard');
  tutStep = 0;
  const ov = document.getElementById('tutorial-overlay');
  ov.style.display = 'flex';
  renderTutStep();
}

function renderTutStep() {
  const steps = TUTORIAL_STEPS;
  const s = steps[tutStep];
  if (!s) { endTutorial(); return; }
  document.getElementById('tut-num').textContent = tutStep + 1;
  document.getElementById('tut-total').textContent = steps.length;
  document.getElementById('tut-title').textContent = s.title;
  document.getElementById('tut-text').textContent = s.text;
  document.getElementById('tut-next').textContent = tutStep < steps.length - 1 ? 'Suivant →' : 'Terminer ✓';
  const ov = document.getElementById('tutorial-overlay');
  const hl = document.getElementById('tut-highlight');
  const card = document.getElementById('tut-card');
  const sels = s.sel.split(',').map(x=>x.trim());
  let target = null;
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (el) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) { target = el; break; } }
  }
  if (target) {
    // Amène la cible dans le viewport si elle dépasse (sauf éléments fixes : fab, nav), puis mesure
    const pos = getComputedStyle(target).position;
    const isFixed = pos === 'fixed' || pos === 'sticky';
    const r0 = target.getBoundingClientRect();
    if (!isFixed && (r0.top < 80 || r0.bottom > window.innerHeight - 80)) {
      target.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    const r = target.getBoundingClientRect(); const pad = 8;
    // Le highlight est position:absolute dans un overlay fixed → coordonnées viewport, sans scrollY.
    ov.style.background = 'transparent';
    hl.style.display = 'block';
    hl.style.top = (r.top - pad) + 'px';
    hl.style.left = (r.left - pad) + 'px';
    hl.style.width = (r.width + pad * 2) + 'px';
    hl.style.height = (r.height + pad * 2) + 'px';
    const spaceBelow = window.innerHeight - r.bottom;
    if (spaceBelow > 220) { card.style.top = (r.bottom + 18) + 'px'; card.style.bottom = ''; }
    else { card.style.bottom = (window.innerHeight - r.top + 16) + 'px'; card.style.top = ''; }
    card.style.left = '50%'; card.style.transform = 'translateX(-50%)'; card.style.position = 'fixed';
  } else {
    // Pas de cible visible → l'overlay assure lui-même l'assombrissement
    ov.style.background = 'rgba(0,0,0,.6)';
    hl.style.display = 'none';
    card.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)';
  }
}

function nextTutStep() { tutStep++; if (tutStep >= TUTORIAL_STEPS.length) { endTutorial(); return; } renderTutStep(); }

function endTutorial() {
  document.getElementById('tutorial-overlay').style.display = 'none';
  document.getElementById('tut-highlight').style.display = 'none';
  if (state.profile) { state.profile.tutorialDone = true; saveState(); }
  flash('Tutoriel terminé — bonne culture ! 🌱');
}

/* ============================================================
   QUESTIONNAIRE D'ACCUEIL
   ============================================================ */
let surveyData = {};

function renderSurveyStep(step) {
  document.querySelectorAll('.sv-step').forEach(s => s.classList.toggle('active', +s.dataset.step === step));
  document.querySelectorAll('.sv-dot').forEach((d, i) => d.classList.toggle('on', i < step));
}

function selectExperience(level) {
  surveyData.experience = level;
  surveyData.level = level === 'lots' ? 'expert' : 'beginner';
  renderSurveyStep(3);
}

function selectSpaceType(type) {
  surveyData.spaceType = type;
  renderSurveyStep(4);
}

function selectRegion(id) {
  surveyData.region = id;
  buildSurveyResult();
  renderSurveyStep(5);
}

function buildSurveyResult() {
  const isBegin = surveyData.level === 'beginner';
  const spaceLabel = { jardin:'jardin', serre:'serre', both:'jardin et serre' }[surveyData.spaceType] || '';
  const el = document.getElementById('sv-result-step');
  if (isBegin) {
    el.innerHTML = `
      <div class="center mb-3"><div style="font-size:60px">🎉</div></div>
      <h2 class="sv-q">Parfait, on s'adapte à vous !</h2>
      <div class="card mt-3" style="background:var(--green-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">🌱</span>
          <div>
            <div style="font-weight:800;margin-bottom:4px">Mode Débutant activé</div>
            <div class="small muted">Guide pas-à-pas · Système d'XP et d'étoiles · Conseils contextuels</div>
          </div>
        </div>
      </div>
      <div class="card mt-3" style="background:var(--earth-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">📚</span>
          <div class="small">Le <b>Guide du Potager</b> est disponible à tout moment dans le menu — il couvre le sol, les semis, l'arrosage, les ravageurs, la récolte et les fruitiers.</div>
        </div>
      </div>
      <div class="card mt-3" style="border:1px solid var(--line)">
        <div class="small muted">Espace : <b>${spaceLabel}</b></div>
        ${surveyData.region ? `<div class="small muted mt-2">Région : <b>${REGIONS.find(r=>r.id===surveyData.region)?.emoji} ${REGIONS.find(r=>r.id===surveyData.region)?.label}</b></div>` : ''}
      </div>
      <div class="card mt-3 sv-notif-card">
        <div class="row gap-2">
          <span style="font-size:28px">🔔</span>
          <div style="flex:1">
            <div style="font-weight:800;margin-bottom:4px">Activer les rappels</div>
            <div class="small muted">Arrosages, maladies et alertes — ne ratez plus rien.</div>
          </div>
        </div>
        <button class="btn primary mt-3" style="width:100%" onclick="handleSurveyNotifRequest(this)">🔔 Activer les notifications</button>
      </div>
      <button class="btn primary sv-cta mt-4" onclick="finishSurvey()">Lancer l'application →</button>`;
  } else {
    el.innerHTML = `
      <div class="center mb-3"><div style="font-size:60px">🏆</div></div>
      <h2 class="sv-q">Bienvenue, expert !</h2>
      <div class="card mt-3" style="background:var(--green-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">🌿</span>
          <div>
            <div style="font-weight:800;margin-bottom:4px">Accès complet déverrouillé</div>
            <div class="small muted">32 plantes · Catalogue complet · Toutes les fonctionnalités disponibles</div>
          </div>
        </div>
      </div>
      <div class="card mt-3" style="border:1px solid var(--line)">
        <div class="small muted">Le Guide reste accessible si besoin depuis le menu 📚<br>Espace : <b>${spaceLabel}</b>${surveyData.region ? `<br>Région : <b>${REGIONS.find(r=>r.id===surveyData.region)?.emoji} ${REGIONS.find(r=>r.id===surveyData.region)?.label}</b>` : ''}</div>
      </div>
      <div class="card mt-3 sv-notif-card">
        <div class="row gap-2">
          <span style="font-size:28px">🔔</span>
          <div style="flex:1">
            <div style="font-weight:800;margin-bottom:4px">Activer les rappels</div>
            <div class="small muted">Arrosages, alertes maladies et taille des fruitiers.</div>
          </div>
        </div>
        <button class="btn primary mt-3" style="width:100%" onclick="handleSurveyNotifRequest(this)">🔔 Activer les notifications</button>
      </div>
      <button class="btn primary sv-cta mt-4" onclick="finishSurvey()">Accéder à l'application →</button>`;
  }
}

function finishSurvey() {
  state.profile = state.profile || {};
  Object.assign(state.profile, {
    surveyed: true,
    level: surveyData.level,
    experience: surveyData.experience,
    spaceType: surveyData.spaceType,
    region: surveyData.region || null,
    xp: 0, stars: 0, milestones: [], tutorialDone: false, guideSeen: []
  });
  // Ajuster les parcelles selon l'espace.
  // Sécurité : ne jamais supprimer une parcelle qui contient des plantes.
  const hasPlants = b => (b.cells || []).some(Boolean);
  if (surveyData.spaceType === 'jardin') {
    state.beds = state.beds.filter(b => (b.type||'jardin') === 'jardin' || hasPlants(b));
  } else if (surveyData.spaceType === 'serre') {
    state.beds = state.beds.filter(b => b.type === 'serre' || hasPlants(b));
    if (!state.beds.some(b => b.type === 'serre')) {
      state.beds.push({ id:'b'+Date.now(), name:'Serre', type:'serre', cols:3, rows:2, cells:Array(6).fill(null) });
    }
  }
  if (!state.beds.length) {
    state.beds = [{ id:'b'+Date.now(), name:'Jardin', type:'jardin', cols:4, rows:3, cells:Array(12).fill(null) }];
  }
  if (!state.beds.find(b => b.id === state.activeBedId)) state.activeBedId = state.beds[0].id;
  state.gardenTab = surveyData.spaceType === 'both' ? 'all' : (surveyData.spaceType || 'all');
  state.onboarded = true;
  syncGardenTasks();
  closeModal('survey-backdrop');
  setTimeout(() => startTutorial(), 400);
}

/* ============================================================
   DEFAULT STATE
   ============================================================ */
const DEFAULT_STATE = {
  profile: {
    surveyed: false,
    level: null,         // 'beginner' | 'expert'
    experience: null,    // 'none' | 'some' | 'lots'
    spaceType: null,     // 'jardin' | 'serre' | 'both'
    xp: 0,
    stars: 0,
    milestones: [],
    tutorialDone: false,
    guideSeen: [],
    region: null,
  },
  beds: [
    { id:'b1', name:'Jardin', type:'jardin', cols:4, rows:3, cells:[
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
    { id:'b2', name:'Serre', type:'serre', cols:3, rows:2, cells:[
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
  prefs: {
    digest:true, weather:true, quiet:true, pushAsked:false, pushOn:false,
    darkMode:false,
    alertMildiou:true, alertTraitement:true, alertParasite:true,
    alertTaille:true, alertTraitementArbo:true, alertGreffage:true
  },
  onboarded: false,
  gardenTab: 'all',
  draft: null,
  streak: 7,
  weather: null,
  shopping: []
};

const STORAGE_KEY = 'potager.state.v2.fr';
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const def = JSON.parse(JSON.stringify(DEFAULT_STATE));
    const saved = JSON.parse(raw);
    const merged = { ...def, ...saved };
    merged.prefs   = { ...def.prefs,   ...(saved.prefs   || {}) };
    merged.profile = { ...def.profile, ...(saved.profile || {}) };
    return merged;
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

/* ============================================================
   THÈME (mode sombre)
   ============================================================ */
function applyTheme() {
  const dark = state.prefs?.darkMode;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

function toggleDarkMode() {
  state.prefs.darkMode = !state.prefs.darkMode;
  saveState();
  applyTheme();
  const btn = document.getElementById('acc-darkmode');
  if (btn) btn.querySelector('.at').textContent = state.prefs.darkMode ? '🌙 Mode sombre' : '☀️ Mode clair';
}

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
  const regionLbl = document.getElementById('acc-region-label');
  if (regionLbl) {
    const rid = state.profile?.region;
    const r = rid ? REGIONS.find(x => x.id === rid) : null;
    regionLbl.textContent = r ? `${r.emoji} ${r.label}` : 'Non renseignée — touchez pour configurer';
  }
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
  closePanel();
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.dataset.view === name));
  document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
  if (name === 'dashboard') renderDashboard();
  if (name === 'garden')    renderGarden();
  if (name === 'catalog')   renderCatalog();
  if (name === 'guide')     renderGuide();
  if (name === 'calendar')  renderCalendar();
  if (name === 'journal')   renderJournal();
  if (name === 'reminders') renderReminders();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   SYNCHRONISATION JARDIN → TÂCHES / CALENDRIER
   Le tableau de bord et le calendrier reflètent toujours le
   contenu réel du jardin :
   1. Purge des tâches liées à des plantes qui ne sont plus là.
   2. Génération auto des arrosages (7 jours) selon waterEvery.
   ============================================================ */
function syncGardenTasks() {
  const todayStr = iso(new Date());
  const present = new Set(state.beds.flatMap(b => (b.cells || []).filter(Boolean).map(c => c.plant)));

  state.tasks = (state.tasks || []).filter(t => {
    if (t.done) return true;                          // historique conservé
    if (t.auto && t.date < todayStr) return false;    // arrosage auto expiré
    if (t.plantId && !present.has(t.plantId)) return false; // plante retirée du jardin
    return true;
  });

  const keys = new Set(state.tasks.map(t => `${t.plantId}|${t.kind}|${t.date}`));
  const today = new Date();
  state.beds.forEach(bed => (bed.cells || []).filter(Boolean).forEach(cell => {
    const p = plantById(cell.plant);
    if (!p || !p.waterEvery) return;
    const plantedAt = parseISO(cell.planted);
    for (let i = 0; i < 7; i++) {
      const d = parseISO(iso(addDays(today, i)));
      const age = daysBetween(plantedAt, d);
      if (age <= 0 || age % p.waterEvery !== 0) continue;
      const key = `${p.id}|water|${iso(d)}`;
      if (keys.has(key)) continue;
      keys.add(key);
      state.tasks.push({ id:'t' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title:`Arroser : ${p.name}`, kind:'water', date: iso(d), done:false, plantId:p.id, auto:true });
    }
  }));
  saveState();
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const today = new Date();
  const fmt = today.toLocaleDateString('fr-FR', { weekday:'long', month:'long', day:'numeric' });
  document.getElementById('today-date').textContent = fmt;
  const hour = today.getHours();
  const greet = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const userName = currentUser ? (currentUser.displayName || '').split(' ')[0] : '';
  document.getElementById('greeting').textContent = userName ? `${greet}, ${userName} 👋` : `${greet} 👋`;

  // Hero deco — adapté à l'heure / saison
  const heroDecoEl = document.getElementById('hero-deco');
  if (heroDecoEl) {
    const deco = hour < 7 ? '🌙' : hour < 12 ? '☀️' : hour < 18 ? '🌻' : '🌿';
    heroDecoEl.textContent = deco;
  }

  // Contextual subtitle
  const urgentCount = state.beds.flatMap(b => (b.cells||[]).filter(c => c && c.status === 'urgent')).length;
  const greetSubEl = document.getElementById('greet-sub');
  if (greetSubEl) {
    if (urgentCount > 0) {
      greetSubEl.textContent = `🚨 ${urgentCount} plante${urgentCount > 1 ? 's' : ''} nécessite${urgentCount > 1 ? 'nt' : ''} votre attention !`;
    } else if ((state.streak || 0) >= 7) {
      greetSubEl.textContent = `🔥 ${state.streak} jours de suite — continuez comme ça !`;
    } else {
      greetSubEl.textContent = 'Tout va bien dans votre potager. 🌱';
    }
  }

  // Weather widget
  fetchWeather();
  renderWeatherWidget();

  updateNavBadges();

  // XP widget (débutants uniquement)
  renderXPWidget();

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
      if (t.done) { awardXP('task_done'); if (t.kind === 'harvest') awardXP('harvest_done'); checkMilestones(); }
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
  // Onglets Jardin / Serre
  const gt = state.gardenTab || 'all';
  document.querySelectorAll('.gtab').forEach(b => b.classList.toggle('active', b.dataset.gt === gt));
  const titleMap = { all:'Le potager', jardin:'Jardin (plein air)', serre:'Serre (sous abri)' };
  const titleEl = document.getElementById('garden-title');
  if (titleEl) titleEl.textContent = titleMap[gt] || 'Le potager';

  // Filtrer les parcelles selon l'onglet
  const allBeds = state.beds;
  const beds = gt === 'all' ? allBeds : allBeds.filter(b => (b.type || 'jardin') === gt);

  // Si la parcelle active n'est pas dans le filtre, changer
  if (beds.length && !beds.find(b => b.id === state.activeBedId)) {
    state.activeBedId = beds[0].id;
  }

  const bar = document.getElementById('beds-toolbar');
  const bedIcon = b => b.type === 'serre' ? '🏡' : '🌿';
  bar.innerHTML = beds.map(b => `<button class="bed-tab ${b.id === state.activeBedId ? 'active' : ''}" data-bed="${b.id}">${bedIcon(b)} ${escapeHTML(b.name)}<span class="x">${(b.cells||[]).filter(Boolean).length}/${(b.cols||4)*(b.rows||3)}</span></button>`).join('');
  bar.querySelectorAll('[data-bed]').forEach(b => b.addEventListener('click', () => { state.activeBedId = b.dataset.bed; saveState(); renderGarden(); }));

  updateNavBadges();

  const stage = document.getElementById('bed-stage');
  const emptyEl = document.getElementById('garden-empty');
  const bed = beds.find(b => b.id === state.activeBedId) || beds[0];
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
      const age = daysBetween(parseISO(c.planted), new Date());
      const hbadge = c.status === 'urgent' ? '🚨' : c.status === 'warn' ? '⚠️' : '🌿';
      return `<div class="cell has-plant" draggable="true" data-idx="${i}" data-cell="${c.id}">
        <span class="cell-status-bar" style="background:${statusColor(c.status)}"></span>
        <div class="cell-emoji">${p ? p.icon : '❓'}</div>
        <div class="cell-name">${p ? p.name : '?'}</div>
        <div class="cell-footer">
          <span class="cell-days">${age}j</span>
          <span class="cell-hbadge">${hbadge}</span>
        </div>
      </div>`;
    }
    return `<div class="cell" data-idx="${i}"><div class="cell-empty-inner"><span class="cell-plus">+</span><span class="cell-plus-label">Planter</span></div></div>`;
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

function updateNavBadges() {
  const urgentCount = state.beds.flatMap(b => (b.cells||[]).filter(c => c && c.status === 'urgent')).length;
  const wrap = document.querySelector('[data-nav="garden"] .nav-badge-wrap');
  if (!wrap) return;
  let badge = wrap.querySelector('.nav-badge');
  if (urgentCount > 0) {
    if (!badge) { badge = document.createElement('span'); badge.className = 'nav-badge'; wrap.appendChild(badge); }
    badge.textContent = urgentCount;
  } else if (badge) {
    badge.remove();
  }
}

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

    ${(() => { const sc = regionScore(cell.plant); return sc !== null ? `<div class="pd-section"><h4>Compatibilité régionale</h4>${regionScoreHTML(sc)}</div>` : ''; })()}
    ${companions.length ? `<div class="pd-section">
      <h4>Bons voisinages</h4>
      <div class="row gap-2" style="flex-wrap:wrap">
        ${companions.map(c => `<span class="chip earth">🤝 ${escapeHTML(c)}</span>`).join('')}
      </div>
    </div>` : ''}
    ${p && p.varieties && p.varieties.length ? `<div class="pd-section">
      <h4>Variétés populaires</h4>
      <div class="row gap-2" style="flex-wrap:wrap">
        ${p.varieties.map(v => `<span class="chip">${escapeHTML(v)}</span>`).join('')}
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

  document.getElementById('pd-water').onclick = () => {
    const todayStr = iso(new Date());
    const t = (state.tasks || []).find(t => !t.done && t.kind === 'water' && t.plantId === cell.plant && t.date <= todayStr);
    if (t) { t.done = true; saveState(); awardXP('task_done'); checkMilestones(); }
    flash('Arrosée ✓');
    closePanel();
  };
  document.getElementById('pd-remove').onclick = () => {
    confirmDialog({
      title: `Retirer ${p ? p.name : 'cette plante'} ?`,
      msg: 'La plante sera retirée de cette cellule. Ses tâches en attente seront aussi supprimées.',
      yesLabel: 'Oui, retirer',
      onYes: () => { bed.cells[idx] = null; syncGardenTasks(); closePanel(); renderGarden(); }
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
  const typeEl = document.getElementById('bed-modal-type');
  if (typeEl) typeEl.value = bed ? (bed.type || 'jardin') : (state.gardenTab !== 'all' ? state.gardenTab : 'jardin');
  document.getElementById('bed-modal-save').onclick = () => saveBedModal(bedId);
  openModal('bed-modal-backdrop');
}

function saveBedModal(editId) {
  const name = document.getElementById('bed-modal-name').value.trim();
  if (!name) { flash('Donnez un nom à la parcelle'); return; }
  const cols = clampInt(document.getElementById('bed-modal-cols').value, 2, 10, 4);
  const rows = clampInt(document.getElementById('bed-modal-rows').value, 2, 10, 3);
  const typeEl = document.getElementById('bed-modal-type');
  const type = typeEl ? typeEl.value : 'jardin';
  if (editId) {
    const bed = state.beds.find(b => b.id === editId);
    if (bed) { bed.name = name; bed.type = type; bed.cols = cols; bed.rows = rows; while (bed.cells.length < cols*rows) bed.cells.push(null); bed.cells.length = cols*rows; }
  } else {
    const newBed = { id:'b'+Date.now(), name, type, cols, rows, cells: Array(cols*rows).fill(null) };
    state.beds.push(newBed);
    state.activeBedId = newBed.id;
  }
  syncGardenTasks(); closeModal('bed-modal-backdrop'); renderGarden();
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
      syncGardenTasks(); renderGarden();
    }
  });
}

/* ============================================================
   CATALOG
   ============================================================ */
let catalogFilter = { q:'', category:'all', season:'all', difficulty:'all' };

function renderRegionPrompt() {
  const el = document.getElementById('region-catalog-prompt');
  if (!el) return;
  const rid = state.profile?.region;
  const r = rid ? REGIONS.find(x => x.id === rid) : null;
  if (!r) {
    el.innerHTML = `<div class="region-prompt-banner">
      <span class="rpb-icon">📍</span>
      <div class="rpb-body">
        <div class="rpb-title">Configurez votre région</div>
        <div class="rpb-sub">Affichez le taux de réussite de chaque plante pour votre climat.</div>
      </div>
      <button class="btn primary sm" id="rpb-set">Configurer →</button>
    </div>`;
    document.getElementById('rpb-set').onclick = openRegionModal;
  } else {
    el.innerHTML = `<div class="region-prompt-banner region-prompt-set">
      <span class="rpb-icon">${r.emoji}</span>
      <div class="rpb-body">
        <div class="rpb-title">${escapeHTML(r.label)}</div>
        <div class="rpb-sub">Les taux de réussite sont affichés pour votre région.</div>
      </div>
      <button class="btn ghost sm" id="rpb-change">Changer</button>
    </div>`;
    document.getElementById('rpb-change').onclick = openRegionModal;
  }
}

function renderCatalog() {
  renderRegionPrompt();
  const f = document.getElementById('catalog-filters');
  const filterGroups = [
    { label:'Type', chips:[
      { k:'category', v:'all',            label:'Toutes catégories' },
      { k:'category', v:'legume',          label:'🥕 Légumes' },
      { k:'category', v:'herbe',           label:'🌿 Herbes' },
      { k:'category', v:'fruit',           label:'🍓 Fruits' },
      { k:'category', v:'arbre-fruitier',  label:'🌳 Fruitiers' },
    ]},
    { label:'Saison', chips:[
      { k:'season', v:'all',     label:'Toutes saisons' },
      { k:'season', v:'spring',  label:'🌷 Printemps' },
      { k:'season', v:'summer',  label:'☀️ Été' },
      { k:'season', v:'autumn',  label:'🍂 Automne' },
      { k:'season', v:'winter',  label:'❄️ Hiver' },
    ]},
    { label:'Niveau', chips:[
      { k:'difficulty', v:'all', label:'Tous niveaux' },
      { k:'difficulty', v:'1',   label:'🟢 Facile' },
      { k:'difficulty', v:'2',   label:'🟡 Moyen' },
      { k:'difficulty', v:'3',   label:'🔴 Délicat' },
    ]},
  ];
  f.innerHTML = filterGroups.map(g =>
    `<div class="filter-group"><span class="filter-group-label">${g.label}</span>${g.chips.map(x => `<button class="filter-chip ${catalogFilter[x.k] === x.v ? 'active' : ''}" data-k="${x.k}" data-v="${x.v}">${x.label}</button>`).join('')}</div>`
  ).join('');
  f.querySelectorAll('.filter-chip').forEach(b => b.addEventListener('click', () => { catalogFilter[b.dataset.k] = b.dataset.v; renderCatalog(); }));

  const q = catalogFilter.q.trim().toLowerCase();
  const list = CATALOG.filter(p => {
    if (q && !p.name.toLowerCase().includes(q) && !(p.family||'').toLowerCase().includes(q) && !(p.sci||'').toLowerCase().includes(q)) return false;
    if (catalogFilter.category !== 'all' && p.category !== catalogFilter.category) return false;
    if (catalogFilter.season !== 'all' && !(p.season||[]).includes(catalogFilter.season)) return false;
    if (catalogFilter.difficulty !== 'all' && p.difficulty !== +catalogFilter.difficulty) return false;
    return true;
  });

  const grid = document.getElementById('catalog-grid');
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ei">🔍</div><h3>Aucune plante ne correspond</h3><p>Retirez un filtre ou essayez un autre mot-clé.</p><button class="btn primary" id="reset-catalog">Réinitialiser</button></div>`;
    document.getElementById('reset-catalog').addEventListener('click', () => { catalogFilter = { q:'', category:'all', season:'all', difficulty:'all' }; document.getElementById('catalog-search').value = ''; renderCatalog(); });
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
        <span class="chip ${categoryColor(p.category)}">${categoryLabel(p.category)}</span>
        ${(p.season||[]).map(s => `<span class="chip green">${seasonLabel(s)}</span>`).join('')}
        ${(p.companions||[]).length ? `<span class="chip earth">🤝 ${escapeHTML((p.companions||[]).slice(0,2).join(', '))}</span>` : ''}
      </div>
      ${(() => { const sc = regionScore(p.id); return sc !== null ? regionScoreHTML(sc) : ''; })()}
      ${p.varieties && p.varieties.length ? `<div class="cat-varieties"><span class="cat-var-label">Variétés :</span>${p.varieties.map(v => `<span class="cat-var-chip">${escapeHTML(v)}</span>`).join('')}</div>` : ''}
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
      syncGardenTasks();
      awardXP('plant_added');
      checkMilestones();
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
  const notifGranted = 'Notification' in window && Notification.permission === 'granted';
  const notifDenied = 'Notification' in window && Notification.permission === 'denied';
  if (!state.prefs.pushAsked && !notifGranted) {
    wrap.innerHTML = `<div class="push-prompt-active"><span class="pi">🔔</span><div class="pb"><div class="pt">Activer les notifications</div><div class="ps">Arrosage, gel, ravageurs — soyez alerté au bon moment.</div></div></div><div class="row gap-2 mb-4"><button class="btn primary" id="push-enable" style="flex:1">Activer</button><button class="btn ghost" id="push-skip">Plus tard</button></div>`;
    document.getElementById('push-enable').onclick = async () => {
      const result = await requestNotificationPermission();
      if (result === 'granted') { flash('Notifications activées ✓'); initNotificationScheduler(); }
      else if (result === 'denied') flash('Bloquées — vérifiez les paramètres du navigateur');
      renderReminders();
    };
    document.getElementById('push-skip').onclick = () => { state.prefs.pushAsked = true; saveState(); renderReminders(); };
  } else if (notifDenied) {
    wrap.innerHTML = `<div class="push-prompt" style="background:var(--urgent-tint);border-color:#f0bdb9;color:var(--urgent)"><span class="pi">🔕</span><div class="pb"><div class="pt">Notifications bloquées</div><div class="small">Autorisez-les dans les paramètres de votre navigateur.</div></div></div>`;
  } else if (notifGranted) {
    wrap.innerHTML = `<div class="push-prompt" style="border-color:#c6e1bd"><span class="pi">✓</span><div class="pb"><div class="pt" style="color:var(--green-dark)">Notifications actives</div><div class="small muted">Vous recevrez les rappels arrosage et alertes maladies.</div></div></div>`;
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
    syncGardenTasks();
    awardXP('plant_added');
    checkMilestones();
    flash(`${plantById(plantId)?.name || plantId} ajoutée ✓`);
  } else if (type === 'note') {
    const text = (document.querySelector('[data-draft="note-text"]').value || '').trim();
    if (!text) { flash("Écrivez une note d'abord"); return; }
    const tag = document.querySelector('[data-draft="note-tag"]').value;
    const subject = document.querySelector('[data-draft="note-subject"]').value || 'Général';
    state.journal = state.journal || [];
    state.journal.push({ id:'j'+Date.now(), date: iso(new Date()), subject, icon:'🌿', text, tags: tag ? [tag] : [] });
    awardXP('journal_entry'); checkMilestones();
    flash('Note enregistrée ✓');
  }
  state.draft = null; saveState();
  document.querySelectorAll('[data-draft]').forEach(el => { if (el.type !== 'date' && el.tagName !== 'SELECT') el.value = ''; });
  closeModal('quickadd-backdrop');
  const active = document.querySelector('.view.active');
  if (active) setView(active.dataset.view);
}

/* ============================================================
   ONBOARDING (legacy — remplacé par le questionnaire)
   ============================================================ */

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
function openPrivacyModal() {
  closeModal('acc-backdrop');
  openModal('privacy-modal-backdrop');
}

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
function categoryLabel(c) { return ({'legume':'Légume','herbe':'Herbe','fruit':'Fruit','arbre-fruitier':'🌳 Fruitier'})[c] || (c||''); }
function categoryColor(c) { return ({'arbre-fruitier':'earth'})[c] || 'green'; }

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

function openRegionModal() {
  const choices = document.getElementById('region-modal-choices');
  const cur = state.profile?.region;
  choices.innerHTML = REGIONS.map(r => `
    <button class="sv-choice region-choice ${cur === r.id ? 'active' : ''}" data-rid="${r.id}">
      <div class="sv-ci">${r.emoji}</div>
      <div class="sv-cd">
        <div class="sv-ct">${escapeHTML(r.label)}</div>
        <div class="sv-cs">${escapeHTML(r.desc)}</div>
      </div>
      ${cur === r.id ? '<div class="sv-arrow" style="color:var(--green)">✓</div>' : '<div class="sv-arrow">›</div>'}
    </button>`).join('');
  choices.querySelectorAll('[data-rid]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.profile) state.profile = {};
      state.profile.region = btn.dataset.rid;
      saveState();
      closeModal('region-modal-backdrop');
      closeModal('acc-backdrop');
      flash(`Région mise à jour : ${REGIONS.find(r=>r.id===btn.dataset.rid)?.label} ✓`);
      const active = document.querySelector('.view.active');
      if (active) setView(active.dataset.view);
    });
  });
  openModal('region-modal-backdrop');
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
  document.getElementById('region-modal-close').addEventListener('click', () => closeModal('region-modal-backdrop'));
  document.getElementById('acc-region').addEventListener('click', () => { closeModal('acc-backdrop'); openRegionModal(); });
  document.getElementById('acc-replay-tutorial').addEventListener('click', () => {
    closeModal('acc-backdrop');
    startTutorial();
  });
  document.getElementById('acc-reset').addEventListener('click', () => {
    confirmDialog({
      title: 'Tout réinitialiser ?',
      msg: 'Plantes, tâches, journal, progression et questionnaire : tout sera effacé définitivement. L\'application redémarrera comme à la première visite.',
      yesLabel: 'Oui, tout effacer',
      onYes: async () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        try {
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister()));
          }
          if (window.caches) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          }
        } catch {}
        location.reload();
      }
    });
  });
  document.getElementById('acc-darkmode')?.addEventListener('click', toggleDarkMode);
  document.getElementById('acc-privacy')?.addEventListener('click', openPrivacyModal);
  document.getElementById('acc-shopping')?.addEventListener('click', () => { closeModal('acc-backdrop'); openShoppingList(); });

  // Symptom finder
  document.getElementById('symptom-btn')?.addEventListener('click', openSymptomFinder);
  document.getElementById('symptom-modal-close')?.addEventListener('click', () => closeModal('symptom-modal-backdrop'));

  // Shopping list
  document.getElementById('shopping-modal-close')?.addEventListener('click', () => closeModal('shopping-modal-backdrop'));

  // Privacy policy
  document.getElementById('privacy-modal-close')?.addEventListener('click', () => closeModal('privacy-modal-backdrop'));
  document.getElementById('privacy-modal-close-btn')?.addEventListener('click', () => closeModal('privacy-modal-backdrop'));

  // Click-outside to close modals (sauf questionnaire et auth : obligatoires)
  const PROTECTED_MODALS = ['survey-backdrop', 'auth-backdrop'];
  document.querySelectorAll('.modal-backdrop').forEach(bd => bd.addEventListener('click', e => { if (e.target === bd && !PROTECTED_MODALS.includes(bd.id)) { bd.classList.remove('open'); document.body.style.overflow = ''; } }));

  // ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => { if (!PROTECTED_MODALS.includes(m.id)) { m.classList.remove('open'); document.body.style.overflow = ''; } });
      closePanel();
    }
  });

  // Garden type tabs
  document.querySelectorAll('.gtab').forEach(b => {
    b.addEventListener('click', () => {
      state.gardenTab = b.dataset.gt;
      saveState();
      renderGarden();
    });
  });

  // Tutorial
  const tutNext = document.getElementById('tut-next');
  if (tutNext) tutNext.addEventListener('click', nextTutStep);
  const tutSkip = document.getElementById('tut-skip');
  if (tutSkip) tutSkip.addEventListener('click', endTutorial);
  const restartTut = document.getElementById('guide-restart-tut');
  if (restartTut) restartTut.addEventListener('click', startTutorial);

  // Guide topbar button
  const topbarGuide = document.getElementById('topbar-guide');
  if (topbarGuide) topbarGuide.addEventListener('click', () => setView('guide'));

  // Synchroniser tâches/calendrier avec le contenu réel du jardin
  syncGardenTasks();

  // Render initial view
  renderDashboard();
  renderGarden();

  // Start notification scheduler if permission already granted
  initNotificationScheduler();

  // Apply theme
  applyTheme();

  // Questionnaire (remplace l'ancien onboarding)
  if (!state.profile || !state.profile.surveyed) {
    surveyData = {};
    renderSurveyStep(1);
    openModal('survey-backdrop');
  }
}

/* ============================================================
   INIT — Firebase auth or direct boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Wire auth buttons immediately (before boot, before Firebase resolves)
  document.getElementById('google-signin').addEventListener('click', handleGoogleSignIn);
  document.getElementById('auth-skip').addEventListener('click', handleLocalMode);

  // Firebase warning
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
        openModal('auth-backdrop');
      }
    });
  } else {
    // No Firebase — show auth modal with local option
    openModal('auth-backdrop');
  }

  // Service worker : version network-first — les mises à jour de l'app
  // sont récupérées immédiatement, le cache ne sert que hors-ligne.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
