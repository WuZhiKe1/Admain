<template>
  <div ref="charts" class="charts" />
</template>

<script>
// 引入 echarts
import Charts from '@/utils/echarts.js'

export default {
  name: 'LineChart',
  mounted() {
    // 初始化 Echarts 实例
    const lineCharts = Charts(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: { show: false },
      // 系列
      series: [
        {
          // 曲线
          smooth: true,
          type: 'line',
          data: [20, 27, 33, 12, 48, 60, 89, 95, 84, 66, 83, 92],
          // 拐点的透明度
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'skyblue'
          },
          // 填充颜色-渐变色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'skyblue' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#ffff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ],
      // 布局的调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      // 提示信息
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>
