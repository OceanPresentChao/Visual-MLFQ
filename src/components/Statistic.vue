<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import Diagram from './Diagram.vue'
import type { Process } from '@/class/Process'
defineEmits(['toggle'])
const TextUI = new Map([['ready', '#18ee317b'], ['wait', '#38bbf869'], ['running', '#f12f7665'], ['finished', '#ede618']])
const statis = inject<Ref<Process>[]>('statis')
const classifiedProcess = computed(() => {
  const result: {
    wait: Ref<Process>[]
    ready: Ref<Process>[]
    running: Ref<Process>[]
    finished: Ref<Process>[]
  } = {
    wait: [],
    ready: [],
    running: [],
    finished: [],
  }
  if (statis) {
    statis.forEach((v: Ref<Process>) => {
      if (v.value.status === 'ready')
        result.ready.push(v)
      if (v.value.status === 'running')
        result.running.push(v)
      if (v.value.status === 'wait')
        result.wait.push(v)
      if (v.value.status === 'finished')
        result.finished.push(v)
    })
  }
  return result
})
</script>

<template>
  <div>
    <div style="position: fixed;height: 100vh;width: 40vw;right: 0;overflow-y: scroll;">
      <div>
        <span style="float: right;" @click="$emit('toggle')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 20L4 4m16 0L4 20" /></svg>
        </span>
      </div>
      <div v-for="(val, key) in classifiedProcess" :key="key">
        <h1 :style="{ color: TextUI.get(key) }">
          {{ key }}
        </h1>
        <div v-for="(pro, index) in val" :key="index">
          <h2>{{ pro.value.name }}</h2>
          <Diagram :process="pro" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
