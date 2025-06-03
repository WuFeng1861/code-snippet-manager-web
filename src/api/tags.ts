import http from './http'
import type { Tag, TagCreateDTO } from '../types/tag'

export const tagsApi = {
  // 创建标签
  createTag: (tag: TagCreateDTO) => {
    return http.post<Tag>('/tags', tag)
  },
  
  // 获取所有可见标签
  getAllTags: () => {
    return http.get<Tag[]>('/tags')
  },
  
  // 获取当前用户创建的所有标签
  getMyTags: () => {
    return http.get<Tag[]>('/tags/my-tags')
  },
  
  // 更新标签可见性
  updateTagVisibility: (id: number, isHidden: boolean) => {
    return http.patch<Tag>(`/tags/${id}/visibility`, { isHidden })
  }
}