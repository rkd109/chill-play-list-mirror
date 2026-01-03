import { NextRequest, NextResponse } from 'next/server';
import {
  getVideos,
  getVideoById,
  createOrUpdateVideo,
  createVideos,
} from '@/lib/firebase/videos';
import type { VideoInput, VideoQueryOptions } from '@/types/video';
import { getCuratedDate } from '@/utils/firestore/video';

/**
 * GET /api/videos
 * Video 리스트 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const videoId = searchParams.get('videoId');
    const category = searchParams.get('category') || undefined;
    const curatedDate = searchParams.get('curatedDate') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const orderBy = (searchParams.get('orderBy') as 'curatedAt' | 'publishedAt' | 'viewCount') || undefined;
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // 단일 Video 조회
    if (videoId) {
      const video = await getVideoById(videoId);
      if (!video) {
        return NextResponse.json(
          { success: false, error: '비디오를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: video }, { status: 200 });
    }

    // Video 리스트 조회
    const options: VideoQueryOptions = {
      category,
      curatedDate,
      tags,
      orderBy,
      orderDirection,
      limit,
    };

    const videos = await getVideos(options);

    return NextResponse.json(
      { success: true, data: videos, count: videos.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/videos error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '비디오를 가져오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videos
 * Video 생성 또는 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 단일 Video 생성
    if (body.videoId || body.length === undefined) {
      const input = body as VideoInput;

      // 필수 필드 검증
      if (!input.videoId || !input.title) {
        return NextResponse.json(
          { success: false, error: 'videoId와 title은 필수입니다.' },
          { status: 400 }
        );
      }

      // 기본값 설정
      const now = new Date();
      const videoInput: VideoInput = {
        videoId: input.videoId,
        title: input.title,
        description: input.description || '',
        customComment: input.customComment || '',
        thumbnail: input.thumbnail || '',
        viewCount: input.viewCount || 0,
        publishedAt: input.publishedAt || now,
        curatedDate: input.curatedDate || getCuratedDate(),
        curatedAt: input.curatedAt || now,
        category: input.category || '기타',
        tags: input.tags || [],
      };

      const video = await createOrUpdateVideo(videoInput);

      return NextResponse.json(
        { success: true, data: video },
        { status: 201 }
      );
    }

    // 여러 Video 일괄 생성
    if (Array.isArray(body)) {
      const inputs = body as VideoInput[];
      const videos = await createVideos(inputs);

      return NextResponse.json(
        { success: true, data: videos, count: videos.length },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, error: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST /api/videos error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '비디오를 저장하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

