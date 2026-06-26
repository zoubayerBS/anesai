import { h } from 'preact';
import { useState } from 'preact/hooks';

export function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith('gsk_')) { alert('Cle invalide (gsk_...)'); return; }
    onSave(trimmed);
  };

  return (
    <div class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="glass-strong rounded-3xl p-8 w-full max-w-sm text-center fade-up">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl text-white font-bold mx-auto mb-5 shadow-lg shadow-amber-500/20">A</div>
        <h3 class="font-serif text-[22px] text-[#1A1612] mb-2">API Groq</h3>
        <p class="text-[14px] text-[#8C7E6E] mb-6 leading-relaxed">Entrez votre cle API Groq pour commencer.</p>
        <input
          type="password"
          placeholder="gsk_..."
          autocomplete="off"
          value={key}
          onInput={e => setKey(e.target.value)}
          class="glass-input w-full rounded-xl px-4 py-3 text-sm text-[#1A1612] outline-none focus:ring-2 focus:ring-amber-500/20 transition mb-4"
        />
        <button onClick={handleSave} class="glass-btn w-full py-3 rounded-xl text-sm font-medium">Demarrer AnesIA</button>
      </div>
    </div>
  );
}
