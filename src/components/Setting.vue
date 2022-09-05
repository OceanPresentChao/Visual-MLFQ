<template>
  <div>
    <header>
      Setting
    </header>
    <main>
      <p>
        就绪队列个数:{{ queNum }}
      </p>
      <div v-for="index in queNum">
        <span>队列{{ index }}: </span>
        <label>优先级</label><input type="number">
        <label>时间片长度</label><input type="number">
      </div>
      <div>
        <button @click="$emit('changestatus', 'mlfq')">完成设置</button>
      </div>
    </main>
    <footer></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const emits = defineEmits(['changestatus'])
const queNum = ref(3)
</script>

<style scoped>
</style>