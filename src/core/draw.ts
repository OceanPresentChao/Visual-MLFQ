import { fabric } from 'fabric'
import * as _ from 'lodash'
import type { MLFQContext } from './logitc'
import { SVGs } from './svg'
import type { IO } from '@/class/IO'
import * as ui from '@/config/ui'
import { type Queue, ReadyQueue } from '@/class/Queue'
import type { Process } from '@/class/Process'
export interface RenderContext {
  queue2Group: Map<string, ReturnType<typeof drawQueue>>
  process2Group: Map<string, ReturnType<typeof drawProcess>>
  IO2Group: Map<string, ReturnType<typeof drawIO>>
  canvas: fabric.Canvas | null
}
export function drawQueue(value: Queue<Process> | Queue<IO>, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
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

export function renderQueue(value: Queue<Process> | Queue<IO>, group: ReturnType<typeof drawQueue>) {
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
  const canvEl = new fabric.Group(_.cloneDeep(SVGs.get('process')!))
  const nameText = new fabric.IText(`${value.name}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const totalText = new fabric.IText(`任务总时间:${value.taskTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const remainText = new fabric.IText(`任务剩余时间:${value.remainingTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const sliceText = new fabric.IText(`时间片剩余时间:${value.remainSliceTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const items: fabric.Object[] = [canvEl, nameText, totalText, remainText, sliceText]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    canvEl, nameText, totalText, remainText, sliceText, group,
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
  // group.circle.set(ui.processUI.get(value.status)!)
  group.canvEl._objects.forEach((obj) => {
    if (obj.fill)
      obj.set(ui.processUI.get(value.status)!)
  })
}

export function drawIO(value: IO, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let count = 0
  const canvEl = new fabric.Group(_.cloneDeep(SVGs.get('IO')!))
  const nameText = new fabric.IText(`${value.name}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const totalText = new fabric.IText(`任务总时间:${value.requestTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const remainText = new fabric.IText(`任务剩余时间:${value.remainingTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const items: fabric.Object[] = [canvEl, nameText, totalText, remainText]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    canvEl, nameText, totalText, remainText, group,
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
  group.canvEl._objects.forEach((obj) => {
    if (obj.fill)
      obj.set(ui.IOUI.get(value.status)!)
  })
}

export function animateProcess(value: Process, renderContext: RenderContext, mlfqContext: MLFQContext) {
  const aniOption: Record<string, number | string> = {}
  const { readyQueues, runningQueue, waitQueue } = mlfqContext
  const { process2Group, queue2Group, canvas } = renderContext
  if (value.queueIndex < 0 || !canvas)
    return
  const pGroup = process2Group.get(value.id)!
  if (value.status === 'ready') {
    const queue = readyQueues[value.queueIndex]
    const index = queue.value.list.findIndex(v => v === value)
    const qGroup = queue2Group.get(queue.value.id)!
    aniOption.left = qGroup.group.left!
    aniOption.left += pGroup.group.width! * (index + 1)
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'running') {
    const qGroup = queue2Group.get(runningQueue.value.id)!
    aniOption.left = qGroup.group.left!
    aniOption.left += pGroup.group.width! * runningQueue.value.list.length
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'wait') {
    const qGroup = queue2Group.get(waitQueue.value.id)!
    aniOption.left = qGroup.group.left!
    aniOption.left += pGroup.group.width! * waitQueue.value.list.length
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'finished') {
    // aniOption.left = 1000
    canvas.remove(pGroup.group)
  }
  pGroup.group.animate(aniOption, {
    duration: 100,
    onChange: canvas.renderAll.bind(canvas),
  })
}

export function animateIO(value: IO, renderContext: RenderContext, mlfqContext: MLFQContext) {
  const aniOption: Record<string, number | string> = {}
  const { ioQueue } = mlfqContext
  const { IO2Group, queue2Group, canvas } = renderContext
  if (!canvas)
    return
  const iGroup = IO2Group.get(value.id)!
  const qGroup = queue2Group.get(ioQueue.value.id)!
  if (value.status === 'running') {
    aniOption.left = qGroup.group.left!
    aniOption.left += iGroup.group.width! * ioQueue.value.runningList.length
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'wait') {
    const index = ioQueue.value.list.findIndex(v => v === value)
    aniOption.left = qGroup.group.left!
    aniOption.left += iGroup.group.width! * (index + 2)
    aniOption.top = qGroup.group.top! + 15
  }
  else if (value.status === 'finished') {
    // aniOption.left = 1000
    canvas.remove(iGroup.group)
  }
  iGroup.group.animate(aniOption, {
    duration: 100,
    onChange: canvas.renderAll.bind(canvas),
  })
}

