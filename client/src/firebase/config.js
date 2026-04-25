import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, doc, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'placeholder',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'humane-care-residential-homes',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'humane-care-residential-homes.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:placeholder',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.tenantId = import.meta.env.VITE_TENANT_ID || null;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '';
const APP_ID = import.meta.env.VITE_APP_ID || '';

export const appColl = (name) => collection(db, 'clients', CLIENT_ID, 'apps', APP_ID, name);
export const appDoc = (name, id) => doc(db, 'clients', CLIENT_ID, 'apps', APP_ID, name, id);

const clientId12 = CLIENT_ID.substring(0, 12);
const appId12 = APP_ID.substring(0, 12);
export const fnName = (name) => `${clientId12}_${appId12}_${name}`;

// Connect to local emulators when running tests
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

export default app;
