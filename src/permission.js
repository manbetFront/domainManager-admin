import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.permission_routes.length > 0) {
        next();
      }else{
        try {
          // await store.dispatch('user/getInfo')

          await store.dispatch('order/getNumber1')
          await store.dispatch('order/getNumber2')
          await store.dispatch('order/getNumber3')
          
          store.dispatch('GetInfo').then(res => {
            // 拉取user_info
            const roles = res.roles
            store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
              // 测试 默认静态页面
              // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
              // for(let i = 0,length =accessRoutes.length;i<length;i++) {
              //   const element = accessRoutes[i]
              //   router.addRoute(element)
              // }
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          })

          // const accessRoutes = await store.dispatch('permission/generateRoutes')
          // for (let i = 0, len = accessRoutes.length; i < len; i++) {
          //   router.addRoute(accessRoutes[i])
          // }
          // next({ ...to, replace: true })
        } catch (error) {
            store.dispatch('FedLogOut').then(() => {
              Message.error(error)
              next({ path: '/' })
            })
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
