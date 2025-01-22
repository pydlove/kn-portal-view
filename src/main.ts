import 'virtual:svg-icons-register'
import { Component, createApp } from 'vue'
import Antd from 'ant-design-vue'
import GlobalComponent from '@/components'
import { setupStore } from '@/store'
import '@/assets/icons/iconfont/iconfont.js'
// CSS common style sheet
import './styles/scss/common.scss'
import './styles/css/common.css'

import App from './App.vue'
import { setupRouter } from './router'
async function setupApp() {
  const app = createApp(App as Component)

  app.use(GlobalComponent)
  app.use(Antd)
  // Mounts Vuex state management
  setupStore(app)
  // tell Vue to ignore all workbench custom elements, which are prefixed by "wb-".
  // Mount the route
  await setupRouter(app)

  app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('wb-')

  app.mount('#app')
}

setupApp()
