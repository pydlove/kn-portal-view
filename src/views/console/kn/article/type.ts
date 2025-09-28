// src/views/kn/console/article/types.ts
export interface ArticleVO {
  id: number
  createTime: string
  updateTime: string
  version: string
  createUid: number
  updateUid: number
  deletedStatus: number
  articleTitle: string
  articleContent: string
  menuId: number
}
