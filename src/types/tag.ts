export interface Tag {
  id: number
  name: string
  userId: number
  isHidden: boolean
  createdAt: string
}

export interface TagCreateDTO {
  name: string
  isHidden?: boolean
}