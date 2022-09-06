import { ref } from 'vue'
export interface ReadyQueueSetting {
  priority: number
  timeSlice: number
}
export const readyQueueSetting = ref<ReadyQueueSetting[]>([
  {
    priority: 1,
    timeSlice: 1,
  },
  {
    priority: 2,
    timeSlice: 1,
  },
  {
    priority: 3,
    timeSlice: 1,
  },
])
