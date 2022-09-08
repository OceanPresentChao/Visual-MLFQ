import { v1 } from 'uuid'
import type { fabric } from 'fabric'
import type { Process } from '@/class/Process'
export type QueueType = 'ready' | 'running' | 'wait'
export const string2ElMap = new Map([['name', 1], ['rect', 0], ['size', 2], ['priority', 3], ['timeslice', 4]])
export class Queue {
  readonly category: QueueType
  id: string
  name: string
  limit: number
  size: number
  list: Process[]
  group: fabric.Group | null
  constructor(type: QueueType, name: string) {
    this.category = type
    this.limit = Infinity
    this.size = 0
    this.list = []
    this.name = name
    this.id = v1()
    this.group = null
  }

  getEl(key: string) {
    if (!this.group || !string2ElMap.has(key))
      return
    return this.group.item(string2ElMap.get(key)!)
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

