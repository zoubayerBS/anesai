import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Chat } from "./components/Chat";
import { InputBar } from "./components/InputBar";
import { PatientModal } from "./components/PatientModal";
import PreVisitModal from "./components/PreVisitModal";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { store } from "./lib/store";
import { CONFIG } from "./lib/config";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [patient, setPatient] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPreVisitModal, setShowPreVisitModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [key, pat, id, chatList] = await Promise.all([
        store.getApiKey(),
        store.getPatient(),
        store.getActiveChatId(),
        store.getChats(),
      ]);
      const finalKey = key || CONFIG.API_KEY;
      if (!key) store.setApiKey(finalKey);
      setApiKey(finalKey);
      setPatient(pat || {});
      setActiveChatId(id || "");
      setChats(chatList || []);
      setReady(true);
      if (!finalKey) setShowApiModal(true);
    })();
  }, []);

  const saveApiKey = (key) => {
    store.setApiKey(key);
    setApiKey(key);
    setShowApiModal(false);
  };

  const savePatient = (data) => {
    store.setPatient(data);
    setPatient(data);
    setShowPatientModal(false);
  };

  const newChat = () => {
    setActiveChatId("");
    setHistory([]);
    store.setActiveChatId("");
    setSidebarOpen(false);
  };

  const loadChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    setActiveChatId(id);
    store.setActiveChatId(id);
    setHistory(chat.history);
    setSidebarOpen(false);
  };

  const deleteChat = async (id) => {
    await store.deleteChat(id);
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) newChat();
  };

  const autoSave = async (hist) => {
    let currentId = activeChatId;
    if (!currentId) {
      currentId = "chat_" + Date.now();
      setActiveChatId(currentId);
      store.setActiveChatId(currentId);
    }
    let firstUser = "Nouvelle conversation";
    for (const m of hist) {
      if (m.role === "user") {
        firstUser = m.content;
        break;
      }
    }
    const title =
      firstUser.substring(0, 40) + (firstUser.length > 40 ? "..." : "");
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const chat = { id: currentId, title, date, history: hist };
    await store.setChats(chat);
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === currentId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = chat;
        return next;
      }
      return [chat, ...prev];
    });
  };

  const quickAsk = (text) => {
    const input = document.getElementById("userInput");
    if (input) {
      input.value = text;
      input.dispatchEvent(new Event("input"));
      input.focus();
      setTimeout(() => {
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        });
        input.dispatchEvent(enterEvent);
      }, 50);
    }
  };

  if (!ready) return null;

  return (
    <div
      class="bg-mesh text-[#1A1612] overflow-hidden"
      style="height:100%;height:100dvh;"
    >
      {/* dvh pour iOS Safari */}
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
      <div class="bg-orb orb-3" />

      <div class="relative z-10 flex h-full">
        {sidebarOpen && (
          <div
            class="sidebar-overlay fixed inset-0 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={newChat}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
          onOpenPatient={() => setShowPatientModal(true)}
          onOpenPreVisit={() => setShowPreVisitModal(true)}
        />

        <div class="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div class="text-amber-700/80 bg-amber-50/60 backdrop-blur-sm text-center text-[10px] sm:text-[11px] px-3 sm:px-4 py-1.5 sm:py-2 shrink-0 border-b border-amber-200/50 font-medium">
            <strong>Avertissement :</strong> Aide a la decision uniquement.
            Jugement clinique requis.
          </div>

          <div class="flex-1 overflow-y-auto">
            <Chat history={history} isLoading={isLoading} quickAsk={quickAsk} />
          </div>

          <div class="shrink-0">
            <InputBar
              history={history}
              setHistory={setHistory}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              apiKey={apiKey}
              patient={patient}
              onShowApiModal={() => setShowApiModal(true)}
              onAutoSave={autoSave}
            />
          </div>
        </div>
      </div>

      {showPatientModal && (
        <PatientModal
          patient={patient}
          onSave={savePatient}
          onClose={() => setShowPatientModal(false)}
        />
      )}

      {showPreVisitModal && (
        <PreVisitModal
          onClose={() => setShowPreVisitModal(false)}
          onSendToChat={(text) => {
            setShowPreVisitModal(false);
            setTimeout(() => {
              const input = document.getElementById("userInput");
              if (input) {
                input.value = text;
                input.dispatchEvent(new Event("input"));
              }
            }, 100);
          }}
        />
      )}

      {showApiModal && <ApiKeyModal onSave={saveApiKey} />}
    </div>
  );
}
