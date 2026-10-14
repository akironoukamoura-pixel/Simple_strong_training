'use strict';
/* ================= ÉTAT & SAUVEGARDE (localStorage) ================= */
const KEY = 'muscu_v1';
let S = { flex:{}, flexN:0, chk:{}, tank:{m:'bike',s:10,r:6,on:true}, done:{}, rec:{}, tgt:{}, bonus:0, badges:{}, seq:0, maxStreak:0 };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
S.tank.p = S.tank.p ?? 20;   // repos entre les rounds du bonus (s)
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const $ = s => document.querySelector(s);

/* ================= PROGRAMME (modifie ici les exercices) ================= */
// x(id, nom, séries, objectif, repos(s), type 'r'=reps / 't'=secondes, pose, consigne, record)
const x = (id,n,s,r,rest,t,p,tip,rec) => ({id,n,s,r,rest,t,p,tip,rec});
const E = {
  pompes: x('pompes','Pompes',4,12,60,'r','push','Corps gainé, poitrine au sol, poussée franche.','pompes'),
  pexp:   x('pexp','Pompes explosives',3,6,75,'r','pexp','Pousse fort : les mains décollent du sol.'),
  dips:   x('dips','Dips sur chaise',3,10,60,'r','dips','Descends à 90°, remonte fort.','dips'),
  tract:  x('tract','Tractions',4,5,90,'r','pull','Menton au-dessus de la barre, descente contrôlée.','tractions'),
  neg:    x('neg','Négatives de tractions',3,3,60,'r','neg','Saute en haut, puis descends en 5 secondes : le meilleur moyen de gagner des tractions.'),
  rows:   x('rows','Rows inversés',4,10,60,'r','rows','Sous une table solide, tire la poitrine vers elle.'),
  super:  x('super','Supermans',3,15,45,'r','super','Ventre au sol, lève bras et jambes, serre le dos.'),
  squat:  x('squat','Squats sautés',4,12,60,'r','jump','Descends bas, saute le plus haut possible.','squat'),
  fentes: x('fentes','Fentes',3,12,60,'r','lunge','Genou arrière près du sol, buste droit.'),
  banc:   x('banc','Montées sur banc',3,10,60,'r','step','Monte avec une jambe, pousse dans le talon.'),
  burpee: x('burpee','Burpees',3,10,60,'r','burpee','Pompe, saut, enchaîne sans pause.'),
  jambes: x('jambes','Relevés de jambes',3,15,45,'r','legs','Lombaires plaquées au sol, jambes tendues.'),
  crunch: x('crunch','Crunchs',3,20,30,'r','crunch','Enroule le haut du dos, souffle en montant.'),
  bike:   x('bike','Crunchs vélo',3,30,30,'r','bike','Coude vers genou opposé, sans à-coup.'),
  mont:   x('mont','Mountain climbers',3,30,45,'t','mont','Genoux vers la poitrine, rythme rapide.'),
  gaine:  x('gaine','Gainage (planche)',3,30,45,'t','plank','Corps aligné, ventre serré, respire.','gainage'),
  gaine2: x('gaine2','Gainage (planche)',3,45,45,'t','plank','Corps aligné, ventre serré, respire.','gainage')
};
EEX.forEach(o => E[o.id] = x(o.id,o.n,o.s,o.r,o.rest,o.t||'r',o.p,o.tip));   // exercices élastiques (exos.js)
const ORDER = ['A','B','C','D','E','F'];
const DAYS = {
  A: { n:'Pousser',          e:[E.pompes,E.pexp,E.dips,E.jambes,E.gaine] },
  B: { n:'Tirer',            e:[E.tract,E.rows,E.super,E.jambes,E.bike] },
  C: { n:'Jambes explosives',e:[E.squat,E.fentes,E.banc,E.crunch,E.gaine] },
  D: { n:'Full body + abdos',e:[E.burpee,E.pompes,E.tract,E.jambes,E.gaine2] },
  E: { n:'Abdos et gainage', e:[E.crunch,E.jambes,E.gaine2,E.bike,E.mont] }
};
Object.values(DAYS).forEach(d => d.e.splice(1, 0, E.neg));   // + négatives de tractions à chaque séance
DAYS.F = { n:'Élastiques', e:[E.epress,E.erow,E.efac,E.ecurl,E.etri,E.esquat,E.epal] };
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
[7,30].forEach(v => BG.push({ id:'g'+v, i:'🤜', t:'Poigne d\'acier', d:v+' séances', ok:() => (S.gripN || 0) >= v }));
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

