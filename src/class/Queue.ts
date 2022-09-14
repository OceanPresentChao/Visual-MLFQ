import { v1 } from 'uuid'
import type { Ref } from 'vue'
import type { IO } from './IO'
import type { Process } from '@/class/Process'
export type QueueType = 'ready' | 'running' | 'wait' | 'IO'

export class Queue {
  readonly category: QueueType
  id: string
  name: string
  limit: number
  waitList: Array<any>
  constructor(type: QueueType, name: string) {
    this.category = type
    this.limit = Infinity
    this.waitList = []
    this.name = name
    this.id = v1()
  }

  size() {
    return this.waitList.length
  }
}

export class WaitQueue extends Queue {
  waitList: Ref<Process>[]
  constructor(name: string) {
    super('wait', name)
    this.waitList = []
  }
}

export class RunningQueue extends Queue {
  waitList: Ref<Process>[]
  timer: number | null
  constructor(name: string) {
    super('running', name)
    this.waitList = []
    this.limit = 1
    this.timer = null
  }

  clearTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export class ReadyQueue extends Queue {
  priority: number
  timeSlice: number
  waitList: Ref<Process>[]
  constructor(priority: number, timeSlice: number, name: string) {
    super('ready', name)
    this.priority = priority
    this.waitList = []
    this.timeSlice = timeSlice
  }
}

export class IOQueue extends Queue {
  waitList: Ref<IO>[]
  runningList: Ref<IO>[]
  timer: number | null
  constructor(name: string) {
    super('IO', name)
    this.waitList = []
    this.runningList = []
    this.timer = null
  }

  clearTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  insertWaitIO(io: Ref<IO>) {
    const priIndex = this.waitList.findIndex(v => v.value.priority < io.value.priority)
    if (priIndex === 0 || priIndex === -1)
      this.waitList.unshift(io)
    else
      this.waitList.splice(priIndex, 0, io)
  }
}

