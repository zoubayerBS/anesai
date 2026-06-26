import { useRef, useEffect } from "preact/hooks";
import { fetchWithRetry } from "../lib/api";
import { SYSTEM_PROMPT } from "../lib/config";
import { buildPatientCtx } from "../lib/helpers";

export function InputBar({
  history,
  setHistory,
  isLoading,
  setIsLoading,
  apiKey,
  patient,
  onShowApiModal,
  onAutoSave,
}) {
  const inputRef = useRef(null);
  const localHistoryRef = useRef(history);
  localHistoryRef.current = history;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, []);

  const sendMessage = async () => {
    if (isLoading) return;
    const input = inputRef.current;
    const text = input.value.trim();
    if (!text) return;
    if (!apiKey) {
      onShowApiModal();
      return;
    }
    input.value = "";
    input.style.height = "auto";
    setIsLoading(true);
    const userMsg = { role: "user", content: text + buildPatientCtx(patient) };
    const newHist = [...localHistoryRef.current, userMsg];
    setHistory(newHist);
    localHistoryRef.current = newHist;
    try {
      const result = await fetchWithRetry(
        [{ role: "system", content: SYSTEM_PROMPT }, ...newHist],
        apiKey,
      );
      const { res, data } = result;
      if (!res.ok || data.error) {
        let errMsg = data?.error?.message || "Erreur inconnue";
        if (errMsg.length > 200) errMsg = errMsg.substring(0, 200) + "...";
        setHistory([...localHistoryRef.current]);
      } else {
        const reply = data.choices?.[0]?.message?.content;
        if (!reply) {
          setHistory([...localHistoryRef.current]);
        } else {
          const assistantMsg = { role: "assistant", content: reply };
          const finalHist = [...localHistoryRef.current, assistantMsg];
          setHistory(finalHist);
          localHistoryRef.current = finalHist;
          onAutoSave(finalHist);
        }
      }
    } catch (e) {
      setHistory([...localHistoryRef.current]);
    }
    setIsLoading(false);
  };

  return (
    <div class="px-2 sm:px-3 pb-2 sm:pb-3 pt-1 shrink-0">
      <div class="max-w-3xl mx-auto">
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.75)",
            border: "1px solid #E8E4DE",
            backdropFilter: "blur(10px)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#FBBF24";
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(217,119,6,0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "#E8E4DE";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <textarea
            ref={inputRef}
            id="userInput"
            placeholder="Posez votre question clinique..."
            rows="1"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "15px",
              color: "#1A1612",
              lineHeight: "1.6",
              padding: "14px 16px 44px 16px",
              maxHeight: "192px",
              borderRadius: "16px",
              fontFamily: "inherit",
              boxShadow: "none",
              appearance: "none",
            }}
            onInput={(e) => {
              const el = e.target;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 192) + "px";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "#1A1612",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s",
              opacity: isLoading ? 0.2 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2d2520")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1612")}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="white"
              stroke-width="2.2"
              viewBox="0 0 24 24"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
