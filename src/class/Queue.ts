import type{ Process } from '@/class/Process'
export type QueueType = 'ready' | 'running' | 'wait'
class Queue {
  readonly category: QueueType
  limit: number
  size: number
  list: Process[]
  constructor(type: QueueType) {
    this.category = type
    this.limit = Infinity
    this.size = 0
    this.list = []
  }
}

export class WaitQueue extends Queue {
  constructor() {
    super('wait')
  }
}

export class RunningQueue extends Queue {
  constructor() {
    super('running')
    this.limit = 1
  }
}

export class ReadyQueue extends Queue {
  priority: number
  timeSlice: number
  constructor(priority: number, timeSlice: number) {
    super('ready')
    this.priority = priority
    this.timeSlice = timeSlice
  }
}

