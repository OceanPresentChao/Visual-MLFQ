export type IOStatus = 'running' | 'finished' | 'wait'
export class IO {
  name: string
  requestTime: number
  remainingTime: number
  status: IOStatus
  constructor(name: string, requestTime: number) {
    this.name = name
    this.requestTime = requestTime
    this.remainingTime = requestTime
    this.status = 'wait'
  }
}
