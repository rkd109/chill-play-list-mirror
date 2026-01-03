'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { getAuthInstance } from '@/lib/firebase/config';

/**
 * 관리자 전용 페이지 - 데이터 수집
 */
export default function AdminFetchPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const auth = getAuthInstance();
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 인급동 데이터 수집 핸들러
  const handleFetchData = async () => {
    try {
      // TODO: 인급동 데이터 수집 로직 구현
      alert('인급동 데이터 수집 기능을 구현해주세요.');
    } catch (error) {
      console.error('데이터 수집 오류:', error);
      alert('데이터 수집 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중 스피너 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 관리자가 아닌 경우 (리다이렉트 중이므로 빈 화면 또는 리다이렉트 메시지)
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">접근 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  // 관리자 페이지 내용
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            관리자 페이지
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            안녕하세요, {user?.email}님
          </p>

          <div className="space-y-4">
            {/* 인급동 데이터 수집 버튼 */}
            <button
              onClick={handleFetchData}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              인급동 데이터 수집
            </button>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

