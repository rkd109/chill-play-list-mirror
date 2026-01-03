'use client';

import { useState, FormEvent } from 'react';
import { useVideos } from '@/hooks/useVideos';
import type { VideoInput } from '@/types/video';
import { getCuratedDate } from '@/utils/firestore/video';

interface VideoFormProps {
  onSuccess?: (video: any) => void;
  onError?: (error: string) => void;
}

/**
 * Video 생성/수정 폼 컴포넌트
 */
export default function VideoForm({ onSuccess, onError }: VideoFormProps) {
  const { saveVideo, loading, error } = useVideos();
  const [formData, setFormData] = useState<Partial<VideoInput>>({
    videoId: '',
    title: '',
    description: '',
    customComment: '',
    thumbnail: '',
    viewCount: 0,
    category: '기타',
    tags: [],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.videoId || !formData.title) {
      const errorMsg = 'videoId와 title은 필수입니다.';
      if (onError) onError(errorMsg);
      return;
    }

    try {
      const now = new Date();
      const videoInput: VideoInput = {
        videoId: formData.videoId!,
        title: formData.title!,
        description: formData.description || '',
        customComment: formData.customComment || '',
        thumbnail: formData.thumbnail || '',
        viewCount: formData.viewCount || 0,
        publishedAt: formData.publishedAt || now,
        curatedDate: formData.curatedDate || getCuratedDate(),
        curatedAt: formData.curatedAt || now,
        category: formData.category || '기타',
        tags: formData.tags || [],
      };

      const video = await saveVideo(videoInput);
      
      if (onSuccess) {
        onSuccess(video);
      }
      
      // 폼 초기화
      setFormData({
        videoId: '',
        title: '',
        description: '',
        customComment: '',
        thumbnail: '',
        viewCount: 0,
        category: '기타',
        tags: [],
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.';
      if (onError) onError(errorMsg);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'viewCount' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="videoId" className="block text-sm font-medium mb-1">
          Video ID *
        </label>
        <input
          type="text"
          id="videoId"
          name="videoId"
          value={formData.videoId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          제목 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="customComment" className="block text-sm font-medium mb-1">
          추천 이유
        </label>
        <textarea
          id="customComment"
          name="customComment"
          value={formData.customComment}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">
          썸네일 URL
        </label>
        <input
          type="url"
          id="thumbnail"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="viewCount" className="block text-sm font-medium mb-1">
          조회수
        </label>
        <input
          type="number"
          id="viewCount"
          name="viewCount"
          value={formData.viewCount}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="기타">기타</option>
          <option value="음악">음악</option>
          <option value="개발">개발</option>
          <option value="역사">역사</option>
          <option value="프론트엔드">프론트엔드</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          태그 (쉼표로 구분)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags?.join(', ') || ''}
          onChange={handleTagsChange}
          placeholder="예: 팝, 클래식, 밈"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}

