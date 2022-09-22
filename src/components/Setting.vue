<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import type{ ReadyQueueSetting } from '@/config'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting!

function addReadyQueue() {
  readyQueueSetting.value.push({
    priority: 1,
    timeSlice: 1,
  })
}

function removeReadyQueue(queue: ReadyQueueSetting) {
  readyQueueSetting.value.splice(readyQueueSetting.value.findIndex((v) => {
    return v === queue
  }), 1)
}

function finishSetting() {
  if (checkSetting()) {
    modifySetting()
    emits('changestatus', 'mlfq')
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保每个队列优先级、时间片长度均为正数且队列优先级唯一')
  }
}

function checkSetting(): boolean {
  const flag1 = readyQueueSetting.value.every((val) => {
    return val.priority > 0 && val.timeSlice > 0
  })
  const flag2 = new Set(readyQueueSetting.value.map(v => v.priority)).size === readyQueueSetting.value.length
  return !!(flag1 && flag2)
}

function modifySetting() {
  readyQueueSetting.value.forEach((v) => {
    v.priority = Math.floor(v.priority)
    v.timeSlice = Number(v.timeSlice.toFixed(1))
  })
}
</script>

<template>
  <div style="display:flex;flex-direction: column;align-items: center;justify-content: center;min-height: 60vh;">
    <header>
      <h1>
        Setting
      </h1>
    </header>
    <main>
      <div>
        <span>
          就绪队列个数:{{ readyQueueSetting.length }}
        </span>
        <button style="margin-left: 2rem;" @click="addReadyQueue">
          添加队列
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.879 0-9 4.121-9 9s4.121 9 9 9s9-4.121 9-9s-4.121-9-9-9zm0 16c-3.794 0-7-3.206-7-7s3.206-7 7-7s7 3.206 7 7s-3.206 7-7 7z" /><path fill="currentColor" d="M13 8h-2v4H7v2h4v4h2v-4h4v-2h-4zm7.292-1.292l-3.01-3l1.412-1.417l3.01 3zM5.282 2.294L6.7 3.706l-2.99 3l-1.417-1.413z" /></svg>
        </button>
      </div>
      <div v-for="(item, index) in readyQueueSetting" :key="index" style="margin:0.5rem;">
        <span>队列{{ index }}: </span>
        <span style="padding: 0 1rem;">
          <label>优先级</label><input v-model="item.priority" type="number" step="1" min="1">
        </span>
        <span style="padding: 0 1rem;">
          <label>时间片长度</label><input v-model="item.timeSlice" type="number" step="0.1" min="0.1">
        </span>
        <button class="danger" @click="removeReadyQueue(item)">
          移除
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 12"><path fill="currentColor" d="M5 3h2a1 1 0 0 0-2 0ZM4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1H4Zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0V6ZM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5ZM3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11l.436 5.085Z" /></svg>
        </button>
      </div>
      <div style="text-align: center;">
        <button class="primary" @click="finishSetting">
          完成设置
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path fill="currentColor" d="m924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1c0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1l74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3l-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2l-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9l-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5l-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5c0-15.3 1.2-30.6 3.7-45.5l6.5-40l-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2l31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3l17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97l38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8l92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176s176-78.8 176-176s-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z" /></svg>
        </button>
      </div>
    </main>
    <footer />
  </div>
</template>

<style scoped>
</style>
