<script setup lang="ts">
import { defineEmits, getCurrentInstance } from 'vue'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting!
function addReadyQueue() {
  readyQueueSetting.value.push({
    priority: 4,
    timeSlice: 1,
  })
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
  <div>
    <header>
      Setting
    </header>
    <main>
      <div>
        <span>
          就绪队列个数:{{ readyQueueSetting.length }}
        </span>
        <button style="margin-left: 2rem;" @click="addReadyQueue">
          添加队列
        </button>
      </div>
      <div v-for="(item, index) in readyQueueSetting" :key="index">
        <span>队列{{ index }}: </span>
        <label>优先级</label><input v-model="item.priority" type="number" step="1" min="1">
        <label>时间片长度</label><input v-model="item.timeSlice" type="number" step="0.1" min="0.1">
      </div>
      <div>
        <button @click="finishSetting">
          完成设置
        </button>
      </div>
    </main>
    <footer />
  </div>
</template>

<style scoped>
</style>
