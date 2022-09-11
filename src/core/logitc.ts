import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
import type { ReadyQueue } from '@/class/Queue'
export async function runProcess(process: Ref<Process>, readyQueues: ReadyQueue[]) {
  try {
    let queueIndex = process.value.priority
    if (queueIndex < 0) {
      queueIndex = 0
      process.value.remainSliceTime = readyQueues[queueIndex].timeSlice
    }
    else {
      if (process.value.remainSliceTime <= 0) {
        queueIndex++
        process.value.remainSliceTime = readyQueues[queueIndex].timeSlice
      }
    }
    process.value.status = 'running'
    readyQueues[queueIndex].list.push(process)
    requestInterval(() => {
      process.value.remainSliceTime -= 0.1
      process.value.remainingTime -= 0.1
      process.value.modifyTime()
      return !(process.value.remainingTime <= 0 || process.value.remainSliceTime <= 0)
    }, 100)
  }
  catch (error) {
    console.error(error)
  }
}

function requestInterval<T extends Function>(callback: T, interval: number) {
  let start = -1
  let continued = true
  function step(timestamp: number) {
    if (start === -1)
      start = timestamp
    const elapsed = timestamp - start
    if (elapsed >= interval && elapsed - interval < 10) {
      start = timestamp
      continued = callback()
    }
    if (continued)
      window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}
