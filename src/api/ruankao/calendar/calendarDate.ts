// src/api/exam-calendar/calendarDate.ts
import {ruankaoRequest} from '@/utils/request'

// 创建日历日期内容
export function createCalendarDate(data: any) {
  return ruankaoRequest({
    url: '/api/calendar-date/create',
    method: 'post',
    data
  })
}

// 更新日历日期内容
export function updateCalendarDate(id: number, data: any) {
  return ruankaoRequest({
    url: '/api/calendar-date/update',
    method: 'post',
    data: {...data, id}
  })
}

// 删除日历日期内容
export function deleteCalendarDate(id: number) {
  return ruankaoRequest({
    url: `/api/calendar-date/${id}`,
    method: 'delete'
  })
}

// 根据日期查询所有相关内容
export function listCalendarDatesByDate(data: { calendarDateStr: string }) {
  return ruankaoRequest({
    url: '/api/calendar-date/list-by-date',
    method: 'get',
    data
  })
}

// 根据ID获取日历日期内容
export function getCalendarDateById(id: number) {
  return ruankaoRequest({
    url: `/api/calendar-date/${id}`,
    method: 'get'
  })
}

// 获取日历日期关联的问题
export function getCalendarDateQuestions(calendarId: number, data: {
  pageNum: number;
  pageSize: number
}) {
  return ruankaoRequest({
    url: `/api/calendar-date/${calendarId}/questions`,
    method: 'get',
    data
  })
}

// 保存日历日期关联的问题
export function saveCalendarDateQuestions(id: number, data: any[]) {
  return ruankaoRequest({
    url: `/api/calendar-date/${id}/questions`,
    method: 'post',
    data
  })
}


// 软考日历相关接口
export const getCalendarDateTaskCount = (data: { startDate: string, endDate: string }) => {
  return ruankaoRequest({
    url: '/api/calendar-date/task/count',
    method: 'get',
    data
  });
};

export const getCalendarDateTasks = (data: { calendarDateStr: string }) => {
  return ruankaoRequest({
    url: '/api/calendar-date/task/list-by-date',
    method: 'get',
    data
  });
};

export const getCalendarDateQuestionDetail = (calendarId: number, data: { pageNum: number; pageSize: number }) => {
  return ruankaoRequest({
    url: `/api/calendar-date/${calendarId}/detail`,
    method: 'get',
    data
  });
};

export const finishTask = (data: {calendarId: number}) => {
  return ruankaoRequest({
    url: `/api/calendar-date/task/finish`,
    method: 'get',
    data
  });
};
