import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, STORE_NAME } from './constants.js';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

export async function addCount(count) {
  const db = await getDb();
  return db.add(STORE_NAME, count);
}

export async function getAllCounts() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function deleteCount(id) {
  const db = await getDb();
  return db.delete(STORE_NAME, id);
}

export async function getCountsByDay(date) {
  const db = await getDb();
  return db.getAllFromIndex(STORE_NAME, 'date', date);
}

export async function getCountsByMonth(year, month) {
  const db = await getDb();
  const mm = String(month).padStart(2, '0');
  const startDate = `${year}-${mm}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`;
  const range = IDBKeyRange.bound(startDate, endDate);
  return db.getAllFromIndex(STORE_NAME, 'date', range);
}

export async function getCountsByYear(year) {
  const db = await getDb();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const range = IDBKeyRange.bound(startDate, endDate);
  return db.getAllFromIndex(STORE_NAME, 'date', range);
}

export async function replaceAllCounts(counts) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  counts.forEach((count) => tx.store.put(count));
  await tx.done;
}
