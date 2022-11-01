<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三级联动 -->
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 展示spu列表的情况 -->
      <div v-show="scene==0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="marginBottom:20px;"
          :disabled="!category3Id"
          @click="addSpu"
        >添加Spu</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="spuName" label="SPU名称" width="width" align="center" />
          <el-table-column prop="description" label="SPU描述" width="width" align="center" />
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row}">
              <hint-button icon="el-icon-plus" round title="添加SKU" @click="addSku(row)" />
              <hint-button
                type="warning"
                icon="el-icon-edit"
                round
                title="修改SPU"
                @click="updateSpu(row)"
              />
              <hint-button
                type="info"
                icon="el-icon-info"
                round
                title="查看当前SPU全部SKU列表"
                @click="handler(row)"
              />
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  round
                  title="删除SPU"
                />
              </el-popconfirm>
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
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- 添加编辑spu -->
      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />
      <!-- 添加sku -->
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <!-- sku列表 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table v-loading="loading" :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" width="width" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="无数据" style="width:100px;height:100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      // 分类的 ID
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 当前第几页
      page: 1,
      // 当前页数展示条数
      limit: 5,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      records: [],
      // 当前页高亮
      currentPage: null,
      // 控制各个界面显示
      scene: 0, // 0展示spu列表的属性 1添加与修改spu 2添加sku
      // 控制sku列表显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], // 储存sku列表数据
      loading: true // loading效果
    }
  },
  mounted() {

  },
  methods: {
    // 添加sku
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件发起请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // // 点击页码
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getSpuList()
    // },
    // 三级联动自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 区分相应的ID
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.records = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.records = []
      } else {
        this.category3Id = categoryId
        // 获取spu进行数据展示
        this.getSpuList()
      }
    },

    // 获取spu数据
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
      this.currentPage = this.page
    },

    // 更改每一页展示数据条数
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList(this.page)
    },

    // 添加spu
    addSpu() {
      this.scene = 1 // 切换为修改页面
      // 通知子组件发请求--两个_将3id传入
      this.$refs.spu.addSpuData(this.category3Id)
    },

    // 修改spu
    updateSpu(row) {
      this.scene = 1 // 切换为修改页面
      // 获取子组件spuForm传递row
      this.$refs.spu.initSpuData(row)
    },

    // 自定义事件 spuForm传递0 切换为spu列表界面
    // flag 区分保存还是修改
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        // 添加跳转第一页
        this.getSpuList()
      }
    },
    // skuForm切换
    changeScenes(scene) {
      this.scene = scene
      this.getSpuList(this.page)
    },

    // 展示sku列表
    async handler(spu) {
      // 点击后展示对话框
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 获取数据后关闭loading
        this.loading = false
      }
    },
    // 关闭sku列表清除数据
    close(done) {
      // loading 再次为真
      this.loading = true
      // 清除数据
      this.skuList = []
      done()
    },
    // 删除spu
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    }
  }
}
</script>

<style>
</style>
