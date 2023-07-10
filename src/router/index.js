import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
]

// 动态路由
export const asyncRoutes =[
    // 域名管理
    {
      path: "/domainAdmin",
      component: Layout,
      name: "DomainAdmin",
      alwaysShow: true,
      meta: {
        title: "域名管理",
        icon: "list"
      },
      children: [
        {
          path: "main",
          component: () => import('@/views/domainAdmin/main'),
          name: "DomainMain",
          meta: { title: "主域名列表", icon: "example", hasBadge: 2}
        },
        {
          path: "promotion",
          component: () => import('@/views/domainAdmin/promotion'),
          name: "DomainPromotion",
          meta: { title: "推广域名列表", icon: "example", hasBadge: 1 }
        },
        {
          path: "jumpmain",
          component: () => import('@/views/domainAdmin/jumpmain'),
          name: "DomainJumpmain",
          meta: { title: "跳转域名列表", icon: "example"}
        },
        {
          path: "handle",
          component: () => import('@/views/domainAdmin/handle'),
          name: "DomainHandle",
          meta: { title: "域名操作日志", icon: "example"}
        }
      ]
    },
  
    //警报管理
    {
      path: "/alarmAdmin",
      component: Layout,
      name: "AlarmAdmin",
      alwaysShow: true,
      meta: {
        title: "警报管理",
        icon: "list"
      },
      children: [
        {
          path: "reportList",
          component: () => import('@/views/alarmAdmin/reportList'),
          name: "ReportList",
          meta: { title: "异常回报列表", icon: "example", hasBadge: 3}
        },
        {
          path: "reportLog",
          component: () => import('@/views/alarmAdmin/reportLog'),
          name: "ReportLog",
          meta: { title: "域名回报处理日志", icon: "example" }
        },
      ]
    },
  
    // 域名流量查询
    {
      path: "/domainQuery",
      component: Layout,
      name: "DomainQuery",
      alwaysShow: true,
      meta: {
        title: "域名流量查询",
        icon: "list"
      },
      children: [
        {
          path: "flowprofile",
          component: () => import('@/views/domainQuery/flowprofile/index'),
          name: "Flowprofile",
          meta: { title: "域名流量概览", icon: "example" }
        },
        // {
        //   path: "lockdown",
        //   component: "domainQuery/lockdown",
        //   name: "Lockdown",
        //   meta: { title: "域名封锁预警", icon: "example", hasBadge: 3 }
        // },
        // {
        //   path: "log",
        //   component: "domainQuery/log",
        //   name: "Log",
        //   meta: { title: "域名封锁预警日志", icon: "example" }
        // }
      ]
    },
    // 系统管理
    {
      path: "/system",
      component: Layout,
      redirect: "noredirect",
      alwaysShow: true,
      name: "SystemManage",
      meta: {
        title: "系统管理",
        icon: "system"
      },
      children: [
        {
          path: "user",
          component: () => import('@/views/system/user/index'),
          name: "SystemUser",
          meta: { title: "账号管理", icon: "example" }
        },
        {
          path: "competence",
          component: () => import('@/views/system/competence/index'),
          name: "SystemCompetence",
          meta: { title: "权限管理", icon: "example" }
        },
  
        {
          path: "menu",
          component: () => import('@/views/system/menu/index'),
          name: "SystemMenu",
          meta: { title: "菜单权限", icon: "example" }
        },
        // {
        //   path: "extractMoneyAddress",
        //   component: () => import('@/views/system/extractMoneyAddress'),
        //   name: "ExtractMoneyAddress",
        //   meta: { title: "提现地址设置", icon: "example", hasBadge: 6 }
        // }
      ]
    }
]


export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
