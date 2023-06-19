import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";

const _routerData = [
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
        path: "promotion",
        component: "domainAdmin/promotion",
        name: "DomainPromotion",
        meta: { title: "推广域名设置", icon: "example", hasBadge: 1 }
      },
      {
        path: "jumpmain",
        component: "domainAdmin/jumpmain",
        name: "DomainJumpmain",
        meta: { title: "跳转域名设置", icon: "example", hasBadge: 2}
      },
      {
        path: "handle",
        component: "domainAdmin/handle",
        name: "DomainHandle",
        meta: { title: "域名操作日志", icon: "example"}
      }
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
        component: "domainQuery/flowprofile/index",
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
        component: "system/user/index",
        name: "SystemUser",
        meta: { title: "账号管理", icon: "example" }
      },
      {
        path: "competence",
        component: "system/competence/index",
        name: "SystemCompetence",
        meta: { title: "权限管理", icon: "example" }
      },

      {
        path: "menu",
        component: "system/menu/index",
        name: "SystemMenu",
        meta: { title: "菜单权限", icon: "example" }
      },
      // {
      //   path: "extractMoneyAddress",
      //   component: "system/extractMoneyAddress",
      //   name: "ExtractMoneyAddress",
      //   meta: { title: "提现地址设置", icon: "example", hasBadge: 6 }
      // }
    ]
  }
];

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 抛出路由设置默认路由
        getRouters({
          pid: process.env.VUE_APP_PID
        }).then(res => {
          const newRouter = res.data[0] || [];
          const accessedRoutes = filterRouter(_routerData, newRouter);
          // const accessedRoutes = filterRouter(_routerData, _routerData)
          accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        });
      });
    }
  }
};

// 匹配新的路由
function filterRouter(all, now) {
  const filterArr = [];
  now.forEach(element => {
    let _obj = {};
    all.forEach(route => {
      if (element.url === route.name) {
        // if (element.name == route.name) {
        if (route.component) {
          // Layout组件特殊处理
          if (route.component.name === "Layout") {
            route.component = Layout;
          } else {
            route.component = loadView(route.component);
          }
        }
        _obj = route;
      }
    });

    if (element.child && element.child.length) {
      // if (element.children && element.children.length) {
      _obj.children = filterRouter(_obj.children, element.child);
      // _obj.children = filterRouter(_obj.children, element.children)
    }
    if (JSON.stringify(_obj) !== "{}") {
      filterArr.push(_obj);
    }
  });

  return filterArr;
}

export const loadView = view => {
  // 路由懒加载
  // return () => import(`@/views/${view}`)
  return resolve => require([`@/views/${view}`], resolve);
};

export default permission;
