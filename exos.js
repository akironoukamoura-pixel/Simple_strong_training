'use strict';
/* ===== Bibliothèque d'exercices (modifie les textes ici) =====
   Listes : sépare les éléments avec « | ». g = groupe, el = exercice avec élastique. */

// Exercices à l'élastique : id, nom, séries, objectif, repos, pose, consigne (t:'t' = secondes)
const EEX = [
  {id:"epress", n:"Développé élastique",   s:3,r:15,rest:45,p:"epress", tip:"Élastique dans le dos, pousse les bras droits devant toi."},
  {id:"erow",   n:"Rowing élastique",      s:3,r:15,rest:45,p:"erow",   tip:"Assis, dos droit, tire les coudes vers les hanches."},
  {id:"efac",   n:"Face pulls élastique",  s:3,r:15,rest:30,p:"efac",   tip:"Tire vers le visage, coudes hauts, écarte les mains."},
  {id:"elat",   n:"Élévations latérales",  s:3,r:15,rest:30,p:"elat",   tip:"Bras sur les côtés jusqu'à l'horizontale, sans hausser les épaules."},
  {id:"ecurl",  n:"Curl biceps élastique", s:3,r:15,rest:30,p:"ecurl",  tip:"Coudes collés au corps, remonte et redescends lentement."},
  {id:"etri",   n:"Triceps élastique",     s:3,r:15,rest:30,p:"etri",   tip:"Coudes vers le plafond, tends les bras sans les bouger."},
  {id:"epull",  n:"Écartements élastique", s:3,r:15,rest:30,p:"epull",  tip:"Bras tendus devant, ouvre en croix et serre les omoplates."},
  {id:"esquat", n:"Squats élastique",      s:3,r:15,rest:45,p:"esquat", tip:"Élastique au-dessus des genoux, repousse-le vers l'extérieur."},
  {id:"ewalk",  n:"Pas latéraux élastique",s:3,r:20,rest:30,p:"ewalk",  tip:"Genoux fléchis, grands pas sur le côté, garde la tension."},
  {id:"ehing",  n:"Soulevé de terre élastique",s:3,r:15,rest:45,p:"ehing",tip:"Hanches en arrière, dos plat, redresse-toi en serrant les fessiers."},
  {id:"epal",   n:"Pallof press",          s:3,r:10,rest:30,p:"epal",   tip:"De profil, pousse devant toi et résiste à la rotation (par côté)."},
  {id:"eassist",n:"Tractions assistées",   s:3,r:6, rest:75,p:"eassist",tip:"Boucle d'élastique sous le genou, contrôle la descente."},
  {id:"erot",   n:"Rotations externes",    s:3,r:15,rest:30,p:"erot",   tip:"Coude collé, tourne l'avant-bras vers l'extérieur. Léger !"}
];
const EPOSES = {
  epress: [40,10,"M40 16V40L34 58M40 40L46 58M40 22L56 24L72 22","M30 27H72"],
  erow:   [30,18,"M30 24V46H64M30 30L26 38L38 38","M64 46L38 38"],
  efac:   [40,10,"M40 16V40L34 58M40 40L46 58M40 22L30 26L34 14","M34 14L90 18M90 8V28"],
  ecurl:  [50,10,"M50 16V40L44 58M50 40L56 58M50 22L52 34L62 26","M44 58H56M56 58L62 26"],
  etri:   [50,12,"M50 18V42L44 58M50 42L56 58M50 24L58 12L48 8","M44 58H56M56 58L48 8"],
  elat:   [50,10,"M50 16V40L44 58M50 40L56 58M50 22L22 26M50 22L78 26","M44 58L22 26M56 58L78 26"],
  epull:  [50,10,"M50 16V40L44 58M50 40L56 58M50 24L20 24M50 24L80 24","M20 24Q50 36 80 24"],
  esquat: [50,10,"M50 16V34M50 34L36 44L38 58M50 34L64 44L62 58M50 22L36 30M50 22L64 30","M37 46H63"],
  ewalk:  [50,10,"M50 16V36M50 36L34 58M50 36L66 58M50 22L38 30M50 22L62 30","M36 54H64"],
  ehing:  [82,26,"M48 58L50 38M50 38L76 30M70 31L66 48","M44 58H56M56 58L66 48"],
  epal:   [40,10,"M40 16V40L34 58M40 40L46 58M40 22L62 24","M62 24H92M92 14V34"],
  eassist:[50,9,"M30 12L44 28M70 12L56 28M50 28V46L46 60M50 46L54 60","M16 12H84M64 12V52L52 52"],
  erot:   [50,10,"M50 16V40L44 58M50 40L56 58M50 22L46 36L62 36","M62 36H92M92 26V46"]
};

