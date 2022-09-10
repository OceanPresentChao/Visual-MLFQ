import { fabric } from 'fabric'
import * as ui from '@/config/ui'
import { type Queue, ReadyQueue } from '@/class/Queue'
import type { Process } from '@/class/Process'
export function drawQueue(value: Queue, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  let count = 0
  const nameText = new fabric.IText(`${value.name}`, {
    fontSize: ui.textOptions.fontSize!,
    originX: 'center',
    originY: 'left',
    fill: '#f1ca17',
    top: (ui.textOptions.fontSize! + 10) * count++,
  })
  const sizeText = new fabric.IText(`队列长度:${value.size}`, {
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
  const rect = new fabric.Rect(Object.assign({}, ui.queueOptions.get(value.category)))
  const items = [rect, nameText, sizeText, priorityText, sliceText].filter(v => v !== null) as fabric.Object[]
  const group = new fabric.Group(items, options)
  canvas.add(group)
  return {
    rect, nameText, sizeText, priorityText, sliceText,
  }
}

export function renderQueue(value: Queue, group: ReturnType<typeof drawQueue>) {
  if (!value.group)
    return
  group.nameText.set('text', `${value.name}`)
  group.sizeText.set('text', `队列长度:${value.size}`)
  if (value instanceof ReadyQueue) {
    group.priorityText!.set('text', `优先级:${value.priority}`)
    group.sliceText!.set('text', `时间片长度:${value.timeSlice}`)
  }
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
    circle, nameText, totalText, remainText, sliceText,
  }
}

export function renderProcess(value: Process, group: ReturnType<typeof drawProcess>) {
  if (!group)
    return
  group.nameText.set('text', `进程名称:${value.name}`)
  group.totalText.set('text', `任务总时间:${value.taskTime}`)
  group.remainText.set('text', `任务剩余时间:${value.remainingTime}`)
  group.sliceText.set('text', `时间片剩余时间:${value.remainSliceTime}`)
}
