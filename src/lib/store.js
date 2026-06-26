import { CONFIG } from './config';
import { chatDB, settingsDB } from './db';

const K = CONFIG.STORAGE_KEYS;

export const store = {
  getApiKey: () => settingsDB.get(K.API_KEY),
  setApiKey: (key) => settingsDB.set(K.API_KEY, key),

  getPatient: () => settingsDB.get(K.PATIENT),
  setPatient: (p) => settingsDB.set(K.PATIENT, p),

  getPreVisit: () => settingsDB.get(K.PREVISIT),
  setPreVisit: (d) => settingsDB.set(K.PREVISIT, d),

  getActiveChatId: () => settingsDB.get(K.ACTIVE_CHAT),
  setActiveChatId: (id) => settingsDB.set(K.ACTIVE_CHAT, id),

  getChats: () => chatDB.getAll(),
  setChats: (chat) => chatDB.put(chat),
  deleteChat: (id) => chatDB.delete(id),
};
