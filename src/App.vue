<script setup lang="ts">
import MLFQ from './components/MLFQ.vue'
import Setting from './components/Setting.vue'
import { ref } from 'vue';
type AppStatus = 'setting' | 'mlfq'
const GlobalStatus = ref<AppStatus>('setting')

function changeStatus(status: AppStatus) {
  GlobalStatus.value = status
}
</script>

<template>
  <Setting v-if="GlobalStatus === 'setting'" @changestatus="changeStatus"></Setting>
  <MLFQ v-if="GlobalStatus === 'mlfq'" @changestatus="changeStatus"></MLFQ>
</template>

