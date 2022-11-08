//请求函数:登录请求函数、退出登录的请求函数、获取用户信息请求函数
import { login, logout, getInfo } from '@/api/user'
//持久化存储token
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由提供的函数:引入常量路由、引入异步路由、引入任意路由
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    // 项目中已有的异步路由，与服务器返回的标记进行对比最终进行展示的路由
    resultAsyncRouters: [],
    // 最终用户需要展示的全部路由
    resultAllRoutes: [],
  }
}

const state = getDefaultState()

const mutations = {
  // 重置 state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限的标记
    state.routes = userInfo.routes
    // 按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色的信息
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULT_ASYNC_ROUTES: (state, asyncRoutes) => {
    state.resultAsyncRouters = asyncRoutes
    // 计算出当前用户需要展示的所有路由（常量，异步，任意路由）
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRouters, anyRoutes)
    // 给路由添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}
// 两个数组进行对比 结果是用户到底显示哪个异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户需要展示的路由
  return asyncRoutes.filter(item => {
    // 拥有标记返回的索引值不是-1 没有标记返回的是-1
    if (routes.indexOf(item.name) != -1) {
      // 递归判断 二级路由或者三级等等
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}
const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 结构用户名与密码
    const { username, password } = userInfo
    // // trim(去除字符串两边的空白)
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
    // }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户的信息：name 头像avatar routes【返回的标志： 不同的用户应该展示哪些菜单的标记】
        // roles（用户信息） buttons 【按钮的信息：按钮权限的使用标记】
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USERINFO', data)
        commit('SET_RESULT_ASYNC_ROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

