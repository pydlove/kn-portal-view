/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-28 11:28:05
 * @LastEditTime: 2024-12-24 21:59:13
 * @FilePath: /cbdt-data-classification-categorization-front/src/components/index.ts
 * @Description: file content
 */
import SvgIcon from '@/components/Icon/Icon.vue'
import CustomModal from '@/components/CustomModal.vue'
import ContentBar from '@/components/ContentBar/index.vue'
import ContentHeader from '@/components/ContentHeader/index.vue'
interface GlobalComponents {
  [key: string]: any
}
const allGlobalComponent: GlobalComponents = { SvgIcon }
export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
  }
}
