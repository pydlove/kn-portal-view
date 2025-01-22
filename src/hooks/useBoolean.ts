/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-12-03 14:59:20
 * @LastEditTime: 2024-12-07 15:43:42
 * @FilePath: /cbdt-data-classification-categorization-front/src/hooks/useBoolean.ts
 * @Description: file content
 */
import { ref } from 'vue'

/**
 * Boolean
 *
 * @param initValue Init value
 */
export function useBoolean(initValue = false) {
  const bool = ref(initValue)

  function setBool(value: boolean) {
    bool.value = value
  }
  function setTrue() {
    setBool(true)
  }
  function setFalse() {
    setBool(false)
  }
  function toggle() {
    setBool(!bool.value)
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  }
}
