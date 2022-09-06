<script setup lang="ts">
import { ref } from 'vue'
import MLFQ from './components/MLFQ.vue'
import Setting from './components/Setting.vue'
type AppStatus = 'setting' | 'mlfq'
const GlobalStatus = ref<AppStatus>('setting')

function changeStatus(status: AppStatus) {
  GlobalStatus.value = status
}
</script>

<template>
  <Setting v-if="GlobalStatus === 'setting'" @changestatus="changeStatus" />
  <MLFQ v-if="GlobalStatus === 'mlfq'" @changestatus="changeStatus" />
</template>

