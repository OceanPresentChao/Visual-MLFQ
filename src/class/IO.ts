import * as uuid from 'uuid'
export type IOStatus = 'running' | 'finished' | 'wait' | 'pending'
export class IO {
  id: string
  name: string
  requestTime: number
  remainingTime: number
  startTime: number
  endTime: number
  status: IOStatus
  priority: number
  waitTime: number
  runningTime: number
  trigger: boolean
  constructor(name: string, requestTime: number, priority: number) {
    this.id = uuid.v1()
    this.name = name
    this.requestTime = requestTime
    this.remainingTime = requestTime
    this.priority = priority
    this.startTime = Date.now()
    this.endTime = -1
    this.status = 'pending'
    this.waitTime = 0
    this.runningTime = 0
    this.trigger = false
  }

  modifyTime() {
    this.requestTime = Number(this.requestTime.toFixed(1))
    this.remainingTime = Number(this.remainingTime.toFixed(1))
    this.waitTime = Number(this.waitTime.toFixed(1))
    this.runningTime = Number(this.runningTime.toFixed(1))
  }

  getCyclingTime() {
    if (this.status !== 'finished')
      return null
    else
      return this.endTime - this.startTime
  }
}
