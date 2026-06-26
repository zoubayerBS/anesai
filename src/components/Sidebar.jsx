import { h } from 'preact';

export function Sidebar({ isOpen, onClose, chats, activeChatId, onNewChat, onLoadChat, onDeleteChat, onOpenPatient, onOpenPreVisit }) {
  return (
    <aside class={`sidebar ${isOpen ? '' : 'closed'} w-64 sm:w-72 shrink-0 flex flex-col h-full glass-strong border-r border-black/5 z-40`}>
      <div class="p-3 border-b border-black/5 flex items-center gap-2">
        <button onClick={onNewChat} class="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition text-left">
          <svg class="w-5 h-5 text-[#8C7E6E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          <span class="text-[14px] font-medium text-[#1A1612]">Nouvelle conversation</span>
        </button>
        <button onClick={onClose} class="p-2 rounded-xl hover:bg-white/60 transition lg:hidden">
          <svg class="w-5 h-5 text-[#8C7E6E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-2">
        {!chats.length ? (
          <div class="px-4 py-8 text-center text-[13px] text-[#8C7E6E]">Aucune conversation</div>
        ) : (
          chats.map(c => (
            <div key={c.id} class={`group chat-item mx-2 rounded-xl px-3 py-2.5 ${c.id === activeChatId ? 'active' : ''}`} onClick={() => onLoadChat(c.id)}>
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4 text-[#8C7E6E] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] text-[#1A1612] truncate">{c.title}</div>
                  <div class="text-[11px] text-[#8C7E6E]">{c.date}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id); }} class="p-1 rounded-lg hover:bg-black/5 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <svg class="w-3.5 h-3.5 text-[#8C7E6E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div class="p-3 border-t border-black/5">
        <button onClick={onOpenPatient} class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition text-left">
          <svg class="w-5 h-5 text-[#8C7E6E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span class="text-[13px] text-[#8C7E6E]">Patient</span>
        </button>
        <button onClick={onOpenPreVisit} class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition text-left mt-1">
          <svg class="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <span class="text-[13px] text-[#D97706] font-medium">Visite Pre-Anesthesique</span>
        </button>
      </div>
    </aside>
  );
}
