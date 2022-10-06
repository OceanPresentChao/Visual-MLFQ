export type IOStatus = 'running' | 'finished' | 'wait' | 'pending'
export class IO {
  name: string
  requestTime: number
  remainingTime: number
  startTime: number
  endTime: number
  status: IOStatus
  priority: number
  waitTime: number
  runningTime: number
  timer: ReturnType<typeof setInterval> | null
  trigger: boolean
  constructor(name: string, requestTime: number, priority: number) {
    this.name = name
    this.requestTime = requestTime
    this.remainingTime = requestTime
    this.priority = priority
    this.startTime = Date.now()
    this.endTime = -1
    this.status = 'pending'
    this.waitTime = 0
    this.runningTime = 0
    this.timer = null
    this.trigger = false
    this.startTimer()
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

  startTimer() {
    if (this.timer)
      return
    this.timer = setInterval(() => {
      if (this.status === 'pending') {
        return
      }
      else if (this.status === 'finished') {
        this.endTime = Date.now()
        this.clearTimer()
        return
      }
      else if (this.status === 'wait') {
        this.waitTime += 0.1
      }
      else if (this.status === 'running') {
        this.runningTime += 0.1
        this.remainingTime -= 0.1
      }
      this.modifyTime()
    }, 100)
  }

  clearTimer() {
    if (!this.timer)
      return
    clearInterval(this.timer)
    this.timer = null
  }
}
