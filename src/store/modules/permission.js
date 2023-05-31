import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";

const _routerData = [
  {
    path: "/bind",
    component: Layout,
    redirect: "noredirect",
    name: "Bind",
    alwaysShow: true,
    meta: {
      title: "域名管理",
      icon: "list"
    },
    children: [
      {
        path: "card",
        component: "bind-card/index",
        name: "BindCard",
        meta: { title: "推广域名设置", icon: "example" }
      },
      {
        path: "GCash",
        component: "bind-gcash/index",
        name: "BindGCash",
        meta: { title: "跳转域名设置", icon: "example" }
      }
    ]
  },
  // 虚拟币管理
  {
    path: "/virtualAdmin",
    component: Layout,
    name: "VirtualAdmin",
    alwaysShow: true,
    meta: {
      title: "虚拟币管理",
      icon: "list"
    },
    children: [
      {
        path: "rate",
        component: "virtualAdmin/rate/index",
        name: "Rate",
        meta: { title: "汇率管理", icon: "example", hasBadge: 1 }
      },
      {
        path: "wallet",
        component: "virtualAdmin/wallet",
        name: "Wallet",
        meta: { title: "钱包管理", icon: "example", hasBadge: 2 }
      },
      {
        path: "address",
        component: "virtualAdmin/address",
        name: "Address",
        meta: { title: "使用中地址查询", icon: "example" }
      },
      {
        path: "extractMoneyOne",
        component: "virtualAdmin/extractMoneyOne",
        name: "ExtractMoneyOne",
        meta: { title: "虚拟币提现一审", icon: "example" }
      },
      {
        path: "extractMoneyRecord",
        component: "virtualAdmin/extractMoneyRecord",
        name: "ExtractMoneyRecord",
        meta: { title: "虚拟币取款记录", icon: "example" }
      }
    ]
  },
  // 订单管理
  {
    path: "/orderAdmin",
    component: Layout,
    name: "OrderAdmin",
    alwaysShow: true,
    meta: {
      title: "订单管理",
      icon: "list"
    },
    children: [
      {
        path: "virtualOrder",
        component: "orderAdmin/virtualOrder",
        name: "VirtualOrder",
        meta: { title: "虚拟币订单审核", icon: "example", hasBadge: 3 }
      },
      {
        path: "virtualOrderHistory",
        component: "orderAdmin/virtualOrderHistory",
        name: "VirtualOrderHistory",
        meta: { title: "虚拟币支付历史记录", icon: "example" }
      },
      {
        path: "payMoneyRecord",
        component: "orderAdmin/payMoneyRecord",
        name: "PayMoneyRecord",
        meta: { title: "支付金额变更记录", icon: "example", hasBadge: 4 }
      }
    ]
  },

  {
    path: "/order",
    component: Layout,
    redirect: "noredirect",
    name: "SelfMerchant",
    alwaysShow: true,
    meta: {
      title: "自有商户",
      icon: "list"
    },
    children: [
      {
        path: "pay_check",
        component: "self-merchant/pay-check/index",
        name: "PayCheck",
        meta: { title: "支付审核", icon: "example", hasBadge: 5 }
      },
      {
        path: "pay_check_record",
        component: "self-merchant/pay-check-record/index",
        name: "PayCheckRecord",
        meta: { title: "支付审核记录", icon: "example" }
      }
    ]
  },

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
      {
        path: "extractMoneyAddress",
        component: "system/extractMoneyAddress",
        name: "ExtractMoneyAddress",
        meta: { title: "提现地址设置", icon: "example", hasBadge: 6 }
      }
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
      console.log(element, route);
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
