import type {Tag} from './tag';

export interface Snippet {
  id: number;
  title: string;
  content: string;
  description?: string;
  language: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  tagIds: number[];
  tags: Tag[];
}

export interface SnippetCreateDTO {
  title: string;
  content: string;
  description?: string;
  language: string;
  tagIds?: number[];
}

export interface SnippetUpdateDTO {
  id: number;
  title: string;
  content: string;
  description?: string;
  language: string;
  tagIds?: number[];
}