// Illustrations SVG minimalistes : [x tête, y tête, tracé du corps, décor (barre, banc, chaise...)]
const POSES = {
  push:  [84,30,'M12 52L76 34M76 34V55',''],
  pexp:  [82,22,'M12 46L74 28M74 28L90 32','M58 14V4M55 8L58 4L61 8'],
  dips:  [50,14,'M50 20V40H70L74 56M50 22L38 36','M26 38H42M30 38V58'],
  pull:  [50,9,'M30 12L44 28M70 12L56 28M50 28V46L46 60M50 46L54 60','M16 12H84'],
  neg:   [50,20,'M28 5L44 30M72 5L56 30M50 30V48L46 60M50 48L54 60','M16 5H84M88 20V42M84 38L88 42L92 38'],
  rows:  [18,40,'M26 42L86 52M32 43L40 30','M24 30H54M30 30V58'],
  super: [16,40,'M24 46H72M24 46L6 36M72 46L92 38',''],
  legs:  [10,50,'M16 52H50M50 52V16M16 52L30 56',''],
  crunch:[32,28,'M50 54L36 34M50 54L66 38L80 54M38 36L52 32',''],
  bike:  [28,30,'M44 54L32 36M44 54L58 38L66 46M44 54H88M34 38L48 36',''],
  jump:  [50,10,'M50 16V34M50 20L36 8M50 20L64 8M50 34L40 44L44 50M50 34L60 44L56 50',''],
  lunge: [46,10,'M46 16V34M46 34L66 38V56M46 34L30 50L18 56',''],
  step:  [50,8,'M50 14V32M50 32L66 36L68 40M50 32L44 58','M60 40H94V58'],
  burpee:[64,22,'M30 34L58 26M30 34L36 50L24 56M58 26L66 56',''],
  mont:  [86,26,'M22 46L80 30M80 30V54M22 46L10 56M22 46L50 48L46 56',''],
  plank: [86,30,'M16 50L82 36M82 36V52L92 52','']
};
Object.assign(POSES, EPOSES);
const svg = p => { const [a, b, d, o] = POSES[p]; return `<svg viewBox="0 0 100 62"><path class="g" d="M4 58H96"/>${o ? `<path class="o" d="${o}"/>` : ''}<circle cx="${a}" cy="${b}" r="6"/><path d="${d}"/></svg>`; };

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
  $('#nav').style.display = ['home','exos','hist','troph','tips','flex'].includes(view) ? 'flex' : 'none';
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  $('#app').innerHTML = ({ home, bfin, eq, exos, exo, hist, troph, work, rest, bonus, fin, tank, tips, flex, frun })[view]();
  if (view !== lastView) $('#app').scrollTop = 0; lastView = view;
  if (view === 'rest') count(W.r, () => go('work'));
  if (view === 'frun' && !F.p) ftick();
}
document.querySelectorAll('#nav button').forEach(b => b.onclick = () => go(b.dataset.v));

