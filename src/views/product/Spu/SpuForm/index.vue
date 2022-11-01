<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU的名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" placeholder="SPU描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--
          上图片的地址 action
          list-type 文件列表类型
          on-preview 图片预览的时候会触发
          on-remove 删除图片的时候触发
          on-success 文件上传成功的钩子
          file-list:照片请需要展示的数据【数组：数组里务必要有name、url属性】
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option
            v-for="(ubSelect) in unSelectSaleAttr"
            :key="ubSelect.id"
            :label="ubSelect.name"
            :value="`${ubSelect.id}:${ubSelect.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="marginLeft:10px;"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="marginTop:10px;" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="100" align="center" />
          <el-table-column prop="prop" label="属性值名称列表" width="width" align="center">
            <template slot-scope="{row}">
              <!--
                @close="handleClose(tag)" 叉号事件
              -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >{{ tag.saleAttrValueName }}</el-tag>
              <!-- 、
              相当于写过的e与input切换的结构
              -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="keyup"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
              >添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="spu.spuSaleAttrList.splice($index,1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="changeScene">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性——格式是保存时上传时的格式，根据服务器的需求设置的
      spu: {
        // 三级分类id
        category3Id: 0,
        // 品牌描述
        description: '',
        // spu的名称
        spuName: '',
        // 品牌的id
        tmId: null,
        // 收集spu 图片的信息
        spuImageList: [],
        // 平台属性与属性值
        spuSaleAttrList: []
      },
      tradeMarkList: [], // 存储品牌的信息
      spuImageList: [], // 存储spu图片
      saleAttrList: [], // 销售属性
      attrIdAndAttrName: '', // 为选择的销售属性id
      // 保存节流
      flag: false
    }
  },
  computed: {
    // 计算出还未选择的计算属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个 ——颜色、尺寸、版本--saleAttrList
      // 当前spu拥有属于自己的销售属性spu.spuSaleAttrList
      // 数组过滤
      const result = this.saleAttrList.filter((item) => {
        // every 返回布尔值 boolean
        // 用saleAttrList其中一个与spu.spuSaleAttrList所有比较不相等就返回、相等就不反回
        // 最后得到spu.spuSaleAttrList相较于saleAttrList还未拥有的销售属性
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙删除图片的时候触发
    handleRemove(file, fileList) {
      // file 参数：代表删除的那个图片
      // fileList ：照片墙删除一张图片剩余的其他图片
      // 收集照片墙图片的数据
      // 已有的图片fileList拥有name、url字段，提交服务器时要处理不需要name、url字段
      this.spuImageList = fileList
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙-文件上传成功的钩子
    handleSuccess(response, file, fileList) {
      // 收集图片的信息 fileList 上传成功后所有图片信息
      this.spuImageList = fileList
    },
    // (添加) 初始化 spuForm 数据
    async addSpuData(category3Id) {
      // 添加spu收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkList = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkList.code === 200) {
        this.tradeMarkList = tradeMarkList.data
      }
      // 获取全部的平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //  (修改) 初始化 spuFrom 数据
    async initSpuData(spu) {
      // 获取spu信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      const tradeMarkList = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkList.code === 200) {
        this.tradeMarkList = tradeMarkList.data
      }
      // 获取spu图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        const listAttr = spuImageResult.data
        // 照片墙需要的的数据要有name和url字段，要进行处理
        listAttr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 整理好的数据赋值
        this.spuImageList = listAttr
      }
      // 获取全部的平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },

    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性的数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu的spuSaleAttrList追加
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },

    // 添加属性值
    addSaleAttrValue(row) {
      // 新增的销售属性值不能超过10条
      if (row.spuSaleAttrValueList.length === 10) {
        this.$message.error('销售属性值不能超过10条')
        return
      }
      // 点击添加按钮，button切换input由inputVisible字段控制
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集数据
      this.$set(row, 'inputValue', '')
      // 获取焦点
      this.$nextTick(() => this.$refs.saveTagInput.focus())
    },

    // el-input 失去焦点的事件——button-input切换
    handleInputConfirm(row) {
      // 结构出销售属性中收集的数据
      const { baseSaleAttrId, inputValue } = row
      // 去掉空格
      const inputValues = inputValue.trim()
      // 销售属性值不能重复
      const result = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValues)
      // 新增的销售属性值不能为空不能超过10个字不能重复
      if (inputValues === '') {
        this.$message.error('属性值不能为空')
        this.$refs.saveTagInput.focus()
        return
      } else if (inputValues.length >= 10) {
        this.$message.error('属性值不能超过10个字')
        this.$refs.saveTagInput.focus()
        return
      } else if (result) {
        this.$message.error('属性值不能相等')
        this.$refs.saveTagInput.focus()
        return
      }
      // 整理新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValues }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // button-input切换
      row.inputVisible = false
    },

    // 回车失去焦点触发handleInputConfirm()
    keyup() {
      this.$refs.saveTagInput.blur()
    },

    // 保存
    async addOrUpdateSpu() {
      // 整理参数
      // 图片需要携带imgName，imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      if (this.flag) {
        this.$message({
          message: '上传中请勿重复点击',
          type: 'warning'
        })
        return
      }
      this.flag = true
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)

      if (result.code === 200) {
        this.flag = false
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '参加' })

        // 清除数据
        // Object.assign es6合并对象——都和并覆盖到第一个对象参数
        // 组件实例_data可以操作data中的响应式数据
        // this.$options.data()可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
        Object.assign(this._data, this.$options.data.call(this))
      }
    },
    // 取消--切换为spu列表页面
    changeScene() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data.call(this))
    }
  }

}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>

