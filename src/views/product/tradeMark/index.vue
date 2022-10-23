<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:20px 0px" @click="addTradeMark">添加</el-button>
    <!--
      表格组件
      table属性
      data: 表格组件将来展示的数据----数组类型
      border: 给表格添加边框
      column属性
      prop: 对应列内容的字段名
      label: 显示的标题 :string
      width：对应列的宽度 string
      align：对其方式  string:center/left/right
      el-table展示数据是以列展示
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌标题" width="width" align="center" />
      <el-table-column prop="prop" label="品牌LOGO" width="width" align="center">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt style="width:75px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-edit"
            size="main"
            style="marginLeft:40px"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button icon="el-icon-delete" size="main" @click="deleteTradeMark(row)">删除</el-button>
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
      style="margin-top:20px;textAlign:center;"
      :current-page="currentPage"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[ 5, 10]"
      layout=" prev, pager, next, jumper, -> ,sizes, total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!--
      对话框
      :visible.sync 控制对话框的显示与隐藏
      :closed 关闭动画结束时的回调
    -->
    <el-dialog
      :title="tradeMarkForm.id?'修改品牌':'添加品牌'"
      :visible.sync="dialogFormVisible"
      @closed="cancelValidation"
    >
      <!--、
      form 表单验证功能，只需要通过 rules 属性传入约定的验证规则，
      并将 Form-Item 的 prop 属性设置为校验的字段名即可
      :model属性把表单数据收集到哪个对象的身上，表单验证也需要这个属性
      -->
      <el-form ref="tradeMarkForm" style="width:80%" :model="tradeMarkForm" :rules="rules">
        <el-form-item label="品牌" label-width="100px" prop="tmName">
          <el-input v-model="tradeMarkForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="LOGO" label-width="100px" prop="logoUrl">
          <!--
            图片上传成功后的回调和之前的回调
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action:设置图片上传的地址
          -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tradeMarkForm.logoUrl" :src="tradeMarkForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件, 且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'TradeMark',
  data() {
    const checkSpace = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('不能为空'))
      } else if (value.trim().length < 3 || value.trim().length > 10) {
        callback(new Error('长度为3到10位'))
      } else {
        callback()
      }
    }
    return {
      // 当前第几页
      page: 1,
      // 当前页数展示条数
      limit: 5,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 当前页高亮
      currentPage: null,
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 收集品牌的信息: 对象身上的属性是根据接口的需求定义的
      tradeMarkForm: {
        tmName: '',
        // 上传图片使用的属性
        logoUrl: ''
      },
      // 表单验证的规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: checkSpace, trigger: 'change' }
        ],
        // 品牌 logo 的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌的图片' }
        ]
      }
    }
  },
  mounted() {
    // 获取品牌数据
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的函数
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMark(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
      this.currentPage = this.page
    },
    // 改变每页显示的总条数
    handleSizeChange(limit) {
      // limit 返回切换每页展示数据
      this.limit = limit
      this.getPageList(this.page)
    },
    // 添加产品
    addTradeMark() {
      this.dialogFormVisible = true
      // 清空数据
      this.tradeMarkForm = { tmName: '', logoUrl: '' }
    },
    // 修改品牌数据
    updateTradeMark(row) {
      // row当前修改的信息
      this.dialogFormVisible = true
      // 将已有的品牌信息赋值给 tradeMarkForm
      // 需要深拷贝否则点击取消后表单还是会变化
      // 深拷贝是开辟新的地址
      // 点击修改展示的是tradeMarkForm的数据
      // 点击取消后 row 的数据地址没有更改
      this.tradeMarkForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tradeMarkForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加/修改-提交商品数据
    addOrUpdateTradeMark() {
      // 当表单验证通过后在执行逻辑
      this.$refs.tradeMarkForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false
          // 去掉两边的空格在传入服务器
          this.tradeMarkForm.tmName = this.tradeMarkForm.tmName.trim()
          const result = await this.$API.trademark.reqAddTradeMark(this.tradeMarkForm)
          if (result.code === 200) {
            // 上传成功弹出信息
            const message = this.tradeMarkForm.id ? '修改品牌成功' : '添加品牌成功'
            this.$message({ message, type: 'success' })
            const pages = Math.ceil((this.total + 1) / this.limit)
            this.getPageList(this.tradeMarkForm.id ? this.page : pages)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单验证
    cancelValidation() {
      this.$refs.tradeMarkForm.resetFields()
    },
    // 删除
    deleteTradeMark(row) {
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.trademark.deleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
