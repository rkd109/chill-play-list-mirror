import { NextResponse } from 'next/server';
import { createVideos } from '@/lib/firebase/videos';
import type { VideoInput } from '@/types/video';
import { getCuratedDate } from '@/utils/firestore/video';

/**
 * POST /api/videos/seed
 * 테스트용 임시 데이터 생성
 */
export async function POST() {
  try {
    const now = new Date();
    const curatedDate = getCuratedDate();

    // 테스트용 임시 데이터
    const testVideos: VideoInput[] = [
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
        description:
          'The official video for "Never Gonna Give You Up" by Rick Astley. Taken from the album "Whenever You Need Somebody" – deluxe 2CD and digital deluxe out 6th May 2022.',
        customComment:
          '클래식한 인터넷 문화의 상징. 음악 자체도 훌륭하고, 밈으로도 유명한 작품입니다.',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        viewCount: 1500000000,
        publishedAt: new Date('2009-10-25T06:57:33Z'),
        curatedDate: curatedDate,
        curatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
        category: '음악',
        tags: ['팝', '클래식', '밈', '1980s'],
      },
      {
        videoId: 'jNQXAC9IVRw',
        title: 'Me at the zoo',
        description: 'The first video ever uploaded to YouTube.',
        customComment:
          '역사적인 첫 번째 YouTube 영상. 인터넷 역사의 중요한 순간을 담고 있습니다.',
        thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
        viewCount: 250000000,
        publishedAt: new Date('2005-04-23T20:57:33Z'),
        curatedDate: curatedDate,
        curatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1일 전
        category: '역사',
        tags: ['역사', 'YouTube', '첫영상', '2005'],
      },
      {
        videoId: 'kJQP7kiw5Fk',
        title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
        description:
          '"Despacito" by Luis Fonsi featuring Daddy Yankee. The most viewed video on YouTube.',
        customComment:
          '역대 최다 조회수를 기록한 명작. 라틴 팝의 대표작으로 음악 산업에 큰 영향을 미쳤습니다.',
        thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        viewCount: 8500000000,
        publishedAt: new Date('2017-01-13T00:00:00Z'),
        curatedDate: curatedDate,
        curatedAt: now,
        category: '음악',
        tags: ['라틴', '팝', '레게톤', '히트곡'],
      },
      {
        videoId: '9bZkp7q19f0',
        title: 'PSY - GANGNAM STYLE (강남스타일)',
        description: 'PSY - GANGNAM STYLE (강남스타일) Official Music Video',
        customComment:
          'K-pop을 세계적으로 알린 작품. 한국 문화의 글로벌 확산에 기여한 중요한 영상입니다.',
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        viewCount: 5000000000,
        publishedAt: new Date('2012-07-15T00:00:00Z'),
        curatedDate: curatedDate,
        curatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3시간 전
        category: '음악',
        tags: ['K-pop', '한국', '힐링', '글로벌'],
      },
      {
        videoId: 'fJ9rUzIMcZQ',
        title: 'Queen – Bohemian Rhapsody (Official Video)',
        description:
          'Bohemian Rhapsody by Queen. The official music video for the song.',
        customComment:
          '록 음악의 걸작. 퀸의 대표곡으로 음악사에 길이 남을 명작입니다.',
        thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
        viewCount: 2000000000,
        publishedAt: new Date('2008-10-01T00:00:00Z'),
        curatedDate: curatedDate,
        curatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5시간 전
        category: '음악',
        tags: ['록', '퀸', '클래식', '1970s'],
      },
    ];

    const videos = await createVideos(testVideos);

    return NextResponse.json(
      {
        success: true,
        message: `${videos.length}개의 테스트 비디오가 생성되었습니다.`,
        data: videos,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/videos/seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '테스트 데이터를 생성하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

