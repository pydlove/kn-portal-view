// src/api/template/template.ts
import request from '@/utils/request'
import {TemplateForm} from '../../views/kn/console/template/type'

// 分页查询面试模板
export function getTemplatePage(data: {menuName: string, pageNum: number; pageSize: number}) {
  return request({
    url: '/template/page',
    method: 'get',
    data
  })
}

// 创建面试模板
export function createTemplate(data: TemplateForm) {
  return request({
    url: '/template/create',
    method: 'post',
    data
  })
}

// 更新面试模板
export function updateTemplate(id: number, data: TemplateForm) {
  return request({
    url: `/template/update/${id}`,
    method: 'put',
    data
  })
}

// 删除面试模板
export function deleteTemplate(id: number) {
  return request({
    url: `/template/delete/${id}`,
    method: 'delete'
  })
}

// 获取所有模板（用于下拉选择）
export function getAllTemplates() {
  return request({
    url: '/template/all',
    method: 'get',
  })
}

// 创建模板问题关联关系
export function createTemplateQuestionRel(data: any) {
  return request({
    url: '/qt_rel/create',
    method: 'post',
    data
  })
}

// 批量创建模板问题关联关系
export function batchCreateTemplateQuestionRel(data: any[]) {
  return request({
    url: '/qt_rel/batchCreate',
    method: 'post',
    data
  })
}

// 获取模板关联的问题列表
export function getTemplateQuestions(templateId: number) {
  return request({
    url: `/qt_rel/template/${templateId}`,
    method: 'get'
  })
}
