import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

/**
 * Firebase 설정 타입
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Firebase 앱 초기화
 */
function initializeFirebaseApp(): FirebaseApp {
  // 이미 초기화된 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 환경 변수에서 Firebase 설정 가져오기
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // 필수 설정 확인
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      'Firebase 설정이 완료되지 않았습니다. 환경 변수를 확인해주세요.'
    );
  }

  return initializeApp(config);
}

/**
 * Firestore 인스턴스 가져오기
 * Emulator 모드인 경우 자동으로 연결
 */
export function getFirestoreInstance(): Firestore {
  const app = initializeFirebaseApp();
  const db = getFirestore(app);

  // Emulator 모드 확인 (서버 사이드에서만)
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || 'localhost';
  const emulatorPort = parseInt(
    process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT || '8080',
    10
  );

  // Emulator 연결 (서버 사이드에서만, 한 번만)
  if (
    useEmulator &&
    typeof window === 'undefined' &&
    !(db as any)._delegate?._settings?.host?.includes('localhost')
  ) {
    try {
      connectFirestoreEmulator(db, emulatorHost, emulatorPort);
      console.log(`Firestore Emulator connected: ${emulatorHost}:${emulatorPort}`);
    } catch (error) {
      // 이미 연결된 경우 무시
      console.warn('Firestore Emulator connection warning:', error);
    }
  }

  return db;
}

/**
 * Firebase 앱 인스턴스 가져오기
 */
export function getFirebaseApp(): FirebaseApp {
  return initializeFirebaseApp();
}

