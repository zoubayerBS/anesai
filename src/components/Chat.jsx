import { h } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';
import { renderMarkdown } from '../lib/markdown';

function Welcome({ quickAsk }) {
  const [paused, setPaused] = useState(false);
  const suggestions = [
    'Protocole induction TIVA adulte standard',
    'Gestion anaphylaxie peroperatoire',
    'Dosages drogues urgence 70kg',
    'Criteres sortie SSPI',
    'Bronchospasme peroperatoire',
    'Intubation difficile algorithme'
  ];
  return (
    <div id="welcome" class="flex flex-col items-center justify-center text-center py-8 max-w-lg mx-auto">
      <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-lg shadow-amber-500/20">A</div>
      <h2 class="font-serif text-[20px] sm:text-[26px] text-[#1A1612] mb-3">Bonjour, je suis AnesIA</h2>
      <p class="text-[15px] text-[#8C7E6E] leading-relaxed mb-8">Votre assistant IA specialise en anesthesie-reanimation.</p>
      <div class="w-full mt-2 overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div class={`marquee-track flex gap-2 pb-2 ${paused ? 'paused' : ''}`}>
          {[...suggestions, ...suggestions].map((s, i) => (
            <button key={i} onClick={() => quickAsk(s)} class="suggestion-chip rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1A1612] whitespace-nowrap shrink-0">{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div id="typing-row" class="flex gap-3 items-start fade-up">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0">A</div>
      <div class="msg-ai px-4 py-3 rounded-2xl flex gap-1.5 items-center">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  );
}

function Message({ role, html }) {
  const isAi = role === 'ai';
  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return (
    <div class={`flex gap-3 items-start fade-up ${isAi ? '' : 'flex-row-reverse'}`}>
      <div class={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${isAi ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md' : 'glass text-[#8C7E6E]'}`}>
        {isAi ? 'A' : 'U'}
      </div>
      <div class="flex flex-col gap-1 max-w-[80%]">
        <div class={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAi ? 'msg-ai text-[#1A1612]' : 'msg-user'}`} dangerouslySetInnerHTML={{ __html: html }} />
        <div class={`text-[10px] text-[#8C7E6E] px-1 ${isAi ? '' : 'text-right'}`}>{now}</div>
      </div>
    </div>
  );
}

export function Chat({ history, isLoading, quickAsk }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  return (
    <div ref={scrollRef} class="flex-1 overflow-y-auto px-4 py-6 space-y-4 lg:px-8">
      {history.length === 0 && !isLoading && <Welcome quickAsk={quickAsk} />}
      {history.map((m, i) => (
        <Message key={i} role={m.role === 'user' ? 'user' : 'ai'} html={m.role === 'user' ? m.content : renderMarkdown(m.content)} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
}
