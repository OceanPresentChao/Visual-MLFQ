async function demo() {
  let a = -1
  let t = 0
  await new Promise((resolve) => {
    a = setInterval(() => {
      console.log('object')
      if (t++ > 5)
        resolve(0)
    }, 1000)
  })
  clearInterval(a)
}

demo()
