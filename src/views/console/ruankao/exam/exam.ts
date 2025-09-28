// src/types/exam.ts
export interface RkExamQuestion {
  id?: number;
  type?: string;
  title?: string;
  score?: number;
  difficulty?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  deletedStatus?: number;
}

export interface RkExamQuestionChoice {
  id?: number;
  questionId?: number;
  choiceType?: number; // 1-单选 2-多选
  options?: any;
  correctAnswers?: string;
  analysis?: string;
  createTime?: string;
  updateTime?: string;
  deletedStatus?: number;
}

export interface RkExamQuestionCase {
  id?: number;
  questionId?: number;
  background?: string;
  requirement?: string;
  referenceAnswer?: string;
  createTime?: string;
  updateTime?: string;
  deletedStatus?: number;
}

export interface RkExamQuestionEssay {
  id?: number;
  questionId?: number;
  requirement?: string;
  wordLimitMin?: number;
  wordLimitMax?: number;
  referenceAnswer?: string;
  scoringCriteria?: string;
  createTime?: string;
  updateTime?: string;
  deletedStatus?: number;
}

// src/types/exam.ts
export interface RkExamQuestionArticle {
  id?: number;
  questionId?: number;
  title?: string;
  content?: string;
  createTime?: string;
  updateTime?: string;
  deletedStatus?: number;
}

// 添加创建文章题的函数定义
export interface ArticleQuestionVO {
  question: RkExamQuestion;
  articleDetail: RkExamQuestionArticle;
}

