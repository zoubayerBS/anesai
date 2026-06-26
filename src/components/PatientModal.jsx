import { useState, useEffect, useRef } from "preact/hooks";

const FIELDS = [
  "age",
  "weight",
  "height",
  "sex",
  "asa",
  "surgery",
  "history",
  "meds",
];

export function PatientModal({ patient, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    const data = {};
    FIELDS.forEach((k) => (data[k] = patient[k] || ""));
    return data;
  });

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div
      class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="glass-strong rounded-3xl p-6 w-full max-w-md fade-up">
        <h3 class="font-serif text-[22px] text-[#1A1612] mb-5">
          Contexte Patient
        </h3>
        <div class="grid grid-cols-2 gap-3 mb-5">
          <Field
            label="Age"
            value={form.age}
            onInput={(v) => update("age", v)}
            placeholder="55"
            type="number"
          />
          <Field
            label="Poids (kg)"
            value={form.weight}
            onInput={(v) => update("weight", v)}
            placeholder="72"
            type="number"
          />
          <Field
            label="Taille (cm)"
            value={form.height}
            onInput={(v) => update("height", v)}
            placeholder="170"
            type="number"
          />
          <SelectField
            label="Sexe"
            value={form.sex}
            onChange={(v) => update("sex", v)}
            options={[
              { v: "", t: "--" },
              { v: "M", t: "Masculin" },
              { v: "F", t: "Feminin" },
            ]}
          />
          <SelectField
            label="ASA"
            value={form.asa}
            onChange={(v) => update("asa", v)}
            options={[
              { v: "", t: "--" },
              { v: "ASA I", t: "ASA I" },
              { v: "ASA II", t: "ASA II" },
              { v: "ASA III", t: "ASA III" },
              { v: "ASA IV", t: "ASA IV" },
              { v: "ASA V", t: "ASA V" },
            ]}
          />
          <Field
            label="Intervention"
            value={form.surgery}
            onInput={(v) => update("surgery", v)}
            placeholder="cholecystectomie"
          />
          <div class="flex flex-col gap-1.5 col-span-2">
            <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
              Antecedents / Allergies
            </label>
            <textarea
              value={form.history}
              onInput={(e) => update("history", e.target.value)}
              placeholder="HTA, diabete, allergie..."
              class="glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none min-h-[60px]"
            />
          </div>
          <div class="flex flex-col gap-1.5 col-span-2">
            <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
              Traitements
            </label>
            <textarea
              value={form.meds}
              onInput={(e) => update("meds", e.target.value)}
              placeholder="Amlodipine 5mg..."
              class="glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none min-h-[50px]"
            />
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <button
            onClick={onClose}
            class="btn-outline px-5 py-2.5 rounded-xl text-sm text-[#8C7E6E]"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            class="glass-btn px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onInput, placeholder, type = "text" }) {
  return (
    <div class="flex flex-col gap-1.5">
      <label class="text-[12px] font-semibold text-[#8C7E6E] uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onInput={(e) => onInput(e.target.value)}
        placeholder={placeholder}
        class="glass-input rounded-xl px-3 py-2.5 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.v === value);
  const isPlaceholder = !value;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
          <span>{selected?.t || "--"}</span>
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
                key={o.v}
                onClick={() => {
                  onChange(o.v);
                  setOpen(false);
                }}
                style={{
                  padding: "10px 14px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color:
                    value === o.v
                      ? "#D97706"
                      : o.v === ""
                        ? "#8C7E6E"
                        : "#1A1612",
                  fontWeight: value === o.v ? "500" : "400",
                  background:
                    value === o.v ? "rgba(217,119,6,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(217,119,6,0.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    value === o.v ? "rgba(217,119,6,0.05)" : "transparent")
                }
              >
                {o.t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
