import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getFirebaseAdminConfig } from './client-server';

let cachedAdminConfig: Awaited<ReturnType<typeof getFirebaseAdminConfig>> | null = null;
let cachedAdminApp: App | null = null;

/**
 * Firebase Admin 앱 초기화
 * 서버 액션에서 받은 설정 정보를 사용하여 초기화
 */
async function initializeAdminApp(): Promise<App> {
  // 이미 초기화된 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 캐시된 앱이 있으면 재사용
  if (cachedAdminApp) {
    return cachedAdminApp;
  }

  // 서버 액션에서 설정 정보 가져오기 (plain object만 반환되므로 안전)
  if (!cachedAdminConfig) {
    cachedAdminConfig = await getFirebaseAdminConfig();
  }

  if (!cachedAdminConfig.serviceAccountKey) {
    throw new Error('Firebase Admin 설정 정보가 없습니다.');
  }

  cachedAdminApp = initializeApp({
    credential: cert(cachedAdminConfig.serviceAccountKey),
    projectId: cachedAdminConfig.projectId,
  });

  return cachedAdminApp;
}

/**
 * Firebase Admin Auth 인스턴스 가져오기
 */
export async function getAdminAuth(): Promise<Auth> {
  const app = await initializeAdminApp();
  return getAuth(app);
}

/**
 * Firebase Admin Firestore 인스턴스 가져오기
 * 서버 사이드에서 사용하며, 보안 규칙을 우회합니다.
 */
export async function getAdminFirestore(): Promise<Firestore> {
  const app = await initializeAdminApp();
  return getFirestore(app);
}

