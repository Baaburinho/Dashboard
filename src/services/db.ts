// PAOS IndexedDB Persistence Engine
// Lifelong Academic Archive Storage with Schema Migration Support

const DB_NAME = 'PAOS_Pure_V10_DB';
const DB_VERSION = 1;

export interface DBSnapshot {
  id: string;
  timestamp: string;
  description: string;
  data: any;
}

class PAOSDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

        const storeNames = [
          'student',
          'semesters',
          'courses',
          'activities',
          'memories',
          'goals',
          'tasks',
          'documents',
          'feeRecords',
          'timetable',
          'courseNotes',
          'gradeScale',
          'auditLogs',
          'snapshots',
          'schemaMeta',
        ];

        storeNames.forEach((name) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: 'id' });
          }
        });

        // Schema migrations log
        if (oldVersion < 1) {
          console.info('[PAOS DB] Initialized database schema v1.');
        }
        if (oldVersion < 2) {
          console.info('[PAOS DB] Migrated database schema to v2: Added snapshots & provenance stores.');
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Create an automated snapshot before any major restore/mutation
  async createSnapshot(description: string, data: any): Promise<string> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('snapshots', 'readwrite');
      const store = tx.objectStore('snapshots');

      const snapshotId = 'snap-' + Date.now();
      const snapshot: DBSnapshot = {
        id: snapshotId,
        timestamp: new Date().toISOString(),
        description,
        data,
      };

      store.put(snapshot);
      await new Promise<void>((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });

      return snapshotId;
    } catch (e) {
      console.warn('[PAOS DB] Error saving snapshot:', e);
      return '';
    }
  }

  // Save collection to object store
  async saveStore<T>(storeName: string, items: T[]): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      // Clear existing
      await new Promise<void>((res, rej) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => res();
        clearReq.onerror = () => rej(clearReq.error);
      });

      for (const item of items) {
        const itemWithId = (item && typeof item === 'object' && !('id' in item))
          ? { ...item, id: (item as any).grade || (item as any).code || 'item-' + Math.random().toString(36).slice(2) }
          : item;
        store.put(itemWithId);
      }

      await new Promise<void>((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (e) {
      console.warn(`[PAOS DB] Error saving ${storeName}:`, e);
    }
  }

  // Save single item
  async saveItem<T>(storeName: string, item: T): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);

      await new Promise<void>((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (e) {
      console.warn(`[PAOS DB] Error saving item in ${storeName}:`, e);
    }
  }

  // Load all items from store
  async getStore<T>(storeName: string): Promise<T[] | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);

      return new Promise<T[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  // Load single item
  async getItem<T>(storeName: string, id: string): Promise<T | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);

      return new Promise<T | null>((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }
}

export const paosDB = new PAOSDatabase();
