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
  list: Array<any>
  constructor(type: QueueType, name: string) {
    this.category = type
    this.limit = Infinity
    this.list = []
    this.name = name
    this.id = v1()
  }

  size() {
    return this.list.length
  }
}

export class WaitQueue extends Queue {
  list: Ref<Process>[]
  constructor(name: string) {
    super('wait', name)
    this.list = []
  }
}

export class RunningQueue extends Queue {
  list: Ref<Process>[]
  timer: number | null
  constructor(name: string) {
    super('running', name)
    this.list = []
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
  list: Ref<Process>[]
  constructor(priority: number, timeSlice: number, name: string) {
    super('ready', name)
    this.priority = priority
    this.list = []
    this.timeSlice = timeSlice
  }
}

export class IOQueue extends Queue {
  list: Ref<IO>[]
  runningList: Ref<IO>[]
  timer: number | null
  constructor(name: string) {
    super('IO', name)
    this.list = []
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
    io.value.status = 'wait'
    const priIndex = this.list.findIndex(v => v.value.priority < io.value.priority)
    if (priIndex === 0 || priIndex === -1)
      this.list.unshift(io)
    else
      this.list.splice(priIndex, 0, io)
  }
}

