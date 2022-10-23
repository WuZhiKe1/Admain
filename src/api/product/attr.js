// 平台属性管理
// 引入二次封装的 axios
import request from '@/utils/request'

// 获取一级分类数据
export const reqCategory1List = () => request({
    url: '/admin/product/getCategory1',
    method: 'get'
})

// 获取二级分类数据
export const reqCategory2List = (category1id) => request({
    url: `/admin/product/getCategory2/${category1id}`,
    method: 'get'
})

// 获取三级分类数据
export const reqCategory3List = (category2id) => request({
    url: `/admin/product/getCategory3/${category2id}`,
    method: 'get'
})

// 获取商品基础属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})

// 添加/保存属性接口
export const reqAddOrUpdateAttr = (data) => request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
})

// 删除属性
export const deleteAttr = (attrId) => request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
})

