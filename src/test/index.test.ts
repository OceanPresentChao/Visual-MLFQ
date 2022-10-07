import { expect, it } from 'vitest'
import { ref } from 'vue'
it('', () => {
  const a = { a: 1 }
  const arr = ref<any[]>([])
  arr.value.push(a)
  expect(arr.value[0]).toStrictEqual(a)
  expect(arr.value.findIndex(v => v === arr.value)).toMatchInlineSnapshot('-1')
})
