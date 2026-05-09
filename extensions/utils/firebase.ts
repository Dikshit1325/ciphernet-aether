import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration (same as React app)
export const firebaseConfig = {
  apiKey: 'AIzaSyDzbRpcAIMIVqo3HGq4sMMKqek211WFtbs',
  authDomain: 'cipherai-62911.firebaseapp.com',
  projectId: 'cipherai-62911',
  storageBucket: 'cipherai-62911.firebasestorage.app',
  messagingSenderId: '359120184830',
  appId: '1:359120184830:web:12ec4488477cee6af10caf',
};

let _db: ReturnType<typeof getFirestore> | null = null;

/**
 * Initialize Firebase (modular) for the extension. This uses bundled SDK
 * so it does not inject external scripts (extension CSP blocks remote scripts).
 */
export async function initializeExtensionFirebase() {
  try {
    // If an app is already initialized, use it
    if (getApps().length > 0) {
      const app = getApp();
      _db = getFirestore(app);
      return;
    }

    // Prefer a config injected at runtime (dist-ext/firebase-defaults.js or window.__FIREBASE_DEFAULTS__)
    const injected = (window as any).__FIREBASE_DEFAULTS__?.config;
    const cfg = injected || firebaseConfig;

    const app = initializeApp(cfg);
    _db = getFirestore(app);

    console.log('Firebase initialized for extension (modular SDK)');
  } catch (err) {
    console.error('Failed to initialize Firebase in extension:', err);
    throw err;
  }
}

/**
 * Save browser scan result to Firestore using modular SDK (bundled)
 */
export async function saveBrowserScanToFirestore(scanData: any) {
  try {
    if (!_db) {
      // try to init synchronously
      await initializeExtensionFirebase();
      if (!_db) throw new Error('Firestore not initialized');
    }

    const col = collection(_db!, 'browser_scans');
    const payload = {
      ...scanData,
      scannedAt: serverTimestamp(),
    };

    const docRef = await addDoc(col, payload);
    console.log('Scan saved to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('Error saving to Firestore (modular):', err);
    throw err;
  }
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const auth = getAuth();
    return auth.currentUser?.uid || null;
  } catch {
    return null;
  }
}
