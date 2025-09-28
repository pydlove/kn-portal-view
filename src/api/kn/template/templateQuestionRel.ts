// src/api/template/templateQuestionRel.ts
import {defaultRequest} from '@/utils/request'

// 创建模板问题关联关系
export function createTemplateQuestionRel(data: any) {
  return defaultRequest({
    url: '/qt_rel/create',
    method: 'post',
    data
  })
}

// 批量创建模板问题关联关系
export function batchCreateTemplateQuestionRel(data: any[]) {
  return defaultRequest({
    url: '/qt_rel/batchCreate',
    method: 'post',
    data
  })
}

// 获取模板关联的问题列表
export function getTemplateQuestions(templateId: number) {
  return defaultRequest({
    url: `/qt_rel/template/${templateId}`,
    method: 'get'
  })
}

// 删除模板问题关联关系
export function deleteTemplateQuestionRel(id: number) {
  return defaultRequest({
    url: `/qt_rel/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除模板问题关联关系
export function batchDeleteTemplateQuestionRel(ids: number[]) {
  return defaultRequest({
    url: '/qt_rel/batchDelete',
    method: 'post',
    data: ids
  })
}
