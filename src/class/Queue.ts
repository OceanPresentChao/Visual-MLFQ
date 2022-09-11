import { v1 } from 'uuid'
import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
export type QueueType = 'ready' | 'running' | 'wait'

export class Queue {
  readonly category: QueueType
  id: string
  name: string
  limit: number
  list: Ref<Process>[]
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
  constructor(name: string) {
    super('wait', name)
  }
}

export class RunningQueue extends Queue {
  constructor(name: string) {
    super('running', name)
    this.limit = 1
  }
}

export class ReadyQueue extends Queue {
  priority: number
  timeSlice: number
  constructor(priority: number, timeSlice: number, name: string) {
    super('ready', name)
    this.priority = priority
    this.timeSlice = timeSlice
  }
}

