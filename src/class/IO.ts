export type IOStatus = 'running' | 'finished' | 'wait'
export class IO {
  name: string
  requestTime: number
  remainingTime: number
  startTime: number
  endTime: number
  status: IOStatus
  priority: number
  constructor(name: string, requestTime: number, priority: number) {
    this.name = name
    this.requestTime = requestTime
    this.remainingTime = requestTime
    this.priority = priority
    this.startTime = Date.now()
    this.endTime = -1
    this.status = 'wait'
  }

  modifyTime() {
    this.requestTime = Number(this.requestTime.toFixed(1))
    this.remainingTime = Number(this.remainingTime.toFixed(1))
  }

  getCyclingTime() {
    if (this.status !== 'finished')
      return null
    else
      return this.endTime - this.startTime
  }
}
