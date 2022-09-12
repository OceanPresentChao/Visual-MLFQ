<script setup lang="ts">
import { fabric } from 'fabric'
import { type Ref, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { type Queue, ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'
import { Process } from '@/class/Process'
import { IO } from '@/class/IO'
import { drawIO, drawProcess, drawQueue, renderIO, renderProcess, renderQueue } from '@/core/draw'
import * as ui from '@/config/ui'
import { insertReadyProcess, runProcess } from '@/core/logitc'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting!
interface AddSetting {
  name: string
  time: number
  total: number
  count: number
}
const processSetting: Ref<AddSetting> = ref({
  name: '',
  time: 1,
  total: 0,
  count: 0,
})
const IOSetting: Ref<AddSetting> = ref({
  name: '',
  time: 1,
  total: 0,
  count: 0,
})
const processes: Ref<Process>[] = []
const IOs: Ref<IO>[] = []
const readyQueues: Ref<ReadyQueue>[] = []
const waitQueue = ref(new WaitQueue('等待队列'))
const runningQueue = ref(new RunningQueue('运行队列'))
const queue2Group: Map<Queue, ReturnType<typeof drawQueue>> = new Map()
const process2Group: Map<Process, ReturnType<typeof drawProcess>> = new Map()
const IO2Group: Map<IO, ReturnType<typeof drawIO>> = new Map()
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
    const newqueue = ref(new ReadyQueue(item.priority, item.timeSlice, `就绪队列${index}`))
    readyQueues.push(newqueue)
  })
  readyQueues.sort((a: Ref<ReadyQueue>, b: Ref<ReadyQueue>) => {
    return b.value.priority - a.value.priority
  })
}

function drawAllQueues(canvas: fabric.Canvas) {
  const queues: Ref<Queue>[] = [...readyQueues, waitQueue, runningQueue]
  queues.forEach((q, i) => {
    const group = drawQueue(q.value, canvas, {
      top: (ui.defaultQueueOptions.height! + 20) * i + 10, left: 100,
    })
    watch(q, (v) => {
      renderQueue(v, group)
      canvas?.renderAll()
    }, { immediate: true, deep: true })
    queue2Group.set(q.value, group)
  })
}

function addProcess() {
  if (!canvas)
    return
  if (checkSetting(processSetting, processes)) {
    modifySetting(processSetting)
    const newPro = ref(new Process(processSetting.value.name, processSetting.value.time))
    processes.push(newPro)
    const group = drawProcess(newPro.value, canvas!)
    watch((newPro), (v) => {
      renderProcess(v, group)
      canvas?.renderAll()
    }, { immediate: true, deep: true })
    process2Group.set(newPro.value, group)
    insertReadyProcess(newPro, { readyQueues, runningQueue, waitQueue, processes })
    processSetting.value.count++
    processSetting.value.total++
    processSetting.value.name = ''
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保进程名称唯一并且进程时间片大于0')
  }
}

function addIO() {
  if (!canvas)
    return
  if (checkSetting(IOSetting, IOs)) {
    modifySetting(IOSetting)
    const newIO = ref(new IO(IOSetting.value.name, IOSetting.value.time))
    IOs.push(newIO)
    const group = drawIO(newIO.value, canvas!)
    watch((newIO), (v) => {
      renderIO(v, group)
      canvas?.renderAll()
    }, { immediate: true, deep: true })
    IO2Group.set(newIO.value, group)
    IOSetting.value.count++
    IOSetting.value.total++
    IOSetting.value.name = ''
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保进程名称唯一并且进程时间片大于0')
  }
}

function modifySetting(setting: Ref<AddSetting>) {
  if (!setting.value.name.trim())
    setting.value.name = `进程${setting.value.total}`
  setting.value.time = Number(setting.value.time.toFixed(1))
}
function checkSetting(setting: Ref<AddSetting>, arr: Ref<Process>[] | Ref<IO>[]) {
  if (arr.findIndex((v) => {
    return setting.value.name === v.value.name
  }) >= 0 || setting.value.time <= 0)
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
      <div>
        <label>进程名称: </label>
        <input v-model="processSetting.name" type="text">
        <label>进程任务总时间: </label>
        <input v-model="processSetting.time" type="number" :min="1" :step="0.1">
        <button @click="addProcess">
          添加进程
        </button>
      </div>
      <div>
        <label>IO名称: </label>
        <input v-model="IOSetting.name" type="text">
        <label>IO总时间: </label>
        <input v-model="IOSetting.time" type="number" :min="1" :step="0.1">
        <button @click="addIO">
          添加IO请求
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
