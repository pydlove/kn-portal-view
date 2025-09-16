// src/views/kn/console/menu/types.ts
export interface KnMenu {
  id?: number
  menuName: string
  menuDesc?: string
  menuUrl?: string
  parentId: number
  menuLevel?: number
  orderNo?: number
  createTime?: string
  updateTime?: string
  version?: number
  createUid?: number
  updateUid?: number
  deletedStatus?: number
  enabledStatus?: number
  childrenMenu?: KnMenu[]
}

export interface MenuDataItem {
  id: number
  menuName: string
  menuDesc: string
  menuUrl: string
  parentId: number
  menuLevel: number
  orderNo: number
  createTime: string
  updateTime: string
  version: number
  enabledStatus: number
}
