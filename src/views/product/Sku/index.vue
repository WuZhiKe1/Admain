<template>
  <div>
    <el-table :data="skuList" style="width: 100%;marginTop:30px;" border>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" align="center" />
      <el-table-column prop="skuDesc" label="描述" width="width" align="center" />
      <el-table-column label="默认图片" width="110" align="center">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="加载失败" style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80" align="center" />
      <el-table-column prop="price" label="价格(元)" width="80" align="center" />
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale==1"
            type="primary"
            icon="el-icon-bottom"
            round
            @click="cancel(row)"
          />
          <el-button v-else type="primary" icon="el-icon-top" round @click="sale(row)" />
          <el-button type="warning" icon="el-icon-edit" round @click="edit" />
          <el-button type="info" icon="el-icon-info" round @click="getSkuInfo(row)" />
          <el-button icon="el-icon-delete" type="danger" round />
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      当前第几页(current-page)
      数据总条数(total)
      每一页展示数据的总条数(page-size)
      连续页码数(pager-count=按钮的数量)
      当前页数展示条数发生变化: @size-change="handleSizeChange"
      当前页码发生变化时会触发: @current-change="handleCurrentChange"
      layout:分页器的布局
    -->
    <el-pagination
      style="marginTop:20px;textAlign:center;"
      :current-page="currentPage"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[5, 10]"
      layout="prev, pager, next, jumper, -> ,sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
    <!-- 详情页抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            type="success"
            style="margin-right: 10px;"
          >{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="加载失败" style="height:500px;width:520px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1, // 当前第几页
      limit: 10, // 当前页数展示条数
      total: 0, // 总共数据的条数
      skuList: [], // sku列表
      currentPage: null, // 当前页高亮
      skuInfo: {}, // 存储sku信息
      drawer: false // 控制sku详情页的显示
    }
  },
  mounted() {
    // 获取skuList
    this.getSkuList()
  },
  methods: {
    // 获取skuList
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.skuList = result.data.records
        this.total = result.data.total
      }
      this.currentPage = this.page
    },
    // 更改每一页展示数据条数
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },

    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({ message: '上架成功', type: 'success' })
      } else {
        this.$message.error('上架失败')
      }
    },

    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message({ message: '下架成功', type: 'success' })
      } else {
        this.$message.error('下架失败')
      }
    },

    // 编辑
    edit() {
      this.$message('正在开发中')
    },

    // 获取sku详情信息
    async getSkuInfo(row) {
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.drawer = true
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}

.el-col {
    margin: 10px;
}
</style>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>

