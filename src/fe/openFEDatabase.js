import { openDB } from '../vendor/idb/index.js';

export async function openFEDatabase(name = 'terminal-fe-debug') {
  return openDB(name, 1, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'id' });
      const records = db.createObjectStore('messages', { keyPath: ['sessionId', 'seq'] });

      records.createIndex('time', ['sessionId', 'at', 'seq']);
      records.createIndex('entityTime', ['sessionId', 'entity', 'at', 'seq']);
      db.createObjectStore('meta');
    },
  });
}
