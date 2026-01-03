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
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Video 리스트 조회
 *     description: Video 리스트를 조회합니다. 쿼리 파라미터로 필터링, 정렬, 페이지네이션이 가능합니다.
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: string
 *         description: 단일 Video 조회 시 사용하는 Video ID
 *         example: dQw4w9WgXcQ
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리 필터
 *         example: 음악
 *       - in: query
 *         name: curatedDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 큐레이션 날짜 필터 (YYYY-MM-DD)
 *         example: 2024-05-20
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: 태그 필터 (쉼표로 구분)
 *         example: 팝,클래식
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [curatedAt, publishedAt, viewCount]
 *         description: 정렬 기준
 *         example: curatedAt
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 정렬 방향
 *         example: desc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 결과 개수 제한
 *         example: 10
 *     responses:
 *       200:
 *         description: 성공적으로 Video 리스트를 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *                 count:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: Video를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
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
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Video 생성 또는 업데이트
 *     description: 단일 Video를 생성하거나 업데이트합니다. videoId가 이미 존재하면 업데이트됩니다.
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/VideoInput'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/VideoInput'
 *                 description: 여러 Video를 일괄 생성
 *           examples:
 *             single:
 *               summary: 단일 Video 생성
 *               value:
 *                 videoId: dQw4w9WgXcQ
 *                 title: Rick Astley - Never Gonna Give You Up
 *                 description: The official video
 *                 customComment: 클래식한 인터넷 문화의 상징
 *                 thumbnail: https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
 *                 viewCount: 1500000000
 *                 publishedAt: 2009-10-25T06:57:33Z
 *                 category: 음악
 *                 tags: [팝, 클래식, 밈]
 *             multiple:
 *               summary: 여러 Video 일괄 생성
 *               value:
 *                 - videoId: dQw4w9WgXcQ
 *                   title: Video 1
 *                   category: 음악
 *                 - videoId: jNQXAC9IVRw
 *                   title: Video 2
 *                   category: 역사
 *     responses:
 *       201:
 *         description: 성공적으로 Video 생성/업데이트
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Video'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Video'
 *                 count:
 *                   type: number
 *                   description: 일괄 생성 시 생성된 개수
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

