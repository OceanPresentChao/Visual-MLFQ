import type { fabric } from 'fabric'
import type { QueueType } from '@/class/Queue'
import type { ProcessStatus } from '@/class/Process'
import type { IOStatus } from '@/class/IO'
const defaultQueueOptions: fabric.IRectOptions = {
  height: 110,
  width: 500,
  strokeWidth: 5,
}
const queueUI: Map<QueueType, fabric.IRectOptions> = new Map()
queueUI.set('ready', {
  fill: '#18ee317b',
  stroke: '#229453ad',
})
queueUI.set('wait', {
  fill: '#38bbf869',
  stroke: '#15559aaa',
})
queueUI.set('running', {
  fill: '#f12f7665',
  stroke: '#b5176c8b',
})
queueUI.set('IO', {
  fill: '#f8e5146b',
  stroke: '#f37e118c',
})

const processUI: Map<ProcessStatus, fabric.IGroupOptions> = new Map()
processUI.set('ready', {
  fill: '#66c18c',
  stroke: '#229453',
})
processUI.set('wait', {
  fill: '#2b73af',
  stroke: '#15559a',
})
processUI.set('running', {
  fill: '#D81B60',
  stroke: '#880E4F',
})
processUI.set('finished', {
  fill: '#b7ed17',
  stroke: '#ede618',
})

const IOUI: Map<IOStatus, fabric.IGroupOptions> = new Map()
IOUI.set('wait', {
  fill: '#2b73af',
  stroke: '#15559a',
})
IOUI.set('running', {
  fill: '#D81B60',
  stroke: '#880E4F',
})
IOUI.set('finished', {
  fill: '#b7ed17',
  stroke: '#ede618',
})

const textOptions: fabric.ITextOptions = {
  fontSize: 20,
}

export { queueUI, defaultQueueOptions, textOptions, processUI, IOUI }
