import { fabric } from 'fabric'
import type { MLFQContext } from './logitc'
import type { IO } from '@/class/IO'
import * as ui from '@/config/ui'
import { type Queue, ReadyQueue } from '@/class/Queue'
import type { Process } from '@/class/Process'
export interface RenderContext {
  queue2Group: Map<Queue, ReturnType<typeof drawQueue>>
  process2Group: Map<Process, ReturnType<typeof drawProcess>>
  IO2Group: Map<IO, ReturnType<typeof drawIO>>
  canvas: fabric.Canvas | null
}
export function drawQueue(value: Queue, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let count = 0
  const nameText = new fabric.IText(`${value.name}`, {
    fontSize: ui.textOptions.fontSize!,
    originX: 'center',
    originY: 'left',
    fill: '#f1ca17',
    top: (ui.textOptions.fontSize! + 10) * count++,
  })
  const sizeText = new fabric.IText(`队列长度:${value.size()}`, {
    fontSize: ui.textOptions.fontSize!,
    originX: 'center',
    originY: 'left',
    top: (ui.textOptions.fontSize! + 10) * count++,
  })
  let priorityText: fabric.IText | null = null
  let sliceText: fabric.IText | null = null
  if (value instanceof ReadyQueue) {
    priorityText = new fabric.IText(`优先级:${value.priority}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
    sliceText = new fabric.IText(`时间片长度:${value.timeSlice}`, {
      fontSize: ui.textOptions.fontSize!,
      originX: 'center',
      originY: 'left',
      top: (ui.textOptions.fontSize! + 10) * count++,
    })
  }
  const rect = new fabric.Rect(Object.assign({}, ui.defaultQueueOptions))
  const items = [rect, nameText, sizeText, priorityText, sliceText].filter(v => v !== null) as fabric.Object[]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    rect, nameText, sizeText, priorityText, sliceText, group,
  }
}

export function renderQueue(value: Queue, group: ReturnType<typeof drawQueue>) {
  if (!group)
    return
  group.nameText.set('text', `${value.name}`)
  group.sizeText.set('text', `队列长度:${value.size()}`)
  if (value instanceof ReadyQueue) {
    group.priorityText!.set('text', `优先级:${value.priority}`)
    group.sliceText!.set('text', `时间片长度:${value.timeSlice}`)
  }
  group.rect.set(ui.queueUI.get(value.category)!)
}

export function drawProcess(value: Process, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let count = 0
  const circle = new fabric.Circle({
    radius: 50,
    fill: 'green',
  })
  const nameText = new fabric.IText(`${value.name}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const totalText = new fabric.IText(`任务总时间:${value.taskTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const remainText = new fabric.IText(`任务剩余时间:${value.remainingTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const sliceText = new fabric.IText(`时间片剩余时间:${value.remainSliceTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const items: fabric.Object[] = [circle, nameText, totalText, remainText, sliceText]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    circle, nameText, totalText, remainText, sliceText, group,
  }
}

export function renderProcess(value: Process, group: ReturnType<typeof drawProcess>) {
  if (!group)
    return
  group.nameText.set('text', `进程名称:${value.name}`)
  group.totalText.set('text', `任务总时间:${value.taskTime}`)
  group.remainText.set('text', `任务剩余时间:${value.remainingTime}`)
  group.sliceText.set('text', `时间片剩余时间:${value.remainSliceTime}`)
  if (value.status === 'finished')
    group.nameText.set('text', `进程名称:${value.name}(已完成)`)
  group.circle.set(ui.processUI.get(value.status)!)
}

export function drawIO(value: IO, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let count = 0
  const triangle = new fabric.Triangle({
    width: 80,
    height: 80,
    fill: '#c10e8b',
  })
  const nameText = new fabric.IText(`${value.name}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const totalText = new fabric.IText(`任务总时间:${value.requestTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const remainText = new fabric.IText(`任务剩余时间:${value.remainingTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const items: fabric.Object[] = [triangle, nameText, totalText, remainText]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    triangle, nameText, totalText, remainText, group,
  }
}

export function renderIO(value: IO, group: ReturnType<typeof drawIO>) {
  if (!group)
    return
  group.nameText.set('text', `进程名称:${value.name}`)
  group.totalText.set('text', `任务总时间:${value.requestTime}`)
  group.remainText.set('text', `任务剩余时间:${value.remainingTime}`)
  if (value.status === 'finished')
    group.nameText.set('text', `进程名称:${value.name}(已完成)`)
  group.triangle.set(ui.processUI.get(value.status)!)
}

export function animateProcess(value: Process, renderContext: RenderContext, mlfqContext: MLFQContext) {
  const aniOption: Record<string, number | string> = {}
  const { readyQueues, runningQueue, waitQueue } = mlfqContext
  const { process2Group, queue2Group, canvas } = renderContext
  if (value.queueIndex < 0 || !canvas)
    return
  const pGroup = process2Group.get(value)!
  if (value.status === 'ready') {
    const queue = readyQueues[value.queueIndex]
    const index = queue.value.list.findIndex(v => v.value.id === value.id)
    const qGroup = queue2Group.get(queue.value)!
    aniOption.left = qGroup.group.left! + 120
    aniOption.left += (ui.defaultProcessOptions.radius! * index * 2)
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'running') {
    const qGroup = queue2Group.get(runningQueue.value)!
    aniOption.left = qGroup.group.left! + 60
    aniOption.left += ui.defaultProcessOptions.radius! * runningQueue.value.list.length
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'wait') {
    const qGroup = queue2Group.get(waitQueue.value)!
    aniOption.left = qGroup.group.left! + 60
    aniOption.left += ui.defaultProcessOptions.radius! * runningQueue.value.list.length
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'finished') {
    aniOption.left = 1000
  }
  pGroup.group.animate(aniOption, {
    duration: 100,
    onChange: canvas.renderAll.bind(canvas),
  })
}
