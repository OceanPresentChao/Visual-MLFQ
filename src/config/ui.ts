import type { fabric } from 'fabric'
import type{ QueueType } from '@/class/Queue'

const defaultQueueOptions: fabric.IRectOptions = {
  height: 100,
  width: 500,
  strokeWidth: 5,
}
const queueOptions: Map<QueueType, fabric.IRectOptions> = new Map()
queueOptions.set('ready', Object.assign({}, defaultQueueOptions, {
  fill: '#66c18c',
  stroke: '#229453',
}))
queueOptions.set('wait', Object.assign({}, defaultQueueOptions, {
  fill: '#2b73af',
  stroke: '#15559a',
}))
queueOptions.set('running', Object.assign({}, defaultQueueOptions, {
  fill: '#D81B60',
  stroke: '#880E4F',
}))

const textOptions: fabric.ITextOptions = {
  fontSize: 20,
}

export { queueOptions, defaultQueueOptions, textOptions }
