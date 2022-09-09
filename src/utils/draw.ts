import { fabric } from 'fabric'
import * as ui from '@/config/ui'
import { type Queue, ReadyQueue } from '@/class/Queue'
import type { Process } from '@/class/Process'
export function drawQueue(value: Queue, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
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
  const rect = new fabric.Rect(Object.assign({}, ui.queueOptions.get(value.category)))
  items = [rect, nametext, sizetext, ...items]
  const group = new fabric.Group(items, options)
  value.group = group
  canvas.add(group)
}

export function drawProcess(value: Process, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
  const items: fabric.Object[] = []
  let count = 0
  const circle = new fabric.Circle({
    radius: 50,
    fill: 'green',
  })
  const totalText = new fabric.IText(`任务总时间:${value.taskTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const remainText = new fabric.IText(`任务剩余时间:${value.remainingTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  const sliceText = new fabric.IText(`时间片剩余时间:${value.sliceTime}`, Object.assign({ top: (ui.textOptions.fontSize! + 10) * count++ }, ui.textOptions))
  items.push(circle, totalText, remainText, sliceText)
  const group = new fabric.Group(items, options)
  canvas.add(group)
}
