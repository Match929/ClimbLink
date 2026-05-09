import { createSSRApp } from 'vue'
import App from './App.vue'
import cloud from './utils/cloud'

// 初始化云开发
cloud.initCloud()

export function createApp() {
  const app = createSSRApp(App)
  
  // 将云开发实例挂载到全局属性
  app.config.globalProperties.$cloud = cloud
  
  return {
    app
  }
}
