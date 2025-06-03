import http from './http'
import type {Snippet, SnippetCreateDTO, SnippetUpdateDTO} from '../types/snippet';

export const snippetsApi = {
  // 创建代码片段
  createSnippet: (snippet: SnippetCreateDTO) => {
    return http.post<Snippet>('/snippets', snippet)
  },
  
  // 更新代码片段
  updateSnippet: (snippet: SnippetUpdateDTO) => {
    return http.post<Snippet>('/snippets', snippet)
  },
  
  // 获取当前用户的所有代码片段
  getMySnippets: () => {
    return http.get<Snippet[]>('/snippets')
  },
  
  // 获取单个代码片段
  getSnippet: (id: number) => {
    return http.get<Snippet>(`/snippets/${id}`)
  },
  
  // 删除代码片段
  deleteSnippet: (id: number) => {
    return http.delete<null>(`/snippets/${id}`)
  }
}