const INFO = {
 pompes:{g:"push",mat:"Aucun matériel",m:"Pectoraux, triceps, épaules",
  how:"Mains un peu plus larges que les épaules, corps aligné de la tête aux talons.|Descends en gardant les coudes à 45° du corps.|Frôle le sol avec la poitrine, puis pousse franchement.",
  tips:"Serre fessiers et ventre : le bassin ne s'affaisse pas.|Expire en poussant.",
  up:"Pieds surélevés sur une chaise|Descente lente de 3 s|Pause de 1 s en bas|Élastique passé dans le dos et tenu dans les mains|Pompes diamant ou archer|Une main surélevée",
  down:"Mains sur une table ou un mur, ou pompes sur les genoux."},
 pexp:{g:"push",mat:"Aucun matériel",m:"Pectoraux, triceps, puissance",
  how:"Position de pompe, descends en contrôle.|Pousse le plus fort possible pour décoller les mains.|Réceptionne bras légèrement fléchis et enchaîne.",
  tips:"Qualité avant quantité : arrête-toi si tu ralentis.|Très utile pour la puissance des coups.",
  up:"Tape dans les mains en l'air|Élastique dans le dos|Pieds surélevés",
  down:"Pompes normales avec poussée rapide, mains sur un banc."},
 dips:{g:"push",mat:"Chaise solide",m:"Triceps, pectoraux bas, épaules",
  how:"Mains sur le bord d'une chaise stable, jambes pliées ou tendues.|Descends jusqu'à 90° aux coudes.|Pousse fort jusqu'à tendre les bras.",
  tips:"Reste proche de la chaise, épaules loin des oreilles.|Ne descends pas trop bas : épaules fragiles.",
  up:"Jambes tendues|Pieds sur une 2e chaise|Sac à dos lesté sur les cuisses|Descente de 4 s|Dips à une jambe",
  down:"Genoux fléchis, pieds près de la chaise."},
 tract:{g:"pull",mat:"Barre de traction",m:"Dos, biceps, avant-bras",
  how:"Prise un peu plus large que les épaules, suspends-toi bras tendus.|Abaisse les omoplates, puis tire les coudes vers les hanches.|Menton au-dessus de la barre, redescends en 2-3 s.",
  tips:"Pas de balancement.|Bras bien tendus en bas à chaque répétition.",
  up:"Prise large ou serrée|Pause de 2 s en haut|Descente de 5 s|Sac lesté|Tractions archer|Poitrine à la barre, explosif",
  down:"Négatives, ou tractions assistées par élastique."},
 neg:{g:"pull",mat:"Barre de traction",m:"Dos, biceps",
  how:"Monte en haut avec un saut ou une chaise.|Menton au-dessus de la barre, bloque.|Descends le plus lentement possible (5 s) jusqu'aux bras tendus.",
  tips:"Contrôle surtout le dernier tiers de la descente.|Reste gainé, jambes serrées.",
  up:"Descente de 8 à 10 s|Pause à mi-hauteur|Sac à dos lesté",
  down:"Descente de 3 s, avec l'aide d'un élastique."},
 rows:{g:"pull",mat:"Table solide",m:"Haut du dos, biceps",
  how:"Allonge-toi sous une table solide, mains sur le bord.|Corps droit, talons au sol.|Tire la poitrine vers la table, serre les omoplates, redescends lentement.",
  tips:"Bassin haut du début à la fin.|Vérifie que la table est stable !",
  up:"Jambes tendues, pieds surélevés|Pause de 2 s en haut|Une main à la fois|Sac lesté sur le ventre",
  down:"Genoux fléchis, corps plus vertical."},
 super:{g:"pull",mat:"Aucun matériel",m:"Lombaires, fessiers, dos",
  how:"Allongé sur le ventre, bras tendus devant.|Lève bras, poitrine et jambes en même temps.|Tiens 1-2 s en serrant, redescends.",
  tips:"Regarde le sol, nuque neutre.|Mouvement lent, sans balancier.",
  up:"Pause de 3 s en haut|Mouvement de nage|Élastique entre les mains (écarte-le)|Bouteilles d'eau dans les mains",
  down:"Lève bras et jambes opposés en alternance."},
 squat:{g:"legs",mat:"Aucun matériel",m:"Cuisses, fessiers, mollets, explosivité",
  how:"Pieds largeur d'épaules, descends les hanches en arrière, cuisses parallèles.|Pousse fort et saute le plus haut possible.|Réceptionne en douceur, genoux fléchis.",
  tips:"Genoux dans l'axe des pieds.|Retombe sans bruit : pointe puis talon.",
  up:"Genoux à la poitrine en l'air|Élastique au-dessus des genoux|Sauts à une jambe|Demi-tour de 180° dans le saut",
  down:"Squats classiques, sans saut."},
 fentes:{g:"legs",mat:"Aucun matériel",m:"Cuisses, fessiers, équilibre",
  how:"Fais un grand pas en avant.|Descends jusqu'à frôler le sol avec le genou arrière.|Pousse dans le talon avant pour revenir.",
  tips:"Genou avant au-dessus du pied.|Buste droit.",
  up:"Fentes marchées avec sac lesté|Fentes sautées|Pied arrière surélevé (bulgare)|Descente de 3 s",
  down:"Fentes arrière, ou appui d'une main sur un mur."},
 banc:{g:"legs",mat:"Banc ou chaise solide",m:"Fessiers, cuisses",
  how:"Pose le pied entier sur un banc solide.|Monte en poussant dans le talon, avec cette jambe seulement.|Redescends lentement.",
  tips:"Ne te propulse pas avec l'autre jambe.|Plus le banc est haut, plus c'est dur.",
  up:"Banc plus haut|Sac lesté|Genou haut en haut du mouvement|Montée explosive avec saut",
  down:"Marche plus basse."},
 burpee:{g:"core",mat:"Aucun matériel",m:"Corps entier, cardio",
  how:"Debout, descends en appui, pieds en arrière.|Fais une pompe (ou touche le sol avec la poitrine).|Ramène les pieds et saute en l'air.",
  tips:"Respire régulièrement.|Dos gainé en bas.",
  up:"Pompe complète + saut genoux hauts|Burpee à une jambe|Burpee + traction|30 s sans pause",
  down:"Sans pompe, pieds en arrière un par un."},
 jambes:{g:"core",mat:"Aucun matériel",m:"Bas du ventre, fléchisseurs de hanche",
  how:"Allongé, lombaires plaquées au sol, mains sous les fessiers.|Lève les jambes tendues à la verticale.|Redescends lentement sans toucher le sol.",
  tips:"Si le dos se creuse, plie les genoux.|Souffle en montant.",
  up:"Descente de 4 s|Jambes à 5 cm du sol, sans poser|Pause en bas|Suspendu à la barre",
  down:"Genoux fléchis."},
 crunch:{g:"core",mat:"Aucun matériel",m:"Abdominaux",
  how:"Dos au sol, genoux fléchis, mains aux tempes.|Enroule le haut du dos en soufflant.|Redescends sans relâcher complètement.",
  tips:"Ne tire pas sur la nuque.|Garde un poing de distance entre menton et poitrine.",
  up:"Pause de 2 s en haut|Jambes en l'air|Bras tendus derrière la tête|Poids tenu sur la poitrine",
  down:"Demi-mouvement, bras croisés."},
 bike:{g:"core",mat:"Aucun matériel",m:"Abdos, obliques",
  how:"Mains aux tempes, jambes en l'air.|Amène le coude vers le genou opposé en tendant l'autre jambe.|Alterne lentement.",
  tips:"Tourne le buste, pas seulement les coudes.|Jambe tendue basse = plus dur.",
  up:"2 s par côté|Jambe tendue plus basse|Pause de 1 s coude-genou",
  down:"Pieds au sol, touche le genou sans tendre."},
 mont:{g:"core",mat:"Aucun matériel",m:"Abdos, épaules, cardio",
  how:"Position de pompe, mains sous les épaules.|Ramène un genou vers la poitrine, alterne vite.",
  tips:"Bassin bas, dos plat.|Respire sans bloquer.",
  up:"Pieds surélevés|Genou vers le coude opposé|Rythme maximal",
  down:"Mains sur une chaise, rythme lent."},
 gaine:{g:"core",mat:"Aucun matériel",m:"Abdos profonds, dos, épaules",
  how:"Appui sur les avant-bras, coudes sous les épaules.|Corps aligné, fessiers et ventre serrés.|Respire normalement et tiens.",
  tips:"Bassin ni trop haut ni creusé.|Pousse le sol avec les avant-bras.",
  up:"Lève un bras ou une jambe|Pieds surélevés|Coudes loin devant les épaules|Planche dynamique (de coudes en mains)",
  down:"Planche sur les genoux."},

 epress:{g:"push",el:1,mat:"Élastique",m:"Pectoraux, épaules, triceps",
  how:"Passe l'élastique dans le dos, sous les aisselles, mains devant la poitrine.|Pousse les bras droits devant toi.|Reviens lentement, coudes à hauteur de poitrine.",
  tips:"Dos droit, ventre serré.|Un élastique plus court ou un pas en avant augmente la tension.",
  up:"Élastique plus fort ou doublé|Fais un pas en avant|Un bras à la fois|Pause de 2 s bras tendus|Retour en 4 s",
  down:"Élastique plus léger, ou reste plus proche de l'ancrage."},
 erow:{g:"pull",el:1,mat:"Élastique",m:"Dos, biceps, arrière d'épaules",
  how:"Assis, jambes tendues, élastique autour des pieds, bouts dans les mains.|Dos droit, tire les coudes vers les hanches.|Serre les omoplates 1 s, reviens lentement.",
  tips:"Ne te penche pas en arrière.|Épaules loin des oreilles.",
  up:"Élastique plus fort ou doublé|Pause de 2 s serré|Un bras à la fois|Retour en 4 s",
  down:"Élastique plus lâche, genoux fléchis."},
 efac:{g:"pull",el:1,mat:"Élastique + point d'ancrage",m:"Arrière d'épaules, haut du dos, coiffe",
  how:"Fixe l'élastique à hauteur du visage (porte, poteau).|Tire vers le visage, coudes hauts et écartés.|Écarte les mains en fin de course, reviens lentement.",
  tips:"Excellent pour garder des épaules saines en boxe.|Mouvement propre, pas de triche avec le dos.",
  up:"Élastique plus fort|Recule pour plus de tension|Pause de 2 s en fin de course|Sur une jambe",
  down:"Avance pour détendre l'élastique."},
 ecurl:{g:"pull",el:1,mat:"Élastique",m:"Biceps, avant-bras",
  how:"Pieds sur l'élastique, bouts dans les mains, paumes vers l'avant.|Coudes collés au corps, plie les bras.|Redescends lentement.",
  tips:"Pas d'élan avec le dos.|Poignets droits.",
  up:"Élastique plus fort ou raccourci dans les mains|Descente de 4 s|Curl marteau (paumes face à face)|Un bras à la fois|Pause à mi-course",
  down:"Élastique plus léger ou plus long."},
 etri:{g:"push",el:1,mat:"Élastique",m:"Triceps",
  how:"Pieds sur un bout de l'élastique, passe l'autre derrière la tête, coudes vers le plafond.|Tends les bras vers le haut sans bouger les coudes.|Reviens lentement.",
  tips:"Coudes serrés près des oreilles.|Dos neutre.",
  up:"Élastique plus fort ou raccourci|Un bras à la fois|Descente de 4 s|Pause de 1 s bras tendus",
  down:"Élastique plus long."},
 elat:{g:"push",el:1,mat:"Élastique",m:"Épaules (deltoïdes)",
  how:"Pieds sur l'élastique, poignées de chaque côté.|Lève les bras sur les côtés jusqu'à l'horizontale.|Redescends lentement.",
  tips:"Coudes légèrement fléchis.|Ne hausse pas les épaules.",
  up:"Élastique plus fort|Descente de 4 s|Pause de 2 s en haut|Un bras à la fois",
  down:"Élastique plus léger."},
 epull:{g:"pull",el:1,mat:"Élastique",m:"Arrière d'épaules, haut du dos",
  how:"Debout, élastique tenu bras tendus devant la poitrine.|Écarte les mains jusqu'à ouvrir les bras en croix.|Reviens lentement.",
  tips:"Bras à hauteur d'épaules.|Serre les omoplates en fin de mouvement.",
  up:"Mains plus proches sur l'élastique|Pause de 2 s bras ouverts|Élastique plus fort|Retour en 4 s",
  down:"Mains plus écartées sur l'élastique."},
 esquat:{g:"legs",el:1,mat:"Élastique",m:"Cuisses, fessiers, moyens fessiers",
  how:"Place l'élastique au-dessus des genoux.|Descends en poussant les genoux vers l'extérieur.|Remonte fermement.",
  tips:"Les genoux ne rentrent jamais vers l'intérieur.|Poids sur les talons.",
  up:"Élastique plus fort|Descente de 4 s|Pause de 2 s en bas|Ajoute un saut en remontant",
  down:"Élastique plus léger, ou sans élastique."},
 ewalk:{g:"legs",el:1,mat:"Élastique",m:"Moyens fessiers, hanches",
  how:"Élastique autour des chevilles ou au-dessus des genoux, genoux légèrement fléchis.|Fais de grands pas sur le côté.|Garde la tension tout du long.",
  tips:"Les pieds ne se rapprochent jamais.|Bassin stable, buste droit.",
  up:"Élastique plus fort ou placé aux chevilles|Plus de pas|Position plus basse|Pas en diagonale",
  down:"Élastique au-dessus des genoux, moins fléchi."},
 ehing:{g:"legs",el:1,mat:"Élastique",m:"Fessiers, ischios, bas du dos",
  how:"Pieds sur l'élastique, poignées dans les mains.|Pousse les hanches en arrière, dos plat.|Redresse-toi en serrant les fessiers.",
  tips:"Dos toujours plat.|Genoux à peine fléchis.",
  up:"Élastique plus fort ou doublé|Pause de 2 s debout|Sur une jambe|Descente de 4 s",
  down:"Élastique plus léger."},
 epal:{g:"core",el:1,mat:"Élastique + point d'ancrage",m:"Abdos, obliques (anti-rotation)",
  how:"Fixe l'élastique à hauteur de poitrine, mets-toi de profil.|Mains devant le sternum, pousse les bras droits devant toi.|Résiste à la rotation, tiens 2 s, reviens.",
  tips:"Le buste ne tourne pas.|Respire sans bloquer.",
  up:"Éloigne-toi de l'ancrage|Tiens 5 s bras tendus|Passe à genoux, debout, puis en fente|Lève les bras au-dessus de la tête",
  down:"Rapproche-toi de l'ancrage."},
 eassist:{g:"pull",el:1,mat:"Barre + élastique",m:"Dos, biceps",
  how:"Fixe l'élastique en boucle sur la barre.|Place un genou ou un pied dans la boucle.|Tire comme pour une traction normale.",
  tips:"L'élastique aide surtout en bas : contrôle la descente.|Ne rebondis pas dessus.",
  up:"Élastique plus fin|Pied dans la boucle au lieu du genou|Descente de 4 s|Passe ensuite aux négatives",
  down:"Élastique plus épais."},
 erot:{g:"pull",el:1,mat:"Élastique + point d'ancrage",m:"Coiffe des rotateurs (épaule)",
  how:"Élastique fixé à hauteur du coude, coude collé au flanc plié à 90°.|Tire l'avant-bras vers l'extérieur sans bouger le coude.|Reviens lentement.",
  tips:"Coince une serviette sous le coude.|Reste léger : ce sont de petits muscles protecteurs.",
  up:"Élastique plus fort|Descente de 4 s|Pause de 2 s",
  down:"Élastique plus léger."}
};
INFO.gaine2 = INFO.gaine;

