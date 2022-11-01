<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          class="input1"
          placeholder="价格(元)"
          onkeypress="return event.keyCode>=48&&event.keyCode<=57"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuInfo.weight"
          class="input1"
          placeholder="重量(千克)"
          onkeypress="return event.keyCode>=48&&event.keyCode<=57"
        />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px">
          <el-form-item
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width:100%;"
          border
          tooltip-effect="dark"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column prop="prop" label="图片" width="width" align="center">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width:100px;height:100px;" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" align="center" />
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{ row }">
              <el-button v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else type="primary">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 图片信息
      spuImageList: [],
      // 销售属性
      spuSaleAttrList: [],
      // 平台属性
      attrInfoList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类父组件给与的数据
        category3Id: null,
        spuId: null,
        tmId: null,
        // 第二类 数 据通过双向绑定收集
        price: 0, // 价格
        skuName: '',
        weight: null, // 重量
        skuDesc: '', // 描述
        // 第三类需要自己书写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片信息
        skuImageList: [
          // {
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   spuImgId: 0
          // }
        ],
        // sku的销售属性列表
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // }
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0
          // }
        ]
      },
      spu: {},
      // 收集图片数据的字段,去掉idDefault字段，上传服务器是要整理参数
      imageList: [],
      // 节流
      flag: false
    }
  },
  methods: {
    // 初始化数据
    async getData(category1Id, category2Id, spu) {
      // 清除数据
      Object.assign(this._data, this.$options.data.call(this))
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      const result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code === 200) {
        const list = result.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取平台属性的数据
      const result2 = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params) {
      // 获取到用户选中的图片信息数据，当前收集的数据缺少isDefault字段
      this.imageList = params
    },

    // 排他操作
    changeDefault(row) {
      // 图片列表数据的字段isDefault=0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 点击的图片字段isDefault=1
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消切换界面
    cancel() {
      // 自定义事件
      this.$emit('changeScenes', 0)
    },

    // 保存
    async save() {
      // 整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 新建数组
      const arr = []
      // 把收集到的数据整理
      attrInfoList.forEach(item => {
        // 当前平台属性用户进行了选择
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          // 带给服务器的是对象
          const obj = { attrId, valueId }
          arr.push(obj)
        }
      })
      // 将整理好的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = arr

      // 整理销售属性-另一种筛选方式
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      if (this.flag) {
        this.$message({
          message: '上传中请勿重复点击',
          type: 'warning'
        })
        return
      }
      this.flag = true
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.flag = false
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScenes', 0)
      }
    }

  }
}
</script>

<style  scoped>
.input1::-webkit-outer-spin-button,
.input1::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
</style>>

