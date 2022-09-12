import * as uuid from 'uuid'
export type ProcessStatus = 'running' | 'wait' | 'ready' | 'finished'

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
  status: ProcessStatus
  constructor(name: string, taskTime: number) {
    this.name = name
    this.id = uuid.v1()
    this.taskTime = taskTime
    this.remainingTime = taskTime
    this.remainSliceTime = 0
    this.status = 'ready'
    this.queueIndex = -1
  }

  modifyTime() {
    this.taskTime = Number(this.taskTime.toFixed(1))
    this.remainSliceTime = Number(this.remainSliceTime.toFixed(1))
    this.remainingTime = Number(this.remainingTime.toFixed(1))
  }
}