// Souplesse : même ordre que STR dans app.js
const STRX = [
 {why:"Lubrifie les articulations et réveille la coiffe des rotateurs.",how:"Debout, bras relâchés.|Roule les épaules en grands cercles vers l'arrière.",up:"Fais des cercles de bras tendus, plus grands|Ajoute un élastique léger entre les mains"},
 {why:"Libère la poitrine après pompes et dips, et rouvre les épaules.",how:"Avant-bras contre un mur, coude à hauteur d'épaule.|Tourne doucement le buste à l'opposé.|Respire et relâche.",up:"Change la hauteur du coude pour varier l'angle|Tiens 45 s|Pousse 5 s contre le mur, relâche, avance un peu plus"},
 {why:"Décompresse la colonne et étire dorsaux et épaules.",how:"Mains à la barre, bras tendus.|Relâche les épaules et laisse-toi pendre.|Respire dans les côtes.",up:"Tiens 45 à 60 s|Une main puis l'autre|Rotations lentes du bassin"},
 {why:"Les hanches se raidissent assis : elles limitent coups, squats et fentes.",how:"Un genou au sol, l'autre pied devant.|Pousse les hanches vers l'avant, buste droit.|Contracte la fesse de la jambe arrière.",up:"Lève les bras au plafond|Rapproche le pied avant de la hanche|Penche-toi légèrement du côté étiré"},
 {why:"Des ischios souples protègent le bas du dos et améliorent squats et coups de pied.",how:"Une jambe tendue devant, talon au sol.|Dos plat, penche-toi en reculant les fesses.|Ne t'arrondis pas.",up:"Tire les orteils vers toi|Pousse le talon dans le sol 5 s puis relâche|Tiens 45 s"},
 {why:"Soulage genoux et bas du dos, utile après squats et sauts.",how:"Debout, attrape ta cheville, talon vers la fesse.|Genoux joints, bassin poussé vers l'avant.|Appuie-toi à un mur si besoin.",up:"Pousse le pied dans la main 5 s puis relâche|Recule légèrement le genou derrière toi"},
 {why:"Mobilise la colonne et la détend après les efforts.",how:"À quatre pattes, mains sous les épaules.|Expire : dos rond, menton rentré.|Inspire : dos creux, regard devant.",up:"Ralentis : 4 s par mouvement|Ajoute des cercles du bassin"},
 {why:"Relâche dos, hanches et épaules : parfait pour finir.",how:"Fesses sur les talons, bras loin devant.|Front au sol, respire dans le bas du dos.",up:"Marche les mains vers un côté puis l'autre|Écarte les genoux pour ouvrir les hanches"}
];
const STIP = "Régularité : 5 à 10 min chaque jour valent mieux qu'une longue séance par semaine.|Étire-toi chaud, de préférence après la séance ou une douche chaude.|Tiens 30 à 60 s : le muscle met environ 20 s à se relâcher.|Expire en t'enfonçant doucement, ne bloque jamais ta respiration.|Tension de 5-6 sur 10 : jamais de douleur vive.|Contracté-relâché : pousse 5 s contre l'étirement, relâche, puis va un peu plus loin.|Ne rebondis pas : les à-coups crispent le muscle.";

