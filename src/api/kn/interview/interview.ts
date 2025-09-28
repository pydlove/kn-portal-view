import {defaultRequest} from '../../../utils/request';

// 获取面试问题
export const getInterviewQuestions = (data: {level: number}) => {

  return defaultRequest({
    url: '/interview/questions',
    method: 'get',
    data
  });
};
