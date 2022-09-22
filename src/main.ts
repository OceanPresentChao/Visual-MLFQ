import { createApp } from 'vue'
import type { Ref } from 'vue'
import App from './App.vue'
import { readyQueueSetting } from '@/config'
import type { ReadyQueueSetting } from '@/config'
import './style.css'
const app = createApp(App)
app.config.globalProperties.$readyQueueSetting = readyQueueSetting
app.mount('#app')
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $readyQueueSetting: Ref<ReadyQueueSetting[]>
  }
}
