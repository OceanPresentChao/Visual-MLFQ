<script setup lang="ts">
import { fabric } from 'fabric'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'
import { Process } from '@/class/Process'
import type{ Queue } from '@/class/Queue'
import * as ui from '@/config/ui'
import { bindAttr2Ref } from '@/utils/tool'
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
const processes: Process[] = []
const readyQueues: ReadyQueue[] = []
const waitQueue = new WaitQueue('等待队列')
const runningQueue = new RunningQueue('运行队列')
let canvas: fabric.Canvas | null = null
initReadyQueues()

onMounted(() => {
  canvas = new fabric.Canvas('c', {
    backgroundColor: 'rgb(100,100,200)',
    selectionLineWidth: 2,
    height: (readyQueues.length + 2) * (ui.defaultQueueOptions.height! + 20),
    width: 1500,
    // ...
  })
  // drawQueues(canvas)
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
    drawQueue(v, canvas, {
      top: (ui.defaultQueueOptions.height! + 20) * i + 10, left: 100,
    })
  })
}

function drawQueue(value: Queue, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let items: fabric.Object[] = []
  let count = 0
  const nametext = new fabric.Text(`${value.name}`, {
    fontSize: ui.textOptions.fontSize!,
    originX: 'center',
    originY: 'left',
    fill: '#f1ca17',
    top: (ui.textOptions.fontSize! + 10) * count++,
  })
  if (value instanceof ReadyQueue) {
    const pritext = new fabric.Text(`优先级:${value.priority}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
    const timetext = new fabric.Text(`时间片长度:${value.timeSlice}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
    items.push(pritext, timetext)
  }
  const sizetext = new fabric.Text(`队列长度:${value.size}`, {
    fontSize: ui.textOptions.fontSize!,
    originX: 'center',
    originY: 'left',
    top: (ui.textOptions.fontSize! + 10) * count++,
  })
  const rect = new fabric.Rect(Object.assign({ }, ui.queueOptions.get(value.category)))
  items = [rect, nametext, sizetext, ...items]
  const group = new fabric.Group(items, options)
  value.group = group
  canvas.add(group)
}

function drawProcess(value: Process, canvas: fabric.Canvas, option: fabric.IGroupOptions = {}) {

}

function addProcess() {
  if (!canvas)
    return
  const modifySetting = () => {
    if (!processSetting.value.name.trim())
      processSetting.value.name = `进程${processSetting.value.total}`
    processSetting.value.taskTime = Number(processSetting.value.taskTime.toFixed(1))
  }
  const checkSetting = () => {
    if (processes.findIndex((value) => {
      return processSetting.value.name === value.name
    }) >= 0 || processSetting.value.taskTime <= 0)
      return false
    return true
  }
  if (checkSetting()) {
    modifySetting()
    const newPro = new Process(processSetting.value.name, processSetting.value.taskTime)
    processes.push(newPro)
    drawProcess(newPro, canvas)
    processSetting.value.total++
    processSetting.value.total++
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保进程名称唯一并且进程时间片大于0')
  }
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
