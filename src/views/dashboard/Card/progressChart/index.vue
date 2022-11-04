<template>
  <div ref="charts" class="charts" />
</template>

<script>
// 引入 echarts
import Charts from '@/utils/echarts.js'
export default {
  name: 'ProgressChart',
  mounted() {
    // 初始化 Echarts 实例
    const lineCharts = Charts(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏
        show: false,
        // 最小值最大值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          // 柱状图的宽度
          barWidth: 15,
          // 背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本的设置
          label: {
            show: true,
            color: 'yellowgreen',
            // 文本内容
            formatter: '|',
            // 文本位置
            position: 'right'
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
