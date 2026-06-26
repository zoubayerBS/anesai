import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import { buildPreVisitSummary } from "../lib/helpers";

const STORAGE_KEY = "anesia_previsit";

const TABS = [
  "Identite",
  "Antecedents",
  "Voies Aeriennes",
  "Cardio-Respiratoire",
  "Biologie & Scores",
  "Plan & Consentement",
];

function calcScore(d) {
  let score = 0;
  if (d.pv_mallampati === "III" || d.pv_mallampati === "IV") score++;
  if (d.pv_tmt > 0 && d.pv_tmt < 6) score++;
  if (d.pv_ouverture > 0 && d.pv_ouverture < 3) score++;
  if (d.pv_protrusion === "Insuffisante") score++;
  if (score >= 2) return { label: `Eleve (${score}/4)`, color: "text-red-600" };
  if (score === 1)
    return { label: `Intermediaire (${score}/4)`, color: "text-amber-600" };
  return { label: `Faible (${score}/4)`, color: "text-emerald-600" };
}

function buildSummary(d) {
  const lines = [];
  lines.push("=== RESUME VISITE PRE-ANESTHESIQUE ===");
  lines.push("");
  const patient =
    [d.pv_prenom, d.pv_nom].filter(Boolean).join(" ") || "(non renseigne)";
  lines.push(`Patient: ${patient}`);
  let age = "";
  if (d.pv_dob) {
    const birth = new Date(d.pv_dob);
    const now = new Date();
    let a = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) a--;
    age = `${a} ans`;
  }
  const parts = [
    age,
    d.pv_taille ? `${d.pv_taille} cm` : "",
    d.pv_poids ? `${d.pv_poids} kg` : "",
    d.pv_imc ? `IMC: ${d.pv_imc}` : "",
  ].filter(Boolean);
  if (parts.length) lines.push(`Age: ${parts.join(" | ")}`);
  if (d.pv_sexe && d.pv_sexe !== "--") lines.push(`Sexe: ${d.pv_sexe}`);
  if (d.pv_asa && d.pv_asa !== "--") lines.push(`ASA: ${d.pv_asa}`);
  if (d.pv_intervention) lines.push(`Intervention: ${d.pv_intervention}`);
  if (d.pv_date_intervention)
    lines.push(`Date intervention: ${d.pv_date_intervention}`);
  if (d.pv_chirurgien) lines.push(`Chirurgien: ${d.pv_chirurgien}`);
  lines.push("");
  lines.push("--- ANTECEDENTS ---");
  if (d.pv_atcd_med) lines.push(`Medicaux: ${d.pv_atcd_med}`);
  if (d.pv_atcd_chir) lines.push(`Chirurgicaux: ${d.pv_atcd_chir}`);
  if (d.pv_anesth_prec)
    lines.push(`Anesthesies precedentes: ${d.pv_anesth_prec}`);
  if (d.pv_allergies) lines.push(`Allergies: ${d.pv_allergies}`);
  if (d.pv_traitements) lines.push(`Traitements: ${d.pv_traitements}`);
  if (d.pv_atcd_fam) lines.push(`Antecedents familiaux: ${d.pv_atcd_fam}`);
  if (d.pv_tabac && d.pv_tabac !== "--") lines.push(`Tabac: ${d.pv_tabac}`);
  if (d.pv_pa) lines.push(`PA (paquets/an): ${d.pv_pa}`);
  if (d.pv_alcool && d.pv_alcool !== "--") lines.push(`Alcool: ${d.pv_alcool}`);
  if (d.pv_drogues && d.pv_drogues !== "--")
    lines.push(`Drogues: ${d.pv_drogues}`);
  lines.push("");
  lines.push("--- VOIES AERIENNES ---");
  if (d.pv_mallampati && d.pv_mallampati !== "--")
    lines.push(`Mallampati: ${d.pv_mallampati}`);
  if (d.pv_tmt) lines.push(`TMT: ${d.pv_tmt} cm`);
  if (d.pv_ouverture) lines.push(`Ouverture buccale: ${d.pv_ouverture} doigts`);
  if (d.pv_protrusion && d.pv_protrusion !== "--")
    lines.push(`Protrusion mandibulaire: ${d.pv_protrusion}`);
  if (d.pv_cervicale && d.pv_cervicale !== "--")
    lines.push(`Mobilite cervicale: ${d.pv_cervicale}`);
  if (d.pv_dents && d.pv_dents !== "--") lines.push(`Dents: ${d.pv_dents}`);
  if (d.pv_collerette) lines.push(`Collerette: ${d.pv_collerette} cm`);
  const sc = calcScore(d);
  lines.push(`Score difficulte: ${sc.label}`);
  if (d.pv_va_remarques) lines.push(`Remarques VA: ${d.pv_va_remarques}`);
  lines.push("");
  lines.push("--- CARDIO-RESPIRATOIRE ---");
  if (d.pv_tas || d.pv_tad)
    lines.push(`PA: ${d.pv_tas || "?"}/${d.pv_tad || "?"} mmHg`);
  if (d.pv_fc) lines.push(`FC: ${d.pv_fc} bpm`);
  if (d.pv_spo2) lines.push(`SpO2: ${d.pv_spo2}%`);
  if (d.pv_auscultation_card && d.pv_auscultation_card !== "--")
    lines.push(`Auscultation cardiaque: ${d.pv_auscultation_card}`);
  if (d.pv_auscultation_pulm && d.pv_auscultation_pulm !== "--")
    lines.push(`Auscultation pulmonaire: ${d.pv_auscultation_pulm}`);
  if (d.pv_effort && d.pv_effort !== "--")
    lines.push(`Capacite d'effort: ${d.pv_effort}`);
  if (d.pv_nyha && d.pv_nyha !== "--") lines.push(`NYHA: ${d.pv_nyha}`);
  if (d.pv_ecg) lines.push(`ECG: ${d.pv_ecg}`);
  if (d.pv_echo) lines.push(`Echo: ${d.pv_echo}`);
  if (d.pv_pamt && d.pv_pamt !== "--") lines.push(`PAMT: ${d.pv_pamt}`);
  if (d.pv_rcr !== undefined && d.pv_rcr !== "")
    lines.push(`RCR: ${d.pv_rcr}/6`);
  lines.push("");
  lines.push("--- BIOLOGIE & SCORES ---");
  if (d.pv_hb) lines.push(`Hb: ${d.pv_hb} g/dL`);
  if (d.pv_plaq) lines.push(`Plaquettes: ${d.pv_plaq} G/L`);
  if (d.pv_tp) lines.push(`TP: ${d.pv_tp}%`);
  if (d.pv_inr) lines.push(`INR: ${d.pv_inr}`);
  if (d.pv_creat) lines.push(`Creatinine: ${d.pv_creat} µmol/L`);
  if (d.pv_dfg) lines.push(`DFG: ${d.pv_dfg} mL/min`);
  if (d.pv_glycemie) lines.push(`Glycemie: ${d.pv_glycemie} mmol/L`);
  if (d.pv_hba1c) lines.push(`HbA1c: ${d.pv_hba1c}%`);
  if (d.pv_asat) lines.push(`ASAT: ${d.pv_asat} UI/L`);
  if (d.pv_alat) lines.push(`ALAT: ${d.pv_alat} UI/L`);
  if (d.pv_bicarb) lines.push(`Bicarbonates: ${d.pv_bicarb} mmol/L`);
  if (d.pv_k) lines.push(`K+: ${d.pv_k} mmol/L`);
  if (d.pv_ariscat) lines.push(`ARISCAT: ${d.pv_ariscat}`);
  if (d.pv_chads !== undefined && d.pv_chads !== "")
    lines.push(`CHA2DS2-VASc: ${d.pv_chads}`);
  if (d.pv_hasbled !== undefined && d.pv_hasbled !== "")
    lines.push(`HAS-BLED: ${d.pv_hasbled}`);
  if (d.pv_autres_bilans) lines.push(`Autres bilans: ${d.pv_autres_bilans}`);
  lines.push("");
  lines.push("--- PLAN & CONSENTEMENT ---");
  if (d.pv_technique && d.pv_technique !== "--")
    lines.push(`Technique: ${d.pv_technique}`);
  if (d.pv_premedication) lines.push(`Premedication: ${d.pv_premedication}`);
  if (d.pv_antibio) lines.push(`Antibio prophylaxie: ${d.pv_antibio}`);
  if (d.pv_anticoag) lines.push(`Anticoagulation: ${d.pv_anticoag}`);
  if (d.pv_strategie_va) lines.push(`Strategie VA: ${d.pv_strategie_va}`);
  if (d.pv_analgesie) lines.push(`Analgesie: ${d.pv_analgesie}`);
  if (d.pv_nvpo) lines.push(`NVPO: ${d.pv_nvpo}`);
  if (d.pv_plan_postop) lines.push(`Plan post-op: ${d.pv_plan_postop}`);
  if (d.pv_risques) lines.push(`Risques: ${d.pv_risques}`);
  if (d.pv_consentement && d.pv_consentement !== "--")
    lines.push(`Consentement: ${d.pv_consentement}`);
  if (d.pv_npo) lines.push(`NPO: ${d.pv_npo}`);
  return lines.join("\n");
}

