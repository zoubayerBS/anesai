import { CONFIG } from './config';

export async function fetchWithRetry(messages, apiKey, retries = 3) {
  for (let i = 0; i < retries; i++) {
    let res;
    try {
      res = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({ model: CONFIG.MODEL, max_tokens: CONFIG.MAX_TOKENS, messages })
      });
    } catch (e) {
      if (i < retries - 1) { await new Promise(r => setTimeout(r, Math.pow(2, i) * 2000)); continue; }
      return { res: { ok: false, status: 0 }, data: { error: { message: e.message } } };
    }
    if (res.status === 429 && i < retries - 1) {
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 2000));
      continue;
    }
    let data;
    try { data = await res.json(); } catch { data = { error: { message: 'Erreur de parsing JSON' } }; }
    return { res, data };
  }
  return { res: { ok: false, status: 429 }, data: { error: { message: 'Trop de requetes. Reessayez.' } } };
}
