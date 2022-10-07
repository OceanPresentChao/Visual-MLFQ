import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
import type { IO } from '@/class/IO'
import type { IOQueue, ReadyQueue, RunningQueue, WaitQueue } from '@/class/Queue'

export interface MLFQContext {
  readyQueues: Ref<ReadyQueue>[]
  runningQueue: Ref<RunningQueue>
  waitQueue: Ref<WaitQueue>
  ioQueue: Ref<IOQueue>
}

export function startQueueTimers(context: MLFQContext) {
  const { readyQueues, runningQueue, waitQueue, ioQueue } = context
  runningQueue.value.timer = setInterval(() => {
    for (const process of runningQueue.value.list) {
      process.runningTime += 0.1
      process.remainingTime -= 0.1
      process.remainSliceTime -= 0.1
      process.modifyTime()
      if (process.remainingTime <= 0 || process.remainSliceTime <= 0) {
        removeProcess(process, context)
        // 如果时间片用完任务仍未结束则加入下一级就绪队列
        if (process.remainingTime > 0) {
          insertReadyProcess(process, context)
        }
        else {
          changeProcess(process, context, 'finished')
          process.endTime = Date.now()
          const nextProcess = chooseReadyProcess(context)
          if (nextProcess)
            runProcess(nextProcess, context)
        }
      }
    }
  }, 100)

  ioQueue.value.timer = setInterval(() => {
    for (const io of ioQueue.value.runningList) {
      io.remainingTime -= 0.1
      io.modifyTime()
      if (io.remainingTime <= 0) {
        changeIO(io, context, 'finished')
        io.endTime = Date.now()
        if (ioQueue.value.list.length) {
          runIO(ioQueue.value.list[0], context)
        }
        else if (waitQueue.value.list.length) {
          runProcess(waitQueue.value.list[0], context)
        }
        else {
          const nextProcess = chooseReadyProcess(context)
          if (nextProcess)
            runProcess(nextProcess, context)
        }
      }
    }
  }, 100)

  waitQueue.value.timer = setInterval(() => {
    // 因为最后一下渲染不出来，需要依靠修改队列触发渲染
    waitQueue.value.list = waitQueue.value.list.filter(v => v.status !== 'finished')
    for (const process of waitQueue.value.list) {
      process.waitTime += 0.1
      process.modifyTime()
    }
  }, 100)

  readyQueues.forEach((queue) => {
    queue.value.timer = setInterval(() => {
      for (const process of queue.value.list) {
        process.readyTime += 0.1
        process.modifyTime()
      }
    }, 100)
  })
}

export function insertReadyProcess(process: Process, context: MLFQContext) {
  try {
    if (process.remainingTime <= 0)
      return
    removeProcess(process, context)
    const { readyQueues } = context
    let queueIndex = process.queueIndex
    if (queueIndex < 0) {
      queueIndex = 0
      process.remainSliceTime = readyQueues[queueIndex].value.timeSlice
      readyQueues[queueIndex].value.list.push(process)
    }
    else {
      if (process.remainSliceTime <= 0) {
        // 若还未到最下级就绪队列则下移，否则一直呆在最底层
        queueIndex = queueIndex < readyQueues.length - 1 ? queueIndex + 1 : readyQueues.length - 1
        process.remainSliceTime = readyQueues[queueIndex].value.timeSlice
        readyQueues[queueIndex].value.list.push(process)
      }
      else {
        // 被io插队重新回来
        readyQueues[queueIndex].value.list.unshift(process)
      }
    }
    process.queueIndex = queueIndex
    process.status = 'ready'
    const nextProcess = chooseReadyProcess(context)
    if (nextProcess)
      runProcess(nextProcess, context)
  }
  catch (error) {
    console.error(error)
  }
}

export function runProcess(process: Process, context: MLFQContext) {
  if (process.queueIndex < 0)
    throw new Error('进程运行前未被加入就绪队列')
  const { runningQueue, ioQueue } = context
  if (runningQueue.value.list.length > 0
    || ioQueue.value.runningList.length > 0
    || ioQueue.value.list.length > 0
    || process.status === 'running'
    || process.status === 'finished')
    return
  changeProcess(process, context, 'running')
}

export function changeProcess(process: Process, context: MLFQContext, status: 'running' | 'wait' | 'finished') {
  removeProcess(process, context)
  const { waitQueue, runningQueue } = context
  if (status === 'running') {
    runningQueue.value.list.push(process)
    process.status = 'running'
  }
  else if (status === 'wait') {
    waitQueue.value.list.push(process)
    process.status = 'wait'
  }
  else if (status === 'finished') {
    process.status = 'finished'
  }
}

export function removeProcess(process: Process, context: MLFQContext) {
  if (process.queueIndex < 0 || process.status === 'finished')
    return
  const { readyQueues, runningQueue, waitQueue } = context
  const readyQueue = readyQueues[process.queueIndex]
  if (process.status === 'ready') {
    const index = readyQueue.value.list.findIndex(v => v.id === process.id)
    readyQueue.value.list.splice(index, index > -1 ? 1 : 0)
  }
  else if (process.status === 'running') {
    const index = runningQueue.value.list.findIndex(v => v.id === process.id)
    runningQueue.value.list.splice(index, index > -1 ? 1 : 0)
  }
  else if (process.status === 'wait') {
    const index = waitQueue.value.list.findIndex(v => v.id === process.id)
    waitQueue.value.list.splice(index, index > -1 ? 1 : 0)
  }
}

function chooseReadyProcess(context: MLFQContext) {
  const { readyQueues } = context
  let readyProcess: Process | null = null
  readyQueues.forEach((q) => {
    if (!readyProcess && q.value.list.length > 0)
      readyProcess = q.value.list[0]
  })
  return readyProcess
}

export function insertIO(io: IO, context: MLFQContext) {
  const { ioQueue } = context
  // 先将io加入io等待队列
  changeIO(io, context, 'wait')
  if (!ioQueue.value.runningList.length
    || (ioQueue.value.runningList.length > 0 && io.priority > ioQueue.value.runningList[0].priority))
    runIO(io, context)
}

export function runIO(io: IO, context: MLFQContext) {
  if (io.status !== 'wait' || io.remainingTime <= 0)
    return
  const { ioQueue, runningQueue } = context
  // 若运行队列有进程，暂停该进程
  if (runningQueue.value.list.length) {
    const process = runningQueue.value.list[0]
    changeProcess(process, context, 'wait')
  }
  if (ioQueue.value.runningList.length) {
    const runningIO = ioQueue.value.runningList[0]
    changeIO(runningIO, context, 'wait')
  }
  changeIO(io, context, 'running')
}

function changeIO(io: IO, context: MLFQContext, status: 'running' | 'wait' | 'finished') {
  removeIO(io, context)
  const { ioQueue } = context
  if (status === 'running') {
    ioQueue.value.runningList.push(io)
    io.status = 'running'
  }
  else if (status === 'wait') {
    ioQueue.value.list.push(io)
    io.status = 'wait'
  }
  else if (status === 'finished') {
    io.status = 'finished'
  }
}

function removeIO(io: IO, context: MLFQContext) {
  if (io.status === 'finished')
    return
  const { ioQueue } = context
  if (io.status === 'running') {
    const index = ioQueue.value.runningList.findIndex(v => v.id === io.id)
    ioQueue.value.runningList.splice(index, index > -1 ? 1 : 0)
  }
  else if (io.status === 'wait') {
    const index = ioQueue.value.list.findIndex(v => v.id === io.id)
    ioQueue.value.list.splice(index, index > -1 ? 1 : 0)
  }
}