/* ─── SelectField custom — zéro <select> natif ─── */
function SelectField({ label, id, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = value && value !== "--" ? value : "";
  const displayLabel = current || "--";
  const isPlaceholder = !current;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div class="flex flex-col gap-1.5">
      <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
        {label}
      </label>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.7)",
            border: `1px solid ${open ? "#FBBF24" : "#E8E4DE"}`,
            borderRadius: "12px",
            padding: "10px 36px 10px 12px",
            fontSize: "14px",
            color: isPlaceholder ? "#8C7E6E" : "#1A1612",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "inherit",
            boxShadow: open ? "0 0 0 2px rgba(217,119,6,0.15)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <span>{displayLabel}</span>
          <svg
            style={{
              width: 14,
              height: 14,
              flexShrink: 0,
              color: "#8C7E6E",
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.97)",
              border: "1px solid #E8E4DE",
              borderRadius: "12px",
              boxShadow:
                "0 8px 24px rgba(26,22,18,0.12), 0 2px 6px rgba(26,22,18,0.06)",
              zIndex: 9999,
              overflow: "hidden",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {options.map((o) => (
              <div
                key={o}
                onClick={() => select(o === "--" ? "" : o)}
                style={{
                  padding: "10px 14px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color:
                    current === o
                      ? "#D97706"
                      : o === "--"
                        ? "#8C7E6E"
                        : "#1A1612",
                  fontWeight: current === o ? "500" : "400",
                  background:
                    current === o ? "rgba(217,119,6,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(217,119,6,0.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    current === o ? "rgba(217,119,6,0.05)" : "transparent")
                }
              >
                {o}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Field générique (input / textarea) ─── */
function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  readonly,
  min,
  max,
  step,
  rows,
}) {
  if (type === "textarea") {
    return (
      <div class="flex flex-col gap-1.5">
        <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
          {label}
        </label>
        <textarea
          id={id}
          class={`glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none ${rows > 2 ? "min-h-[60px]" : "min-h-[50px]"}`}
          value={value || ""}
          onInput={onChange}
          rows={rows || 2}
          placeholder={placeholder}
        />
      </div>
    );
  }

  const cls = readonly
    ? "glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none bg-black/3"
    : "glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition";

  return (
    <div class="flex flex-col gap-1.5">
      <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type={type || "text"}
        class={cls}
        value={value || ""}
        onInput={onChange}
        placeholder={placeholder}
        readonly={readonly ? true : undefined}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

/* ─── Modal principal ─── */
export default function PreVisitModal({ onClose, onSendToChat }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const taille = parseFloat(formData.pv_taille);
    const poids = parseFloat(formData.pv_poids);
    if (taille > 0 && poids > 0) {
      const imc = (poids / (taille / 100) ** 2).toFixed(1);
      if (formData.pv_imc !== imc) {
        setFormData((prev) => ({ ...prev, pv_imc: imc, pv_imc2: imc }));
      }
    }
  }, [formData.pv_taille, formData.pv_poids]);

  const handleChange = useCallback((id, e) => {
    const val = e && e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [id]: val }));
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleExport = useCallback(() => {
    const summary = buildSummary(formData);
    if (onSendToChat) onSendToChat(summary);
  }, [formData, onSendToChat]);

  const score = calcScore(formData);
  const D = formData;

  return (
    <div class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="glass-strong rounded-3xl w-full max-w-3xl max-h-[90dvh] flex flex-col fade-up">
        {/* Header */}
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-black/5 flex items-center justify-between shrink-0">
          <h2 class="text-base sm:text-lg font-semibold text-[#1A1612]">
            Visite Pre-Anesthesique
          </h2>
          <button
            class="text-[#8C7E6E] hover:text-[#1A1612] transition"
            onClick={onClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div class="px-6 pt-4 shrink-0">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-black/5 mb-2">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                class={
                  i === activeTab
                    ? "px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 bg-[#D97706] text-white"
                    : "px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 bg-[#F5F0EB] text-[#8C7E6E]"
                }
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* Tab 0 - Identite */}
          {activeTab === 0 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Nom"
                id="pv_nom"
                type="text"
                value={D.pv_nom}
                onChange={(e) => handleChange("pv_nom", e)}
              />
              <Field
                label="Prenom"
                id="pv_prenom"
                type="text"
                value={D.pv_prenom}
                onChange={(e) => handleChange("pv_prenom", e)}
              />
              <Field
                label="Date de naissance"
                id="pv_dob"
                type="date"
                value={D.pv_dob}
                onChange={(e) => handleChange("pv_dob", e)}
              />
              <SelectField
                label="Sexe"
                id="pv_sexe"
                value={D.pv_sexe}
                onChange={(v) => handleChange("pv_sexe", v)}
                options={["--", "M", "F"]}
              />
              <Field
                label="Taille (cm)"
                id="pv_taille"
                type="number"
                value={D.pv_taille}
                onChange={(e) => handleChange("pv_taille", e)}
                placeholder="170"
              />
              <Field
                label="Poids (kg)"
                id="pv_poids"
                type="number"
                value={D.pv_poids}
                onChange={(e) => handleChange("pv_poids", e)}
                placeholder="72"
              />
              <Field
                label="IMC"
                id="pv_imc"
                type="text"
                value={D.pv_imc}
                readonly
              />
              <SelectField
                label="ASA"
                id="pv_asa"
                value={D.pv_asa}
                onChange={(v) => handleChange("pv_asa", v)}
                options={[
                  "--",
                  "ASA I",
                  "ASA II",
                  "ASA III",
                  "ASA IV",
                  "ASA V",
                ]}
              />
              <div class="col-span-2">
                <Field
                  label="Intervention"
                  id="pv_intervention"
                  type="text"
                  value={D.pv_intervention}
                  onChange={(e) => handleChange("pv_intervention", e)}
                  placeholder="Cholecystectomie coelioscopique"
                />
              </div>
              <Field
                label="Date intervention"
                id="pv_date_intervention"
                type="date"
                value={D.pv_date_intervention}
                onChange={(e) => handleChange("pv_date_intervention", e)}
              />
              <Field
                label="Chirurgien"
                id="pv_chirurgien"
                type="text"
                value={D.pv_chirurgien}
                onChange={(e) => handleChange("pv_chirurgien", e)}
                placeholder="Dr. Martin"
              />
            </div>
          )}

          {/* Tab 1 - Antecedents */}
          {activeTab === 1 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="col-span-2">
                <Field
                  label="ATCD Medicaux"
                  id="pv_atcd_med"
                  type="textarea"
                  value={D.pv_atcd_med}
                  onChange={(e) => handleChange("pv_atcd_med", e)}
                  rows={3}
                  placeholder="HTA, diabete type 2..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="ATCD Chirurgicaux"
                  id="pv_atcd_chir"
                  type="textarea"
                  value={D.pv_atcd_chir}
                  onChange={(e) => handleChange("pv_atcd_chir", e)}
                  rows={3}
                  placeholder="Appendicectomie 2010..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Anesthesies precedentes"
                  id="pv_anesth_prec"
                  type="textarea"
                  value={D.pv_anesth_prec}
                  onChange={(e) => handleChange("pv_anesth_prec", e)}
                  rows={2}
                  placeholder="GA 2010, sans incident..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Allergies"
                  id="pv_allergies"
                  type="textarea"
                  value={D.pv_allergies}
                  onChange={(e) => handleChange("pv_allergies", e)}
                  rows={2}
                  placeholder="Penicilline (rash)..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Traitements en cours"
                  id="pv_traitements"
                  type="textarea"
                  value={D.pv_traitements}
                  onChange={(e) => handleChange("pv_traitements", e)}
                  rows={3}
                  placeholder="Amlodipine 5mg/j..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="ATCD Familiaux"
                  id="pv_atcd_fam"
                  type="textarea"
                  value={D.pv_atcd_fam}
                  onChange={(e) => handleChange("pv_atcd_fam", e)}
                  rows={2}
                  placeholder="Hyperthermie maligne..."
                />
              </div>
              <SelectField
                label="Tabac"
                id="pv_tabac"
                value={D.pv_tabac}
                onChange={(v) => handleChange("pv_tabac", v)}
                options={["--", "Non fumeur", "Ex-fumeur", "Fumeur actif"]}
              />
              <Field
                label="PA (paquets/an)"
                id="pv_pa"
                type="number"
                value={D.pv_pa}
                onChange={(e) => handleChange("pv_pa", e)}
                placeholder="0"
              />
              <SelectField
                label="Alcool"
                id="pv_alcool"
                value={D.pv_alcool}
                onChange={(v) => handleChange("pv_alcool", v)}
                options={["--", "Non", "Occasionnel", "Regulier"]}
              />
              <SelectField
                label="Drogues"
                id="pv_drogues"
                value={D.pv_drogues}
                onChange={(v) => handleChange("pv_drogues", v)}
                options={["--", "Non", "Occasionnel", "Regulier"]}
              />
            </div>
          )}

          {/* Tab 2 - Voies Aeriennes */}
          {activeTab === 2 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField
                label="Mallampati"
                id="pv_mallampati"
                value={D.pv_mallampati}
                onChange={(v) => handleChange("pv_mallampati", v)}
                options={["--", "I", "II", "III", "IV"]}
              />
              <Field
                label="TMT (cm)"
                id="pv_tmt"
                type="number"
                value={D.pv_tmt}
                onChange={(e) => handleChange("pv_tmt", e)}
                step="0.5"
                placeholder="6.5"
              />
              <Field
                label="Ouverture buccale (doigts)"
                id="pv_ouverture"
                type="number"
                value={D.pv_ouverture}
                onChange={(e) => handleChange("pv_ouverture", e)}
                placeholder="4"
              />
              <SelectField
                label="Protrusion mandibulaire"
                id="pv_protrusion"
                value={D.pv_protrusion}
                onChange={(v) => handleChange("pv_protrusion", v)}
                options={["--", "Normale", "Limitee", "Insuffisante"]}
              />
              <SelectField
                label="Mobilite cervicale"
                id="pv_cervicale"
                value={D.pv_cervicale}
                onChange={(v) => handleChange("pv_cervicale", v)}
                options={["--", "Normale", "Limitee", "Insuffisante"]}
              />
              <SelectField
                label="Dents"
                id="pv_dents"
                value={D.pv_dents}
                onChange={(v) => handleChange("pv_dents", v)}
                options={[
                  "--",
                  "Intactes",
                  "Protheses",
                  "Dents mobiles",
                  "Couronnes",
                  "Appareil dentaire",
                ]}
              />
              <Field
                label="IMC"
                id="pv_imc2"
                type="text"
                value={D.pv_imc2 || D.pv_imc}
                readonly
              />
              <Field
                label="Collerette (cm)"
                id="pv_collerette"
                type="number"
                value={D.pv_collerette}
                onChange={(e) => handleChange("pv_collerette", e)}
                placeholder="42"
              />
              <div class="col-span-2 flex flex-col gap-1.5">
                <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
                  Score difficulte
                </label>
                <div
                  class={`glass-input rounded-xl px-3 py-2.5 text-sm font-medium ${score.color}`}
                >
                  {score.label}
                </div>
              </div>
              <div class="col-span-2">
                <Field
                  label="Remarques"
                  id="pv_va_remarques"
                  type="textarea"
                  value={D.pv_va_remarques}
                  onChange={(e) => handleChange("pv_va_remarques", e)}
                  rows={2}
                  placeholder="Macroglossie, epaules courbes..."
                />
              </div>
            </div>
          )}

          {/* Tab 3 - Cardio-Respiratoire */}
          {activeTab === 3 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="TA Systolique (mmHg)"
                id="pv_tas"
                type="number"
                value={D.pv_tas}
                onChange={(e) => handleChange("pv_tas", e)}
                placeholder="130"
              />
              <Field
                label="TA Diastolique (mmHg)"
                id="pv_tad"
                type="number"
                value={D.pv_tad}
                onChange={(e) => handleChange("pv_tad", e)}
                placeholder="80"
              />
              <Field
                label="FC (bpm)"
                id="pv_fc"
                type="number"
                value={D.pv_fc}
                onChange={(e) => handleChange("pv_fc", e)}
                placeholder="72"
              />
              <Field
                label="SpO2 (%)"
                id="pv_spo2"
                type="number"
                value={D.pv_spo2}
                onChange={(e) => handleChange("pv_spo2", e)}
                placeholder="98"
              />
              <SelectField
                label="Auscultation cardiaque"
                id="pv_auscultation_card"
                value={D.pv_auscultation_card}
                onChange={(v) => handleChange("pv_auscultation_card", v)}
                options={["--", "Normale", "Souffle", "Galop", "Autre"]}
              />
              <SelectField
                label="Auscultation pulmonaire"
                id="pv_auscultation_pulm"
                value={D.pv_auscultation_pulm}
                onChange={(v) => handleChange("pv_auscultation_pulm", v)}
                options={[
                  "--",
                  "Normale",
                  "Rales",
                  "Sibilants",
                  "Diminuee",
                  "Autre",
                ]}
              />
              <SelectField
                label="Capacite d'effort"
                id="pv_effort"
                value={D.pv_effort}
                onChange={(v) => handleChange("pv_effort", v)}
                options={["--", "Bonne", "Limitee", "Mauvaise", "Non evaluee"]}
              />
              <SelectField
                label="NYHA"
                id="pv_nyha"
                value={D.pv_nyha}
                onChange={(v) => handleChange("pv_nyha", v)}
                options={["--", "I", "II", "III", "IV"]}
              />
              <div class="col-span-2">
                <Field
                  label="ECG"
                  id="pv_ecg"
                  type="textarea"
                  value={D.pv_ecg}
                  onChange={(e) => handleChange("pv_ecg", e)}
                  rows={2}
                  placeholder="Rythme sinusal..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Echo cardiaque"
                  id="pv_echo"
                  type="textarea"
                  value={D.pv_echo}
                  onChange={(e) => handleChange("pv_echo", e)}
                  rows={2}
                  placeholder="FE 65%..."
                />
              </div>
              <div class="col-span-2">
                <SelectField
                  label="PAMT"
                  id="pv_pamt"
                  value={D.pv_pamt}
                  onChange={(v) => handleChange("pv_pamt", v)}
                  options={[
                    "--",
                    "I - Risque faible",
                    "II - Risque intermediaire",
                    "III - Risque eleve",
                    "IV - Risque tres eleve",
                  ]}
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="RCR (0-6)"
                  id="pv_rcr"
                  type="number"
                  value={D.pv_rcr}
                  onChange={(e) => handleChange("pv_rcr", e)}
                  min="0"
                  max="6"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* Tab 4 - Biologie & Scores */}
          {activeTab === 4 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Hb (g/dL)"
                id="pv_hb"
                type="number"
                value={D.pv_hb}
                onChange={(e) => handleChange("pv_hb", e)}
                placeholder="13.5"
              />
              <Field
                label="Plaquettes (G/L)"
                id="pv_plaq"
                type="number"
                value={D.pv_plaq}
                onChange={(e) => handleChange("pv_plaq", e)}
                placeholder="250"
              />
              <Field
                label="TP (%)"
                id="pv_tp"
                type="number"
                value={D.pv_tp}
                onChange={(e) => handleChange("pv_tp", e)}
                placeholder="100"
              />
              <Field
                label="INR"
                id="pv_inr"
                type="number"
                value={D.pv_inr}
                onChange={(e) => handleChange("pv_inr", e)}
                step="0.1"
                placeholder="1.0"
              />
              <Field
                label="Creatinine (µmol/L)"
                id="pv_creat"
                type="number"
                value={D.pv_creat}
                onChange={(e) => handleChange("pv_creat", e)}
                placeholder="80"
              />
              <Field
                label="DFG (mL/min)"
                id="pv_dfg"
                type="number"
                value={D.pv_dfg}
                onChange={(e) => handleChange("pv_dfg", e)}
                placeholder="90"
              />
              <Field
                label="Glycemie (mmol/L)"
                id="pv_glycemie"
                type="number"
                value={D.pv_glycemie}
                onChange={(e) => handleChange("pv_glycemie", e)}
                step="0.1"
                placeholder="5.5"
              />
              <Field
                label="HbA1c (%)"
                id="pv_hba1c"
                type="number"
                value={D.pv_hba1c}
                onChange={(e) => handleChange("pv_hba1c", e)}
                step="0.1"
                placeholder="5.5"
              />
              <Field
                label="ASAT (UI/L)"
                id="pv_asat"
                type="number"
                value={D.pv_asat}
                onChange={(e) => handleChange("pv_asat", e)}
                placeholder="30"
              />
              <Field
                label="ALAT (UI/L)"
                id="pv_alat"
                type="number"
                value={D.pv_alat}
                onChange={(e) => handleChange("pv_alat", e)}
                placeholder="25"
              />
              <Field
                label="Bicarbonates (mmol/L)"
                id="pv_bicarb"
                type="number"
                value={D.pv_bicarb}
                onChange={(e) => handleChange("pv_bicarb", e)}
                placeholder="24"
              />
              <Field
                label="K+ (mmol/L)"
                id="pv_k"
                type="number"
                value={D.pv_k}
                onChange={(e) => handleChange("pv_k", e)}
                step="0.1"
                placeholder="4.0"
              />
              <Field
                label="ARISCAT"
                id="pv_ariscat"
                type="number"
                value={D.pv_ariscat}
                onChange={(e) => handleChange("pv_ariscat", e)}
                placeholder="0"
              />
              <Field
                label="CHA2DS2-VASc (0-9)"
                id="pv_chads"
                type="number"
                value={D.pv_chads}
                onChange={(e) => handleChange("pv_chads", e)}
                min="0"
                max="9"
                placeholder="0"
              />
              <Field
                label="HAS-BLED (0-9)"
                id="pv_hasbled"
                type="number"
                value={D.pv_hasbled}
                onChange={(e) => handleChange("pv_hasbled", e)}
                min="0"
                max="9"
                placeholder="0"
              />
              <div class="col-span-2">
                <Field
                  label="Autres bilans"
                  id="pv_autres_bilans"
                  type="textarea"
                  value={D.pv_autres_bilans}
                  onChange={(e) => handleChange("pv_autres_bilans", e)}
                  rows={2}
                  placeholder="Bandelette urinaire, gasometrie..."
                />
              </div>
            </div>
          )}

          {/* Tab 5 - Plan & Consentement */}
          {activeTab === 5 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="col-span-2">
                <SelectField
                  label="Technique anesthesique"
                  id="pv_technique"
                  value={D.pv_technique}
                  onChange={(v) => handleChange("pv_technique", v)}
                  options={[
                    "--",
                    "AG",
                    "AG + ETT",
                    "AG + MASQUE LMA",
                    "TIVA",
                    "Rachianesthesie",
                    "Peridurale",
                    "Locoregionale + sedation",
                    "Locoregionale seule",
                    "Autre",
                  ]}
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Premedication"
                  id="pv_premedication"
                  type="textarea"
                  value={D.pv_premedication}
                  onChange={(e) => handleChange("pv_premedication", e)}
                  rows={2}
                  placeholder="Midazolam 0.5mg/kg PO..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Antibio prophylaxie"
                  id="pv_antibio"
                  type="textarea"
                  value={D.pv_antibio}
                  onChange={(e) => handleChange("pv_antibio", e)}
                  rows={2}
                  placeholder="Cefazoline 2g IV..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Anticoagulation"
                  id="pv_anticoag"
                  type="textarea"
                  value={D.pv_anticoag}
                  onChange={(e) => handleChange("pv_anticoag", e)}
                  rows={2}
                  placeholder="Aspirine J-7..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Strategie voies aeriennes"
                  id="pv_strategie_va"
                  type="textarea"
                  value={D.pv_strategie_va}
                  onChange={(e) => handleChange("pv_strategie_va", e)}
                  rows={2}
                  placeholder="Vide buccal, VL disponible..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Analgesie per-operatoire"
                  id="pv_analgesie"
                  type="textarea"
                  value={D.pv_analgesie}
                  onChange={(e) => handleChange("pv_analgesie", e)}
                  rows={2}
                  placeholder="PCA morphine, Paracetamol..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="NVPO"
                  id="pv_nvpo"
                  type="textarea"
                  value={D.pv_nvpo}
                  onChange={(e) => handleChange("pv_nvpo", e)}
                  rows={2}
                  placeholder="Ondansetron 4mg + Dexamethasone 8mg..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Plan post-operatoire"
                  id="pv_plan_postop"
                  type="textarea"
                  value={D.pv_plan_postop}
                  onChange={(e) => handleChange("pv_plan_postop", e)}
                  rows={3}
                  placeholder="SSPI, Surveillance..."
                />
              </div>
              <div class="col-span-2">
                <Field
                  label="Risques et discussion"
                  id="pv_risques"
                  type="textarea"
                  value={D.pv_risques}
                  onChange={(e) => handleChange("pv_risques", e)}
                  rows={3}
                  placeholder="Risque aspiration..."
                />
              </div>
              <SelectField
                label="Consentement"
                id="pv_consentement"
                value={D.pv_consentement}
                onChange={(v) => handleChange("pv_consentement", v)}
                options={["--", "Obtenu", "Non obtenu", "A valider"]}
              />
              <Field
                label="NPO depuis"
                id="pv_npo"
                type="text"
                value={D.pv_npo}
                onChange={(e) => handleChange("pv_npo", e)}
                placeholder="ex: 22h"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-black/5 flex flex-wrap gap-2 sm:gap-3 justify-between shrink-0">
          <button
            class="btn-outline px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-[#D97706] flex items-center gap-2"
            onClick={handleExport}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Resume pour l'IA
          </button>
          <div class="flex gap-3">
            <button
              class="btn-outline px-5 py-2.5 rounded-xl text-sm text-[#8C7E6E]"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              class="glass-btn px-5 py-2.5 rounded-xl text-sm font-medium"
              onClick={handleSave}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
