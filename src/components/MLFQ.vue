<script setup lang="ts">
import { fabric } from 'fabric'
import { getCurrentInstance, onMounted } from 'vue'
import { ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'
import type{ Queue } from '@/class/Queue'
import * as ui from '@/config/ui'
const emits = defineEmits(['changestatus'])
const { proxy } = getCurrentInstance()!
// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const readyQueueSetting = proxy?.$readyQueueSetting!
const readyQueues: ReadyQueue[] = []
const waitQueue = new WaitQueue('等待队列')
const runningQueue = new RunningQueue('运行队列')
initReadyQueues()

onMounted(() => {
  const canvas = new fabric.Canvas('c', {
    backgroundColor: 'rgb(100,100,200)',
    selectionLineWidth: 2,
    height: (readyQueues.length + 2) * (ui.defaultQueueOptions.height! + 20),
    width: 1500,
    // ...
  })
  drawQueues(canvas)
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

function drawQueues(canvas: fabric.Canvas) {
  const queues: Queue[] = [...readyQueues, waitQueue, runningQueue]
  queues.forEach((v, i) => {
    let items: fabric.Object[] = []
    let count = 0
    const nametext = new fabric.Text(`${v.name}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      fill: '#f1ca17',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
    if (v instanceof ReadyQueue) {
      const pritext = new fabric.Text(`优先级:${v.priority}`, {
        fontSize: ui.textOptions.fontSize!,
        originX: 'center',
        originY: 'left',
        top: (ui.textOptions.fontSize! + 10) * count++,
      })
      const timetext = new fabric.Text(`时间片长度:${v.timeSlice}`, {
        fontSize: ui.textOptions.fontSize!,
        originX: 'center',
        originY: 'left',
        top: (ui.textOptions.fontSize! + 10) * count++,
      })
      items.push(pritext, timetext)
    }
    const sizetext = new fabric.Text(`队列长度:${v.size}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
    const rect = new fabric.Rect(Object.assign({ }, ui.queueOptions.get(v.category)))
    items = [rect, nametext, sizetext, ...items]
    const group = new fabric.Group(items, {
      top: (ui.defaultQueueOptions.height! + 20) * i + 10, left: 100,
    })
    canvas.add(group)
  })
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
  </div>
</template>

<style scoped>
</style>
