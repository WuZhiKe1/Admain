# 完成登录业务

----

 1. 静态组件完成
 2. 书写API换成真实的接口

 > 登录接口----/admit/acl/index/login----post
 >
 > 获取用户信息----/admin/acl/index/info---get
 >
 > 退出登录----/admin/acl/index/logout----post

 3. 查看 axios 的二次封装

 4. 解决代理跨域问题 ---接口http://gmall-h5-api.atguigu.cn

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
 > > > > 添加品牌/admin/product/baseTrademark/save -- post 参数：品牌名称 品牌 logo
 > > > > 修改品品牌/admin/product/baseTrademark/update  -- put 参数：id 修改后的品牌名称 Logo
 > > > 2. 收集数据发起请求---根具是否存在 id 判断增加/修改
 > > > > 图片上传的地址---/admin/product/fileUpload
 > > > 3. 表单验证
 > > 4. 删除---接口/admin/product/baseTrademark/remove/{id} -delete

# 平台属性管理
----
1. 完成静态页面的搭建
> 封装全局组件——三级联动组件
2. 动态展示三级联动
> 接口——get
> > 一级分类/admin/product/getCategory1
> > 二级分类/admin/product/getCategory2/{category1id}
> > 三级分类/admin/product/getCategory3/{category2id}
3. 展示平台属性数据
> 商品基础数据--接口——get
> > /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   
4. 添加属性/修改属性
> 1. 完成静态页面给
> 2. 接口——/admin/product/saveAttrInfo
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
# SPU
----


