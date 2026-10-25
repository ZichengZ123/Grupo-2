import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  timeSeconds: number;
  createdAt: string;
  device?: string;
}

const LOCAL_STORAGE_KEY = 'mps_firebase_leaderboard_live_v2';

// Helper to detect device category
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'Escritorio';
  const width = window.innerWidth;
  if (width < 640) return 'Móvil';
  if (width < 1024) return 'Tablet';
  return 'Escritorio';
}

/**
 * Subscribes in real-time to the Firebase Firestore leaderboard collection.
 * Sorts by score descending, then by time ascending.
 * If offline or empty initially, seamlessly updates UI.
 */
export function subscribeToLeaderboard(
  onUpdate: (entries: LeaderboardEntry[], loading: boolean) => void
): () => void {
  const collectionRef = collection(db, 'leaderboard');

  try {
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const items: LeaderboardEntry[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: typeof data.name === 'string' ? data.name : 'Anónimo',
            score: typeof data.score === 'number' ? data.score : 0,
            totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : 6,
            timeSeconds: typeof data.timeSeconds === 'number' ? data.timeSeconds : 0,
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
            device: typeof data.device === 'string' ? data.device : undefined,
          });
        });

        // Sort: highest score first, then lowest time
        items.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeSeconds - b.timeSeconds;
        });

        // Backup to localStorage for instant offline access
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        } catch {
          // ignore
        }

        onUpdate(items, false);
      },
      (error) => {
        console.warn('Firestore snapshot error, falling back to local cache:', error);
        let fallback: LeaderboardEntry[] = [];
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) fallback = JSON.parse(stored);
        } catch {
          // ignore
        }
        onUpdate(fallback, false);
        // Also log per skill requirement
        try {
          handleFirestoreError(error, OperationType.GET, 'leaderboard');
        } catch {
          // handled
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error initiating Firestore snapshot:', error);
    onUpdate([], false);
    return () => {};
  }
}

/**
 * Saves a new quiz result to Firebase Firestore
 */
export async function saveQuizResultToFirestore(data: {
  name: string;
  score: number;
  totalQuestions: number;
  timeSeconds: number;
}): Promise<string> {
  const path = 'leaderboard';
  // Generate safe ID matching ^[a-zA-Z0-9_\-]+$
  const safeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  const payload: Omit<LeaderboardEntry, 'id'> = {
    name: data.name.trim().toUpperCase().substring(0, 60),
    score: Math.max(0, Math.min(6, Math.round(data.score))),
    totalQuestions: Math.max(1, Math.min(10, Math.round(data.totalQuestions))),
    timeSeconds: Math.max(1, Math.min(3600, Math.round(data.timeSeconds))),
    createdAt: new Date().toISOString(),
    device: getDeviceType(),
  };

  try {
    await setDoc(doc(db, path, safeId), payload);

    // Also update localStorage so client immediately has it
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
      list.push({ id: safeId, ...payload });
      list.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timeSeconds - b.timeSeconds));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    return safeId;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
