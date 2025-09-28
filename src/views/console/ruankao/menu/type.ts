// src/views/kn/console/menu/types.ts
export interface RkMenu {
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
  childrenMenu?: RkMenu[]
}

export interface RkMenuDataItem {
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
