'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getClientAuthInstance } from '@/lib/firebase/client';

/**
 * Admin 이메일 주소
 */
const ADMIN_EMAIL = 'rkdk24@gmail.com';

/**
 * Auth Context 타입
 */
interface AuthContextType {
  /**
   * 현재 로그인한 사용자
   */
  user: User | null;
  /**
   * 로딩 중 여부
   */
  loading: boolean;
  /**
   * 관리자 여부
   */
  isAdmin: boolean;
}

/**
 * Auth Context 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider 컴포넌트
 * Firebase Auth 상태를 관리하고 onAuthStateChanged를 사용하여 유저 정보를 추적합니다.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      const auth = await getClientAuthInstance();

      // onAuthStateChanged로 인증 상태 변경 감지
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    };

    initializeAuth();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 관리자 여부 확인 (이메일이 ADMIN_EMAIL과 일치하는 경우)
  const isAdmin = user?.email === ADMIN_EMAIL;

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth 커스텀 훅
 * AuthContext를 사용하여 인증 상태에 접근합니다.
 *
 * @throws {Error} AuthProvider 외부에서 사용 시 에러 발생
 * @returns {AuthContextType} 인증 상태 정보
 *
 * @example
 * ```tsx
 * const { user, loading, isAdmin } = useAuth();
 *
 * if (loading) return <div>로딩 중...</div>;
 * if (!user) return <div>로그인이 필요합니다.</div>;
 * if (isAdmin) return <div>관리자 페이지</div>;
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

