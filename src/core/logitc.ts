import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
import type { IO } from '@/class/IO'
import type { IOQueue, ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'

export interface MLFQContext {
  processes: Ref<Process>[]
  readyQueues: Ref<ReadyQueue>[]
  runningQueue: Ref<RunningQueue>
  waitQueue: Ref<WaitQueue>
  ioQueue: Ref<IOQueue>
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
      if (process.value.remainingTime > 0) {
        if (process.value.remainSliceTime <= 0) {
          // 若还未到最下级就绪队列则下移，否则一直呆在最底层
          queueIndex = queueIndex < readyQueues.length - 1 ? queueIndex + 1 : readyQueues.length - 1
          process.value.remainSliceTime = readyQueues[queueIndex].value.timeSlice
          readyQueues[queueIndex].value.list.push(process)
        }
        else {
          readyQueues[queueIndex].value.list.unshift(process)
        }
      }
      else {
        return
      }
    }
    process.value.queueIndex = queueIndex
    process.value.status = 'ready'
    const nextProcess = chooseReadyProcess(context)
    if (nextProcess)
      runProcess(nextProcess, context)
  }
  catch (error) {
    console.error(error)
  }
}

export function runProcess(process: Ref<Process>, context: MLFQContext) {
  if (process.value.queueIndex < 0)
    throw new Error('进程运行前未被加入就绪队列')
  const { runningQueue } = context
  if (runningQueue.value.list.length > 0 || process.value.status === 'running')
    return
  removeProcess(process, context)
  runningQueue.value.list.push(process)
  process.value.status = 'running'
  runningQueue.value.clearTimer()
  const timer = setInterval(() => {
    process.value.remainSliceTime -= 0.1
    process.value.remainingTime -= 0.1
    process.value.modifyTime()
    if (process.value.remainingTime <= 0 || process.value.remainSliceTime <= 0) {
      runningQueue.value.clearTimer()
      removeProcess(process, context)
      // 如果时间片用完任务仍未结束则加入下一级就绪队列
      if (process.value.remainingTime > 0)
        insertReadyProcess(process, context)
      else
        process.value.status = 'finished'
      const nextProcess = chooseReadyProcess(context)
      if (nextProcess)
        runProcess(nextProcess, context)
    }
  }, 100)
  runningQueue.value.timer = timer
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
  if (process.value.status === 'ready') { readyQueue.value.list.splice(readyQueue.value.list.findIndex(v => v === process), 1) }
  else if (process.value.status === 'running') {
    if (runningQueue.value.timer !== null)
      runningQueue.value.clearTimer()
    runningQueue.value.list.splice(runningQueue.value.list.findIndex(v => v === process), 1)
  }
  else if (process.value.status === 'wait') { waitQueue.value.list.splice(waitQueue.value.list.findIndex(v => v === process), 1) }
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

export function insertIO(io: Ref<IO>, context: MLFQContext) {
  const { ioQueue, runningQueue } = context
  if (runningQueue.value.list.length) {
    const process = runningQueue.value.list[0]
    insertWaitProcess(process, context)
  }

  ioQueue.value.insertWaitIO(io)
  if (!ioQueue.value.runningList.length
    || (ioQueue.value.runningList.length > 0 && io.value.priority > ioQueue.value.runningList[0].value.priority))
    runIO(io, context)
}

export function runIO(io: Ref<IO>, context: MLFQContext) {
  const { ioQueue, runningQueue, waitQueue } = context
  if (io.value.status !== 'wait')
    return
  if (runningQueue.value.list.length)
    insertWaitProcess(runningQueue.value.list[0], context)
  ioQueue.value.runningList.splice(
    ioQueue.value.runningList.findIndex(v => v === io)
    , 1)
  if (!ioQueue.value.runningList.length) {
    ioQueue.value.runningList.push(io)
  }
  else {
    const runningIO = ioQueue.value.runningList[0]
    runningIO.value.status = 'wait'
    ioQueue.value.insertWaitIO(runningIO)
    ioQueue.value.runningList.splice(0, 1, io)
  }
  ioQueue.value.clearTimer()
  io.value.status = 'running'
  const timer = setInterval(() => {
    io.value.remainingTime -= 0.1
    io.value.modifyTime()
    if (io.value.remainingTime <= 0) {
      ioQueue.value.clearTimer()
      ioQueue.value.list.splice(ioQueue.value.list.findIndex(v => v === io), 1)
      io.value.status = 'finished'
      if (ioQueue.value.list.length)
        runIO(ioQueue.value.list[0], context)

      else if (waitQueue.value.list.length)
        runProcess(waitQueue.value.list[0], context)
    }
  }, 100)
  ioQueue.value.timer = timer
}
