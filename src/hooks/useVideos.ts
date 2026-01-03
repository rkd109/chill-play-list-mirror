'use client';

import { useState, useCallback } from 'react';
import {
  getVideos,
  getVideoById,
  createOrUpdateVideo,
  createVideos,
} from '@/lib/firebase/videos';
import type { Video, VideoInput, VideoQueryOptions } from '@/types/video';

/**
 * Video 관련 훅
 */
export function useVideos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Video 리스트 조회
   */
  const fetchVideos = useCallback(
    async (options?: VideoQueryOptions): Promise<Video[]> => {
      setLoading(true);
      setError(null);
      try {
        const videos = await getVideos(options);
        return videos;
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
   * 단일 Video 조회
   */
  const fetchVideoById = useCallback(
    async (videoId: string): Promise<Video | null> => {
      setLoading(true);
      setError(null);
      try {
        const video = await getVideoById(videoId);
        return video;
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
   * Video 생성 또는 업데이트
   */
  const saveVideo = useCallback(
    async (input: VideoInput): Promise<Video> => {
      setLoading(true);
      setError(null);
      try {
        const video = await createOrUpdateVideo(input);
        return video;
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
   * 여러 Video 일괄 생성
   */
  const saveVideos = useCallback(
    async (inputs: VideoInput[]): Promise<Video[]> => {
      setLoading(true);
      setError(null);
      try {
        const videos = await createVideos(inputs);
        return videos;
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

