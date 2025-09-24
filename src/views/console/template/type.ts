// src/views/kn/console/template/type.ts
export interface TemplateVO {
  id: number
  createTime: string
  updateTime: string
  version: string
  createUid: number
  updateUid: number
  deletedStatus: number
  templateName: string
  templateDesc: string
  templateLevel: number
}

export interface TemplateForm {
  id?: number
  templateName: string
  templateDesc: string
  templateLevel: number
}



