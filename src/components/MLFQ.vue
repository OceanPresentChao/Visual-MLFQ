<template>
  <div>
    <main style="height:1000px;">
      <div>
        <button @click="$emit('changestatus', 'setting')">返回</button>
      </div>
      <canvas id="c">
      </canvas>
    </main>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { onMounted, defineEmits } from 'vue';
const emits = defineEmits(['changestatus'])
onMounted(() => {
  let canvas = new fabric.Canvas("c", {
    backgroundColor: 'rgb(100,100,200)',
    selectionLineWidth: 2,
    height: 1000,
    width: 1000
    // ...
  })
  let rect = new fabric.Rect({
    height: 100,
    width: 100
  })
  canvas.add(rect)
  rect.set('angle', -15);
  rect.set('selectable', false)
  rect.animate('angle', 45, {
    onChange: canvas.renderAll.bind(canvas)
  });
  rect.animate('left', '+=45', {
    duration: 2000,
    onChange: canvas.renderAll.bind(canvas)
  });
  var path = new fabric.Path("m9 20l-1.4-1.4l1.75-1.8q-3.2-.425-5.275-1.75T2 12q0-2.075 2.888-3.538Q7.775 7 12 7t7.113 1.462Q22 9.925 22 12q0 1.55-1.663 2.775Q18.675 16 16 16.6v-2.05q1.925-.5 2.962-1.238Q20 12.575 20 12q0-.8-2.137-1.9Q15.725 9 12 9q-3.725 0-5.862 1.1Q4 11.2 4 12q0 .6 1.275 1.438Q6.55 14.275 8.9 14.7l-1.3-1.3L9 12l4 4Z");
  path.set({ left: 120, top: 120 });
  canvas.add(path);

})

</script>

<style scoped>
</style>