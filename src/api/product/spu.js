// spu模块
// 引入二次封装的 axios
import request from '@/utils/request'

// 获取spu列表数据
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
})

// 获取spu信息
export const reqSpu = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})

// 获取品牌的信息
export const reqTradeMarkList = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
})

// 获取spu图片
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

// 获取平台的全部销售属性值-----整个平台的销售属性一共三个
export const reqBaseSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
})

// 修改||添加spu
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 携带的参数与id --- 修改spu
    if (spuInfo.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo
        })
    } else {
        // 携带的参数不带id --- 添加spu
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request({
    url: `admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})

// skuForm
// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request({
    url: `admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})

// 添加sku
export const reqAddSku = (skuInfo) => request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data: skuInfo
})

// 获取sku列表数据
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})

