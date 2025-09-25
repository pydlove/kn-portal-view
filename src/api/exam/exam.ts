// src/api/exam/question.ts
import request from '@/utils/request';
import {
  RkExamQuestion,
  RkExamQuestionChoice,
  RkExamQuestionCase,
  RkExamQuestionEssay,
  ArticleQuestionVO, RkExamQuestionArticle
} from '../../views/console/exam/exam.ts';

// 分页查询题目
export function getQuestionPage(data: {type: string, title: string, difficulty: string, pageNum: number; pageSize: number}) {
  return request({
    url: '/api/question/page',
    method: 'get',
    data
  });
}

// 获取题目基本信息
export function getQuestion(id: number) {
  return request({
    url: `/api/question/${id}`,
    method: 'get'
  });
}

// 获取选择题详情
export function getChoiceDetail(id: number) {
  return request({
    url: `/api/question/${id}/choice`,
    method: 'get'
  });
}

// 获取案例题详情
export function getCaseDetail(id: number) {
  return request({
    url: `/api/question/${id}/case`,
    method: 'get'
  });
}

// 获取论文题详情
export function getEssayDetail(id: number) {
  return request({
    url: `/api/question/${id}/essay`,
    method: 'get'
  });
}

// 创建选择题
export function createChoiceQuestion(data: {
  question: Partial<RkExamQuestion>;
  choiceDetail: Partial<RkExamQuestionChoice>;
}) {
  return request({
    url: '/api/question/choice',
    method: 'post',
    data
  });
}

// 创建案例题
export function createCaseQuestion(data: {
  question: Partial<RkExamQuestion>;
  caseDetail: Partial<RkExamQuestionCase>;
}) {
  return request({
    url: '/api/question/case',
    method: 'post',
    data
  });
}

// 创建论文题
export function createEssayQuestion(data: {
  question: Partial<RkExamQuestion>;
  essayDetail: Partial<RkExamQuestionEssay>;
}) {
  return request({
    url: '/api/question/essay',
    method: 'post',
    data
  });
}

// 更新题目基本信息
export function updateQuestion(id: number, data: Partial<RkExamQuestion>) {
  return request({
    url: `/api/question/${id}`,
    method: 'put',
    data
  });
}

// 更新选择题详情
export function updateChoiceDetail(id: number, data: Partial<RkExamQuestionChoice>) {
  return request({
    url: `/api/question/${id}/choice`,
    method: 'put',
    data
  });
}

// 更新案例题详情
export function updateCaseDetail(id: number, data: Partial<RkExamQuestionCase>) {
  return request({
    url: `/api/question/${id}/case`,
    method: 'put',
    data
  });
}

// 更新论文题详情
export function updateEssayDetail(id: number, data: Partial<RkExamQuestionEssay>) {
  return request({
    url: `/api/question/${id}/essay`,
    method: 'put',
    data
  });
}

// 删除题目
export function deleteQuestion(id: number) {
  return request({
    url: `/api/question/${id}`,
    method: 'delete'
  });
}

// 添加文章题相关API
export const createArticleQuestion = (data: {
  question: Partial<RkExamQuestion>;
  articleDetail: Partial<RkExamQuestionArticle>;
}) => {
  return request({
    url: '/api/question/article',
    method: 'post',
    data
  });
};

export const getArticleDetail = (id: number) => {
  return request({
    url: `/api/question/${id}/article`,
    method: 'get'
  });
};

export const updateArticleDetail = (id: number, data: Partial<RkExamQuestionArticle>) => {
  return request({
    url: `/api/question/${id}/article`,
    method: 'put',
    data
  });
};

