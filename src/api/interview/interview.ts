// src/api/interview/interview.ts
import request from '../../utils/request';

// 获取面试问题
export const getInterviewQuestions = (data: {level: number}) => {

  return request({
    url: '/interview/questions',
    method: 'get',
    data
  });
};
