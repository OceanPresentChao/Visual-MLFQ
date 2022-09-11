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
