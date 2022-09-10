import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
import type { ReadyQueue } from '@/class/Queue'
export function runProcess(process: Ref<Process>, readyQueues: ReadyQueue[]) {
  try {
    let queueIndex = process.value.priority
    if (queueIndex < 0)
      queueIndex = 0
    else if (process.value.remainSliceTime <= 0)
      queueIndex++
    process.value.status = 'running'
    readyQueues[queueIndex].list.push(process)
    setInterval(() => {
      process.value.remainSliceTime--
      process.value.remainingTime--
    }, 1000)
  }
  catch (error) {
    console.error(error)
  }
}
