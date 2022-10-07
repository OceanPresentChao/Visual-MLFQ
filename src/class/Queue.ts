import { v1 } from 'uuid'
import type { IO } from './IO'
import type { Process } from '@/class/Process'
export type QueueType = 'ready' | 'running' | 'wait' | 'IO'

export class Queue<T> {
  readonly category: QueueType
  id: string
  name: string
  limit: number
  list: Array<T>
  timer: ReturnType<typeof setInterval> | null
  constructor(type: QueueType, name: string) {
    this.category = type
    this.limit = Infinity
    this.list = []
    this.name = name
    this.id = v1()
    this.timer = null
  }

  size() {
    return this.list.length
  }

  clearTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export class WaitQueue extends Queue<Process> {
  constructor(name: string) {
    super('wait', name)
  }
}

export class RunningQueue extends Queue<Process> {
  constructor(name: string) {
    super('running', name)
    this.limit = 1
  }
}

export class ReadyQueue extends Queue<Process> {
  priority: number
  timeSlice: number
  constructor(priority: number, timeSlice: number, name: string) {
    super('ready', name)
    this.priority = priority
    this.timeSlice = timeSlice
  }
}

export class IOQueue extends Queue<IO> {
  runningList: IO[]
  constructor(name: string) {
    super('IO', name)
    this.runningList = []
  }

  size() {
    return this.list.length + this.runningList.length
  }
}

