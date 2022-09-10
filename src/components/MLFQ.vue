<script setup lang="ts">
import { fabric } from 'fabric'
import { type Ref, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { type Queue, ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'
import { Process } from '@/class/Process'
import { drawProcess, drawQueue, renderProcess } from '@/core/draw'
import * as ui from '@/config/ui'
import { runProcess } from '@/core/logitc'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting!
const processSetting = ref({
  name: '',
  taskTime: 1,
  total: 0,
  count: 0,
})
const processes: Ref<Process>[] = []
const readyQueues: ReadyQueue[] = []
const waitQueue = new WaitQueue('等待队列')
const runningQueue = new RunningQueue('运行队列')
const queue2Group: Map<Queue, ReturnType<typeof drawQueue>> = new Map()
const process2Group: Map<Process, ReturnType<typeof drawProcess>> = new Map()
let canvas: fabric.Canvas | null = null

onMounted(() => {
  initReadyQueues()
  canvas = new fabric.Canvas('c', {
    backgroundColor: 'rgb(100,100,200)',
    selectionLineWidth: 2,
    height: (readyQueues.length + 2) * (ui.defaultQueueOptions.height! + 20),
    width: 1500,
    // ...
  })
  drawAllQueues(canvas)
})

function initReadyQueues() {
  readyQueueSetting.value.forEach((item, index) => {
    const newqueue = new ReadyQueue(item.priority, item.timeSlice, `就绪队列${index}`)
    readyQueues.push(newqueue)
  })
  readyQueues.sort((a: ReadyQueue, b: ReadyQueue) => {
    return b.priority - a.priority
  })
}

function drawAllQueues(canvas: fabric.Canvas) {
  const queues: Queue[] = [...readyQueues, waitQueue, runningQueue]
  queues.forEach((v, i) => {
    const group = drawQueue(v, canvas, {
      top: (ui.defaultQueueOptions.height! + 20) * i + 10, left: 100,
    })
    queue2Group.set(v, group)
  })
}

function addProcess() {
  if (!canvas)
    return
  if (checkSetting()) {
    modifySetting()
    const newPro = ref(new Process(processSetting.value.name, processSetting.value.taskTime))
    processes.push(newPro)
    const group = drawProcess(newPro.value, canvas!)
    process2Group.set(newPro.value, group)
    watch((newPro), (v) => {
      renderProcess(v, group)
      canvas?.requestRenderAll()
    }, { immediate: true, deep: true })
    processSetting.value.total++
    processSetting.value.total++
    runProcess(newPro, readyQueues)
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保进程名称唯一并且进程时间片大于0')
  }
}

function modifySetting() {
  if (!processSetting.value.name.trim())
    processSetting.value.name = `进程${processSetting.value.total}`
  processSetting.value.taskTime = Number(processSetting.value.taskTime.toFixed(1))
}
function checkSetting() {
  if (processes.findIndex((v) => {
    return processSetting.value.name === v.value.name
  }) >= 0 || processSetting.value.taskTime <= 0)
    return false
  return true
}
</script>

<template>
  <div>
    <main>
      <div>
        <button @click="$emit('changestatus', 'setting')">
          返回
        </button>
      </div>
      <canvas id="c" />
    </main>
    <footer>
      <label>进程名称: </label>
      <input v-model="processSetting.name" type="text">
      <label>进程任务总时间: </label>
      <input v-model="processSetting.taskTime" type="number" :min="1" :step="0.1">
      <button @click="addProcess">
        添加进程
      </button>
    </footer>
  </div>
</template>

<style scoped>
</style>
