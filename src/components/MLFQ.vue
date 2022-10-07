<script setup lang="ts">
import { fabric } from 'fabric'
import { type Ref, getCurrentInstance, onMounted, ref, watch } from 'vue'
import Statistic from './Statistic.vue'
import type { Queue } from '@/class/Queue'
import { IOQueue, ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'
import { Process } from '@/class/Process'
import { IO } from '@/class/IO'
import type { RenderContext } from '@/core/draw'
import type { MLFQContext } from '@/core/logitc'
import * as draw from '@/core/draw'
import * as ui from '@/config/ui'
import { insertIO, insertReadyProcess, startQueueTimers } from '@/core/logitc'
import type { ReadyQueueSetting } from '@/config'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting! as Ref<ReadyQueueSetting[]>
interface AddSetting {
  name: string
  time: number
  total: number
  count: number
  priority?: number
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
  priority: 1,
})
const processes: Ref<Process[]> = ref([])
const IOs: Ref<IO[]> = ref([])
const readyQueues: Ref<ReadyQueue>[] = []
const waitQueue = ref(new WaitQueue('等待队列'))
const runningQueue = ref(new RunningQueue('运行队列'))
const ioQueue = ref(new IOQueue('IO队列'))
const mlfqContext: MLFQContext = {
  readyQueues, waitQueue, runningQueue, ioQueue,
}
const queue2Group: Map<string, ReturnType<typeof draw.drawQueue>> = new Map()
const process2Group: Map<string, ReturnType<typeof draw.drawProcess>> = new Map()
const IO2Group: Map<string, ReturnType<typeof draw.drawIO>> = new Map()
let canvas: fabric.Canvas | null = null
const renderContext: RenderContext = {
  queue2Group, process2Group, IO2Group, canvas,
}
const isMenuVis = ref(false)

onMounted(() => {
  initReadyQueues()
  canvas = new fabric.Canvas('c', {
    selectionLineWidth: 2,
    height: (readyQueues.length + 3) * (ui.defaultQueueOptions.height! + 30),
    width: ui.defaultCanvasOptions.width!,
    // ...
  })
  renderContext.canvas = canvas
  drawAllQueues(canvas)
  startQueueTimers(mlfqContext)
})

function initReadyQueues() {
  readyQueueSetting.value.forEach((item: { priority: number; timeSlice: number }, index: number) => {
    const newqueue = ref(new ReadyQueue(item.priority, item.timeSlice, `就绪队列${index}`))
    readyQueues.push(newqueue)
  })
  readyQueues.sort((a: Ref<ReadyQueue>, b: Ref<ReadyQueue>) => {
    return b.value.priority - a.value.priority
  })
}

function drawAllQueues(canvas: fabric.Canvas) {
  const queues: Ref<Queue<IO> | Queue<Process>>[] = [...readyQueues, waitQueue, runningQueue, ioQueue]
  queues.forEach((q, i) => {
    const group = draw.drawQueue(q.value, canvas, {
      top: (ui.defaultQueueOptions.height! + 20) * i + 10, left: 100,
    })
    queue2Group.set(q.value.id, group)
    watch(q, (v) => {
      draw.renderQueue(v, group)
      if (v instanceof ReadyQueue || v instanceof RunningQueue || v instanceof WaitQueue) {
        for (const pro of v.list) {
          const proGroup = process2Group.get(pro.id)
          if (proGroup) {
            draw.renderProcess(pro, proGroup)
            draw.animateProcess(pro, renderContext, mlfqContext)
          }
        }
      }
      if (v instanceof IOQueue) {
        for (const io of [...v.runningList, ...v.list]) {
          const ioGroup = IO2Group.get(io.id)
          if (ioGroup) {
            draw.renderIO(io, ioGroup)
            draw.animateIO(io, renderContext, mlfqContext)
          }
        }
      }
      canvas?.renderAll()
    }, { immediate: true, deep: true })
  })
}

function addProcess() {
  if (!canvas)
    return
  if (checkSetting(processSetting, processes)) {
    modifySetting(processSetting, 'process')
    const newPro = new Process(processSetting.value.name, processSetting.value.time)
    const group = draw.drawProcess(newPro, canvas!)
    process2Group.set(newPro.id, group)
    processes.value.push(newPro)
    insertReadyProcess(newPro, mlfqContext)
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
    modifySetting(IOSetting, 'IO')
    const newIO = new IO(IOSetting.value.name, IOSetting.value.time, IOSetting.value.priority!)
    const group = draw.drawIO(newIO, canvas!)
    IO2Group.set(newIO.id, group)
    IOs.value.push(newIO)
    insertIO(newIO, mlfqContext)
    IOSetting.value.count++
    IOSetting.value.total++
    IOSetting.value.name = ''
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请确保IO名称唯一并且时间和优先级大于0')
  }
}

function modifySetting(setting: Ref<AddSetting>, type: 'IO' | 'process') {
  if (!setting.value.name.trim())
    setting.value.name = `${type}${setting.value.total}`
  setting.value.time = Number(setting.value.time.toFixed(1))
  if (setting.value.priority)
    setting.value.priority = Math.ceil(setting.value.priority)
}
function checkSetting(setting: Ref<AddSetting>, arr: Ref<Process[]> | Ref<IO[]>) {
  if (arr.value.findIndex(v => setting.value.name === v.name) >= 0
  || setting.value.time <= 0
  || (setting.value.priority && setting.value.priority <= 0))
    return false
  return true
}

function toggleStatistic() {
  isMenuVis.value = !isMenuVis.value
}
</script>

<template>
  <div>
    <transition name="fade">
      <Statistic v-if="isMenuVis" :info="processes" @toggle="toggleStatistic" />
    </transition>
    <main>
      <div style="display:flex;">
        <div>
          <button @click="$emit('changestatus', 'setting')">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2 11l7-9v5c11.953 0 13.332 9.678 13 15c-.502-2.685-.735-7-13-7v5l-7-9Z" /></svg>
            返回
          </button>
        </div>
        <div v-if="!isMenuVis" style="margin-left: auto;cursor: pointer;" @click="toggleStatistic">
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M3 2h2v20H3zm7 4h7v2h-7zm0 4h7v2h-7z" /><path fill="currentColor" d="M19 2H6v20h13c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 18H8V4h11v16z" /></svg>
        </div>
      </div>
      <canvas id="c" />
    </main>
    <footer
      style="display:grid;grid-template: repeat(2,1fr)/repeat(4,1fr);row-gap: 1em;padding: 1rem 20%;"
      :style="{ marginRight: isMenuVis ? '25%' : 0, padding: isMenuVis ? '1rem 10%' : '1rem 20%' }"
    >
      <div>
        <label>进程名称: </label>
        <input v-model="processSetting.name" type="text">
      </div>
      <div>
        <label>进程任务总时间: </label>
        <input v-model="processSetting.time" type="number" :min="1" :step="0.1">
      </div>
      <div />
      <div>
        <button class="primary" @click="addProcess">
          添加进程
        </button>
      </div>
      <div>
        <label>IO名称: </label>
        <input v-model="IOSetting.name" type="text">
      </div>
      <div>
        <label>IO总时间: </label>
        <input v-model="IOSetting.time" type="number" :min="1" :step="0.1">
      </div>
      <div>
        <label>IO优先级: </label>
        <input v-model="IOSetting.priority" type="number" :min="1" :step="1">
      </div>
      <div>
        <button class="primary" @click="addIO">
          添加IO请求
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