/* ===== Poigne d'acier : routine quotidienne (4 min, matériel de la maison) =====
   [icône, nom, secondes, consigne, 2 = les deux côtés] */
const GRIP = [
  ["🧻","Serviette écrasée",30,"Serre une serviette roulée (ou une balle) de toutes tes forces 3 s, relâche, recommence.",2],
  ["🎹","Doigts en éventail",30,"Élastique (ou chouchou) autour des doigts : ouvre-les en grand, referme, sans arrêt."],
  ["📖","Pince du livre",30,"Tiens un gros livre par la tranche entre le pouce et les doigts, bras le long du corps.",2],
  ["🪂","Suspension à la serviette",30,"Jette une serviette sur la barre, accroche-toi aux deux bouts. Tiens le plus longtemps possible."],
  ["🔨","Le marteau",30,"Bouteille d'eau tenue par le goulot : fais-la basculer lentement de haut en bas, avant-bras posé.",2]
];
const GRX = [
 {why:"Travaille l'écrasement : la force qui verrouille tes mains dans les bandes et les prises.",how:"Roule une serviette serrée, tiens-la à pleine main.|Serre fort 3 s, relâche 1 s.|Enchaîne sans te crisper les épaules.",up:"Serviette plus épaisse ou mouillée|Serre 5 s, relâche 1 s|Essore-la en la tordant|Balle de tennis plus dure"},
 {why:"Les extenseurs des doigts sont toujours négligés : les muscler protège les coudes et équilibre la main.",how:"Rassemble le bout des doigts et du pouce, passe un élastique autour.|Ouvre grand les doigts contre la résistance.|Referme lentement.",up:"Élastique plus serré ou doublé|Pause de 2 s ouvert|Un doigt à la fois"},
 {why:"La pince renforce pouce et bout des doigts, la poigne qui tient longtemps.",how:"Pince un livre épais par la tranche, pouce d'un côté, doigts de l'autre.|Bras le long du corps, épaules basses.|Tiens sans lâcher.",up:"Livre plus épais ou plus lourd|Pince avec deux doigts seulement|Marche en le tenant|Tiens une assiette en céramique de profil"},
 {why:"La serviette est plus épaisse que la barre : elle fait travailler fort doigts, avant-bras et épaules.",how:"Pose une serviette sur la barre, saisis les deux bouts.|Suspends-toi, épaules actives.|Tiens jusqu'à la limite sans te lâcher d'un coup.",up:"Chaque jour, essaie de tenir 5 s de plus|Serviette plus épaisse|Une main sur la serviette, l'autre sur la barre|Ajoute une traction"},
 {why:"Renforce l'avant-bras et le poignet, très sollicités par les frappes et les prises.",how:"Avant-bras posé sur une cuisse, la main dépasse.|Tiens la bouteille par le goulot.|Bascule le poignet de haut en bas, lentement.",up:"Bouteille plus lourde ou plus longue|Ralentis (3 s par mouvement)|Rotations de l'avant-bras"}
];
const DEFIS = [
  "Défi du jour : porte tes sacs de courses sans les poser le plus longtemps possible.",
  "Défi du jour : serre ta main fort à chaque fois que tu attends (bus, micro-ondes).",
  "Défi du jour : tiens ta suspension à la serviette 5 s de plus qu'hier.",
  "Défi du jour : ouvre tous les pots et bocaux de la maison sans rechigner.",
  "Défi du jour : porte une bouteille d'eau pleine du bout des doigts en marchant.",
  "Défi du jour : essore une serviette mouillée à fond, pour chaque main.",
  "Défi du jour : monte tes escaliers en tenant la rampe du bout des doigts, sans t'appuyer."
];

