<script setup lang="ts">
import { type Ref, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from '../utils/echarts'
import { echarts } from '../utils/echarts'
import type { Process } from '@/class/Process'
const props = defineProps<{
  process: Ref<Process>
}>()
const echartRef = ref<null | HTMLDivElement>(null)
const BarChartData = {
  charts: {
  } as Record<string, number>,
}
const PieChartData = {
  charts: {
  } as Record<string, number>,
}

onMounted(() => {
  if (echartRef.value) {
    const myChart = echarts.init(echartRef.value)
    watch(props.process, () => {
      initData()
      myChart.setOption(getOption())
      window.onresize = function () {
        myChart.resize()
      }
    }, { deep: true, immediate: true })
  }
})

function initData() {
  BarChartData.charts.taskTime = props.process.value.taskTime
  BarChartData.charts.remainingTime = props.process.value.remainingTime
  BarChartData.charts.remainSliceTime = props.process.value.remainSliceTime
  PieChartData.charts.readyTime = props.process.value.readyTime
  PieChartData.charts.waitTime = props.process.value.waitTime
  PieChartData.charts.runningTime = props.process.value.runningTime
}

function getOption(): EChartsOption {
  return {
    animation: false,
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: '55%',
    },
    textStyle: {
      fontFamily: 'Microsoft YaHei',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    title: [
      {
        text: '柱状图',
        left: '25%',
        textAlign: 'center',
        subtextStyle: {
          color: '#444',
          fontSize: 14,
        },
      },
      {
        text: '饼图',
        left: '75%',
        textAlign: 'center',
        subtextStyle: {
          color: '#444',
          fontSize: 14,
        },
      },
    ],
    grid: [
      {
        top: 50,
        width: '50%',
        bottom: '0%',
        left: 10,
        containLabel: true,
      },

    ],
    xAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#ddd',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: Object.keys(BarChartData.charts),
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: '#ddd',
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    series: [
      {
        type: 'bar',
        stack: 'chart',
        z: 3,
        label: {
          position: 'right',
          show: true,
        },
        data: Object.keys(BarChartData.charts).map((key) => {
          return BarChartData.charts[key]
        }),
      },
      {
        type: 'pie',
        radius: [0, '30%'],
        center: ['75%', '50%'],
        data: Object.keys(PieChartData.charts).map((key) => {
          return {
            name: key,
            value: PieChartData.charts[key],
          }
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}
</script>

<template>
  <div style="margin: 2rem 0;">
    <div ref="echartRef" style="height: 20vh;width: 100%;" />
  </div>
</template>

  <style scoped>

  </style>

