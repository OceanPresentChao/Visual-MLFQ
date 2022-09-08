import * as uuid from 'uuid'
import type { fabric } from 'fabric'
export type ProcessStatus = 'running' | 'wait' | 'ready'
export const string2ElMap = new Map([['name', 1], ['rect', 0], ['size', 2], ['priority', 3], ['timeslice', 4]])
export class Process {
  id: string
  name: string
  /** 任务总时间 */
  taskTime: number
  /** 任务剩余时间 */
  remainingTime: number
  /** 在某层队列消耗的总时间 */
  sliceTime: number
  group: fabric.Group | null
  constructor(name: string, taskTime: number) {
    this.name = name
    this.id = uuid.v1()
    this.taskTime = taskTime
    this.remainingTime = taskTime
    this.sliceTime = 0
    this.group = null
  }

  getEl(key: string) {
    if (!this.group || !string2ElMap.has(key))
      return
    return this.group.item(string2ElMap.get(key)!)
  }
}
