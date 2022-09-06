import * as uuid from 'uuid'
export type ProcessStatus = 'running' | 'wait' | 'ready'
export class Process {
  id: string
  name: string
  /** 任务总时间 */
  taskTime: number
  /** 任务剩余时间 */
  remainingTime: number
  /** 在某层队列消耗的总时间 */
  sliceTime: number

  constructor(name: string, taskTime: number) {
    this.name = name
    this.id = uuid.v1()
    this.taskTime = taskTime
    this.remainingTime = taskTime
    this.sliceTime = 0
  }
}
