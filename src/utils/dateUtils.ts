// utils/timeUtils.js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Convert UTC time string to local time string
 * @param {string} utcTimeString - UTC time string, for example "2024-12-13T15:30:00Z"
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - The default time format for output is "YYYY-MM-DD HH:mm:ss"
 * @returns {string} - 格式化后的本地时间字符串
 */
export const convertUTCToLocalTime = (utcTimeString: string, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!utcTimeString) return '--'
  try {
    if (!utcTimeString.endsWith('Z')) {
      utcTimeString += 'Z'
    }
    const data = dayjs(utcTimeString).utc().local().format(format)
    return data === 'Invalid Date' ? utcTimeString : data
  } catch (error) {
    return utcTimeString
  }
}
