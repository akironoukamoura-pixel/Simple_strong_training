'use strict';
/* ================= ÉTAT & SAUVEGARDE (localStorage) ================= */
const KEY = 'muscu_v1';
let S = { flex:{}, flexN:0, chk:{}, tank:{m:'bike',s:10,r:6,on:true}, done:{}, rec:{}, tgt:{}, bonus:0, badges:{}, seq:0, maxStreak:0 };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const $ = s => document.querySelector(s);

/* ================= PROGRAMME (modifie ici les exercices) ================= */
// x(id, nom, séries, objectif, repos(s), type 'r'=reps / 't'=secondes, pose, consigne, record)
const x = (id,n,s,r,rest,t,p,tip,rec) => ({id,n,s,r,rest,t,p,tip,rec});
const E = {
  pompes: x('pompes','Pompes',4,12,60,'r','push','Corps gainé, poitrine au sol, poussée franche.','pompes'),
  pexp:   x('pexp','Pompes explosives',3,6,75,'r','push','Pousse fort : les mains décollent du sol.'),
  dips:   x('dips','Dips sur chaise',3,10,60,'r','push','Descends à 90°, remonte fort.','dips'),
  tract:  x('tract','Tractions',4,5,90,'r','pull','Menton au-dessus de la barre, descente contrôlée.','tractions'),
  neg:    x('neg','Négatives de tractions',3,3,60,'r','pull','Saute en haut, puis descends en 5 secondes : le meilleur moyen de gagner des tractions.'),
  rows:   x('rows','Rows inversés',4,10,60,'r','pull','Sous une table solide, tire la poitrine vers elle.'),
  super:  x('super','Supermans',3,15,45,'r','core','Ventre au sol, lève bras et jambes, serre le dos.'),
  squat:  x('squat','Squats sautés',4,12,60,'r','jump','Descends bas, saute le plus haut possible.','squat'),
  fentes: x('fentes','Fentes',3,12,60,'r','squat','Genou arrière près du sol, buste droit.'),
  banc:   x('banc','Montées sur banc',3,10,60,'r','squat','Monte avec une jambe, pousse dans le talon.'),
  burpee: x('burpee','Burpees',3,10,60,'r','jump','Pompe, saut, enchaîne sans pause.'),
  jambes: x('jambes','Relevés de jambes',3,15,45,'r','core','Lombaires plaquées au sol, jambes tendues.'),
  crunch: x('crunch','Crunchs',3,20,30,'r','core','Enroule le haut du dos, souffle en montant.'),
  bike:   x('bike','Crunchs vélo',3,30,30,'r','core','Coude vers genou opposé, sans à-coup.'),
  mont:   x('mont','Mountain climbers',3,30,45,'r','plank','Genoux vers la poitrine, rythme rapide.'),
  gaine:  x('gaine','Gainage (planche)',3,30,45,'t','plank','Corps aligné, ventre serré, respire.','gainage'),
  gaine2: x('gaine2','Gainage (planche)',3,45,45,'t','plank','Corps aligné, ventre serré, respire.','gainage')
};
const ORDER = ['A','B','C','D','E'];
const DAYS = {
  A: { n:'Pousser',          e:[E.pompes,E.pexp,E.dips,E.jambes,E.gaine] },
  B: { n:'Tirer',            e:[E.tract,E.rows,E.super,E.jambes,E.bike] },
  C: { n:'Jambes explosives',e:[E.squat,E.fentes,E.banc,E.crunch,E.gaine] },
  D: { n:'Full body + abdos',e:[E.burpee,E.pompes,E.tract,E.jambes,E.gaine2] },
  E: { n:'Abdos et gainage', e:[E.crunch,E.jambes,E.gaine2,E.bike,E.mont] }
};
Object.values(DAYS).forEach(d => d.e.splice(1, 0, E.neg));   // + négatives de tractions à chaque séance
const tgt = e => S.tgt[e.id] || e.r;           // objectif actuel (progression auto)
const unit = e => e.t === 't' ? ' s' : '';

