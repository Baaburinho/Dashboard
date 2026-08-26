import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  writeBatch,
  onSnapshot,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const STORAGE_KEY = 'paos_firebase_config_v1';

// Default / fallback Firebase configuration (supports environment variables or local fallback)
export const getDefaultFirebaseConfig = (): FirebaseConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForPAOSAcademicOS2026',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'paos-academic-os.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'paos-academic-os',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'paos-academic-os.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:abcd1234ef5678',
  };
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initFirebase = (customConfig?: FirebaseConfig): { app: FirebaseApp; db: Firestore; auth: Auth } | null => {
  try {
    const config = customConfig || getDefaultFirebaseConfig();
    
    // Validate config structure
    if (!config.apiKey || !config.projectId) {
      console.warn('[PAOS Firebase] Incomplete Firebase configuration.');
      return null;
    }

    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    db = getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth };
  } catch (error) {
    console.warn('[PAOS Firebase] Initialization failed:', error);
    return null;
  }
};

export const saveCustomFirebaseConfig = (config: FirebaseConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Re-initialize
  try {
    app = initializeApp(config, 'paos_custom_' + Date.now());
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.warn('[PAOS Firebase] Re-initialization error:', e);
  }
};

export type FirebaseSyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'connected';

export interface CloudPayload {
  student: any;
  semesters: any[];
  courses: any[];
  activities: any[];
  memories: any[];
  goals: any[];
  tasks: any[];
  documents: any[];
  feeRecords: any[];
  quotes: any[];
  auditLogs: any[];
  lastSyncedAt: string;
}

export const firebaseCloudService = {
  getDb(): Firestore | null {
    if (!db) {
      initFirebase();
    }
    return db;
  },

  getAuth(): Auth | null {
    if (!auth) {
      initFirebase();
    }
    return auth;
  },

  async authenticateSilently(): Promise<boolean> {
    try {
      const a = this.getAuth();
      if (!a) return false;
      if (!a.currentUser) {
        await signInAnonymously(a);
      }
      return true;
    } catch {
      return false;
    }
  },

  // Push complete academic state to Firebase Cloud (Firestore)
  async pushAllToCloud(payload: CloudPayload): Promise<{ success: boolean; error?: string; timestamp?: string }> {
    try {
      const firestore = this.getDb();
      if (!firestore) throw new Error('Firestore not initialized');

      await this.authenticateSilently();

      const studentId = payload.student?.studentId || 'CIS231475';
      const rootDocRef = doc(firestore, 'paos_academic_vault', studentId);

      // 1. Save main master record
      await setDoc(rootDocRef, {
        student: payload.student,
        lastSyncedAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        counts: {
          semesters: payload.semesters.length,
          courses: payload.courses.length,
          activities: payload.activities.length,
          memories: payload.memories.length,
          goals: payload.goals.length,
          tasks: payload.tasks.length,
          documents: payload.documents.length,
          feeRecords: payload.feeRecords.length,
        }
      }, { merge: true });

      // 2. Batch write entities for real-time relational collections
      const batch = writeBatch(firestore);

      // Save Semesters
      payload.semesters.forEach((sem) => {
        const semRef = doc(firestore, `paos_academic_vault/${studentId}/semesters`, sem.id);
        batch.set(semRef, sem, { merge: true });
      });

      // Save Courses
      payload.courses.forEach((c) => {
        const cRef = doc(firestore, `paos_academic_vault/${studentId}/courses`, c.id);
        batch.set(cRef, c, { merge: true });
      });

      // Save Activities
      payload.activities.forEach((act) => {
        const actRef = doc(firestore, `paos_academic_vault/${studentId}/activities`, act.id);
        batch.set(actRef, act, { merge: true });
      });

      // Save Memories
      payload.memories.forEach((mem) => {
        const memRef = doc(firestore, `paos_academic_vault/${studentId}/memories`, mem.id);
        batch.set(memRef, mem, { merge: true });
      });

      // Save Goals & Tasks
      payload.goals.forEach((g) => {
        const gRef = doc(firestore, `paos_academic_vault/${studentId}/goals`, g.id);
        batch.set(gRef, g, { merge: true });
      });
      payload.tasks.forEach((t) => {
        const tRef = doc(firestore, `paos_academic_vault/${studentId}/tasks`, t.id);
        batch.set(tRef, t, { merge: true });
      });

      // Save Fees
      payload.feeRecords.forEach((f) => {
        const fRef = doc(firestore, `paos_academic_vault/${studentId}/feeRecords`, f.id);
        batch.set(fRef, f, { merge: true });
      });

      await batch.commit();

      const syncedTime = new Date().toISOString();
      return { success: true, timestamp: syncedTime };
    } catch (err: any) {
      console.warn('[PAOS Firebase] Cloud push error:', err);
      return { success: false, error: err?.message || 'Firebase Cloud connection unavailable' };
    }
  },

  // Pull complete academic state from Firebase Cloud (Firestore)
  async pullFromCloud(studentId: string = 'CIS231475'): Promise<Partial<CloudPayload> | null> {
    try {
      const firestore = this.getDb();
      if (!firestore) return null;

      await this.authenticateSilently();

      const rootDocRef = doc(firestore, 'paos_academic_vault', studentId);
      const rootSnap = await getDoc(rootDocRef);

      if (!rootSnap.exists()) return null;

      const rootData = rootSnap.data();

      // Retrieve collections
      const [
        semestersSnap,
        coursesSnap,
        activitiesSnap,
        memoriesSnap,
        goalsSnap,
        tasksSnap,
        feesSnap
      ] = await Promise.all([
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/semesters`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/courses`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/activities`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/memories`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/goals`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/tasks`)),
        getDocs(collection(firestore, `paos_academic_vault/${studentId}/feeRecords`)),
      ]);

      return {
        student: rootData.student,
        lastSyncedAt: rootData.lastSyncedAt,
        semesters: semestersSnap.docs.map((d) => d.data()),
        courses: coursesSnap.docs.map((d) => d.data()),
        activities: activitiesSnap.docs.map((d) => d.data()),
        memories: memoriesSnap.docs.map((d) => d.data()),
        goals: goalsSnap.docs.map((d) => d.data()),
        tasks: tasksSnap.docs.map((d) => d.data()),
        feeRecords: feesSnap.docs.map((d) => d.data()),
      };
    } catch (err) {
      console.warn('[PAOS Firebase] Cloud pull error:', err);
      return null;
    }
  },

  // Real-time listener for cloud changes
  subscribeToCloudChanges(studentId: string = 'CIS231475', onUpdate: (data: any) => void): () => void {
    const firestore = this.getDb();
    if (!firestore) return () => {};

    try {
      const docRef = doc(firestore, 'paos_academic_vault', studentId);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data());
        }
      }, (err) => {
        console.warn('[PAOS Firebase] Snapshot error:', err);
      });
    } catch {
      return () => {};
    }
  },

  // Save single entity to Firestore (e.g. newly created activity, memory, course)
  async saveSingleEntity(collectionName: string, id: string, data: any, studentId: string = 'CIS231475'): Promise<boolean> {
    try {
      const firestore = this.getDb();
      if (!firestore) return false;
      await this.authenticateSilently();
      const ref = doc(firestore, `paos_academic_vault/${studentId}/${collectionName}`, id);
      await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch {
      return false;
    }
  }
};
