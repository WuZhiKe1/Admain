<template>
  <div>
    <!-- :inline 行内表单，一行可以放置多个表单元素  -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          no-data-text="加载数据中"
          :disabled="show"
          @change="handler1"
        >
          <el-option v-for="(c1) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          no-data-text="请先选择一级分类"
          :disabled="show"
          @change="handler2"
        >
          <el-option v-for="(c2) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          no-data-text="请先选择二级分类"
          :disabled="show"
          @change="handler3"
        >
          <el-option v-for="(c3) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: { show: Boolean },
  data() {
    return {
      // 一\二\三级分类
      list1: [],
      list2: [],
      list3: [],
      // 收集相应分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 获取二级分类
    async handler1() {
      // 清空上次获取的数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      // 将一级分类ID传给父组件
      // 用对象的方式传递用以区分哪个ID
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 获取三级分类
    async handler2() {
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      // 将二级分类ID传给父组件
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory2List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 获去三级分类的Id
    handler3() {
      // 将二级分类ID传给父组件
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>