/* ===== Matériel nécessaire + remplacements (même objectif) =====
   EQ : matériel requis par exercice. SUBS : remplaçants possibles, par ordre de préférence. */
const EQL = {barre:"🧗 Barre de traction", chaise:"🪑 Chaise ou banc solide", table:"🪵 Table solide", elastique:"🎗️ Élastiques", ancrage:"🚪 Point d'ancrage (porte, poteau)"};
const EQ = {
  tract:["barre"], neg:["barre"], dips:["chaise"], rows:["table"], banc:["chaise"],
  epress:["elastique"], erow:["elastique"], efac:["elastique","ancrage"], elat:["elastique"], ecurl:["elastique"],
  etri:["elastique"], epull:["elastique"], esquat:["elastique"], ewalk:["elastique"], ehing:["elastique"],
  epal:["elastique","ancrage"], eassist:["barre","elastique"], erot:["elastique","ancrage"]
};
const SUBS = {
  tract:["rows","erow","epull","super","efac"], neg:["rows","erow","epull","super","efac"],
  rows:["erow","efac","epull","super"], dips:["pompes","etri","epress","pexp"], banc:["fentes","squat","esquat"],
  epress:["pompes","pexp","dips"], erow:["rows","tract","super"], efac:["super","rows","epull"], elat:["pompes","mont"],
  ecurl:["tract","neg","rows"], etri:["dips","pompes"], epull:["super","rows"], esquat:["squat","fentes"],
  ewalk:["fentes","squat"], ehing:["super","fentes"], epal:["gaine","mont","crunch"], eassist:["neg","rows","super"], erot:["super","efac"]
};

