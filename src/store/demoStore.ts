import { defineStore } from 'pinia'
import piniaPersistConfig from '@/assets/ts/piniaPersist'

/**
 * 用法如下：
 * 引入：import { DemoStore } from '@/store/demoStore'
 * const demoMyStore = DemoStore()
 * demoMyStore.setDemoStoreFn(demoStrVal)
 * */
// DemoState
export const DemoStore = defineStore({
  id: 'DemoState', // 唯一
  state: () => ({
    demoStr: '' // 测试示例
  }),
  getters: {},
  actions: {
    async setDemoStoreFn(demoStrVal: any) {
      this.demoStr = demoStrVal
    }
  },
  persist: piniaPersistConfig('DemoState')
})
