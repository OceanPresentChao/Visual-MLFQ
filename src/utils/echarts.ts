import * as echarts from 'echarts/core'
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import type {
  BarSeriesOption,
  PieSeriesOption,
} from 'echarts/charts'
import {
  BarChart,
  PieChart,
} from 'echarts/charts'
import {
  LabelLayout,
} from 'echarts/features'
import {
  CanvasRenderer,
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, BarChart, PieChart, CanvasRenderer, LabelLayout, LegendComponent],
)

export type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | TooltipComponentOption | GridComponentOption | BarSeriesOption | PieSeriesOption | LegendComponentOption
>

export { echarts }
