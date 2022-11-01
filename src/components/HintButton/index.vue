<template>
  <a :title="title" style="margin-right:20px">
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: {
    title: { type: String, default: '' }
  }
}
</script>

<style>
</style>