/* ================= ÉCRANS ================= */
function home() {
  const k = ORDER[S.seq % ORDER.length], D = DAYS[k], fait = !!S.done[ds(new Date())], T = S.tank;
  return `<header><div><small>Niveau ${Math.floor(S.seq/ORDER.length)+1}</small><h1>Muscu</h1></div>
    <div class="st">🔥 <b>${streak()}</b><small>jours de suite</small></div></header>
    ${rankHTML()}<p class="quote">${quote()}</p>
    <section class="card"><small>${fait ? 'Prochaine séance' : 'Séance du jour'} (jour ${k})</small><h2>${D.n}</h2>
    <ul>${D.e.map(e => `<li>${svg(e.p)}<b>${e.n}</b><span>${e.s} × ${tgt(e)}${unit(e)}</span></li>`).join('')}</ul></section>
    <button class="big" onclick="start()">${fait ? 'Refaire une séance' : 'Commencer la séance'}</button>
    <section class="card tank" style="margin-top:16px"><small>Bonus facultatif</small><h3>⚡ Brûler le réservoir</h3>
    <p>${TANKS[T.m][0]} · ${T.s} s × ${T.r} rounds${T.p ? ' · repos ' + T.p + ' s' : ''}</p>
    <button class="ghost" onclick="go('tank')">Choisir et lancer</button>
    <div class="row"><span>Le proposer après la séance</span><button class="sw ${T.on ? 'on' : ''}" onclick="S.tank.on=!S.tank.on;save();draw()"></button></div></section>${gripCard()}${chkHTML()}`;
}
function start() { W = { k:ORDER[S.seq % ORDER.length], i:0, s:0, v:null, miss:false, up:[], r:0, D:DAYS[ORDER[S.seq % ORDER.length]] }; if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(() => {});
  go(needEq(W.D.e).length ? 'eq' : 'work'); }
/* ===== Matériel : demande avant la séance, remplacements au besoin ===== */
const hasEq = k => !S.eq || S.eq[k] !== false;
const needEq = list => [...new Set(list.flatMap(e => EQ[e.id] || []))];
const base = id => id === 'gaine2' ? 'gaine' : id;
function adapt(list) {
  const used = new Set(list.map(e => base(e.id))), out = [], subs = [];
  list.forEach(e => {
    if ((EQ[e.id] || []).every(hasEq)) return out.push(e);
    const c = (SUBS[e.id] || []).find(id => !used.has(base(id)) && (EQ[id] || []).every(hasEq));
    if (c) { used.add(base(c)); out.push(E[c]); }
    subs.push([e, c ? E[c] : null]);
  });
  return { list:out, subs };
}
function eqTog(k) { S.eq = S.eq || {}; S.eq[k] = !hasEq(k); save(); draw(); }
function eqGo() { const l = adapt(W.D.e0 || W.D.e).list; if (!l.length) return go('home'); W.D = { n:W.D.n, e:l }; go('work'); }
function eq() {
  W.D.e0 = W.D.e0 || W.D.e;
  const need = needEq(W.D.e0), { list, subs } = adapt(W.D.e0);
  return `<div class="topbar"><button class="x" onclick="go('home')">‹</button><small>${W.D.n}</small><span style="width:40px"></span></div>
    <h2>Tu as le matériel ?</h2><p class="tip">Décoche ce que tu n'as pas sous la main : je remplace les exercices concernés par d'autres qui visent le même objectif. Ton choix est mémorisé.</p>
    <section class="card"><ul>${need.map(k => `<li><b>${EQL[k]}</b><button class="sw ${hasEq(k) ? 'on' : ''}" onclick="eqTog('${k}')"></button></li>`).join('')}</ul></section>
    ${subs.length ? `<section class="card tank"><h3 style="margin-top:0">🔄 Remplacements</h3><ul>${subs.map(([o, n]) => `<li><b>${o.n}</b><span>${n ? '→ ' + n.n : 'retiré'}</span></li>`).join('')}</ul></section>` : ''}
    <button class="big" onclick="eqGo()">${list.length ? 'Commencer la séance' : 'Rien à faire !'}</button>`;
}
const cur = () => W.D.e[W.i];

