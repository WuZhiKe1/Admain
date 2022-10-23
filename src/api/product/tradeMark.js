// 品牌管理
// 引入二次封装的axios
import request from '@/utils/request'

// 获取品牌数据管理模块
export const reqTradeMark = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})

// 添加品牌
// /admin/product/baseTrademark/save -- post 参数：品牌名称 品牌logo

// 修改品品牌
// /admin/product/baseTrademark/update  -- put 参数：id 修改后的品牌名称 品牌Logo
export const reqAddTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // 修改品牌
        return request({
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data: tradeMark
        })
    } else {
        // 新增品牌
        return request({
            url: `/admin/product/baseTrademark/save`,
            method: 'post',
            data: tradeMark
        })
    }
}

// 删除品牌
export const deleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})