/* ================= TROPHÉES ================= */
const BG = [];
[['tractions','Tractions',[1,5,10,15,20],'🧗'],['pompes','Pompes',[10,25,50,75,100],'💪'],
 ['dips','Dips',[10,20,30],'🪑'],['gainage','Gainage',[60,120,180],'🧱'],
 ['squat','Squats sautés',[20,40,60],'🦵']].forEach(([k,l,vals,i]) => vals.forEach(v =>
  BG.push({ id:k+v, i, t: k==='gainage' ? `${l} ${v/60} min` : `${l} × ${v}`,
            d: k==='gainage' ? 'tenu sans pause' : "d'affilée", ok:() => (S.rec[k]||0) >= v })));
[3,7,30,100].forEach(v => BG.push({ id:'s'+v, i:'🔥', t:`${v} jours`, d:'de série', ok:() => S.maxStreak >= v }));
[7,30].forEach(v => BG.push({ id:'f'+v, i:'🧘', t:'Souplesse', d:v+' routines', ok:() => S.flexN >= v }));
BG.push({ id:'expl', i:'⚡', t:'Explosif', d:'10 bonus faits', ok:() => S.bonus >= 10 });

function check() {                              // débloque les nouveaux badges
  const n = BG.filter(b => !S.badges[b.id] && b.ok());
  n.forEach(b => S.badges[b.id] = 1); save();
  n.forEach((b,i) => setTimeout(() => toast('🏆 ' + b.t), i * 2300));
  return n;
}
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2000); }

