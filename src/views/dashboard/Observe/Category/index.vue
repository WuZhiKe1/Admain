<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category_header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div ref="charts" class="charts"></div>
    </div>
  </el-card>
</template>

<script>
import Charts from '@/utils/echarts.js'
export default {
  name: 'Category',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    // 初始化 Echarts 实例
    const myCharts = Charts(this.$refs.charts)
    myCharts.setOption({
      title: {
        text: '',
        subtext: '',
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    // 绑定鼠标移动事件
    myCharts.on('mouseover', (params) => {
      // 获取鼠标移上去的数据
      const { name, value } = params.data
      // 重新设置标题
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.header {
    border-bottom: 1px solid #eeee;
}

.category_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.charts {
    width: 100%;
    height: 241.58px;
}
</style>
