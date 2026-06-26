export const PV_FIELDS = [
  'nom','prenom','dob','sexe','taille','poids','imc','asa','intervention','date_intervention','chirurgien',
  'atcd_med','atcd_chir','anesth_prec','allergies','traitements','atcd_fam','tabac','pa','alcool','drogues',
  'mallampati','tmt','ouverture','protrusion','cervicale','dents','collerette','va_remarques',
  'tas','tad','fc','spo2','auscultation_card','auscultation_pulm','effort','nyha','ecg','echo','pamt','rcr',
  'hb','plaq','tp','inr','creat','dfg','glycemie','hba1c','asat','alat','bicarb','k','ariscat','chads','hasbled','autres_bilans',
  'technique','premedication','antibio','anticoag','strategie_va','analgesie','nvpo','plan_postop','risques','consentement','npo'
];

export const FOLLOW_UP = {
  'induction': ['Dose midazolam premedication', 'Protocole emergence TIVA', 'Monitorage BIS recommande'],
  'tiva': ['Modele Schnider', 'Remifentanil perfusion', 'Propofol TCI vs Bolus'],
  'anaphylaxie': ['Tests allergologiques', 'Traitement a long terme', 'Risque de recurrence'],
  'bronchospasme': ['Salbutamol vs adrenaline neb', 'Theophylline peroperatoire', 'Diagnostic differentiel'],
  'hypotension': ['Noradrenaline vs ephedrine', 'Fluides de remplissage', 'Monitorage invasif'],
  'sspi': ['Score Aldrete interpretation', 'Criteres retour SSPI', 'Complications SSPI'],
  'nvpo': ['Ondansetron vs dexamethasone', 'Ketalgone peroperatoire', 'NVPO et morphiniques'],
  'propofol': ['Co-induction fentanyl', 'Induction sevoflurane', 'Pression arterielle cible'],
  'intubation': ['Score Mallampati', 'Fibroscopie vs video', 'Tube endotracheal adapte'],
  'default': ['Dose propofol induction', 'Protocole emergence', 'Gestion douleur per-operatoire']
};

export function getFollowUps(text) {
  const lower = text.toLowerCase();
  const keys = Object.keys(FOLLOW_UP);
  for (let i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i]) !== -1) return FOLLOW_UP[keys[i]];
  }
  return FOLLOW_UP['default'];
}

export function buildPatientCtx(p) {
  if (!p || !p.age) return '';
  const parts = [];
  if (p.age) parts.push('Age: ' + p.age + ' ans');
  if (p.sex) parts.push('Sexe: ' + p.sex);
  if (p.weight) parts.push('Poids: ' + p.weight + ' kg');
  if (p.height) parts.push('Taille: ' + p.height + ' cm');
  if (p.asa) parts.push(p.asa);
  if (p.surgery) parts.push('Intervention: ' + p.surgery);
  if (p.history) parts.push('ATCD: ' + p.history);
  if (p.meds) parts.push('Traitements: ' + p.meds);
  return '\n\n[Contexte patient: ' + parts.join(' | ') + ']';
}

export function buildPreVisitSummary(d) {
  const parts = [];
  if (d.nom || d.prenom) parts.push('Patient: ' + (d.prenom || '') + ' ' + (d.nom || ''));
  if (d.age || d.taille || d.poids) {
    const bmi = d.imc || '?';
    parts.push('Age: ' + (d.age || '?') + ' ans | Taille: ' + (d.taille || '?') + ' cm | Poids: ' + (d.poids || '?') + ' kg | IMC: ' + bmi);
  }
  if (d.asa) parts.push('ASA: ' + d.asa);
  if (d.intervention) parts.push('Intervention: ' + d.intervention);
  if (d.atcd_med) parts.push('ATCD medicaux: ' + d.atcd_med);
  if (d.atcd_chir) parts.push('ATCD chirurgicaux: ' + d.atcd_chir);
  if (d.anesth_prec) parts.push('Anesthesies anterieures: ' + d.anesth_prec);
  if (d.allergies) parts.push('Allergies: ' + d.allergies);
  if (d.traitements) parts.push('Traitements: ' + d.traitements);
  if (d.atcd_fam) parts.push('ATCD familiaux: ' + d.atcd_fam);
  if (d.tabac) parts.push('Tabac: ' + d.tabac + (d.pa ? ' (' + d.pa + ' PA)' : ''));
  if (d.mallampati || d.tmt) parts.push('Voies aeriennes: Mallampati ' + (d.mallampati || '?') + ' | TMT ' + (d.tmt || '?') + ' cm');
  if (d.score_diff) parts.push('Risque intubation difficile: ' + d.score_diff);
  if (d.tas || d.fc) parts.push('TA: ' + (d.tas || '?') + '/' + (d.tad || '?') + ' mmHg | FC: ' + (d.fc || '?') + ' bpm | SpO2: ' + (d.spo2 || '?') + '%');
  if (d.auscultation_card || d.auscultation_pulm) parts.push('Cardiaque: ' + (d.auscultation_card || '?') + ' | Pulm: ' + (d.auscultation_pulm || '?'));
  if (d.pamt) parts.push('PAMT: ' + d.pamt);
  if (d.rcr) parts.push('RCRI: ' + d.rcr);
  const bio = [];
  if (d.hb) bio.push('Hb:' + d.hb);
  if (d.plaq) bio.push('Plaq:' + d.plaq);
  if (d.tp) bio.push('TP:' + d.tp + '%');
  if (d.inr) bio.push('INR:' + d.inr);
  if (d.creat) bio.push('Creat:' + d.creat);
  if (d.dfg) bio.push('DFG:' + d.dfg);
  if (d.glycemie) bio.push('Glyc:' + d.glycemie);
  if (d.hba1c) bio.push('HbA1c:' + d.hba1c);
  if (d.asat) bio.push('ASAT:' + d.asat);
  if (d.alat) bio.push('ALAT:' + d.alat);
  if (bio.length) parts.push('Biologie: ' + bio.join(' | '));
  if (d.ariscat) parts.push('ARISCAT: ' + d.ariscat + '%');
  if (d.chads) parts.push('CHADS2-VASc: ' + d.chads);
  if (d.hasbled) parts.push('HAS-BLED: ' + d.hasbled);
  if (d.technique) parts.push('Technique: ' + d.technique);
  if (d.premedication) parts.push('Premedication: ' + d.premedication);
  if (d.antibio) parts.push('Antibio: ' + d.antibio);
  if (d.anticoag) parts.push('Anticoag/Antiagreg: ' + d.anticoag);
  if (d.strategie_va) parts.push('Strategie VA: ' + d.strategie_va);
  if (d.analgesie) parts.push('Analgesie: ' + d.analgesie);
  if (d.nvpo) parts.push('NVPO: ' + d.nvpo);
  if (d.plan_postop) parts.push('Plan post-op: ' + d.plan_postop);
  if (d.risques) parts.push('Risques: ' + d.risques);
  if (d.consentement) parts.push('Consentement: ' + d.consentement);
  if (d.npo) parts.push('NPO: ' + d.npo);
  return '=== RESUME VISITE PRE-ANESTHESIQUE ===\n\n' + parts.join('\n');
}
