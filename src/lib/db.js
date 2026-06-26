import Dexie from 'dexie';

const db = new Dexie('AnesIA');
db.version(1).stores({
  chats: 'id, title, date',
  settings: 'key',
});

export const chatDB = {
  async getAll() {
    return db.chats.orderBy('date').reverse().toArray();
  },

  async get(id) {
    return db.chats.get(id);
  },

  async put(chat) {
    return db.chats.put(chat);
  },

  async delete(id) {
    return db.chats.delete(id);
  },

  async clear() {
    return db.chats.clear();
  },
};

export const settingsDB = {
  async get(key) {
    const row = await db.settings.get(key);
    return row?.value ?? '';
  },

  async set(key, value) {
    return db.settings.put({ key, value });
  },
};