/* ===== Échauffement (mobilité) ===== [icône, nom, secondes, consigne, 2 = deux côtés] */
const MOB = [
  ["🤷","Cercles de bras",30,"Bras tendus : 15 s de grands cercles vers l'avant, 15 s vers l'arrière."],
  ["🌀","Rotations du buste",30,"Pieds ancrés, bras relâchés : tourne le buste à droite puis à gauche."],
  ["🔄","Cercles de hanches",30,"Mains sur les hanches, grands cercles dans un sens puis dans l'autre."],
  ["🦵","Squats lents",30,"Descente de 2 s, bras devant, remonte sans à-coup."],
  ["🐱","Chat-vache",30,"À quatre pattes : dos rond, puis creux, au rythme du souffle."],
  ["🏃","Montées de genoux",30,"Genoux hauts, bras qui accompagnent, rythme doux."],
  ["🥊","Shadow boxing léger",30,"Jab-direct au ralenti, déplace-toi sur la pointe des pieds."]
];
const MOBX = [
 {why:"Réveille les épaules, très sollicitées en boxe et en tractions.",how:"Debout, bras tendus sur les côtés.|Fais de grands cercles lents.|Change de sens à mi-temps.",up:"Cercles plus grands|Ajoute un élastique léger entre les mains"},
 {why:"Libère la colonne et prépare les rotations des coups.",how:"Pieds largeur d'épaules, genoux souples.|Tourne le buste, les bras suivent sans force.|Garde le bassin face à toi.",up:"Tourne plus loin à chaque passage|Pivote sur la pointe du pied arrière"},
 {why:"Huile les hanches avant squats, fentes et déplacements.",how:"Mains sur les hanches, jambes un peu fléchies.|Dessine de grands cercles avec le bassin.|Change de sens à mi-temps.",up:"Cercles plus larges|Fais-les sur une jambe"},
 {why:"Active cuisses et fessiers et vérifie ta mobilité de hanches.",how:"Pieds largeur d'épaules, bras devant.|Descends lentement, genoux dans l'axe des pieds.|Remonte en poussant dans les talons.",up:"Pause de 2 s en bas|Descends plus bas si le dos reste droit"},
 {why:"Mobilise la colonne vertébrale en douceur.",how:"À quatre pattes, mains sous les épaules.|Expire : dos rond. Inspire : dos creux.",up:"Ralentis : 4 s par mouvement|Ajoute des cercles du bassin"},
 {why:"Monte la température et réveille le cardio sans fatigue.",how:"Debout, monte un genou puis l'autre.|Bras qui accompagnent, dos droit.|Reste léger sur la pointe des pieds.",up:"Genoux plus hauts|Rythme plus rapide sur les 10 dernières secondes"},
 {why:"Prépare le geste et la coordination : épaules, hanches, jambes ensemble.",how:"Garde haute, menton bas.|Jab-direct au ralenti, pivote le pied arrière.|Reste mobile sur les appuis.",up:"Ajoute un crochet et une esquive|Accélère progressivement"}
];
STRX.push(
 {why:"Les triceps travaillent à chaque pompe, dip et direct : ils se raccourcissent vite.",how:"Main dans le dos, entre les omoplates, coude vers le plafond.|L'autre main appuie doucement sur le coude.|Garde la nuque longue.",up:"Pousse le coude 5 s contre la main, puis relâche|Descends un peu plus la main dans le dos"},
 {why:"Des mollets souples protègent tendon d'Achille et genoux (très utile pour la corde à sauter).",how:"Mains au mur, une jambe tendue derrière, talon au sol.|Avance le bassin vers le mur.|Garde le pied bien droit.",up:"Plie légèrement le genou arrière pour viser le bas du mollet|Recule le pied pour intensifier"},
 {why:"Détend les hanches et soulage le bas du dos.",how:"Allongé sur le dos, cheville sur le genou opposé.|Tire la cuisse du bas vers toi.|Garde la tête au sol.",up:"Pousse le genou vers l'extérieur avec le coude|Rapproche la cuisse de la poitrine"},
 {why:"Relâche les tensions accumulées par la garde haute et les tractions.",how:"Assis ou debout, épaules basses.|Penche l'oreille vers l'épaule.|Main sur la tête, poids très léger seulement.",up:"Regarde un peu vers le sol pour viser l'arrière de la nuque|Tire l'épaule opposée vers le bas"}
);

/* ===== Respiration guidée : [phase, secondes, taille du cercle] ===== */
const BR = {
  coh:{ic:"🌬️",n:"Cohérence cardiaque",min:5,d:"Inspire 5 s, expire 5 s. Calme le cœur : idéal le soir.",ph:[["Inspire",5,1],["Expire",5,.55]]},
  box:{ic:"🟦",n:"Respiration carrée",min:3,d:"4-4-4-4 : garde ton sang-froid sous pression, comme avant un combat.",ph:[["Inspire",4,1],["Retiens",4,1],["Expire",4,.55],["Retiens",4,.55]]},
  rec:{ic:"🌙",n:"Récupération 4-7-8",min:3,d:"Une longue expiration fait retomber la tension et aide à s'endormir.",ph:[["Inspire",4,1],["Retiens",7,1],["Expire",8,.55]]}
};
