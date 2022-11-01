<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          style="margin-bottom:20px;"
          @click="addAttr"
        >添加属性</el-button>
        <!-- 表格展示平台属性 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" align="center" />
          <el-table-column prop="prop" label="属性值列表" width="width" align="center">
            <template slot-scope="{row}">
              <el-tag
                v-for="(attrValue) in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="marginRight:10px;"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{row}">
              <!-- 修改 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                style="marginRight:10px;"
                circle
                @click="upDataAttr(row)"
              />
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteAttr(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="attrName" :inline="true" :model="attrInfo" label-width="80px" :rules="rules">
          <el-form-item label="属性名" prop="attrName">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
              autocomplete="off"
              @blur="attrNameTrim(attrInfo.attrName)"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="marginBottom:20px;"
          :disabled="!(attrInfo.attrName.trim().length>=2)"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="cancelValidation">取消</el-button>
        <el-table style="marginBottom:20px;" :data="attrInfo.attrValueList" border>
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="valueName" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- span input 来回的切换  -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <span
                v-else
                style="display:block;marginLeft:20px;"
                @click="focus(row,$index)"
              >{{ row.valueName.trim() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{row,$index}">
              <!-- 起泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" circle />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length<1"
          @click="addOrUpdateAttr"
        >保存</el-button>
        <el-button @click="cancelValidation">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    const checkSpace = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('不能为空'))
      } else if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error('长度为2到10位'))
      } else {
        callback()
      }
    }
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 平台属性字段
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 收集新增/修改属性
      attrInfo: {
        'attrName': '', // 属性名
        'attrValueList': [], // 属性名中的属性值：因为属性可以是多个，因此需要的是数组]
        'categoryId': 0, // 这里还收集不到三级分类的id 先用0
        'categoryLevel': 3
      },
      // 表单验证
      rules: {
        attrName: [
          { required: true, message: '请输入品牌属性', trigger: 'blur' },
          { validator: checkSpace, trigger: 'change' }
        ]
      },
      // 判断属性值是否有效
      valueName: true,
      // 保存节流
      flag2: true
    }
  },
  methods: {
    // 三级联动自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 区分相应的ID
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else {
        this.category3Id = categoryId
        // 发送请求获取品牌属性id
        this.getAttrList()
      }
    },

    // 获取平台属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },

    // 修改属性
    upDataAttr(row) {
      this.isShowTable = false
      // 将row 深拷贝拷贝给 attrInfo
      this.attrInfo = cloneDeep(row)
      // 这里也添加上 flag
      // 需要使用 $set 添加 这样 flag 就是响应式动态的属性
      this.attrInfo.attrValueList.forEach((item) => {
        // 给谁添加   添加的key 添加的 value
        this.$set(item, 'flag', false)
      })
    },

    // 删除属性
    deleteAttr(row) {
      this.$API.attr.deleteAttr(row.id)
      this.getAttrList()
    },
    // 添加属性并清空上次添加的数据
    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        'attrName': '',
        'attrValueList': [],
        'categoryId': this.category3Id, // 这里就可以获取3id了
        'categoryLevel': 3
      }
    },

    // 添加新的属性值
    addAttrValue() {
      // attrId 修改的话是服务器返回的id 添加就是undefined提交服务器自动匹配id
      // valueName 相应的属性值的名称
      this.attrInfo.attrValueList.push({
        'attrId': this.attrInfo.id, // this.attrInfo.id 是下面拷贝row的id 赋值给attrId
        'valueName': '',
        flag: true // 用于切换input和span
      })
      // 获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },

    // 属性失去焦点去除空格
    attrNameTrim(attrName) {
      this.attrInfo.attrName = attrName.trim()
    },
    // 失去属性值焦点的回调--切换为查看模式展示span
    toLook(row) {
      row.valueName = row.valueName.trim()
      const isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepat || row.valueName === '') {
        this.valueName = false
        this.$message.error('属性值不能相等或者为空')
        return
      }
      this.valueName = true
      row.flag = false
    },

    // 获取焦点
    focus(row, index) {
      // 点击span后获取焦点
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 气泡确认框删除属性值
    deleteAttrValue(index) {
      // 删除当前项
      this.attrInfo.attrValueList.splice(index, 1)
    },

    // 保存按钮
    addOrUpdateAttr() {
      // 判断属性名是否复合要求
      this.$refs.attrName.validate(async (valid) => {
        if (valid) {
          // 判断属性值是否有效
          if (this.valueName && this.flag2) {
            try {
              // 整理参数
              this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                if (item.valueName !== '') {
                  delete item.flag
                  return true
                }
              })
              this.flag2 = false
              // 提交数据
              await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
              this.$message({ type: 'success', message: '保存成功' })
              // 重新发起请求并显示展示页
              this.getAttrList()
              this.$refs.attrName.resetFields()
              this.valueName = true
              this.isShowTable = true
              this.flag2 = true
            } catch (error) {
              this.valueName = true
              this.flag2 = true
              this.$message.error(`保存失败:${error}`)
            }
          } else if (!this.flag2) {
            this.$message({ message: '上传中请稍等', type: 'warning' })
          } else {
            this.$message.error('属性值不能相等或者为空')
          }
        } else {
          this.$message.error('应输入2到10位的品牌属性')
          return false
        }
      })
    },

    // 重置表单验证
    cancelValidation() {
      this.$refs.attrName.resetFields()
      this.isShowTable = true
    }
  }

}
</script>

<style>
</style>
