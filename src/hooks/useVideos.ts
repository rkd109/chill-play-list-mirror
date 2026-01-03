'use client';

import { useState, useCallback } from 'react';
import type { Video, VideoInput, VideoQueryOptions } from '@/types/video';

/**
 * Video 관련 훅
 */
export function useVideos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Video 리스트 조회 (API Route 사용)
   */
  const fetchVideos = useCallback(
    async (options?: VideoQueryOptions): Promise<Video[]> => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (options?.category) params.append('category', options.category);
        if (options?.curatedDate) params.append('curatedDate', options.curatedDate);
        if (options?.tags) params.append('tags', options.tags.join(','));
        if (options?.orderBy) params.append('orderBy', options.orderBy);
        if (options?.orderDirection) params.append('orderDirection', options.orderDirection);
        if (options?.limit) params.append('limit', options.limit.toString());

        const response = await fetch(`/api/videos?${params.toString()}`);
        if (!response.ok) {
          throw new Error('비디오를 가져오는데 실패했습니다.');
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '비디오를 가져오는데 실패했습니다.');
        }
        return result.data || [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '비디오를 가져오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 단일 Video 조회 (API Route 사용)
   */
  const fetchVideoById = useCallback(
    async (videoId: string): Promise<Video | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/videos?videoId=${videoId}`);
        if (!response.ok) {
          throw new Error('비디오를 가져오는데 실패했습니다.');
        }
        const result = await response.json();
        if (!result.success) {
          return null;
        }
        return result.data || null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '비디오를 가져오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Video 생성 또는 업데이트 (API Route 사용)
   */
  const saveVideo = useCallback(
    async (input: VideoInput): Promise<Video> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw new Error('비디오를 저장하는데 실패했습니다.');
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '비디오를 저장하는데 실패했습니다.');
        }
        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '비디오를 저장하는 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 여러 Video 일괄 생성 (API Route 사용)
   */
  const saveVideos = useCallback(
    async (inputs: VideoInput[]): Promise<Video[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });
        if (!response.ok) {
          throw new Error('비디오들을 저장하는데 실패했습니다.');
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '비디오들을 저장하는데 실패했습니다.');
        }
        return result.data || [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '비디오들을 저장하는 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchVideos,
    fetchVideoById,
    saveVideo,
    saveVideos,
  };
}

