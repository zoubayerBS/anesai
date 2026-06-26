import { h } from 'preact';

export function Header({ onToggleSidebar }) {
  return (
    <header class="glass-strong flex items-center gap-3 px-4 h-14 shrink-0 z-20 border-b border-black/5">
      <button onClick={onToggleSidebar} class="p-2 rounded-xl hover:bg-black/5 transition">
        <svg class="w-5 h-5 text-[#8C7E6E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="font-serif text-lg tracking-tight">
        <span class="text-[#1A1612]">Anes</span><span class="text-[#D97706]">IA</span>
      </div>
      <div class="ml-auto flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        En ligne
      </div>
    </header>
  );
}
