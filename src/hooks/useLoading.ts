/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-12-03 14:58:06
 * @LastEditTime: 2024-12-07 15:47:13
 * @FilePath: /cbdt-data-classification-categorization-front/src/hooks/useLoading.ts
 * @Description: file content
 */
import { useBoolean } from './useBoolean'

/**
 * Loading
 *
 * @param initValue Init value
 */
export function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue)

  return {
    loading,
    startLoading,
    endLoading
  }
}
