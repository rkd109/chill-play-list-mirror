'use client';

import { useEffect, useState } from 'react';

interface YouTubePlayerProps {
  /**
   * YouTube 영상 URL 또는 Video ID
   * 예: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 또는 "dQw4w9WgXcQ"
   */
  videoIdOrUrl: string;
  /**
   * 플레이어 너비 (기본값: 100%)
   */
  width?: string | number;
  /**
   * 플레이어 높이 (기본값: 315px)
   */
  height?: string | number;
  /**
   * 자동 재생 여부 (기본값: false)
   */
  autoplay?: boolean;
  /**
   * 자동 음소거 여부 (기본값: false)
   */
  muted?: boolean;
  /**
   * 컨트롤 표시 여부 (기본값: true)
   */
  controls?: boolean;
  /**
   * 반응형 여부 (기본값: true)
   */
  responsive?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * YouTube 영상 ID를 추출하는 함수
 */
function extractVideoId(videoIdOrUrl: string): string | null {
  // 이미 Video ID인 경우 (11자리 문자열)
  if (/^[a-zA-Z0-9_-]{11}$/.test(videoIdOrUrl)) {
    return videoIdOrUrl;
  }

  // URL에서 Video ID 추출
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = videoIdOrUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * YouTube 영상 플레이어 컴포넌트
 */
export default function YouTubePlayer({
  videoIdOrUrl,
  width = '100%',
  height = 315,
  autoplay = false,
  muted = false,
  controls = true,
  responsive = true,
  className = '',
}: YouTubePlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractedId = extractVideoId(videoIdOrUrl);
    if (extractedId) {
      setVideoId(extractedId);
      setError(null);
    } else {
      setError('유효하지 않은 YouTube URL 또는 Video ID입니다.');
      setVideoId(null);
    }
  }, [videoIdOrUrl]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-zinc-100 p-8 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 ${className}`}
      >
        <p>{error}</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-zinc-100 p-8 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 ${className}`}
      >
        <p>로딩 중...</p>
      </div>
    );
  }

  // YouTube embed URL 생성
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0', // 관련 영상 표시 안 함
    modestbranding: '1', // YouTube 로고 최소화
  }).toString()}`;

  const containerStyle = responsive
    ? {
        position: 'relative' as const,
        paddingBottom: '56.25%', // 16:9 비율
        height: 0,
        overflow: 'hidden' as const,
        width: '100%',
      }
    : {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      };

  const iframeStyle = responsive
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }
    : {
        width: '100%',
        height: '100%',
      };

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-lg ${className}`}
      style={containerStyle}
    >
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={iframeStyle}
        title="YouTube video player"
        className="border-0"
      />
    </div>
  );
}


