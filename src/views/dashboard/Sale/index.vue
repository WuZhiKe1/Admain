<template>
  <el-card class="box_card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visits" />
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right_header">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="6" class="right_floor">
          <h4>门店{{ title }}排名</h4>
          <ul>
            <li>
              <span class="r_index r_size">1</span>
              <span class="r_size">肯德基</span>
              <span class="r_value r_size">123</span>
            </li>
            <li>
              <span class="r_index r_size">2</span>
              <span class="r_size">肯德基</span>
              <span class="r_value r_size">123</span>
            </li>
            <li>
              <span class="r_index r_size">3</span>
              <span class="r_size">肯德基</span>
              <span class="r_value r_size">123</span>
            </li>
            <li>
              <span class="r_index index">4</span>
              <span>肯德基</span>
              <span class="r_value">123</span>
            </li>
            <li>
              <span class="r_index index">5</span>
              <span>肯德基</span>
              <span class="r_value">123</span>
            </li>
            <li>
              <span class="r_index index">6</span>
              <span>肯德基</span>
              <span class="r_value">123</span>
            </li>
            <li>
              <span class="r_index index">7</span>
              <span>肯德基</span>
              <span class="r_value">123</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import Charts from '@/utils/echarts.js'
import dayjs from 'dayjs'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      mayCharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    // 标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    // 监听title
    title() {
      // 重新修改图标的配置的数据
      this.mayCharts.setOption({
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    // 初始化Echarts
    this.mayCharts = Charts(this.$refs.charts)
    // 配置数据
    this.mayCharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '50%',
          data: [10, 29, 33, 33, 22, 10, 29, 33, 33, 22, 33, 22]
        }
      ]
    })
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },

    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },

    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }

}
</script>

<style  scoped>
.el-card__header {
    border-bottom: none;
}

.box_card {
    margin-top: 10px;
}
.box_card .clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.box_card .clearfix .tab {
    width: 100%;
}

.box_card .clearfix .right_header {
    position: absolute;
    right: 0;
}
.date {
    width: 250px;
    margin: 0 20px;
}

.right_header span {
    margin: 0 10px;
    cursor: pointer;
}

.charts {
    width: 100%;
    height: 300px;
}
.right_floor {
    padding: 0;
    height: 300px;
}
.right_floor ul li span {
    margin: 0 10px;
}

ul {
    list-style: none;
    width: 100%;
    padding-left: 0px;
}

ul li {
    height: 8%;
    margin-top: 15px;
}

.r_index {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(74, 73, 73);
    text-align: center;
    line-height: 20.6px;
    color: white;
}

.r_size {
    font-size: 17px;
}

.r_value {
    float: right;
}

.right_floor .index {
    background-color: white;
    color: black;
}
</style>
