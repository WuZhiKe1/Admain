<template>
  <div ref="charts" class="charts" />
</template>

<script>
// 引入 echarts
import Charts from '@/utils/echarts.js'
export default {
  name: 'BarChart',
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
          type: 'bar',
          data: [20, 27, 33, 22, 12, 33, 48, 60, 89, 30, 95, 84, 66, 83, 92],
          color: 'skyblue'
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
