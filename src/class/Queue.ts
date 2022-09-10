import { v1 } from 'uuid'
import type { Ref } from 'vue'
import type { Process } from '@/class/Process'
import type { drawQueue } from '@/core/draw'
export type QueueType = 'ready' | 'running' | 'wait'

export class Queue {
  readonly category: QueueType
  id: string
  name: string
  limit: number
  size: number
  list: Ref<Process>[]
  group: ReturnType<typeof drawQueue> | null
  constructor(type: QueueType, name: string) {
    this.category = type
    this.limit = Infinity
    this.size = 0
    this.list = []
    this.name = name
    this.id = v1()
    this.group = null
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

