<template>
  <div class="card">
    <el-row :gutter="10">
      <!-- 第一个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="123123">
            <template slot="charts">
              <span>
                周同比&nbsp;56.67%&nbsp;
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
              </span>
              <span>
                日同比&nbsp;19.96%&nbsp;
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
              </span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 123243</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="123123">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量￥ 123243</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付比数" count="123123">
            <template slot="charts">
              <BarChart />
            </template>
            <template slot="footer">
              <span>转化率64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart />
            </template>
            <template slot="footer">
              <span>
                周同比&nbsp;56.67%&nbsp;
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
              </span>
              <span>
                日同比&nbsp;19.96%&nbsp;
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
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './lineChart'
import BarChart from './barChart'
import ProgressChart from './progressChart'
export default {
  name: 'Card',
  components: { Detail, LineChart, BarChart, ProgressChart }

}
</script>

<style scoped>
.card {
    margin-top: 15px;
}
</style>
