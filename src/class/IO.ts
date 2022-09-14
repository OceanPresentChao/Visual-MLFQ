export type IOStatus = 'running' | 'finished' | 'wait'
export class IO {
  name: string
  requestTime: number
  remainingTime: number
  status: IOStatus
  priority: number
  constructor(name: string, requestTime: number, priority: number) {
    this.name = name
    this.requestTime = requestTime
    this.remainingTime = requestTime
    this.priority = priority
    this.status = 'wait'
  }

  modifyTime() {
    this.requestTime = Number(this.requestTime.toFixed(1))
    this.remainingTime = Number(this.remainingTime.toFixed(1))
  }
}
