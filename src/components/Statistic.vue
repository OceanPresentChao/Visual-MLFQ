<script setup lang="ts">
import type { Ref } from 'vue'
import ProcessDiagram from './Diagram.vue'
import type { IO } from '@/class/IO'
import type { Process } from '@/class/Process'
const props = defineProps<{
  info: Ref<{
    processes: Ref<Process>[]
    IOs: Ref<IO>[]
  }>
}>()
const emits = defineEmits(['toggle'])
</script>

<template>
  <div>
    <div style="position: fixed;height: 100vh;width: 40vw;right: 0;">
      <div>
        <span style="float: right;" @click="$emit('toggle')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 20L4 4m16 0L4 20" /></svg>
        </span>
      </div>
      <p v-for="(p, index) in info.processes">
        <ProcessDiagram :process="p" />
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
