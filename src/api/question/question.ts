// src/api/question/question.ts
import request from '@/utils/request'
import {QuestionForm} from '@/views/kn/console/question/type'

// 分页查询面试题
export function getQuestionPage(data: {questionText: string, difficultyLevel: string, categoryName: string, pageNum: number; pageSize: number}) {
  return request({
    url: '/questions/page',
    method: 'get',
    data
  })
}

// 创建面试题
export function createQuestion(data: QuestionForm) {
  return request({
    url: '/questions/create',
    method: 'post',
    data
  })
}

// 更新面试题
export function updateQuestion(id: number, data: QuestionForm) {
  return request({
    url: `/questions/update/${id}`,
    method: 'put',
    data
  })
}

// 删除面试题
export function deleteQuestion(id: number) {
  return request({
    url: `/questions/delete/${id}`,
    method: 'delete'
  })
}
