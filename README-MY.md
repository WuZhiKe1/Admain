# 完成登录业务

----

 1. 静态组件完成
 2. 书写API换成真实的接口

```
登录接口----/admit/acl/index/login----post

获取用户信息----/admin/acl/index/info---get

退出登录----/admin/acl/index/logout----post
```

  3. 查看 axios 的二次封装

  4. 解决代理跨域问题 

```
---接口http://gmall-h5-api.atguigu.cn
```



# 路由配置

----

> 删除不需要的路由，重新配置路由。

# 完成品牌管理
----
 1. 搭建静态页面
 > 1. 主页面
 > 2. 添加页面
 2. 完成品牌列表的战术
 > 书写相关接口的 api---- /admin/product/baseTrademark/page/limit
 > 在main.js引入挂载到Vue原型对象上
 > 渲染数据
 > 完成用户交互
 > > 1. 点击页码
 > > 2. 改变每页显示数据
 > > 3. 添加品牌\修改品牌
 > > > 1. 书写API(两个接口封装为一个函数)
 > > >
 > > > ```
 > > > 添加品牌/admin/product/baseTrademark/save -- post 参数：品牌名称 品牌 logo
 > > > 修改品品牌/admin/product/baseTrademark/update  -- put 参数：id 修改后的品牌名称 Logo
 > > > ```
 > > >
 > > > 2. 收集数据发起请求---根具是否存在 id 判断增加/修改
 > > >
 > > > ```
 > > > 图片上传的地址---/admin/product/fileUpload
 > > > ```
 > > >
 > > > 3. 表单验证
 > > 4. 删除
 > >
 > > ```
 > > ---接口/admin/product/baseTrademark/remove/{id} -delete
 > > ```

# 完成平台属性管理
----
1. 完成静态页面的搭建：展示与修改
> 封装全局组件——三级联动组件
2. 动态展示三级联动
> 接口——get
>
> ```
> 一级分类/admin/product/getCategory1
> 二级分类/admin/product/getCategory2/{category1id}
> 三级分类/admin/product/getCategory3/{category2id}
> ```
3. 展示平台属性数据
> 商品基础数据--接口——get
>
> ```
> /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   
> ```
4. 添加属性/修改属性
> 1. 完成静态页面给
>
> ```
> 接口——/admin/product/saveAttrInfo
> ```
>
> > ```js
> > {
> >  'attrName': '', // 属性名
> >  'attrValueList': [ // 属性名中的属性值：因为属性可以是多个，因此需要的是数组
> >      {
> >           'attrId': 0, // 属性的id
> >          'valueName': 'string' // 属性值
> >      }
> >   ],
> >     'categoryId': 0, // 这里还收集不到三级分类的id 先用0
> >     'categoryLevel': 3
> > }
> > ```
5. 删除属性值
6. 保存属性和属性值
7. 删除属性
8. 修改或添加属性时禁用三级联动
9. 保存节流
# 完成SPU
----
1. 搭建静态页面：展示|修改|详情
2. 获取spu数据

```
接口-GET /admin/product/{page}/{limit}  params: { category3Id }
```

3. 展示spu列表
4. 搭建SpuForm静态界面
5. 修改功能跳转SpuForm
> 接口--（不能在子组件 mounted 里发送请求，父组件挂在完毕后子组件也已经挂载了，无法再发送请求）
> ```javascript
> // 通过打标识获取子组件的方法传递信息并执行
> this.$refs.spu.initSpuData(row)
> // 子组件里可以接收信息发起请求
> initSpuData(row) {
>     console.log(row)
> },
> ```
> | 描述                          | 接口                                          | 请求方式 |
> | ----------------------------- | --------------------------------------------- | ----------------------------- |
> | 品牌的数据                    | /admin/product/baseTrademark/getTrademarkList | get |
> | 获取平台全部的销售属性（3个） | /admin/product/baseSaleAttrList               | get |
> | 获取某一个spu的信息           | /admin/product/getSpuById/{spuId}                  | get |
> | 获取spu的图片                 | /admin/product/spuImageList/{spuId}       | get |
> 
> 发送请求获取数据

> 1. 渲染spuForm数据、绑定数据
> 2. 绑定照片墙的数据
> 3. 销售属性的添加功能
> > 收集数据-
> > ```
> > baseSaleAttrId : ubSelect.id   收集到- ⬇
> > saleAttrName  :unselect.name   - attrIdAndAttrName
> > spuSaleAttrValueList
> > 最后收集到spu.spuSaleAttrList
> > ```
> 4. 销售属性值的收集与展示
> > 新增的销售属性值需要收集的字段：--baseSaleAttrId --saleAttrValueName
> 5. 删除销售属性与销售属性值
> 6. 保存操作 ---根据id判断是保存还是添加--成功后判断跳转的页码数
> > 整理数据
> > 接口:
> >
> > ```
> > 添加——/admin/product/saveSpuInfo     ---post -data: spuInfo
> > 修改——/admin/product/updateSpuInfo   ---post -data: spuInfo
> > ```
> 7. spu添加操作
> 8. 删除spu ---判断跳转的页码数
>
> ```
> 接口-admin/product/deleteSpu/{spuId}---delete
> ```
>
> 
6. 添加sku
> 1. 搭建静态页面skuFrom
> 2. 获取添加sku的数据
>
> | 描述               | 接口                                                         | 请求方式 |
> | ------------------ | ------------------------------------------------------------ | -------- |
> | 获取图片           | /admin/product/spuImageList/{*spuId*}                        | get      |
> | 获取销售属性列表   | /admin/product/spuSaleAttrList/${*spuId*}                    | get      |
> | 获取平台属性的数据 | /admin/product/attrInfoList/{*category1Id*}/{*category2Id*}/{*category3Id*} | get      |
>
> 3. 数据的展示与收集
> 4. 图片的展示与收集
> 5. skuForm保存操作
>
> ```
> /admin/product/saveSkuInfo ——post----data：skuInfo
> ```
>

7. SKU列表展示

> 1. 搭建静态页面
> 2. 渲染界面
>
> 接口
>
> ```
> /admin/product/findBySpuId/{spuId} ---get
> ```

# 完成SKU

----

1. 搭建静态页面
2. 渲染数据

```
/admin/product/list/{page}/{limit} ---get_获取sku列表的数据
```

3. sku的上下架操作

```js
admin/product/onSale/{skuId}——get——上架
admin/product/cancelSale/{skuId}——get——下架
```

3. 查看sku详情

> 1. 搭建静态页面
> 2. 渲染数据
>
> ```
> /admin/product/getSkuById/{skuId}--get
> ```
>

# 完成Home
----
1. 搭建静态页面

> 使用echarts搭建折线图和柱状图

2. 动态渲染数据

# 权限管理
----
根据返回的数据进行菜单权限的管理