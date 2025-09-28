// src/api/template/template.ts
import {defaultRequest} from '@/utils/request'
import {TemplateForm} from '@/views/console/kn/template/type'

// 分页查询面试模板
export function getTemplatePage(data: {menuName: string, pageNum: number; pageSize: number}) {
  return defaultRequest({
    url: '/template/page',
    method: 'get',
    data
  })
}

// 创建面试模板
export function createTemplate(data: TemplateForm) {
  return defaultRequest({
    url: '/template/create',
    method: 'post',
    data
  })
}

// 更新面试模板
export function updateTemplate(id: number, data: TemplateForm) {
  return defaultRequest({
    url: `/template/update/${id}`,
    method: 'put',
    data
  })
}

// 删除面试模板
export function deleteTemplate(id: number) {
  return defaultRequest({
    url: `/template/delete/${id}`,
    method: 'delete'
  })
}

// 获取所有模板（用于下拉选择）
export function getAllTemplates() {
  return defaultRequest({
    url: '/template/all',
    method: 'get',
  })
}

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
