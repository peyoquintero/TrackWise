import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore database connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'summary_metrics', 'All');
    await getDoc(testDocRef);
    console.log('Firebase Firestore database connection verified.');
    return true;
  } catch (error) {
    console.warn('Firestore connection check warning:', error);
    return false;
  }
}
