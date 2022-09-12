import type { fabric } from 'fabric'
import type { QueueType } from '@/class/Queue'
import type { ProcessStatus } from '@/class/Process'
import type { IOStatus } from '@/class/IO'
const defaultQueueOptions: fabric.IRectOptions = {
  height: 100,
  width: 500,
  strokeWidth: 5,
}
const queueUI: Map<QueueType, fabric.IRectOptions> = new Map()
queueUI.set('ready', {
  fill: '#66c18c',
  stroke: '#229453',
})
queueUI.set('wait', {
  fill: '#2b73af',
  stroke: '#15559a',
})
queueUI.set('running', {
  fill: '#D81B60',
  stroke: '#880E4F',
})

const defaultProcessOptions: fabric.ICircleOptions = {
  radius: 50,
  strokeWidth: 5,
}

const processUI: Map<ProcessStatus, fabric.ICircleOptions> = new Map()
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

const defaultIOOptions: fabric.ITriangleOptions = {
  width: 80,
  height: 80,
  strokeWidth: 5,
}

const IOUI: Map<IOStatus, fabric.ITriangleOptions> = new Map()
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

export { queueUI, defaultQueueOptions, textOptions, defaultProcessOptions, processUI, defaultIOOptions, IOUI }
