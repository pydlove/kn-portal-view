// src/views/kn/console/question/type.ts
export interface QuestionVO {
  id: number
  createTime: string
  updateTime: string
  version: string
  createUid: number
  updateUid: number
  deletedStatus: number
  templateId: number
  questionTitle: string
  questionText: string
  difficultyLevel: string
  answerHint: string
  referenceAnswer: string
  categoryName: string
}

export interface QuestionForm {
  id?: number
  templateId: number | undefined
  questionTitle: string
  questionText: string
  difficultyLevel: string
  answerHint: string
  referenceAnswer: string
  categoryName: string
}
