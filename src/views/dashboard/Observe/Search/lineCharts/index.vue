<template>
  <div class="line_charts">
    <div class="header">
      <span>
        搜索用户数
        <svg
          t="1667377867008"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3676"
          width="16"
          height="16"
        >
          <path
            d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384m0-832C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64"
            fill="#8a8a8a"
            p-id="3677"
          />
          <path
            d="M480 768h64v-288h-64zM512 272a48 48 0 1 0 0 96 48 48 0 0 0 0-96"
            fill="#8a8a8a"
            p-id="3678"
          />
        </svg>
      </span>
    </div>
    <div class="main">
      <span class="main_title">123123</span>
      <span class="main_content">17.1</span>
      <svg
        t="1667379350569"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6448"
        width="16"
        height="16"
      >
        <path
          d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
          fill="#d81e06"
          p-id="6449"
        />
      </svg>
      <svg
        t="1667379489319"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8201"
        width="16"
        height="16"
      >
        <path
          d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
          fill="#1afa29"
          p-id="8202"
        />
      </svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
// 引入 echarts
import Charts from '@/utils/echarts.js'
export default {
  name: 'LineCharts',
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
            color: 'blue'
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
                  color: 'blue' // 0% 处的颜色
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
.line_charts {
    margin-bottom: 20px;
}
.header {
    display: flex;
    position: relative;
    align-items: center;
}

.header .icon {
    position: absolute;
    top: 1px;
    margin: 0px 5px;
}

.main {
    margin-top: 10px;
}

.main_title {
    margin-right: 30px;
}

.main_content {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}
</style>
