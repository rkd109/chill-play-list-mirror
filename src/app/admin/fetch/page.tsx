'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { getClientAuthInstance } from '@/lib/firebase/client';
import { fetchTrendingVideos } from '@/app/actions/fetchTrendingVideos';

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
      const auth = await getClientAuthInstance();
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    count?: number;
  } | null>(null);

  // 인급동 데이터 수집 핸들러
  const handleFetchData = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setFetching(true);
      setFetchResult(null);

      // ID 토큰 가져오기
      const idToken = await user.getIdToken();

      // Server Action 호출
      const result = await fetchTrendingVideos(idToken);

      setFetchResult(result);

      if (result.success) {
        alert(result.message || `${result.count}개의 비디오를 수집했습니다.`);
      } else {
        alert(result.error || '데이터 수집에 실패했습니다.');
      }
    } catch (error) {
      console.error('데이터 수집 오류:', error);
      setFetchResult({
        success: false,
        error: error instanceof Error ? error.message : '데이터 수집 중 오류가 발생했습니다.',
      });
      alert('데이터 수집 중 오류가 발생했습니다.');
    } finally {
      setFetching(false);
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
              disabled={fetching}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetching ? '수집 중...' : '인급동 데이터 수집'}
            </button>

            {/* 수집 결과 표시 */}
            {fetchResult && (
              <div
                className={`rounded-lg p-4 ${
                  fetchResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={
                    fetchResult.success
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }
                >
                  {fetchResult.success
                    ? fetchResult.message || `${fetchResult.count}개의 비디오를 수집했습니다.`
                    : fetchResult.error || '데이터 수집에 실패했습니다.'}
                </p>
              </div>
            )}

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

