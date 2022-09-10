import * as uuid from 'uuid'
import type { drawProcess } from '@/core/draw'
export type ProcessStatus = 'running' | 'wait' | 'ready'

export class Process {
  id: string
  name: string
  /** 任务总时间 */
  taskTime: number
  /** 任务剩余时间 */
  remainingTime: number
  /** 在某层队列剩余的总时间 */
  remainSliceTime: number
  /** 进程上一次所处队列的优先级 */
  priority: number
  status: ProcessStatus
  group: ReturnType<typeof drawProcess> | null
  constructor(name: string, taskTime: number) {
    this.name = name
    this.id = uuid.v1()
    this.taskTime = taskTime
    this.remainingTime = taskTime
    this.remainSliceTime = 0
    this.group = null
    this.status = 'ready'
    this.priority = -1
  }
}