/* ================= OUTILS ================= */
const pad = n => String(n).padStart(2,'0');
const ds = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
function streak() {
  const d = new Date(); let n = 0;
  if (!S.done[ds(d)]) d.setDate(d.getDate() - 1);
  while (S.done[ds(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const QUOTES = ['La discipline bat la motivation.','Un pas de plus. Une rep de plus.','Le corps réussit ce que l\'esprit croit.',
 'Fort aujourd\'hui, plus fort demain.','Ne compte pas les jours, fais-les compter.','La constance fait les champions.',
 'Chaque rep te rapproche de ta meilleure version.','Pas d\'excuses, juste du travail.','Sois explosif. Reste patient.',
 'Le confort ne construit rien.','Tu n\'as pas à être parfait, juste présent.','Sueur aujourd\'hui, fierté ce soir.',
 'Ce que tu fais chaque jour compte plus que ce que tu fais parfois.','Bats l\'homme que tu étais hier.'];
const quote = () => QUOTES[Math.floor(new Date() / 864e5) % QUOTES.length];
const buzz = () => { try { navigator.vibrate && navigator.vibrate(200); const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(); o.frequency.value = 880; o.connect(c.destination); o.start(); o.stop(c.currentTime + .25); } catch (e) {} };

// Illustrations SVG minimalistes (bonhomme filaire) : [tête x, tête y, tracé]
const POSES = {
  push:  [84,25,'M12 46L76 30M76 30L78 48M12 46L6 50'],
  pull:  [50,18,'M15 5H85M42 5L48 26M58 5L52 26M50 26V46M50 46L44 58M50 46L56 58'],
  squat: [48,12,'M48 18L44 34L62 38L58 56M48 22L68 26'],
  plank: [86,28,'M20 42L80 32M80 32V46M20 42L12 48'],
  core:  [10,44,'M16 48H58L74 28M58 48L80 40'],
  jump:  [50,10,'M50 16V36L38 56M50 36L62 56M50 20L34 6M50 20L66 6']
};
const svg = p => { const [a,b,d] = POSES[p]; return `<svg viewBox="0 0 100 62"><circle cx="${a}" cy="${b}" r="6"/><path d="${d}"/></svg>`; };

/* ================= NAVIGATION ================= */
let lastView = '', view = 'home', W = null, B = null, tm = null, hm = 0;
const stop = () => clearInterval(tm);
function go(v) { stop(); view = v; draw(); }
function count(sec, end) {                      // compte à rebours
  let t = sec;
  tm = setInterval(() => {
    t--; const el = $('#t'); if (el) el.textContent = t;
    if (t <= 0) { stop(); buzz(); end(); }
  }, 1000);
}
function draw() {
  $('#nav').style.display = ['home','hist','troph','tips','flex'].includes(view) ? 'flex' : 'none';
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  $('#app').innerHTML = ({ home, hist, troph, work, rest, bonus, fin, tank, tips, flex, frun })[view]();
  if (view !== lastView) $('#app').scrollTop = 0; lastView = view;
  if (view === 'rest') count(W.r, () => go('work'));
  if (view === 'frun') count(STR[F.i][2], nextStr);
}
document.querySelectorAll('#nav button').forEach(b => b.onclick = () => go(b.dataset.v));

/* ================= ÉCRANS ================= */
function home() {
  const k = ORDER[S.seq % 5], D = DAYS[k], fait = !!S.done[ds(new Date())], T = S.tank;
  return `<header><div><small>Niveau ${Math.floor(S.seq/5)+1}</small><h1>Muscu</h1></div>
    <div class="st">🔥 <b>${streak()}</b><small>jours de suite</small></div></header>
    ${rankHTML()}<p class="quote">${quote()}</p>
    <section class="card"><small>${fait ? 'Prochaine séance' : 'Séance du jour'} (jour ${k})</small><h2>${D.n}</h2>
    <ul>${D.e.map(e => `<li>${svg(e.p)}<b>${e.n}</b><span>${e.s} × ${tgt(e)}${unit(e)}</span></li>`).join('')}</ul></section>
    <button class="big" onclick="start()">${fait ? 'Refaire une séance' : 'Commencer la séance'}</button>
    <section class="card tank" style="margin-top:16px"><small>Bonus facultatif</small><h3>⚡ Brûler le réservoir</h3>
    <p>${TANKS[T.m][0]} · ${T.s} s × ${T.r} rounds</p>
    <button class="ghost" onclick="go('tank')">Choisir et lancer</button>
    <div class="row"><span>Le proposer après la séance</span><button class="sw ${T.on ? 'on' : ''}" onclick="S.tank.on=!S.tank.on;save();draw()"></button></div></section>${chkHTML()}`;
}
function start() { W = { k:ORDER[S.seq % 5], i:0, s:0, v:null, miss:false, up:[], r:0 }; go('work'); }
const cur = () => DAYS[W.k].e[W.i];

function work() {
  const D = DAYS[W.k], e = cur(), g = tgt(e); if (W.v == null) W.v = g;
  return `<div class="topbar"><small>${D.n} · exercice ${W.i+1}/${D.e.length}</small><button class="x" onclick="if(confirm('Quitter la séance ?'))go('home')">✕</button></div>
    <div class="bar"><i style="width:${W.i / D.e.length * 100}%"></i></div>
    <div class="fig">${svg(e.p)}</div><h2>${e.n}</h2><p class="tip">${e.tip}</p>
    <p class="set">Série ${W.s+1}/${e.s} · objectif ${g}${unit(e)}</p><div class="dots">${Array.from({length:e.s},(_,i)=>`<i class="${i<W.s?'on':i===W.s?'cur':''}"></i>`).join('')}</div>
    <div class="step"><button onclick="adj(-1)">−</button><b>${W.v}</b><button onclick="adj(1)">+</button></div>
    <button class="big" onclick="setDone()">Série faite</button>`;
}
function adj(d) { W.v = Math.max(0, W.v + d * (cur().t === 't' ? 5 : 1)); draw(); }
function setDone() {
  const e = cur(), g = tgt(e);
  if (e.rec && W.v > (S.rec[e.rec] || 0)) S.rec[e.rec] = W.v;   // record d'une série
  if (W.v < g) W.miss = true;
  W.v = null;
  if (++W.s >= e.s) {                                            // exercice terminé
    if (!W.miss) { S.tgt[e.id] = g + (e.t === 't' ? 5 : 1); W.up.push(`${e.n} → ${S.tgt[e.id]}${unit(e)}`); }
    W.miss = false; W.s = 0; W.i++;
    if (W.i >= DAYS[W.k].e.length) return finish();
  }
  save(); W.r = e.rest; go('rest');
}
function rest() {
  return `<div class="center"><small>Repos</small><div class="timer" id="t">${W.r}</div>
    <p>Ensuite : ${cur().n}</p><button class="big" onclick="go('work')">Passer</button></div>`;
}
function finish() {
  S.done[ds(new Date())] = W.k; S.seq++;
  S.maxStreak = Math.max(S.maxStreak, streak()); save(); check(); go('fin');
}
function fin() {
  const T = S.tank;
  return `<div class="center"><div style="font-size:72px">💪</div><h1>Séance terminée</h1>
    ${W.up.length ? `<p class="tip">Objectifs relevés :<br>${W.up.join('<br>')}</p>` : '<p class="tip">Bien joué. Vise plus haut la prochaine fois.</p>'}
    ${T.on ? `<button class="big" onclick="startBonus()">⚡ Bonus : ${TANKS[T.m][0]}</button>
    <button class="ghost" onclick="go('tank')">Choisir un autre bonus</button>` : ''}
    <button class="ghost" onclick="go('home')">Terminer</button></div>`;
}

/* ===== Brûler le réservoir : activité, durée et rounds au choix ===== */
const TANKS = {
  bike:   ['Assault bike',     'Pédale et pousse à fond.'],
  sprint: ['Sprint sur place', 'Genoux hauts, bras puissants.'],
  burpee: ['Burpees',          'Enchaîne sans pause.'],
  corde:  ['Corde à sauter',   'Rythme maximal.'],
  boxe:   ['Shadow boxing',    'Coups rapides et secs.']
};
const chip = (f, v, l) => `<button class="chip ${S.tank[f] === v ? 'on' : ''}" onclick='pick(${JSON.stringify(f)},${JSON.stringify(v)})'>${l}</button>`;
function pick(f, v) { S.tank[f] = v; save(); draw(); }
function tank() {
  return `<header><h1>Brûler le réservoir</h1></header>
    <p class="tip">Quelques secondes à fond, puis tu récupères. Ton choix est mémorisé.</p>
    <h3>Activité</h3><div class="chips">${Object.keys(TANKS).map(k => chip('m', k, TANKS[k][0])).join('')}</div>
    <h3>Durée d'un round</h3><div class="chips">${[10,20,30].map(n => chip('s', n, n + ' s')).join('')}</div>
    <h3>Nombre de rounds</h3><div class="chips">${[4,6,8].map(n => chip('r', n, n)).join('')}</div>
    <button class="big" onclick="startBonus()">⚡ Lancer</button>
    <button class="ghost" onclick="go('home')">Retour</button>`;
}
function startBonus() { B = { r:0, run:false }; go('bonus'); }
function bonus() {
  const T = S.tank, m = TANKS[T.m];
  return `<div class="center"><small>Brûler le réservoir</small><h2>${m[0]}</h2><p class="tip">${m[1]}</p>${T.m === 'boxe' ? `<p class="combo">🥊 ${COMBOS[B.r % COMBOS.length]}</p>` : ''}
    <div class="timer" id="t">${B.run ? T.s : B.r + '/' + T.r}</div><p>${B.r} round(s) fait(s)</p>
    ${B.run ? '' : `<button class="big" onclick="go10()">${B.r ? 'Round suivant' : 'GO !'}</button>`}
    <button class="ghost" onclick="endBonus()">${B.r >= 4 ? 'Terminer' : 'Passer'}</button></div>`;
}
function go10() { B.run = true; draw(); count(S.tank.s, () => { B.r++; B.run = false; B.r >= S.tank.r ? endBonus() : draw(); }); }
function endBonus() { if (B.r >= 4) { S.bonus++; save(); check(); } go('home'); }

/* ===== Souplesse : routine express (modifie la liste ici) ===== */
// [icône, nom, secondes, consigne]
const STR = [
  ['🤷','Cercles d\'épaules',20,'Grands cercles lents, vers l\'arrière.'],
  ['🚪','Pectoraux (contre un mur)',30,'Avant-bras au mur, tourne doucement le buste.'],
  ['🧗','Suspension à la barre',30,'Relâche les épaules et laisse le dos s\'étirer.'],
  ['🏃','Fente basse (hanches)',30,'Genou arrière au sol, pousse les hanches vers l\'avant.'],
  ['🦵','Arrière des cuisses',30,'Jambe tendue devant, dos plat, penche-toi.'],
  ['🦶','Avant des cuisses',30,'Talon vers la fesse, genoux joints.'],
  ['🐱','Chat-vache',30,'Dos rond puis creux, au rythme du souffle.'],
  ['🧘','Posture de l\'enfant',30,'Fesses sur les talons, bras loin devant, respire.']
];
let F = null;
function flex() {
  const fait = !!S.flex[ds(new Date())], tot = STR.reduce((a, x) => a + x[2], 0);
  return `<header><h1>Souplesse</h1></header>
    <p class="tip">Une routine express chaque jour, idéale après la séance ou avant de dormir. Plus de souplesse, c'est des coups plus rapides, des tractions plus propres et moins de blessures.</p>
    <section class="card"><div class="row" style="margin:0"><small>${Math.round(tot / 60)} min · ${STR.length} étirements</small><b style="color:var(--ac)">${fait ? '✓ fait aujourd\'hui' : ''}</b></div>
    <ul>${STR.map(x => `<li><em>${x[0]}</em><b>${x[1]}</b><span>${x[2]} s</span></li>`).join('')}</ul></section>
    <button class="big" onclick="startFlex()">${fait ? 'Refaire la routine' : 'Lancer la routine'}</button>
    <p class="tip" style="text-align:center">${S.flexN} routine(s) terminée(s)</p>`;
}
function startFlex() { F = { i:0 }; go('frun'); }
function frun() {
  const x = STR[F.i];
  return `<div class="topbar"><small>Étirement ${F.i + 1}/${STR.length}</small><button class="x" onclick="go('flex')">✕</button></div>
    <div class="bar"><i style="width:${F.i / STR.length * 100}%"></i></div>
    <div class="center"><div style="font-size:80px">${x[0]}</div><h2>${x[1]}</h2><p class="tip">${x[3]}</p>
    <div class="timer" id="t">${x[2]}</div><p class="tip">Respire lentement, sans forcer.</p>
    <button class="big" onclick="stop();nextStr()">Suivant</button></div>`;
}
function nextStr() { F.i++; if (F.i >= STR.length) return endFlex(); draw(); }
function endFlex() {
  const k = ds(new Date()), a = S.chk[k] || [];
  S.flex[k] = 1; S.flexN++; if (!a.includes(3)) S.chk[k] = [...a, 3];   // coche « Étirements » dans la checklist
  save(); check(); toast('🧘 Routine terminée'); go('flex');
}

/* ===== Rang, checklist, conseils ===== */
const RANKS = ['Débutant','Sparring-partner','Prétendant','Challenger','Contender','Champion'];
function rankHTML() {
  const r = Math.min(5, Math.floor(S.seq / 15)), nx = RANKS[r + 1], p = r >= 5 ? 100 : (S.seq % 15) / 15 * 100;
  return `<section class="rank"><div class="row" style="margin:0"><b style="color:var(--tx)">🥊 ${RANKS[r]}</b>
    <small>${nx ? `${15 - S.seq % 15} séances avant « ${nx} »` : 'Rang maximum'}</small></div>
    <div class="bar"><i style="width:${p}%"></i></div>
    <div class="stats"><div><b>${S.rec.tractions || 0}</b><small>tractions (record)</small></div>
    <div><b>${S.rec.pompes || 0}</b><small>pompes (record)</small></div><div><b>${S.seq}</b><small>séances</small></div></div></section>`;
}
const COMBOS = ['Jab – Direct','Jab – Direct – Crochet','Jab – Jab – Direct – Esquive','Direct – Crochet – Direct','Jab – Direct – Uppercut – Crochet','Jab – Crochet – Esquive – Direct'];
const CHK = ['Échauffement 5 min','Boire 2 L d\'eau','Protéines à chaque repas','Étirements / mobilité','Dormir 7-8 h'];
function chkHTML() {
  const a = S.chk[ds(new Date())] || [];
  return `<section class="card" style="margin-top:16px"><div class="row" style="margin:0 0 6px"><h3 style="margin:0">✅ Ma journée de boxeur</h3><b style="color:var(--ac)">${a.length}/${CHK.length}</b></div>
    <ul class="chk">${CHK.map((t, i) => `<li class="${a.includes(i) ? 'on' : ''}" onclick="tog(${i})"><i>${a.includes(i) ? '✓' : ''}</i>${t}</li>`).join('')}</ul></section>`;
}
function tog(i) {
  const k = ds(new Date()), a = S.chk[k] || [];
  S.chk[k] = a.includes(i) ? a.filter(n => n !== i) : [...a, i]; save();
  if (S.chk[k].length === CHK.length) toast('🥊 Journée de champion !');
  draw();
}
const NUTRI = ['Vise 1,6 à 2 g de protéines par kg de poids de corps : œufs, poulet, poisson, yaourt grec, légumineuses.',
 'Avant l\'entraînement (2-3 h) : glucides + un peu de protéines (riz, patate douce, flocons d\'avoine).',
 'Dans l\'heure après la séance : protéines + glucides (œufs et pain, yaourt et fruits, poulet et riz).',
 'Bois 2 à 3 L d\'eau par jour. Une urine claire = bonne hydratation.',
 'Des légumes de plusieurs couleurs à chaque repas : énergie et récupération.',
 'Les bons gras (poissons gras, noix, huile d\'olive, avocat) aident articulations et hormones.',
 'Limite sucre et alcool : ils abîment le sommeil et la récupération.',
 'Entraînement le matin ? Une banane ou un toast suffit pour démarrer.'];
const BOXE = ['Respire par le nez en récupération, souffle par la bouche à chaque frappe.',
 'Garde haute, menton bas, même fatigué : c\'est là qu\'on se fait toucher.',
 'La puissance part des jambes : pivote le pied arrière, hanches, épaule, poing en dernier.',
 'Détends les épaules entre les coups : un boxeur crispé s\'épuise vite.',
 'Reste léger sur la pointe des pieds et ne croise jamais les jambes.',
 'L\'endurance se construit en rounds courts répétés : 10 à 30 s à fond, puis repos.',
 'Dors 7 à 8 h : c\'est là que tu deviens plus fort et plus rapide.',
 'Visualise 2 minutes avant la séance : chaque combo, chaque esquive, parfaitement exécutés.'];
const TRACT = ['Les négatives (descente en 5 s) sont le moyen le plus efficace pour gagner des tractions.',
 'Avant de tirer, abaisse les omoplates, comme pour glisser les épaules dans tes poches.',
 'Tire la poitrine vers la barre, pas seulement le menton.',
 'Arrête une série 1 rep avant l\'échec : qualité d\'abord.',
 'Ajoute une suspension à la barre de 20 à 30 s : prise et épaules plus solides.',
 'Ventre gainé, jambes serrées : pas de balancement, pas de triche.',
 'Quand tu réussis toutes tes séries, l\'appli relève ton objectif de 1 rep.',
 'Repose-toi au moins 90 s entre deux séries de tractions.'];
let tp = 0;
const pickT = (a, o = 0) => a[(Math.floor(new Date() / 864e5) + tp + o) % a.length];
function tips() {
  return `<header><h1>Conseils</h1></header>
    <section class="card"><small>🍽️ Nutrition du jour</small><p>${pickT(NUTRI)}</p></section>
    <section class="card"><small>🥊 Tip de boxeur</small><p>${pickT(BOXE, 3)}</p></section>
    <section class="card"><small>🧗 Booster tes tractions</small><p>${pickT(TRACT, 5)}</p></section>
    <button class="ghost" onclick="tp++;draw()">🎲 Autres conseils</button>
    <section class="card" style="margin-top:16px"><small>L'assiette du boxeur</small><ul>
    <li>⏱️ 2-3 h avant : glucides + protéines</li><li>⚡ 30 min avant : banane ou dattes</li>
    <li>🔄 Après : protéines + glucides sous 1 h</li><li>💧 De l'eau toute la journée</li></ul></section>`;
}

function hist() {
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + hm);
  const y = d.getFullYear(), m = d.getMonth(), off = (d.getDay() + 6) % 7, nd = new Date(y, m + 1, 0).getDate();
  let c = '<i></i>'.repeat(off);
  for (let i = 1; i <= nd; i++) { const k = ds(new Date(y, m, i)); c += `<i class="${S.done[k] ? 'ok' : ''}">${S.done[k] || i}</i>`; }
  return `<header><h1>Historique</h1></header>
    <div class="mon"><button onclick="hm--;draw()">‹</button><b>${d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</b><button onclick="hm++;draw()">›</button></div>
    <div class="cal">${'LMMJVSD'.split('').map(l => `<span>${l}</span>`).join('')}${c}</div>
    <p class="tip">${S.seq} séances · meilleure série : ${S.maxStreak} jours</p>`;
}
function troph() {
  const n = BG.filter(b => S.badges[b.id]).length;
  return `<header><h1>Trophées</h1><small>${n}/${BG.length}</small></header><div class="grid">
    ${BG.map(b => `<div class="bd ${S.badges[b.id] ? 'on' : ''}"><span>${S.badges[b.id] ? b.i : '🔒'}</span><b>${b.t}</b><small>${b.d}</small></div>`).join('')}</div>`;
}

draw();
