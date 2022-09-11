import type { Ref } from 'vue'
import type { RunningQueue, WaitQueue } from './../class/Queue'
import type { Process } from '@/class/Process'
import type { ReadyQueue } from '@/class/Queue'

export interface MLFQContext {
  processes: Ref<Process>[]
  readyQueues: Ref<ReadyQueue>[]
  runningQueue: Ref<RunningQueue>
  waitQueue: Ref<WaitQueue>
}

export function insertReadyProcess(process: Ref<Process>, context: MLFQContext) {
  try {
    removeProcess(process, context)
    const { readyQueues } = context
    let queueIndex = process.value.queueIndex
    if (queueIndex < 0) {
      queueIndex = 0
      process.value.remainSliceTime = readyQueues[queueIndex].value.timeSlice
      readyQueues[queueIndex].value.list.push(process)
    }
    else {
      if (process.value.remainSliceTime <= 0) {
        queueIndex++
        process.value.remainSliceTime = readyQueues[queueIndex].value.timeSlice
        readyQueues[queueIndex].value.list.push(process)
      }
      else {
        readyQueues[queueIndex].value.list.unshift(process)
      }
    }
    process.value.queueIndex = queueIndex
    process.value.status = 'ready'
    runProcess(process, context)
  }
  catch (error) {
    console.error(error)
    return null
  }
}

export function runProcess(process: Ref<Process>, context: MLFQContext) {
  if (process.value.queueIndex < 0)
    throw new Error('进程运行前未被加入就绪队列')
  const { runningQueue } = context
  if (runningQueue.value.list.length > 0)
    return
  removeProcess(process, context)
  runningQueue.value.list.push(process)
  process.value.status = 'running'
  const timer = setInterval(() => {
    process.value.remainSliceTime -= 0.1
    process.value.remainingTime -= 0.1
    process.value.modifyTime()
    if (process.value.remainingTime <= 0 || process.value.remainSliceTime <= 0) {
      clearInterval(timer)
      removeProcess(process, context)
      const nextProcess = chooseReadyProcess(context)
      if (nextProcess)
        runProcess(nextProcess, context)
    }
  }, 100)
  return timer
}

export function insertWaitProcess(process: Ref<Process>, context: MLFQContext) {
  removeProcess(process, context)
  const { waitQueue } = context
  waitQueue.value.list.push(process)
  process.value.status = 'wait'
}

export function removeProcess(process: Ref<Process>, context: MLFQContext) {
  if (process.value.queueIndex < 0)
    return
  const { readyQueues, runningQueue, waitQueue } = context
  const readyQueue = readyQueues[process.value.queueIndex]
  if (process.value.status === 'ready')
    readyQueue.value.list.splice(readyQueue.value.list.findIndex(v => v === process), 1)
  else if (process.value.status === 'running')
    runningQueue.value.list.splice(runningQueue.value.list.findIndex(v => v === process), 1)
  else if (process.value.status === 'wait')
    waitQueue.value.list.splice(waitQueue.value.list.findIndex(v => v === process), 1)
}

function chooseReadyProcess(context: MLFQContext) {
  const { readyQueues } = context
  let readyProcess: Ref<Process> | null = null
  readyQueues.forEach((q) => {
    if (!readyProcess && q.value.list.length > 0)
      readyProcess = q.value.list[0]
  })
  return readyProcess
}
