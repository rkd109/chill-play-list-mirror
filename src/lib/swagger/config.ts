import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chill PlaylistPlus API',
      version: '1.0.0',
      description:
        '편하게 즐길 수 있는 영상·글 기반 큐레이션을 제공하는 개인 콘텐츠 허브 API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Video: {
          type: 'object',
          properties: {
            videoId: {
              type: 'string',
              description: 'YouTube Video ID',
              example: 'dQw4w9WgXcQ',
            },
            title: {
              type: 'string',
              description: 'YouTube 영상 제목',
              example: 'Rick Astley - Never Gonna Give You Up',
            },
            description: {
              type: 'string',
              description: 'YouTube 영상 설명',
            },
            customComment: {
              type: 'string',
              description: 'PM님이 직접 쓴 추천 이유',
            },
            thumbnail: {
              type: 'string',
              format: 'uri',
              description: '고화질 썸네일 URL',
            },
            viewCount: {
              type: 'number',
              description: '수집 시점 조회수',
              example: 1500000000,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: '영상 자체 업로드일',
            },
            curatedDate: {
              type: 'string',
              format: 'date',
              description: '날짜별 그룹화 조회용 날짜 (YYYY-MM-DD)',
              example: '2024-05-20',
            },
            curatedAt: {
              type: 'string',
              format: 'date-time',
              description: '정밀 정렬용 타임스탬프 (큐레이션된 시점)',
            },
            category: {
              type: 'string',
              description: '분류 카테고리',
              example: '음악',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '검색용 키워드 배열',
              example: ['팝', '클래식', '밈'],
            },
          },
          required: ['videoId', 'title'],
        },
        VideoInput: {
          type: 'object',
          properties: {
            videoId: {
              type: 'string',
              description: 'YouTube Video ID',
              example: 'dQw4w9WgXcQ',
            },
            title: {
              type: 'string',
              description: 'YouTube 영상 제목',
            },
            description: {
              type: 'string',
              description: 'YouTube 영상 설명',
            },
            customComment: {
              type: 'string',
              description: 'PM님이 직접 쓴 추천 이유',
            },
            thumbnail: {
              type: 'string',
              format: 'uri',
              description: '고화질 썸네일 URL',
            },
            viewCount: {
              type: 'number',
              description: '수집 시점 조회수',
              default: 0,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: '영상 자체 업로드일',
            },
            curatedDate: {
              type: 'string',
              format: 'date',
              description: '날짜별 그룹화 조회용 날짜 (YYYY-MM-DD)',
            },
            curatedAt: {
              type: 'string',
              format: 'date-time',
              description: '정밀 정렬용 타임스탬프',
            },
            category: {
              type: 'string',
              description: '분류 카테고리',
              default: '기타',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '검색용 키워드 배열',
              default: [],
            },
          },
          required: ['videoId', 'title'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '요청 성공 여부',
            },
            data: {
              type: 'object',
              description: '응답 데이터',
            },
            error: {
              type: 'string',
              description: '에러 메시지',
            },
            count: {
              type: 'number',
              description: '데이터 개수 (리스트 응답 시)',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: '에러 메시지',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Videos',
        description: 'Video 관련 API',
      },
    ],
  },
  apis: [
    './src/app/api/**/*.ts', // API Route 파일 경로
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

