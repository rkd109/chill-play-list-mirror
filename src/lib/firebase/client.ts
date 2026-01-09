import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './client-server';

let cachedConfig: Awaited<ReturnType<typeof getFirebaseConfig>> | null = null;
let cachedApp: FirebaseApp | null = null;

/**
 * 클라이언트 사이드 Firebase 앱 초기화
 * 서버 액션에서 받은 설정 정보를 사용하여 클라이언트에서 초기화
 */
async function initializeClientFirebaseApp(): Promise<FirebaseApp> {
  // 이미 초기화된 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 캐시된 앱이 있으면 재사용
  if (cachedApp) {
    return cachedApp;
  }

  // 서버 액션에서 설정 정보 가져오기 (plain object만 반환되므로 안전)
  if (!cachedConfig) {
    cachedConfig = await getFirebaseConfig();
  }

  cachedApp = initializeApp(cachedConfig);
  return cachedApp;
}

/**
 * 클라이언트 사이드 Firebase Auth 인스턴스 가져오기
 */
export async function getClientAuthInstance(): Promise<Auth> {
  const app = await initializeClientFirebaseApp();
  return getAuth(app);
}

/**
 * 클라이언트 사이드 Firestore 인스턴스 가져오기
 */
export async function getClientFirestoreInstance(): Promise<Firestore> {
  const app = await initializeClientFirebaseApp();
  return getFirestore(app);
}


