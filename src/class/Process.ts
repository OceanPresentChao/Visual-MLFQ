import * as uuid from 'uuid'
export type ProcessStatus = 'running' | 'wait' | 'ready' | 'finished' | 'pending'

export class Process {
  id: string
  name: string
  /** 任务总时间 */
  taskTime: number
  /** 任务剩余时间 */
  remainingTime: number
  /** 在某层队列剩余的总时间 */
  remainSliceTime: number
  /** 进程上一次所处队列的序号 */
  queueIndex: number
  startTime: number
  endTime: number
  status: ProcessStatus
  readyTime: number
  waitTime: number
  runningTime: number
  trigger: boolean
  constructor(name: string, taskTime: number) {
    this.name = name
    this.id = uuid.v1()
    this.taskTime = taskTime
    this.remainingTime = taskTime
    this.remainSliceTime = 0
    this.startTime = Date.now()
    this.endTime = -1
    this.status = 'pending'
    this.queueIndex = -1
    this.readyTime = 0
    this.waitTime = 0
    this.runningTime = 0
    this.trigger = false
  }

  modifyTime() {
    this.taskTime = Number(this.taskTime.toFixed(1))
    this.remainSliceTime = Number(this.remainSliceTime.toFixed(1))
    this.remainingTime = Number(this.remainingTime.toFixed(1))
    this.readyTime = Number(this.readyTime.toFixed(1))
    this.waitTime = Number(this.waitTime.toFixed(1))
    this.runningTime = Number(this.runningTime.toFixed(1))
  }

  /**
   * 获取周转时间
   * @returns number
   */
  getCyclingTime() {
    if (this.status !== 'finished')
      return null
    else
      return this.endTime - this.startTime
  }
}
