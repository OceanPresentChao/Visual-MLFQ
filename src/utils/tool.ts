/* eslint-disable @typescript-eslint/no-this-alias */

export function requestInterval<T extends Function>(callback: T, interval: number) {
  let start = -1
  let continued = true
  function step(timestamp: number) {
    if (start === -1)
      start = timestamp
    const elapsed = timestamp - start
    if (elapsed >= interval && elapsed - interval < 10) {
      start = timestamp
      continued = callback()
    }
    if (continued)
      window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}
type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>

export function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFunction<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>
  return function (this: any, ...args): ReturnType<T> {
    const context = this
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
      lastResult = func.apply(context, args)
    }
    return lastResult
  }
}
