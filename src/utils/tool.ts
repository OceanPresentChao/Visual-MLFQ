import { watch } from 'vue'
import type { Ref } from 'vue'
import type { fabric } from 'fabric'

export function bindAttr2Ref<T extends fabric.Object, K>(refVal: Ref<K>, el: T, canvas: fabric.Canvas, callback: (value: K, oldValue: K | undefined, el: T) => void) {
  watch(refVal, (value, oldValue) => {
    callback(value, oldValue, el)
    canvas.requestRenderAll()
  }, { immediate: true })
}
