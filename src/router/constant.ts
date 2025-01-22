// 路由白名单
export const whiteNameList = ['login', 'sso', 'test'] as const // no redirect whitelist

export type WhiteNameList = typeof whiteNameList

export type WhiteName = (typeof whiteNameList)[number]
