import {type RouteRecordRaw} from 'vue-router'

export interface IMeta {
  customMenu?: string
  customTailMenus?: { menuName: string; url?: string }[]
  customContentWidth?: boolean
  customContentBar?: boolean // background: black
  customContentHeader?: boolean // background: grey
  showBack?: boolean
}

export const BASIC_ROUTES: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/kn/home/index.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/kn/main/index.vue')
  },


  {
    path: '/rk/home',
    name: 'rkHome',
    component: () => import('@/views/ruankao/home/index.vue')
  },
  {
    path: '/rk/main',
    name: 'rkMain',
    component: () => import('@/views/ruankao/main/index.vue')
  },
  {
    path: '/rk/study-task',
    name: 'StudyTask',
    component: () => import('@/views/ruankao/home/StudyTask.vue')
  },


  {
    path: '/noAuth',
    name: 'noAuth',
    meta: {hideHeader: true},
    component: () => import('@/views/NoPermission.vue')
  },
  {
    path: '/error',
    name: 'error',
    meta: {hideHeader: true},
    component: () => import('@/views/ErrorPage.vue')
  },
  {
    path: '/index',
    name: 'index',
    meta: {hideHeader: true},
    component: () => import('@/views/console/index/index.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {hideHeader: true},
    component: () => import('@/views/console/menu/index.vue')
  },
  {
    path: '/article',
    name: 'article',
    meta: {hideHeader: true},
    component: () => import('@/views/console/article/index.vue')
  },
  {
    path: '/question',
    name: 'Question',
    meta: {hideHeader: true},
    component: () => import('@/views/console/question/index.vue')
  },
  {
    path: '/template',
    name: 'Template',
    meta: {hideHeader: true},
    component: () => import('@/views/console/template/index.vue'),
  },
  {
    path: '/exam/question',
    name: 'ExamQuestion',
    component: () => import('@/views/console/exam/index.vue'),
    meta: {
      title: '题库管理',
      hideHeader: true
    }
  },
  {
    path: '/exam/question/create',
    name: 'ExamQuestionCreate',
    component: () => import('@/views/console/exam/create.vue'),
    meta: {
      title: '创建题目',
      hideHeader: true
    }
  },
  {
    path: '/exam/question/edit/:id',
    name: 'ExamQuestionEdit',
    component: () => import('@/views/console/exam/edit.vue'),
    meta: {
      title: '编辑题目',
      hideHeader: true
    }
  },
  {
    path: '/exam/calendar',
    name: 'ExamCalendar',
    component: () => import('@/views/console/calendar/ConsoleExamCalendar.vue'),
    meta: {
      title: '考试日历管理',
      hideHeader: true
    }
  }
]