function work() {
  const D = W.D, e = cur(), g = tgt(e), timed = e.t === 't';
  if (W.v == null) W.v = g;
  const ctrl = timed && W.run
    ? `<button class="big stop" onclick="swStop()">■ Stop</button>`
    : `${timed ? '<button class="ghost" onclick="swStart()">▶ Lancer le chrono (3 s pour te placer)</button>' : ''}
       <div class="step"><button onclick="adj(-1)">−</button><b>${W.v}</b><button onclick="adj(1)">+</button></div>
       <button class="big" onclick="setDone()">Série faite</button>`;
  return `<div class="topbar"><small>${D.n} · exercice ${W.i+1}/${D.e.length}</small><button class="x" onclick="if(confirm('Quitter la séance ?'))go('home')">✕</button></div>
    <div class="bar"><i style="width:${W.i / D.e.length * 100}%"></i></div>
    <div class="fig">${svg(e.p)}</div><h2>${e.n}</h2><p class="tip">${e.tip}</p>
    <p class="set">Série ${W.s+1}/${e.s} · objectif ${g}${unit(e)}</p>
    <div class="dots">${Array.from({length:e.s},(_,i)=>`<i class="${i<W.s?'on':i===W.s?'cur':''}"></i>`).join('')}</div>
    ${timed ? `<div class="timer sm" id="sw">${W.run ? (W.pre || W.el) : (W.el || 0)}</div>` : ''}${ctrl}`;
}
// Chronomètre : 3 s de préparation, puis il compte jusqu'à ton Stop (bip à l'objectif)
function swStart() { stop(); W.run = true; W.el = 0; W.pre = 3; draw(); tm = setInterval(swTick, 1000); }
function swTick() {
  const el = $('#sw');
  if (W.pre > 0) { W.pre--; if (el) el.textContent = W.pre || 'GO'; if (!W.pre) buzz(); return; }
  W.el++; if (el) el.textContent = W.el;
  if (W.el === tgt(cur())) { buzz(); toast('✅ Objectif atteint, tiens encore !'); }
}
function swStop() { stop(); W.run = false; W.v = W.el > 0 ? W.el : tgt(cur()); draw(); }
function adj(d) { W.v = Math.max(0, W.v + d * (cur().t === 't' ? 5 : 1)); draw(); }
function setDone() {
  const e = cur(), g = tgt(e);
  if (e.rec && W.v > (S.rec[e.rec] || 0)) S.rec[e.rec] = W.v;   // record d'une série
  if (W.v < g) W.miss = true;
  W.v = null; W.run = false; W.el = 0;
  if (++W.s >= e.s) {                                            // exercice terminé
    if (!W.miss) { S.tgt[e.id] = g + (e.t === 't' ? 5 : 1); W.up.push(`${e.n} → ${S.tgt[e.id]}${unit(e)}`); }
    W.miss = false; W.s = 0; W.i++;
    if (W.i >= W.D.e.length) return finish();
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
  boxe:   ['Shadow boxing',    'Coups rapides et secs.'],
  stairs: ['Escaliers (style Rocky)', 'Monte les marches deux par deux à fond, bras en l\'air en haut, redescends en marchant.']
};
const chip = (f, v, l) => `<button class="chip ${S.tank[f] === v ? 'on' : ''}" onclick='pick(${JSON.stringify(f)},${JSON.stringify(v)})'>${l}</button>`;
function pick(f, v) { S.tank[f] = v; save(); draw(); }
function tank() {
  return `<header><h1>Brûler le réservoir</h1></header>
    <p class="tip">Quelques secondes à fond, puis tu récupères. Ton choix est mémorisé.</p>
    <h3>Activité</h3><div class="chips">${Object.keys(TANKS).map(k => chip('m', k, TANKS[k][0])).join('')}</div>
    <h3>Durée d'un round</h3><div class="chips">${[10,20,30].map(n => chip('s', n, n + ' s')).join('')}</div>
    <h3>Nombre de rounds</h3><div class="chips">${[4,6,8].map(n => chip('r', n, n)).join('')}</div>
    <h3>Repos entre les rounds</h3><div class="chips">${[0,10,20,30,45].map(n => chip('p', n, n ? n + ' s' : 'Aucun')).join('')}</div>
    <button class="big" onclick="startBonus()">⚡ Lancer</button>
    <button class="ghost" onclick="go('home')">Retour</button>`;
}
function startBonus() { B = { r:0, run:false }; go('bonus'); }
function bonus() {
  const T = S.tank, m = TANKS[T.m];
  if (B.rest) return `<div class="center"><small>Repos · prochain round ${B.r + 1}/${T.r}</small><h2>😮‍💨 Récupère</h2><p class="tip">Respire profondément, secoue les bras. Le prochain round démarre tout seul.</p>
    <div class="timer" id="t">${T.p}</div><p>${B.r} round(s) fait(s)</p>
    <button class="big" onclick="skipRest()">Round suivant maintenant</button>
    <button class="ghost" onclick="endBonus()">${B.r >= 4 ? 'Terminer' : 'Passer'}</button></div>`;
  return `<div class="center"><small>Brûler le réservoir</small><h2>${m[0]}</h2><p class="tip">${m[1]}</p>${T.m === 'boxe' ? `<p class="combo">🥊 ${COMBOS[B.r % COMBOS.length]}</p>` : ''}
    <div class="timer" id="t">${B.run ? T.s : B.r + '/' + T.r}</div><p>${B.r} round(s) fait(s)</p>
    ${B.run ? '' : `<button class="big" onclick="go10()">${B.r ? 'Round suivant' : 'GO !'}</button>`}
    <button class="ghost" onclick="endBonus()">${B.r >= 4 ? 'Terminer' : 'Passer'}</button></div>`;
}
function go10() { B.run = true; B.rest = false; draw(); count(S.tank.s, () => { B.r++; B.run = false; if (B.r >= S.tank.r) return endBonus(); S.tank.p ? startRest() : draw(); }); }
function startRest() { B.rest = true; draw(); count(S.tank.p, go10); }   // repos auto, puis round suivant
function skipRest() { stop(); go10(); }
const BRAVO = ['Tu as tout donné, champion !','Voilà comment on forge un mental d\'acier.','Le réservoir est à sec, la fierté est pleine.','Ça, c\'est un vrai round de boxeur.'];
function endBonus() {
  stop();
  if (B.r < 4) return go('home');
  const k = ds(new Date()), c = S.chk[k] || [];
  S.bonus++; if (!c.includes(6)) S.chk[k] = [...c, 6];   // coche « Bonus » dans la checklist
  save(); check(); B.bravo = BRAVO[Math.floor(Math.random() * BRAVO.length)]; go('bfin');
}
function bfin() {
  const full = B.r >= S.tank.r;
  return `<div class="center"><div style="font-size:90px">🏆</div><h2>${full ? 'Réservoir vidé !' : 'Beau boulot !'}</h2>
    <p class="tip">${B.r} round(s) de ${TANKS[S.tank.m][0]}.</p><p class="combo">🥊 ${B.bravo}</p>
    <p>✅ Bonus coché dans ta journée de boxeur</p><button class="big" onclick="go('home')">Retour</button></div>`;
}

/* ===== Souplesse : routine express (modifie la liste ici) ===== */
// [icône, nom, secondes, consigne]
const STR = [
  ['🤷','Cercles d\'épaules',20,'Grands cercles lents, vers l\'arrière.'],
  ['🚪','Pectoraux (contre un mur)',30,'Avant-bras au mur, tourne doucement le buste.',2],
  ['🧗','Suspension à la barre',30,'Relâche les épaules et laisse le dos s\'étirer.'],
  ['🏃','Fente basse (hanches)',30,'Genou arrière au sol, pousse les hanches vers l\'avant.',2],
  ['🦵','Arrière des cuisses',30,'Jambe tendue devant, dos plat, penche-toi.',2],
  ['🦶','Avant des cuisses',30,'Talon vers la fesse, genoux joints.',2],
  ['🐱','Chat-vache',30,'Dos rond puis creux, au rythme du souffle.'],
  ['🧘','Posture de l\'enfant',30,'Fesses sur les talons, bras loin devant, respire.']
];
let F = null;
function flex() {
  const fait = !!S.flex[ds(new Date())], tot = STR.reduce((a, x) => a + x[2] * (x[4] ? 2 : 1), 0);
  return `<header><h1>Souplesse</h1></header>
    <p class="tip">Une routine express chaque jour, idéale après la séance ou avant de dormir. Plus de souplesse, c'est des coups plus rapides, des tractions plus propres et moins de blessures.</p>
    <section class="card"><div class="row" style="margin:0"><small>${Math.round(tot / 60)} min · ${STR.length} étirements · les deux côtés</small><b style="color:var(--ac)">${fait ? '✓ fait aujourd\'hui' : ''}</b></div>
    <ul class="fl">${STR.map((x, i) => `<li onclick="fx=fx===${i}?-1:${i};draw()"><em>${x[0]}</em><b>${x[1]}</b><span>${x[4] ? '2×' : ''}${x[2]} s</span>${fx === i ? fxHTML(i) : ''}</li>`).join('')}</ul></section>
    <button class="big" onclick="startFlex()">${fait ? 'Refaire la routine' : 'Lancer la routine'}</button>
    <p class="tip" style="text-align:center">${S.flexN} routine(s) terminée(s)</p>
    <section class="card"><h3 style="margin-top:0">🧘 Bien s'étirer</h3>${lst(STIP)}</section>`;
}
const fxHTML = i => { const d = STRX[i]; return `<div class="xd"><p>${STR[i][3]}</p><p>${d.why}</p><p class="xh">Comment faire</p>${lst(d.how, 'ol')}<p class="xh">Pour aller plus loin</p>${lst(d.up)}</div>`; };
const mkSteps = L => L.flatMap((x, i) => x[4] ? [{ i, side:'G', sec:x[2] }, { i, swap:1, sec:5 }, { i, side:'D', sec:x[2] }] : [{ i, sec:x[2] }]);
function runStart(o) { F = { ...o, steps:mkSteps(o.list), k:0, p:false }; F.t = F.steps[0].sec; go('frun'); }
const startFlex = () => runStart({ list:STR, x:STRX, kind:'flex', title:'Étirement', back:'flex', tip:'Respire lentement, sans forcer.' });
const startGrip = () => runStart({ list:GRIP, x:GRX, kind:'grip', title:'Poigne', back:'home', tip:'Serre fort, respire, garde les épaules basses.' });
const ctl = () => `<button class="big" id="pb" onclick="fpause()">${F.p ? '▶ Reprendre' : '⏸ Pause'}</button><button class="ghost" onclick="stop();nextStr()">Suivant</button>`;
function frun() {
  const s = F.steps[F.k], x = F.list[s.i], d = F.x[s.i];
  const top = `<div class="topbar"><small>${F.title} ${s.i + 1}/${F.list.length}</small><button class="x" onclick="go('${F.back}')">✕</button></div><div class="bar"><i style="width:${F.k / F.steps.length * 100}%"></i></div>`;
  if (s.swap) return `${top}<div class="center"><div style="font-size:80px">🔄</div><h2>Change de côté</h2><p class="tip">Prépare ton côté droit : ${x[1]}</p><div class="timer" id="t">${F.t}</div>${ctl()}</div>`;
  return `${top}<div class="center"><div style="font-size:80px">${x[0]}</div><h2>${x[1]}</h2>${s.side ? `<p class="combo">${s.side === 'G' ? '◀ Côté GAUCHE' : 'Côté DROIT ▶'}</p>` : ''}<p class="tip">${x[3]}</p>
    <details class="more"><summary>Comment faire / aller plus loin</summary><p>${d.why}</p>${lst(d.how, 'ol')}<p><b style="color:var(--tx)">Aller plus loin :</b></p>${lst(d.up)}</details>
    <div class="timer" id="t">${F.t}</div><p class="tip">${F.tip}</p>${ctl()}</div>`;
}
function ftick() { stop(); tm = setInterval(() => { F.t--; const el = $('#t'); if (el) el.textContent = F.t; if (F.t <= 0) { stop(); buzz(); nextStr(); } }, 1000); }
function fpause() { F.p = !F.p; F.p ? stop() : ftick(); const b = $('#pb'); if (b) b.textContent = F.p ? '▶ Reprendre' : '⏸ Pause'; }
function nextStr() { F.k++; if (F.k >= F.steps.length) return F.kind === 'flex' ? endFlex() : endGrip(); F.t = F.steps[F.k].sec; F.p = false; draw(); }
function endGrip() {
  const k = ds(new Date()), a = S.chk[k] || [];
  S.grip = S.grip || {}; S.grip[k] = 1; S.gripN = (S.gripN || 0) + 1; if (!a.includes(5)) S.chk[k] = [...a, 5];   // coche « Poigne d'acier »
  save(); check(); toast('🤜 Poigne validée'); go('home');
}
const gripCard = () => { const k = ds(new Date()), fait = !!(S.grip || {})[k];
  return `<section class="card"><div class="row" style="margin:0"><h3 style="margin:0">🤜 Poigne d'acier</h3><b style="color:var(--ac)">${fait ? '✓ fait' : '4 min'}</b></div>
    <p class="tip">${DEFIS[Math.floor(Date.now() / 864e5) % DEFIS.length]}</p>
    <details class="more"><summary>Voir la routine (serviette, livre, élastique…)</summary>${GRIP.map(x => `<p><b style="color:var(--tx)">${x[0]} ${x[1]}</b> · ${x[4] ? '2×' : ''}${x[2]} s<br>${x[3]}</p>`).join('')}</details>
    <button class="ghost" onclick="startGrip()">${fait ? 'Refaire' : 'Lancer'} la routine poigne</button></section>`; };
function endFlex() {
  const k = ds(new Date()), a = S.chk[k] || [];
  S.flex[k] = 1; S.flexN++; if (!a.includes(3)) S.chk[k] = [...a, 3];   // coche « Étirements » dans la checklist
  save(); check(); toast('🧘 Routine terminée'); go('flex');
}

/* ===== Exercices : bibliothèque + fiches ===== */
let XF = 'all', XI = null, fx = -1;
const GR = { all:'Tous', push:'Pousser', pull:'Tirer', legs:'Jambes', core:'Abdos', el:'🎗️ Élastiques' };
const lst = (s, t = 'ul') => `<${t} class="bl">${s.split('|').map(i => `<li>${i}</li>`).join('')}</${t}>`;
function exos() {
  const ks = Object.keys(INFO).filter(k => k !== 'gaine2' && (XF === 'all' || (XF === 'el' ? INFO[k].el : INFO[k].g === XF)));
  return `<header><h1>Exercices</h1><small>${ks.length}</small></header>
    <p class="tip">Touche un exercice : explication, conseils et façons de le rendre plus difficile.</p>
    <div class="chips" style="margin-bottom:12px">${Object.keys(GR).map(k => `<button class="chip ${XF === k ? 'on' : ''}" onclick="XF='${k}';draw()">${GR[k]}</button>`).join('')}</div>
    <section class="card"><ul>${ks.map(k => { const e = E[k]; return `<li onclick="XI='${k}';go('exo')">${svg(e.p)}<b>${e.n}<small>${INFO[k].m}</small></b><span>›</span></li>`; }).join('')}</ul></section>`;
}
function exo() {
  const e = E[XI], I = INFO[XI];
  return `<div class="topbar"><button class="x" onclick="go('exos')">‹</button><small>${I.mat}</small><span style="width:40px"></span></div>
    <div class="fig">${svg(e.p)}</div><h2>${e.n}</h2><p class="tip">💪 ${I.m}</p>
    <section class="card"><h3 style="margin-top:0">Comment faire</h3>${lst(I.how, 'ol')}</section>
    <section class="card"><h3 style="margin-top:0">💡 Conseils</h3>${lst(I.tips)}</section>
    <section class="card tank"><h3 style="margin-top:0">🔥 Pour augmenter la difficulté</h3>${lst(I.up)}</section>
    <section class="card"><h3 style="margin-top:0">🌱 Trop dur ?</h3><p>${I.down}</p></section>
    <p class="tip" style="text-align:center">Objectif actuel : ${e.s} × ${tgt(e)}${unit(e)}</p>`;
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
const CHK = ['Échauffement 5 min','Boire 2 L d\'eau','Protéines à chaque repas','Étirements / mobilité','Dormir 7-8 h','Poigne d\'acier','Bonus : vider le réservoir'];
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
